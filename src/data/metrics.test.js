import { describe, it, expect } from "vitest";
import { formulas, rawMetrics, computeScores } from "./metrics";
import geoids from "../../pipeline/city-geoids.json";
import generatedMetrics from "./generated/rawMetrics.json";
import generatedMeta from "./generated/meta.json";

const GENERATED_FIELDS_BY_CATEGORY = {
  jobMarket: ["unemploymentRate", "remoteWorkPct", "medianIncome"],
  youngAdults: ["pctAge25_34", "metroPop"],
  dating: ["metroPop", "femaleMaleRatio", "singlesPct25_34", "pctAge25_34"],
};

// Smoke tests — every formula should:
//   * exist with a .compute() function
//   * produce a number in [1, 10] for a realistic input
//   * clamp correctly when inputs are extreme
//
// We don't test every coefficient by hand; we verify the mathematical
// contract (bounded output, monotonic where expected) and the overall
// score shape.

const EXPECTED_CATEGORIES = [
  "safety", "recovery", "meditation", "healthWellness", "mentalHealth",
  "gyms", "nutrition", "socialCommunity", "walkability", "outdoorRec",
  "climate", "affordability", "airQuality", "jobMarket", "youngAdults",
  "dating", "events",
];

describe("formulas", () => {
  it("defines every expected category", () => {
    for (const key of EXPECTED_CATEGORIES) {
      expect(formulas[key], `missing formula: ${key}`).toBeDefined();
      expect(typeof formulas[key].compute).toBe("function");
      expect(typeof formulas[key].name).toBe("string");
    }
  });

  it("clamps all outputs to [1, 10]", () => {
    // Build a synthetic metric set for each formula using its declared keys.
    // We send "worst case" (all zeros) and "best case" (large positive values).
    for (const [key, formula] of Object.entries(formulas)) {
      const worstInputs = {};
      const bestInputs = {};
      for (const { key: mKey } of formula.metrics) {
        worstInputs[mKey] = 0;
        // Large enough to push any formula past 10, but not Infinity.
        bestInputs[mKey] = 10000;
      }
      // Special-case metrics that are booleans
      if (key === "nutrition") {
        worstInputs.yearRoundMarket = false;
        worstInputs.seasonalMarket = false;
        bestInputs.yearRoundMarket = true;
        bestInputs.seasonalMarket = true;
      }

      const worst = formula.compute(worstInputs);
      const best = formula.compute(bestInputs);

      expect(worst, `${key} worst-case below floor`).toBeGreaterThanOrEqual(1);
      expect(worst, `${key} worst-case above ceiling`).toBeLessThanOrEqual(10);
      expect(best, `${key} best-case below floor`).toBeGreaterThanOrEqual(1);
      expect(best, `${key} best-case above ceiling`).toBeLessThanOrEqual(10);
    }
  });
});

describe("safety (crime) formula", () => {
  it("rewards low crime with ~10", () => {
    const s = formulas.safety.compute({ violentPer1k: 0, propertyPer1k: 0 });
    expect(s).toBeCloseTo(10, 1);
  });

  it("punishes violent crime 10x more than property crime", () => {
    const withViolent = formulas.safety.compute({ violentPer1k: 10, propertyPer1k: 0 });
    const withProperty = formulas.safety.compute({ violentPer1k: 0, propertyPer1k: 10 });
    // 10 * 0.5 = 5 violent penalty vs 10 * 0.05 = 0.5 property penalty
    expect(withProperty - withViolent).toBeCloseTo(4.5, 1);
  });
});

describe("recovery formula", () => {
  it("rewards more meetings with higher score", () => {
    const low = formulas.recovery.compute({ weeklyAA: 5, weeklyNA: 2 });
    const high = formulas.recovery.compute({ weeklyAA: 500, weeklyNA: 80 });
    expect(high).toBeGreaterThan(low);
  });

  it("has diminishing returns (log-scaled)", () => {
    const a = formulas.recovery.compute({ weeklyAA: 10, weeklyNA: 5 });
    const b = formulas.recovery.compute({ weeklyAA: 100, weeklyNA: 5 });
    const c = formulas.recovery.compute({ weeklyAA: 1000, weeklyNA: 5 });
    // 10→100 should be a bigger jump than 100→1000 (diminishing returns)
    expect(b - a).toBeGreaterThan(c - b);
  });
});

describe("walkability formula", () => {
  it("maps walkScore 100 to ~10 and 0 to ~1", () => {
    expect(formulas.walkability.compute({ walkScore: 100 })).toBeCloseTo(10, 1);
    expect(formulas.walkability.compute({ walkScore: 0 })).toBe(1);
    expect(formulas.walkability.compute({ walkScore: 50 })).toBeCloseTo(5, 1);
  });
});

