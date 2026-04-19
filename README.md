# city-finder

A wellness-focused relocation planning app. Scores **47 cities** across **17 data-driven categories** (recovery, mental health, dating, walkability, outdoor rec, climate, cost, air quality, events, and more), with clickable source links for every metric and a formula-based scoring engine — no hand-assigned numbers.

## What it does

- Scores every city 1–10 across 17 categories
- Exposes every raw data point with clickable source links (Raw Data tab)
- Plots all 47 cities on a 1–10 scatter plot (Rankings tab)
- Renders a US flight-path map to BWI with times and costs (Travel Time tab)
- Filter, sort, weight categories, search by name, compare cities side-by-side
- Saves favorites, personal ratings, notes, and pros/cons to localStorage
- Generates shareable URLs that encode your weight + filter state

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint      # ESLint
npm test          # Vitest - formula unit tests
npm run build     # production build → dist/
```

Requires Node 18+.

## The 17 scoring categories

| Category | Key raw inputs |
|---|---|
| Affordability | `costIndex`, `medianRentNumeric` |
| Air Quality | `aqiMedian`, `goodAQIDays` |
| Climate & Weather | `sunshineDays`, summer/winter temps, snowfall |
| Crime | `violentPer1k`, `propertyPer1k` |
| Dating Scene | `metroPop`, `femaleMaleRatio`, `singlesPct25_34`, `pctAge25_34` |
| Events & Entertainment | `proTeams`, `largeVenues`, `annualConcerts`, `musicFestivals` |
| Gyms & Fitness | `gymsTotal`, `gymsPer10k` |
| Health & Wellness | `hospitalScore`, `integrativePractitioners` |
| Healthy Social & Community | `intramuralLeagues`, `runningClubs`, `outdoorGroupsScore` |
| Job Market & Remote Work | `unemploymentRate`, `remoteWorkPct`, `medianIncome` |
| Meditation & Mindfulness | `yogaStudios`, `meditationCenters` |
| Mental Health & Therapy | `therapistsPer10k`, `academicTier`, `acceptingNewPatientsPct`, `insuranceAcceptancePct` |
| Nutrition & Health Food | `healthStores`, `healthStoresPer10k`, `yearRoundMarket` |
| Outdoor Recreation | `trailCount`, `skiResortsWithin1hr`, `publicLandAcres` |
| Recovery Support | `weeklyAA`, `weeklyNA` |
| Walkability | `walkScore` |
| Young Adult Density | `pctAge25_34` (colored chip also shown on every card) |

All formulas live in [`src/data/metrics.js`](src/data/metrics.js). Every raw data point has a clickable source link on the city detail page — see [`src/data/sources.js`](src/data/sources.js).

## Architecture

```
src/
├── App.jsx                   # top-level view routing (~190 lines)
├── App.css                   # global stylesheet with CSS variables
├── components/
│   ├── HeaderNav.jsx         # tab bar
│   ├── FilterControls.jsx    # region chips + search + sort + weights panel
│   ├── GridToolbar.jsx       # result count + expand/collapse-all
│   ├── CityCard.jsx          # grid item with young-adult chip
│   ├── CityDetail.jsx        # full city profile
│   ├── CompareView.jsx       # 2-3 cities side-by-side table
│   ├── RankingsView.jsx      # scatter plot on 4-10 axis
│   ├── TravelTimeView.jsx    # d3-geo US map with flight paths to BWI
│   ├── DecisionDashboard.jsx # favorites + ratings summary
│   ├── MethodologyView.jsx   # raw data + formula docs
│   ├── PersonalNotes.jsx     # per-city notes / rating / pros-cons
│   └── ScoreBar.jsx          # single score row
├── data/
│   ├── cities.js             # static city metadata + detail-generator dispatch table
│   ├── metrics.js            # 17 scoring formulas + raw data for all 47 cities
│   ├── metrics.test.js       # Vitest formula tests
│   ├── sources.js            # source URLs per city per metric
│   └── flights.js            # nearest airport + flight data to BWI
├── hooks/
│   ├── useLocalStorage.js    # persistent state with schema versioning
│   ├── useUserData.js        # favorites/ratings/notes/pros-cons
│   └── useGridFilters.js     # sort/weights/filters + URL param hydration
└── utils/
    └── score.js              # shared weighted-score calculation
```

### How scores are computed

```
rawMetrics[cityId][category] → formulas[category].compute() → number in [1, 10]
```

1. Raw metrics are hand-collected in `src/data/metrics.js`, one entry per city per category
2. `computeScores(cityId)` runs every formula against the raw data
3. `generateAllDetails(cityId)` produces bullet-point descriptions from the same raw data (`detailGenerators` dispatch table in `cities.js`)
4. User-tunable category `weights` combine scores into a weighted average shown on each card

No hand-assigned scores. No silent fallbacks. Every number traces back to a raw input with a source URL.

## Adding a new city

1. **Metrics** — Add an entry to `rawMetrics` in `src/data/metrics.js`. Copy an existing city block and fill all 17 categories. Category keys and field names must match exactly.
2. **City metadata** — Add to `citiesRaw` in `src/data/cities.js`: `{ id, name, region, population, elevation, image, summary, costOfLiving, medianRent, medianHome, vibe }`.
3. **Sources** — Add source URLs in `src/data/sources.js`.
4. **Flight** — Add flight data in `src/data/flights.js`.
5. **Test** — `npm test` to catch missing metrics. Rankings tab should show the new city.

## Adjusting a formula

All formulas live at the top of `src/data/metrics.js`. Each has a `description` and a `formula` string.

When changing a coefficient:

- Re-run `npm test` to confirm outputs stay clamped to [1, 10]
- Sanity-check rank order for Boulder, DC, Austin, Sedona, Carbondale
- Update the `description` with your rationale

## Storage keys

| localStorage key | Contents |
|---|---|
| `cmp-user-data` | favorites, ratings, notes, pros/cons per city |
| `cmp-weights` | per-category multipliers (0–3) |
| `cmp-minScores` | per-category minimum-score filters |
| `cmp-sortBy`, `cmp-search`, `cmp-regions` | grid view state |

All entries are schema-versioned via the `useLocalStorage` hook.

## Tech stack

React 18 · Vite 5 · d3-geo · us-atlas · topojson-client · ESLint flat config · Vitest.

No Redux, no React Router, no CSS-in-JS. Single-page tab routing via a `view` string in App.jsx.

## Known gaps

- No end-to-end tests (only formula unit tests)
- No CI pipeline
- Default Vite favicon
- No Open Graph / social meta tags
- Pre-existing `react/prop-types` lint warnings across components
