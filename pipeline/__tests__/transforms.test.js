import { describe, it, expect } from "vitest";
import { DERIVED_FIELDS, deriveAllFields } from "../variables.js";
import { resolveRow, buildGenerated, diffGenerated } from "../transforms/demographics.mjs";

// Pre-parsed Census row shape: variable names without the "E" suffix, numbers
// already coerced, missing values already nulled. Matches what the fetcher
// produces via parseCensusResponse().
function makeRow(overrides = {}) {
  return {
    NAME: "Test city, Test State",
    state: "08",
    place: "20000",
    B01003_001: 700000,         // total pop
    B01001_011: 30000,          // male 25-29
    B01001_012: 35000,          // male 30-34
    B01001_035: 32000,          // female 25-29
    B01001_036: 37000,          // female 30-34
    B12002_003: 30000,          // male 25-29 total
    B12002_004: 35000,          // male 30-34 total
    B12002_005: 20000,          // male 25-29 never-married
    B12002_006: 22000,          // male 30-34 never-married
    B12002_083: 32000,          // female 25-29 total
    B12002_084: 37000,          // female 30-34 total
    B12002_085: 21000,          // female 25-29 never-married
    B12002_086: 23000,          // female 30-34 never-married
    B23025_002: 400000,         // civilian labor force
    B23025_005: 18000,          // unemployed
    B19013_001: 95000,          // median household income
    B08301_001: 380000,         // total workers
    B08301_021: 76000,          // worked from home (20% remote)
    ...overrides,
  };
}

describe("DERIVED_FIELDS", () => {
  it("computes metroPop from B01003_001", () => {
    expect(DERIVED_FIELDS.metroPop(makeRow())).toBe(700000);
  });

  it("computes pctAge25_34 correctly (sum of 4 age/sex slots over total pop)", () => {
    // (30000 + 35000 + 32000 + 37000) / 700000 = 0.19... → 19.1%
    const pct = DERIVED_FIELDS.pctAge25_34(makeRow());
    expect(pct).toBeCloseTo(19.1, 1);
  });

  it("computes femaleMaleRatio for 25-34", () => {
    // (32000 + 37000) / (30000 + 35000) = 69000 / 65000 = 1.0615...
    const r = DERIVED_FIELDS.femaleMaleRatio(makeRow());
    expect(r).toBeCloseTo(1.062, 3);
  });

  it("computes singlesPct25_34 from never-married counts", () => {
    // Never-married: 20000+22000+21000+23000 = 86000
    // Total 25-34:   30000+35000+32000+37000 = 134000
    // 86000/134000 = 0.642 → 64.2%
    expect(DERIVED_FIELDS.singlesPct25_34(makeRow())).toBeCloseTo(64.2, 1);
  });

  it("computes unemploymentRate as unemployed / labor force", () => {
    // 18000 / 400000 = 0.045 → 4.5%
    expect(DERIVED_FIELDS.unemploymentRate(makeRow())).toBe(4.5);
  });

  it("returns medianIncome directly", () => {
    expect(DERIVED_FIELDS.medianIncome(makeRow())).toBe(95000);
  });

  it("computes remoteWorkPct as worked-from-home / total workers", () => {
    // 76000 / 380000 = 0.2 → 20.0%
    expect(DERIVED_FIELDS.remoteWorkPct(makeRow())).toBe(20);
  });

  it("returns null when any numerator or denominator is null", () => {
    expect(DERIVED_FIELDS.unemploymentRate(makeRow({ B23025_002: null }))).toBeNull();
    expect(DERIVED_FIELDS.remoteWorkPct(makeRow({ B08301_001: 0 }))).toBeNull(); // division by zero
    expect(DERIVED_FIELDS.pctAge25_34(makeRow({ B01003_001: null }))).toBeNull();
  });
});

describe("deriveAllFields", () => {
  it("assembles all 3 category objects with all expected fields", () => {
    const out = deriveAllFields(makeRow());
    expect(out.jobMarket).toEqual({
      unemploymentRate: 4.5,
      remoteWorkPct: 20,
      medianIncome: 95000,
    });
    expect(out.youngAdults).toEqual({
      pctAge25_34: 19.1,
      metroPop: 700000,
    });
    expect(out.dating).toEqual({
      metroPop: 700000,
      femaleMaleRatio: 1.062,
      singlesPct25_34: 64.2,
      pctAge25_34: 19.1,
    });
  });

  it("shares the same pctAge25_34 and metroPop between youngAdults and dating", () => {
    const out = deriveAllFields(makeRow());
    expect(out.youngAdults.pctAge25_34).toBe(out.dating.pctAge25_34);
    expect(out.youngAdults.metroPop).toBe(out.dating.metroPop);
  });
});

