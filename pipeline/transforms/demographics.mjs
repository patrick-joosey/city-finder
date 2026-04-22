// Census rows -> rawMetrics shape, with parentId inheritance.
//
// Produces a per-city object matching the generated fields defined in
// variables.js. Every city in city-geoids.json must resolve to either a place
// row directly OR to a parent city that has one — if neither resolves, an error
// is raised (we fail loudly rather than ship NaNs).

import { deriveAllFields, GENERATED_FIELDS_BY_CATEGORY } from "../variables.js";
import { findPlaceRow } from "../fetchers/census.mjs";

// Maximum parent chain depth to follow. Protects against accidental cycles.
const MAX_PARENT_DEPTH = 4;

// Resolve a city's place row, following parentId up to MAX_PARENT_DEPTH hops.
// Returns { row, resolvedFromId } or throws with a descriptive error.
export function resolveRow(cityId, geoids, stateData) {
  const visited = new Set();
  let currentId = String(cityId);
  for (let depth = 0; depth < MAX_PARENT_DEPTH; depth++) {
    if (visited.has(currentId)) {
      throw new Error(`Cycle detected in parentId chain starting at city ${cityId}`);
    }
    visited.add(currentId);
    const entry = geoids[currentId];
    if (!entry) {
      throw new Error(`City ${currentId} missing from city-geoids.json`);
    }
    if (entry.parentId != null) {
      currentId = String(entry.parentId);
      continue;
    }
    if (!entry.stateFips || !entry.placeFips) {
      throw new Error(`City ${currentId} has neither stateFips/placeFips nor parentId`);
    }
    const state = stateData[entry.stateFips];
    if (!state) {
      throw new Error(`No Census data fetched for state ${entry.stateFips} (needed by city ${currentId})`);
    }
    const row = findPlaceRow(state, entry.placeFips);
    if (!row) {
      throw new Error(
        `Place ${entry.placeFips} not found in state ${entry.stateFips} data (city ${currentId}, ${entry.displayName ?? ""})`,
      );
    }
    return { row, resolvedFromId: currentId, stateFips: entry.stateFips };
  }
  throw new Error(`parentId chain exceeded depth ${MAX_PARENT_DEPTH} for city ${cityId}`);
}

// Build the full generated rawMetrics object for all cities in the geoid map.
// stateData is a map stateFips -> result-of-fetchStateData().
// Returns { generated, errors }.
//   - generated: { cityId: { jobMarket: {...}, youngAdults: {...}, dating: {...} } }
//   - errors: array of { cityId, error } for any city that failed
export function buildGenerated(geoids, stateData) {
  const generated = {};
  const errors = [];
  // Skip meta entries (keys starting with underscore)
  const cityIds = Object.keys(geoids).filter((k) => !k.startsWith("_"));
  for (const cityId of cityIds) {
    try {
      const { row, resolvedFromId } = resolveRow(cityId, geoids, stateData);
      const fields = deriveAllFields(row);
      // Sanity check: every generated field must be a number or null.
      for (const [category, catFields] of Object.entries(GENERATED_FIELDS_BY_CATEGORY)) {
        for (const field of catFields) {
          const val = fields[category]?.[field];
          if (val != null && !Number.isFinite(val)) {
            throw new Error(`Derived ${category}.${field} is not a finite number: ${val}`);
          }
        }
      }
      generated[cityId] = fields;
      if (resolvedFromId !== cityId) {
        fields._inheritedFromId = Number(resolvedFromId);
      }
    } catch (err) {
      errors.push({ cityId, error: err.message });
    }
  }
  return { generated, errors };
}

// Diff two generated snapshots to report changes compactly.
// Returns { added, removed, changed: { cityId: { field: [old, new] } } }.
export function diffGenerated(prev, next) {
  const result = { added: [], removed: [], changed: {} };
  const prevIds = new Set(Object.keys(prev || {}));
  const nextIds = new Set(Object.keys(next || {}));
  for (const id of nextIds) if (!prevIds.has(id)) result.added.push(id);
  for (const id of prevIds) if (!nextIds.has(id)) result.removed.push(id);
  for (const id of nextIds) {
    if (!prevIds.has(id)) continue;
    const diffs = {};
    for (const [category, catFields] of Object.entries(GENERATED_FIELDS_BY_CATEGORY)) {
      for (const field of catFields) {
        const a = prev[id]?.[category]?.[field];
        const b = next[id]?.[category]?.[field];
        if (a !== b) diffs[`${category}.${field}`] = [a, b];
      }
    }
    if (Object.keys(diffs).length > 0) result.changed[id] = diffs;
  }
  return result;
}
