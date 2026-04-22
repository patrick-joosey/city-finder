// Census ACS 5-year API fetcher.
//
// One HTTP call per state fetches every Census variable we need for every place
// in that state. Results are cached to disk so reruns during development are free.
//
// Vintage strategy: start with currentYear - 2 (ACS 5-year is published each
// December with a 2-year lag). If that returns 404, fall back year-by-year.
//
// Rate limits: without an API key the Census API limits anonymous callers to
// 500 requests per IP per day. We use at most ~16 calls per refresh (one per
// state) so we're fine either way, but CENSUS_API_KEY is honored if set.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CENSUS_VARIABLES, vintageCandidates } from "../variables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.resolve(__dirname, "..", ".cache");
const BASE_URL = "https://api.census.gov/data";
// Sentinel the API returns when a value is unknown.
const MISSING = new Set([null, "", "-666666666", "-888888888", "-999999999"]);

async function ensureCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

function cachePath(vintage, stateFips) {
  return path.join(CACHE_DIR, `acs5-${vintage}-state${stateFips}.json`);
}

async function readCache(vintage, stateFips) {
  try {
    const raw = await fs.readFile(cachePath(vintage, stateFips), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(vintage, stateFips, body) {
  await ensureCacheDir();
  await fs.writeFile(cachePath(vintage, stateFips), JSON.stringify(body), "utf8");
}

function buildUrl(vintage, stateFips) {
  const vars = CENSUS_VARIABLES.join(",");
  const key = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
  return `${BASE_URL}/${vintage}/acs/acs5?get=NAME,${vars}&for=place:*&in=state:${stateFips}${key}`;
}

// Convert a raw Census cell to a number or null.
function parseCell(v) {
  if (MISSING.has(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Census returns [[header, ...], [row, ...], ...]. Turn into an array of
// objects keyed by variable name (without the "E" suffix used in our formulas).
function parseCensusResponse(body) {
  if (!Array.isArray(body) || body.length < 2) return [];
  const [header, ...rows] = body;
  return rows.map((row) => {
    const obj = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i];
      const raw = row[i];
      if (key === "NAME") {
        obj.NAME = raw;
      } else if (key === "state" || key === "place") {
        obj[key] = raw;
      } else {
        // Variable like "B01003_001E" -> stored as "B01003_001"
        const normalized = key.endsWith("E") ? key.slice(0, -1) : key;
        obj[normalized] = parseCell(raw);
      }
    }
    return obj;
  });
}

async function fetchWithRetry(url, { attempts = 3, backoffMs = 500 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) {
        const err = new Error(`Census 404 at ${url}`);
        err.status = 404;
        throw err;
      }
      if (!res.ok) {
        throw new Error(`Census HTTP ${res.status}: ${await res.text().catch(() => "")}`);
      }
      const text = await res.text();
      // Census sometimes returns HTML on errors instead of JSON — guard against it.
      if (!text.startsWith("[")) {
        throw new Error(`Census returned non-JSON body (first 80 chars): ${text.slice(0, 80)}`);
      }
      return JSON.parse(text);
    } catch (err) {
      lastErr = err;
      if (err.status === 404) throw err; // don't retry 404
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}

// Fetch a single state's data with vintage fallback.
// Returns { vintage, rows: [{ NAME, state, place, B01003_001, ... }] }.
export async function fetchStateData(stateFips, { useCache = true, candidateVintages } = {}) {
  const years = candidateVintages ?? vintageCandidates();
  for (const vintage of years) {
    if (useCache) {
      const cached = await readCache(vintage, stateFips);
      if (cached) {
        return { vintage, rows: parseCensusResponse(cached), fromCache: true };
      }
    }
    const url = buildUrl(vintage, stateFips);
    try {
      const body = await fetchWithRetry(url);
      if (useCache) {
        await writeCache(vintage, stateFips, body);
      }
      return { vintage, rows: parseCensusResponse(body), fromCache: false };
    } catch (err) {
      if (err.status === 404) {
        // Vintage not yet published — try the next older year.
        continue;
      }
      // Non-404: rethrow so caller can see what happened.
      throw new Error(`Failed to fetch state ${stateFips} (vintage ${vintage}): ${err.message}`);
    }
  }
  throw new Error(`No Census vintage returned data for state ${stateFips}. Tried: ${years.join(", ")}`);
}

// Fetch all requested states. Returns a map keyed by stateFips.
export async function fetchAllStates(stateFipsList, opts = {}) {
  const results = {};
  const errors = [];
  for (const fips of stateFipsList) {
    try {
      results[fips] = await fetchStateData(fips, opts);
    } catch (err) {
      errors.push({ stateFips: fips, error: err.message });
    }
  }
  return { results, errors };
}

// Find a specific place row within a state response.
export function findPlaceRow(stateResult, placeFips) {
  if (!stateResult) return null;
  return stateResult.rows.find((r) => r.place === placeFips) ?? null;
}