describe("resolveRow (parentId chain)", () => {
  const row = makeRow();
  const geoids = {
    "1": { stateFips: "08", placeFips: "07850" },
    "13": { stateFips: "08", placeFips: "20000" },
    "4":  { parentId: 13 },
    "9":  { parentId: 13 },
    "99": { parentId: 99 },   // self-cycle
    "50": { parentId: 51 },   // chains to 51
    "51": { parentId: 50 },   // which chains back to 50
    "60": { parentId: 13 },   // valid chain
  };
  const stateData = {
    "08": { vintage: 2022, rows: [{ ...row, place: "20000" }, { ...row, place: "07850", B19013_001: 110000 }] },
  };

  it("resolves a direct-place city to its own row", () => {
    const { row: r, resolvedFromId } = resolveRow("13", geoids, stateData);
    expect(r.place).toBe("20000");
    expect(resolvedFromId).toBe("13");
  });

  it("resolves a parentId city to the parent's row", () => {
    const { row: r, resolvedFromId } = resolveRow("4", geoids, stateData);
    expect(r.place).toBe("20000");
    expect(resolvedFromId).toBe("13");
  });

  it("uses the city's own place data, not the parent's, for direct-place cities", () => {
    const { row: r } = resolveRow("1", geoids, stateData);
    expect(r.B19013_001).toBe(110000); // Boulder's row, not Denver's
  });

  it("throws on self-cycle parentId", () => {
    expect(() => resolveRow("99", geoids, stateData)).toThrow(/Cycle/);
  });

  it("throws on mutual-cycle parentId", () => {
    expect(() => resolveRow("50", geoids, stateData)).toThrow(/Cycle/);
  });

  it("throws when city is missing from geoids", () => {
    expect(() => resolveRow("999", geoids, stateData)).toThrow(/missing from city-geoids/);
  });

  it("throws when state data isn't fetched", () => {
    const unfetched = { "70": { stateFips: "99", placeFips: "12345" } };
    expect(() => resolveRow("70", unfetched, {})).toThrow(/No Census data fetched/);
  });
});

describe("buildGenerated", () => {
  const geoids = {
    "_comment": "ignored",
    "1":  { stateFips: "08", placeFips: "07850" },
    "13": { stateFips: "08", placeFips: "20000" },
    "4":  { parentId: 13 },
  };
  const stateData = {
    "08": {
      vintage: 2022,
      rows: [
        makeRow({ place: "20000", B19013_001: 80000 }),
        makeRow({ place: "07850", B19013_001: 105000 }),
      ],
    },
  };

  it("produces a full rawMetrics slot for every city", () => {
    const { generated, errors } = buildGenerated(geoids, stateData);
    expect(errors).toEqual([]);
    expect(Object.keys(generated).sort()).toEqual(["1", "13", "4"]);
    for (const id of ["1", "13", "4"]) {
      expect(generated[id].jobMarket).toBeDefined();
      expect(generated[id].youngAdults).toBeDefined();
      expect(generated[id].dating).toBeDefined();
    }
  });

  it("skips keys beginning with underscore (e.g. _comment)", () => {
    const { generated } = buildGenerated(geoids, stateData);
    expect(generated._comment).toBeUndefined();
  });

  it("marks inherited cities with _inheritedFromId", () => {
    const { generated } = buildGenerated(geoids, stateData);
    expect(generated["4"]._inheritedFromId).toBe(13);
    expect(generated["13"]._inheritedFromId).toBeUndefined();
  });

  it("uses the correct place row for direct-place cities", () => {
    const { generated } = buildGenerated(geoids, stateData);
    expect(generated["1"].jobMarket.medianIncome).toBe(105000); // Boulder
    expect(generated["13"].jobMarket.medianIncome).toBe(80000); // Denver
    expect(generated["4"].jobMarket.medianIncome).toBe(80000);  // inherits Denver
  });

  it("collects errors for unresolvable cities instead of throwing", () => {
    const bad = { ...geoids, "777": { stateFips: "99", placeFips: "99999" } };
    const { generated, errors } = buildGenerated(bad, stateData);
    expect(errors.length).toBe(1);
    expect(errors[0].cityId).toBe("777");
    expect(generated["777"]).toBeUndefined();
  });
});

describe("diffGenerated", () => {
  it("reports added, removed, and changed", () => {
    const prev = {
      "1": { jobMarket: { unemploymentRate: 4.0, remoteWorkPct: 20, medianIncome: 100000 }, youngAdults: {}, dating: {} },
      "2": { jobMarket: { unemploymentRate: 5.0, remoteWorkPct: 15, medianIncome: 80000 }, youngAdults: {}, dating: {} },
    };
    const next = {
      "1": { jobMarket: { unemploymentRate: 3.8, remoteWorkPct: 22, medianIncome: 100000 }, youngAdults: {}, dating: {} },
      "3": { jobMarket: {}, youngAdults: {}, dating: {} },
    };
    const d = diffGenerated(prev, next);
    expect(d.added).toEqual(["3"]);
    expect(d.removed).toEqual(["2"]);
    expect(d.changed["1"]).toEqual({
      "jobMarket.unemploymentRate": [4.0, 3.8],
      "jobMarket.remoteWorkPct": [20, 22],
    });
  });

  it("handles missing prev snapshot (first run)", () => {
    const d = diffGenerated(null, { "1": { jobMarket: {}, youngAdults: {}, dating: {} } });
    expect(d.added).toEqual(["1"]);
    expect(d.removed).toEqual([]);
  });
});