describe("youngAdults formula", () => {
  it("maps 25% to 10 and 5% to 2", () => {
    expect(formulas.youngAdults.compute({ pctAge25_34: 25 })).toBe(10);
    expect(formulas.youngAdults.compute({ pctAge25_34: 5 })).toBe(2);
    expect(formulas.youngAdults.compute({ pctAge25_34: 15 })).toBe(6);
  });
});

describe("dating formula", () => {
  it("rewards bigger dating pools more than favorable ratios", () => {
    // Tiny town with great ratio vs big metro with neutral ratio
    const smallTown = formulas.dating.compute({
      metroPop: 10000,
      femaleMaleRatio: 1.1,
      singlesPct25_34: 50,
      pctAge25_34: 10,
    });
    const bigMetro = formulas.dating.compute({
      metroPop: 1_000_000,
      femaleMaleRatio: 0.98,
      singlesPct25_34: 60,
      pctAge25_34: 20,
    });
    expect(bigMetro).toBeGreaterThan(smallTown);
  });

  it("penalizes extreme male skew", () => {
    const neutral = formulas.dating.compute({
      metroPop: 100000, femaleMaleRatio: 1.0, singlesPct25_34: 50, pctAge25_34: 15,
    });
    const maleSkewed = formulas.dating.compute({
      metroPop: 100000, femaleMaleRatio: 0.71, singlesPct25_34: 50, pctAge25_34: 15,
    });
    expect(maleSkewed).toBeLessThan(neutral);
  });
});

describe("computeScores()", () => {
  it("produces a full 17-category score object for every city", () => {
    for (const id of Object.keys(rawMetrics)) {
      const scores = computeScores(Number(id));
      expect(scores, `city ${id} returned null`).not.toBeNull();
      for (const key of EXPECTED_CATEGORIES) {
        expect(scores[key], `city ${id} missing ${key}`).toBeTypeOf("number");
        expect(scores[key]).toBeGreaterThanOrEqual(1);
        expect(scores[key]).toBeLessThanOrEqual(10);
      }
    }
  });

  it("returns null for an unknown city id", () => {
    expect(computeScores(99999)).toBeNull();
  });
});

describe("generated demographics JSON", () => {
  const geoidIds = Object.keys(geoids).filter((k) => !k.startsWith("_"));

  it("has meta with expected shape", () => {
    expect(generatedMeta.source).toMatch(/Census/i);
    expect(typeof generatedMeta.vintage).toBe("number");
    expect(typeof generatedMeta.fetchedAt).toBe("string");
    expect(Array.isArray(generatedMeta.stateFipsFetched)).toBe(true);
    expect(generatedMeta.cityCount).toBe(geoidIds.length);
  });

  it("covers every city in city-geoids.json", () => {
    for (const id of geoidIds) {
      expect(generatedMetrics[id], `generated JSON missing city ${id}`).toBeDefined();
    }
  });

  it("fills all nine generated fields for every city", () => {
    for (const id of geoidIds) {
      const entry = generatedMetrics[id];
      for (const [category, fields] of Object.entries(GENERATED_FIELDS_BY_CATEGORY)) {
        for (const field of fields) {
          const val = entry[category]?.[field];
          expect(val, `city ${id} missing ${category}.${field}`).not.toBeUndefined();
          if (val !== null) {
            expect(Number.isFinite(val), `city ${id} ${category}.${field} not finite: ${val}`).toBe(true);
          }
        }
      }
    }
  });

  it("marks parentId-inherited cities with _inheritedFromId", () => {
    for (const [id, entry] of Object.entries(geoids)) {
      if (id.startsWith("_")) continue;
      if (entry.parentId != null) {
        expect(generatedMetrics[id]._inheritedFromId).toBe(entry.parentId);
      } else {
        expect(generatedMetrics[id]._inheritedFromId).toBeUndefined();
      }
    }
  });
});

describe("rawMetrics (merged static + generated)", () => {
  it("exposes the generated demographics on every city", () => {
    for (const id of Object.keys(generatedMetrics)) {
      const m = rawMetrics[id];
      expect(m, `rawMetrics missing city ${id}`).toBeDefined();
      for (const [category, fields] of Object.entries(GENERATED_FIELDS_BY_CATEGORY)) {
        for (const field of fields) {
          const val = m[category]?.[field];
          expect(val, `merged city ${id} missing ${category}.${field}`).not.toBeUndefined();
        }
      }
    }
  });

  it("keeps static-only categories intact after merge", () => {
    // Spot-check: Boulder (id=1) should still have its static safety/recovery data.
    const boulder = rawMetrics["1"];
    expect(boulder.safety).toBeDefined();
    expect(typeof boulder.safety.violentPer1k).toBe("number");
    expect(boulder.recovery).toBeDefined();
  });
});
