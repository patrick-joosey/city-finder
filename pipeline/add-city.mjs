#!/usr/bin/env node
// Interactive CLI to add a new city to the pipeline.
//
// Usage:
//   node pipeline/add-city.mjs
//
// What it does:
//   1. Prompts for a city name + US state (full name or postal abbr).
//   2. Looks the city up against the Census Places API and shows candidates.
//   3. Appends a new entry to pipeline/city-geoids.json with the next free id.
//   4. Emits pipeline/output/research-checklist-<id>.md listing every
//      non-Census field the user still has to hand-fill in src/data/metrics.js
//      (safety, recovery, walkability, affordability, etc.), with links.
//
// It deliberately does NOT touch src/data/metrics.js or src/data/cities.js —
// the user commits those additions by hand after filling in the checklist.
// Once the geoid entry is saved, `npm run data:refresh` will populate the
// Census-owned fields automatically.

import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { stdin as input, stdout as output } from "node:process";
import { defaultVintage } from "./variables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const GEOIDS_PATH = path.join(__dirname, "city-geoids.json");
const OUTPUT_DIR = path.join(__dirname, "output");

// Minimal .env.local loader so CENSUS_API_KEY is picked up if set.
async function loadDotEnv() {
  try {
    const raw = await fs.readFile(path.join(PROJECT_ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq < 0) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // no .env.local, fine
  }
}

// State abbr -> FIPS. Hard-coded because it never changes.
const STATE_FIPS = {
  AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09",
  DE: "10", DC: "11", FL: "12", GA: "13", HI: "15", ID: "16", IL: "17",
  IN: "18", IA: "19", KS: "20", KY: "21", LA: "22", ME: "23", MD: "24",
  MA: "25", MI: "26", MN: "27", MS: "28", MO: "29", MT: "30", NE: "31",
  NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36", NC: "37", ND: "38",
  OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45", SD: "46",
  TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
  WI: "55", WY: "56", PR: "72",
};

const STATE_NAMES = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

function resolveStateFips(stateInput) {
  const norm = stateInput.trim();
  const upper = norm.toUpperCase();
  if (STATE_FIPS[upper]) return STATE_FIPS[upper];
  const abbr = STATE_NAMES[norm] || STATE_NAMES[norm.replace(/\b\w/g, (c) => c.toUpperCase())];
  return abbr ? STATE_FIPS[abbr] : null;
}

// Query the Census Places endpoint for a given state and case-insensitively
// filter by city name. Returns [{ name, placeFips }].
async function searchPlaces(stateFips, cityName) {
  const vintage = defaultVintage();
  const years = [vintage, vintage - 1, vintage - 2];
  for (const year of years) {
    const key = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
    const url = `https://api.census.gov/data/${year}/acs/acs5?get=NAME&for=place:*&in=state:${stateFips}${key}`;
    const res = await fetch(url);
    if (res.status === 404) continue;
    if (!res.ok) {
      throw new Error(`Census returned HTTP ${res.status} for ${url}`);
    }
    const body = await res.json();
    const [, ...rows] = body;
    const needle = cityName.toLowerCase();
    const matches = rows
      .map((r) => ({ name: r[0], placeFips: r[2] }))
      .filter((r) => r.name.toLowerCase().includes(needle));
    return { matches, vintage: year };
  }
  throw new Error(`No Census vintage returned data for state ${stateFips}`);
}

function nextFreeId(geoids) {
  const ids = Object.keys(geoids)
    .filter((k) => !k.startsWith("_"))
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n));
  return (Math.max(0, ...ids) + 1).toString();
}

