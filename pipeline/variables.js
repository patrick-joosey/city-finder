// Census ACS 5-year variable definitions and derived-field formulas.
// Single source of truth shared between the fetcher, the transform, and tests.
//
// Reference: https://api.census.gov/data/2022/acs/acs5/variables.html
//
// The API returns numeric strings; values of -666666666 (or similar very negative
// numbers) are sentinels meaning "data not available" — the transform replaces
// them with null.

// ---------------------------------------------------------------------------
// Variables we fetch per place
// ---------------------------------------------------------------------------
// Grouped by Census "table" (B01003, B01001, etc.). The fetcher asks for all
// of these in a single HTTP call per state, which the Census API supports by
// comma-joining variable names in the `get=` query param.

export const CENSUS_VARIABLES = [
  // Total population (B01003)
  "B01003_001E",

  // Sex by Age (B01001) — we need 4 specific age/sex slots for the 25-34 cohort
  "B01001_011E", // Male 25-29
  "B01001_012E", // Male 30-34
  "B01001_035E", // Female 25-29
  "B01001_036E", // Female 30-34

  // Marital Status by Age & Sex (B12002) — never-married counts for 25-34
  // Male never-married: B12002_005 (25-29) + B12002_006 (30-34)
  // Female never-married: B12002_085 (25-29) + B12002_086 (30-34)
  // Totals for same age/sex: B12002_003 (Male 25-29) + B12002_004 (Male 30-34)
  //                          B12002_083 (Female 25-29) + B12002_084 (Female 30-34)
  "B12002_003E",
  "B12002_004E",
  "B12002_005E",
  "B12002_006E",
  "B12002_083E",
  "B12002_084E",
  "B12002_085E",
  "B12002_086E",

  // Employment Status (B23025) — civilian labor force + unemployed
  "B23025_002E", // In labor force
  "B23025_005E", // Unemployed

  // Median Household Income (B19013)
  "B19013_001E",

  // Means of Transport to Work (B08301) — total workers + "worked from home"
  "B08301_001E", // Total workers 16+
  "B08301_021E", // Worked from home
];

// ---------------------------------------------------------------------------
// Derived-field formulas
// ---------------------------------------------------------------------------
// Each function takes a `row` object keyed by variable name (without the "E"
// suffix for readability) and returns a number or null.
//
// All Census values are pre-coerced to numbers by the fetcher, with sentinels
// mapped to null. Division by zero or null returns null.

const safeDivide = (num, denom) => {
  if (num == null || denom == null || denom === 0) return null;
  return num / denom;
};

const safeSum = (...vals) => {
  const cleaned = vals.filter((v) => v != null);
  if (cleaned.length === 0) return null;
  return cleaned.reduce((a, b) => a + b, 0);
};

export const DERIVED_FIELDS = {
  // { metroPop }
  metroPop: (r) => r.B01003_001 ?? null,

  // { pctAge25_34 } — percentage (0-100), not proportion (0-1)
  pctAge25_34: (r) => {
    const age25_34 = safeSum(r.B01001_011, r.B01001_012, r.B01001_035, r.B01001_036);
    const total = r.B01003_001;
    const ratio = safeDivide(age25_34, total);
    return ratio == null ? null : Math.round(ratio * 1000) / 10; // 1 decimal place
  },

  // { femaleMaleRatio } — female ÷ male for the 25-34 cohort
  femaleMaleRatio: (r) => {
    const female = safeSum(r.B01001_035, r.B01001_036);
    const male = safeSum(r.B01001_011, r.B01001_012);
    const ratio = safeDivide(female, male);
    return ratio == null ? null : Math.round(ratio * 1000) / 1000;
  },

  // { singlesPct25_34 } — % never-married within the 25-34 cohort
  singlesPct25_34: (r) => {
    const neverMarried = safeSum(r.B12002_005, r.B12002_006, r.B12002_085, r.B12002_086);
    const total25_34 = safeSum(r.B12002_003, r.B12002_004, r.B12002_083, r.B12002_084);
    const ratio = safeDivide(neverMarried, total25_34);
    return ratio == null ? null : Math.round(ratio * 1000) / 10;
  },

  // { unemploymentRate } — percentage (0-100)
  unemploymentRate: (r) => {
    const ratio = safeDivide(r.B23025_005, r.B23025_002);
    return ratio == null ? null : Math.round(ratio * 1000) / 10;
  },

  // { medianIncome }
  medianIncome: (r) => r.B19013_001 ?? null,

  // { remoteWorkPct } — percentage (0-100)
  remoteWorkPct: (r) => {
    const ratio = safeDivide(r.B08301_021, r.B08301_001);
    return ratio == null ? null : Math.round(ratio * 1000) / 10;
  },
};

// ---------------------------------------------------------------------------
// Which rawMetrics fields this slice owns
// ---------------------------------------------------------------------------
// Deleting these from the static rawMetrics in metrics.js is a precondition
// for the pipeline to be the source of truth. Tests should refuse to pass
// if any of these still exists in both places.

export const GENERATED_FIELDS_BY_CATEGORY = {
  jobMarket: ["unemploymentRate", "remoteWorkPct", "medianIncome"],
  youngAdults: ["pctAge25_34", "metroPop"],
  dating: ["metroPop", "femaleMaleRatio", "singlesPct25_34", "pctAge25_34"],
};

// Assemble the per-city generated slot from a Census row
export function deriveAllFields(row) {
  const metroPop = DERIVED_FIELDS.metroPop(row);
  const pctAge25_34 = DERIVED_FIELDS.pctAge25_34(row);
  return {
    jobMarket: {
      unemploymentRate: DERIVED_FIELDS.unemploymentRate(row),
      remoteWorkPct: DERIVED_FIELDS.remoteWorkPct(row),
      medianIncome: DERIVED_FIELDS.medianIncome(row),
    },
    youngAdults: {
      pctAge25_34,
      metroPop,
    },
    dating: {
      metroPop,
      femaleMaleRatio: DERIVED_FIELDS.femaleMaleRatio(row),
      singlesPct25_34: DERIVED_FIELDS.singlesPct25_34(row),
      pctAge25_34,
    },
  };
}

// ---------------------------------------------------------------------------
// Vintage handling
// ---------------------------------------------------------------------------

export function defaultVintage() {
  // ACS 5-year is released each December with a 2-year lag.
  return new Date().getUTCFullYear() - 2;
}

// Candidate years to try if the default isn't yet published.
export function vintageCandidates(start = defaultVintage()) {
  return [start, start - 1, start - 2];
}
