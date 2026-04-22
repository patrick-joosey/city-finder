# Data pipeline

Automated data fetching for the city-finder app. Today only demographics (Census ACS) are covered; follow-up slices will add AQI (EPA AirNow), unemployment (BLS), climate (NOAA), etc.

## What it does

1. Reads `pipeline/city-geoids.json` — maps each of the 47 city IDs to either a Census place (`{ stateFips, placeFips }`) or to a parent city (`{ parentId }`)
2. Batches one Census ACS 5-year API call per state — fetches 30+ variables per call
3. Runs `pipeline/transforms/demographics.mjs` to turn raw Census rows into the `rawMetrics` shape the app expects
4. Writes results to `src/data/generated/rawMetrics.json` and `src/data/generated/meta.json`
5. The app imports the generated JSON at module load and spreads it over the static `rawMetrics` in `src/data/metrics.js`

The 9 fields this pipeline owns:

| Category | Fields |
|---|---|
| `jobMarket` | `unemploymentRate`, `remoteWorkPct`, `medianIncome` |
| `youngAdults` | `pctAge25_34`, `metroPop` |
| `dating` | `metroPop`, `femaleMaleRatio`, `singlesPct25_34`, `pctAge25_34` |

Everything else (therapist counts, AA meetings, walkScore, hospitalScore, etc.) remains hand-curated in `src/data/metrics.js`.

## Quick start

```bash
# Optional: get a Census API key (removes the 500/day rate limit)
#   https://api.census.gov/data/key_signup.html
# Then:
echo "CENSUS_API_KEY=your-key-here" > .env.local

# See what would change without writing:
npm run data:refresh -- --dry-run

# Refresh + write generated files:
npm run data:refresh

# Bootstrap a new city:
npm run data:add-city
```

## Directory layout

```
pipeline/
├── README.md            (this file)
├── city-geoids.json     47 city entries: { stateFips, placeFips } OR { parentId }
├── variables.js         Census variable IDs + derived-field formulas (single source of truth)
├── fetchers/
│   └── census.mjs       Batched per-state fetch, disk cache, retry with backoff
├── transforms/
│   └── demographics.mjs Census rows → rawMetrics shape; resolves parentId inheritance
├── refresh.mjs          Orchestrator with --dry-run
├── add-city.mjs         Interactive CLI: captures geoid + emits research-checklist.md
└── __tests__/           Fixture-based unit tests (no network)
```

Generated output lives in `src/data/generated/` (inside `src/` so Vite resolves imports naturally):

```
src/data/generated/
├── rawMetrics.json      Per-city object with the 9 fields this pipeline owns
└── meta.json            { source: "ACS 5-year", vintage: 2022, fetchedAt: "..." }
```

## Source-of-truth rule

Every field is **either** in `metrics.js` (hand-curated) **or** in `generated/rawMetrics.json` (fetched) — never both. If you want to take a new field out of the hand-curated data, first delete it from `metrics.js` then add it to the pipeline.

## Data vintage

The ACS 5-year release is published every December with a 2-year lag. `variables.js` defaults to `currentYear - 2` and falls back to `-3` if that year returns 404. The `meta.json` output records the exact vintage used; the UI surfaces it in a small footer.

## Parent-metro inheritance

Sub-neighborhoods (e.g., `Denver: Capitol Hill`, `Austin: East Austin`) don't have their own Census place, so their entries in `city-geoids.json` look like:

```json
{ "4": { "parentId": 13 } }
```

At transform time, the neighborhood's `rawMetrics` slot is copied from its parent's fetched data. This matches how the app already handles metros — Denver neighborhoods share Denver-wide demographics because you date / work / earn within the metro, not within a 10-block radius.

## Adding a new city

```bash
npm run data:add-city
```

Interactive prompts ask for:
- City name + region
- State FIPS + place FIPS (or parent city ID)
- Short summary + vibe string
- Median rent + home price (still hand-entered for now)

The script appends to `city-geoids.json`, runs a Census refresh for that city, and emits `research-checklist-{id}.md` listing the non-Census fields you still need to research manually (gyms, AA meetings, therapist counts, etc.).

## Tests

```bash
npm test pipeline
```

Fixture-based. No network. Validates:
- Census rows correctly project into the `rawMetrics` shape
- `parentId` inheritance works both ways (direct and chained)
- Vintage-fallback handles 404
- Schema: every city in `city-geoids.json` produces the 9 expected fields

## Gotchas

- **Margin of error.** Census `_M` columns describe uncertainty. For small neighborhoods, MOE can be ±30%. We currently ignore MOE; Phase 2 should surface "low confidence" for cities where relative MOE > 15%.
- **Metro vs city pop.** `metroPop` for the `dating` pool calculation should be metro-wide (since dating is metro-scoped), but `youngAdults.metroPop` could arguably be city-scoped. The current transform treats them the same — worth revisiting if scores feel off.
- **Census `null` encoding.** Missing values come back as `null` or `-666666666`. The transform filters both.
