#!/usr/bin/env node
// Orchestrator: reads city-geoids.json, fetches Census data for every required
// state, runs the transform, writes the generated JSON + meta.json.
//
// Usage:
//   node pipeline/refresh.mjs              # writes src/data/generated/{rawMetrics,meta}.json
//   node pipeline/refresh.mjs --dry-run    # prints diff vs current generated JSON, no writes
//   node pipeline/refresh.mjs --no-cache   # bypass .cache/ and re-hit the Census API
//
// Environment:
//   CENSUS_API_KEY   optional, removes the 500-req/day anonymous rate limit

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAllStates } from "./fetchers/census.mjs";
import { buildGenerated, diffGenerated } from "./transforms/demographics.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const GEOIDS_PATH = path.join(__dirname, "city-geoids.json");
const GENERATED_DIR = path.join(PROJECT_ROOT, "src", "data", "generated");
const RAW_METRICS_PATH = path.join(GENERATED_DIR, "rawMetrics.json");
const META_PATH = path.join(GENERATED_DIR, "meta.json");
const REPORT_PATH = path.join(__dirname, "output", "refresh-report.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const noCache = args.includes("--no-cache");

async function readJsonOrNull(p) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return null;
  }
}

async function loadDotEnv() {
  // Minimal .env.local loader — no dependency. Sets process.env for any
  // KEY=VALUE lines found. Skips lines starting with # or missing an equals.
  try {
    const raw = await fs.readFile(path.join(PROJECT_ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // no .env.local, that's fine
  }
}

function uniqueStateFips(geoids) {
  const set = new Set();
  for (const [key, entry] of Object.entries(geoids)) {
    if (key.startsWith("_")) continue;
    if (entry.stateFips) set.add(entry.stateFips);
  }
  return [...set].sort();
}

function pickMajorityVintage(stateResults) {
  const counts = {};
  for (const state of Object.values(stateResults)) {
    if (!state) continue;
    counts[state.vintage] = (counts[state.vintage] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function formatDiff(diff) {
  const lines = [];
  if (diff.added.length) lines.push(`  added (${diff.added.length}): ${diff.added.join(", ")}`);
  if (diff.removed.length) lines.push(`  removed (${diff.removed.length}): ${diff.removed.join(", ")}`);
  const changedIds = Object.keys(diff.changed);
  if (changedIds.length) {
    lines.push(`  changed (${changedIds.length}):`);
    for (const id of changedIds.slice(0, 10)) {
      lines.push(`    #${id}:`);
      for (const [field, [a, b]] of Object.entries(diff.changed[id])) {
        lines.push(`      ${field}: ${a} → ${b}`);
      }
    }
    if (changedIds.length > 10) {
      lines.push(`    ... and ${changedIds.length - 10} more cities`);
    }
  }
  if (lines.length === 0) return "  (no changes)";
  return lines.join("\n");
}

async function main() {
  await loadDotEnv();
  console.log(`🌐 Census ACS 5-year refresh ${dryRun ? "(dry run)" : ""}`);
  if (!process.env.CENSUS_API_KEY) {
    console.log("ℹ️  Running without CENSUS_API_KEY (500 req/day limit). Set it in .env.local for production.");
  }

  const geoids = JSON.parse(await fs.readFile(GEOIDS_PATH, "utf8"));
  const states = uniqueStateFips(geoids);
  console.log(`📍 ${Object.keys(geoids).filter((k) => !k.startsWith("_")).length} cities across ${states.length} states`);

  console.log(`\n🚚 Fetching Census data for states: ${states.join(", ")}${noCache ? " (cache bypassed)" : ""}`);
  const { results, errors: fetchErrors } = await fetchAllStates(states, { useCache: !noCache });
  for (const fips of states) {
    const r = results[fips];
    const marker = r?.fromCache ? "(cache)" : "(fetched)";
    console.log(`   state ${fips}: ${r ? `vintage ${r.vintage} ${marker} — ${r.rows.length} places` : "❌ failed"}`);
  }
  if (fetchErrors.length) {
    console.error(`\n❌ ${fetchErrors.length} state fetch errors:`);
    for (const e of fetchErrors) console.error(`   ${e.stateFips}: ${e.error}`);
  }

  console.log(`\n🔄 Transforming ${Object.keys(geoids).filter((k) => !k.startsWith("_")).length} cities...`);
  const { generated, errors: transformErrors } = buildGenerated(geoids, results);
  if (transformErrors.length) {
    console.error(`❌ ${transformErrors.length} transform errors:`);
    for (const e of transformErrors) console.error(`   city ${e.cityId}: ${e.error}`);
  }

  const vintage = pickMajorityVintage(results);
  console.log(`✅ ${Object.keys(generated).length} cities transformed; majority vintage = ${vintage}`);

  // Diff vs existing generated file
  const prev = await readJsonOrNull(RAW_METRICS_PATH);
  const diff = diffGenerated(prev, generated);
  console.log(`\n📊 Diff vs ${RAW_METRICS_PATH}:\n${formatDiff(diff)}`);

  const totalErrors = fetchErrors.length + transformErrors.length;
  const meta = {
    source: "US Census Bureau — American Community Survey (ACS) 5-year",
    vintage: vintage ? Number(vintage) : null,
    fetchedAt: new Date().toISOString(),
    pipelineVersion: "1.0.0",
    stateFipsFetched: states,
    cityCount: Object.keys(generated).length,
    errors: [...fetchErrors, ...transformErrors.map(({ cityId, error }) => ({ cityId, error }))],
  };

  if (dryRun) {
    console.log("\n💨 Dry run: no files written.");
    return totalErrors > 0 ? 1 : 0;
  }

  // Write outputs
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await fs.writeFile(RAW_METRICS_PATH, JSON.stringify(generated, null, 2) + "\n", "utf8");
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2) + "\n", "utf8");
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(
    REPORT_PATH,
    JSON.stringify({ meta, diff }, null, 2) + "\n",
    "utf8",
  );

  console.log(`\n💾 Wrote:`);
  console.log(`   ${path.relative(PROJECT_ROOT, RAW_METRICS_PATH)}`);
  console.log(`   ${path.relative(PROJECT_ROOT, META_PATH)}`);
  console.log(`   ${path.relative(PROJECT_ROOT, REPORT_PATH)}`);

  if (totalErrors > 0) {
    console.error(`\n⚠️  Completed with ${totalErrors} errors. See refresh-report.json for details.`);
    return 1;
  }
  console.log("\n✨ Done.");
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error("💥 Unhandled error:", err);
    process.exit(2);
  });
