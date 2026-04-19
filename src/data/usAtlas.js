// Shared us-atlas loader + state-path cache.
// Used by TravelTimeView (full US map with flight paths) and CityCard
// (faint state silhouette behind each card).
//
// Fetches the TopoJSON once per page load, precomputes an SVG `d` string
// for every state, and exposes a `getStatePath(stateName, width, height)`
// helper that fits the state to an arbitrary bounding box.

import { geoPath, geoMercator } from "d3-geo";
import { feature, mesh } from "topojson-client";

const US_ATLAS_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

let cachedAtlas = null;
let atlasPromise = null;
let stateFeatures = null; // array of GeoJSON features, one per state, keyed by name

// Map of common region strings (as used in cities.js) to full state names.
// Cities where the region string already is a state name work without mapping.
const REGION_TO_STATE = {
  "Arizona": "Arizona",
  "Austin": "Texas",
  "Baltimore": "Maryland",
  "Central Mountains": "Colorado",
  "Charleston": "South Carolina",
  "DC Metro": "Virginia",
  "Denver Metro": "Colorado",
  "Front Range": "Colorado",
  "Idaho": "Idaho",
  "Maryland": "Maryland",
  "Minneapolis": "Minnesota",
  "Nashville": "Tennessee",
  "New Mexico": "New Mexico",
  "North Carolina": "North Carolina",
  "Northern Front Range": "Colorado",
  "Northwest": "Colorado",
  "Oregon": "Oregon",
  "Phoenix-Scottsdale": "Arizona",
  "Raleigh-Durham": "North Carolina",
  "Roaring Fork Valley": "Colorado",
  "Salt Lake City": "Utah",
  "Southwest": "Colorado",
  "Tampa": "Florida",
  "Washington DC": "District of Columbia",
};

export function regionToState(region) {
  return REGION_TO_STATE[region] || region;
}

export function loadUsAtlas() {
  if (cachedAtlas) return Promise.resolve(cachedAtlas);
  if (atlasPromise) return atlasPromise;
  atlasPromise = fetch(US_ATLAS_URL)
    .then((res) => res.json())
    .then((data) => {
      cachedAtlas = data;
      const fc = feature(data, data.objects.states);
      stateFeatures = Object.fromEntries(
        fc.features.map((f) => [f.properties.name, f]),
      );
      atlasPromise = null;
      return data;
    })
    .catch((err) => {
      atlasPromise = null;
      console.error("Failed to load US atlas:", err);
      throw err;
    });
  return atlasPromise;
}

// Kick off the fetch as soon as this module is imported, so by the time
// cards render the atlas is (likely) already in cache.
loadUsAtlas().catch(() => {});

export function getCachedAtlas() {
  return cachedAtlas;
}

export function getAtlasMesh() {
  if (!cachedAtlas) return { nationPath: "", statesMeshPath: "" };
  // Re-derive the national outline and state boundaries on demand (cheap).
  const nation = feature(cachedAtlas, cachedAtlas.objects.nation);
  const statesMeshGeom = mesh(cachedAtlas, cachedAtlas.objects.states, (a, b) => a !== b);
  return {
    nation,
    statesMesh: statesMeshGeom,
  };
}

// Returns an SVG path `d` string for the named state, fit to a width × height box.
// Returns null if the atlas isn't loaded yet or the state name isn't recognized.
// Uses geoMercator with fitSize so the state fills the box regardless of its real latitude.
export function getStatePath(stateName, width = 100, height = 100) {
  if (!stateFeatures) return null;
  const feat = stateFeatures[stateName];
  if (!feat) return null;
  const projection = geoMercator().fitSize([width, height], feat);
  const path = geoPath(projection);
  return path(feat);
}