function checklistMarkdown({ id, cityName, stateFips, placeFips, displayName }) {
  return `# Research checklist — new city #${id}: ${cityName}

**Census match:** ${displayName} (stateFips=${stateFips}, placeFips=${placeFips})

The pipeline will fill in these fields on the next \`npm run data:refresh\`:
- \`jobMarket\`: unemploymentRate, remoteWorkPct, medianIncome
- \`youngAdults\`: pctAge25_34, metroPop
- \`dating\`: metroPop, femaleMaleRatio, singlesPct25_34, pctAge25_34

You still need to hand-fill the rest in \`src/data/metrics.js\` and add an entry
in \`src/data/cities.js\`. Suggested starting sources:

## Safety (crime)
- [ ] \`violentPer1k\` / \`propertyPer1k\` — NeighborhoodScout, CrimeGrade.org, FBI UCR

## Recovery
- [ ] \`weeklyAA\` / \`weeklyNA\` — local AA Intergroup site, na.org meeting locator

## Meditation
- [ ] \`yogaStudios\` — Yelp / Google Maps "yoga studios" in [${cityName}]
- [ ] \`meditationCenters\` — Google "meditation center [${cityName}]"

## Health & Wellness
- [ ] naturopath/chiropractor counts via Yelp

## Mental Health
- [ ] \`therapistsPer10k\` — Psychology Today count / population × 10000 (cap 30)

## Gyms
- [ ] \`gymsPer10k\` — Yelp "gyms" / population × 10000

## Nutrition
- [ ] \`healthStores\` — Whole Foods / Sprouts / Natural Grocers count
- [ ] \`yearRoundMarket\` / \`seasonalMarket\` — farmersmarket.usda.gov

## Social / Community
- [ ] \`meetupsPerWeek\` — Meetup.com keyword search ("recovery", "meditation", etc.)

## Walkability
- [ ] \`walkScore\` — walkscore.com

## Outdoor Rec
- [ ] AllTrails trail count + BLM/USFS public land acreage nearby

## Climate
- [ ] \`sunnyDays\` — NOAA Climate Normals
- [ ] \`elevationFt\` — Wikipedia / USGS

## Affordability
- [ ] \`costIndex\` — BestPlaces.net / Numbeo
- [ ] \`medianRentNumeric\` — Zillow ZORI

## Air Quality
- [ ] \`aqiMedian\` / \`goodAQIDays\` — airnow.gov or EPA AQS

## Events
- [ ] \`proTeams\` / \`largeVenues\` / \`annualConcerts\` / \`musicFestivals\` — manual research

---

Once the checklist is complete:
1. Add a \`cities.js\` entry with matching id ${id}
2. Add a \`metrics.js\` \`rawMetrics[${id}]\` entry with all categories
3. Run \`npm run data:refresh\` to fetch Census fields
4. Run \`npm test\` — shape + completeness tests will catch anything missing
`;
}

async function main() {
  await loadDotEnv();
  const rl = readline.createInterface({ input, output });

  console.log("📍 Add a new city to the pipeline\n");
  const cityName = (await rl.question("City name (e.g., \"Asheville\"): ")).trim();
  if (!cityName) {
    console.error("Aborted: city name required.");
    rl.close();
    process.exit(1);
  }
  const stateInput = (await rl.question("State (name or 2-letter abbr, e.g., \"NC\"): ")).trim();
  const stateFips = resolveStateFips(stateInput);
  if (!stateFips) {
    console.error(`Unknown state: ${stateInput}`);
    rl.close();
    process.exit(1);
  }

  console.log(`\n🔎 Searching Census Places in state FIPS ${stateFips} for "${cityName}"...`);
  let searchResult;
  try {
    searchResult = await searchPlaces(stateFips, cityName);
  } catch (err) {
    console.error(`💥 Census lookup failed: ${err.message}`);
    rl.close();
    process.exit(2);
  }
  const { matches, vintage } = searchResult;
  if (matches.length === 0) {
    console.error(`No matches in vintage ${vintage}. Try a broader search or a different spelling.`);
    rl.close();
    process.exit(1);
  }
  console.log(`\nFound ${matches.length} candidate(s) in vintage ${vintage}:`);
  matches.slice(0, 15).forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.name}  (placeFips=${m.placeFips})`);
  });
  if (matches.length > 15) console.log(`  ... and ${matches.length - 15} more`);

  const pick = (await rl.question("\nPick a number (or 'q' to quit): ")).trim();
  if (pick.toLowerCase() === "q") {
    rl.close();
    return;
  }
  const idx = Number(pick) - 1;
  if (!Number.isInteger(idx) || idx < 0 || idx >= matches.length) {
    console.error("Invalid selection.");
    rl.close();
    process.exit(1);
  }
  const chosen = matches[idx];

  const geoids = JSON.parse(await fs.readFile(GEOIDS_PATH, "utf8"));
  const existing = Object.values(geoids).find(
    (e) => e && e.stateFips === stateFips && e.placeFips === chosen.placeFips,
  );
  if (existing) {
    console.warn(`⚠️  This place is already in city-geoids.json as ${existing.displayName ?? "(no displayName)"}`);
  }
  const id = nextFreeId(geoids);
  geoids[id] = {
    stateFips,
    placeFips: chosen.placeFips,
    displayName: chosen.name,
  };

  await fs.writeFile(GEOIDS_PATH, JSON.stringify(geoids, null, 2) + "\n", "utf8");
  console.log(`\n✅ Added id ${id} to city-geoids.json: ${chosen.name}`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const checklistPath = path.join(OUTPUT_DIR, `research-checklist-${id}.md`);
  await fs.writeFile(
    checklistPath,
    checklistMarkdown({
      id,
      cityName,
      stateFips,
      placeFips: chosen.placeFips,
      displayName: chosen.name,
    }),
    "utf8",
  );
  console.log(`📝 Wrote ${path.relative(PROJECT_ROOT, checklistPath)}`);
  console.log(`\nNext: run \`npm run data:refresh\` to fetch Census fields, then fill the checklist by hand.`);
  rl.close();
}

main().catch((err) => {
  console.error("💥 Unhandled error:", err);
  process.exit(2);
});
