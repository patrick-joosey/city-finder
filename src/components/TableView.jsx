import { useState, useMemo } from "react";
import { categories } from "../data/cities";
import { regionToState } from "../data/usAtlas";
import { getWeightedScore } from "../utils/score";

// Sortable table with sub-tabs: "All" plus one tab per state that has
// at least one city. Click any column header to sort by that field.
// Click a city name to open its detail page.

// Columns to display by default. Score columns are derived from categories.
// Static columns come first, then a curated subset of category scores that
// are the most decision-relevant for the target demographic.
const PRIMARY_CATEGORY_KEYS = [
  "dating",
  "mentalHealth",
  "walkability",
  "safety",
  "affordability",
  "outdoorRec",
  "youngAdults",
];

// Format a score to 2 decimals or return "—" for null/undefined
const fmt = (n) => (typeof n === "number" ? n.toFixed(2) : "—");

// Color a score cell by its value
function scoreColor(n) {
  if (typeof n !== "number") return "var(--text-dim)";
  if (n >= 8.5) return "#4ecb71";
  if (n >= 7) return "#7ec47d";
  if (n >= 5.5) return "#ffa726";
  if (n >= 4) return "#ff9800";
  return "#ef5350";
}

export default function TableView({ cities, weights, onSelectCity }) {
  const [activeTab, setActiveTab] = useState("All");
  const [sortKey, setSortKey] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");

  // Build state tabs from the cities data
  const states = useMemo(() => {
    const set = new Set();
    cities.forEach((c) => set.add(regionToState(c.region)));
    return [...set].sort();
  }, [cities]);

  const filteredCities = useMemo(() => {
    if (activeTab === "All") return cities;
    return cities.filter((c) => regionToState(c.region) === activeTab);
  }, [cities, activeTab]);

  // Attach weighted overall score to each row for sorting
  const rows = useMemo(() => {
    return filteredCities.map((c) => ({
      city: c,
      overall: getWeightedScore(c, weights),
    }));
  }, [filteredCities, weights]);

  // Sort the rows
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    const mul = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      let av, bv;
      if (sortKey === "overall") {
        av = a.overall; bv = b.overall;
      } else if (sortKey === "name") {
        av = a.city.name.toLowerCase(); bv = b.city.name.toLowerCase();
      } else if (sortKey === "state") {
        av = regionToState(a.city.region); bv = regionToState(b.city.region);
      } else if (sortKey === "region") {
        av = a.city.region; bv = b.city.region;
      } else if (sortKey === "rent") {
        av = parseInt(String(a.city.medianRent).replace(/[^\d]/g, ""), 10) || 0;
        bv = parseInt(String(b.city.medianRent).replace(/[^\d]/g, ""), 10) || 0;
      } else {
        // Category score
        av = a.city.scores[sortKey] ?? 0;
        bv = b.city.scores[sortKey] ?? 0;
      }
      if (av < bv) return -1 * mul;
      if (av > bv) return 1 * mul;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Most columns sort descending by default (higher = better).
      // Name and region sort ascending alphabetically.
      setSortDir(key === "name" || key === "state" || key === "region" ? "asc" : "desc");
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  // Column definitions — static columns plus the primary-category score columns
  const scoreCols = PRIMARY_CATEGORY_KEYS.map((key) => {
    const cat = categories.find((c) => c.key === key);
    return { key, label: cat?.label ?? key, icon: cat?.icon ?? "" };
  });

  return (
    <div className="table-view">
      <div className="table-header">
        <h1>City Table</h1>
        <p className="table-subtitle">
          Sortable data table for all {cities.length} cities. Click a state tab to narrow the list.
        </p>
      </div>

      {/* Sub-tabs: All + per state */}
      <div className="table-tabs" role="tablist" aria-label="Filter by state">
        <button
          role="tab"
          aria-selected={activeTab === "All"}
          className={`table-tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => setActiveTab("All")}
        >
          All ({cities.length})
        </button>
        {states.map((state) => {
          const count = cities.filter((c) => regionToState(c.region) === state).length;
          return (
            <button
              key={state}
              role="tab"
              aria-selected={activeTab === state}
              className={`table-tab ${activeTab === state ? "active" : ""}`}
              onClick={() => setActiveTab(state)}
            >
              {state} ({count})
            </button>
          );
        })}
      </div>

      <div className="table-wrapper">
        <table className="city-table" aria-label={`Cities in ${activeTab}`}>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className="sortable">
                City{sortIndicator("name")}
              </th>
              <th onClick={() => handleSort("state")} className="sortable">
                State{sortIndicator("state")}
              </th>
              <th onClick={() => handleSort("region")} className="sortable">
                Metro{sortIndicator("region")}
              </th>
              <th onClick={() => handleSort("rent")} className="sortable num">
                Rent{sortIndicator("rent")}
              </th>
              <th
                onClick={() => handleSort("overall")}
                className="sortable num score-cell-header overall-col"
              >
                Overall{sortIndicator("overall")}
              </th>
              {scoreCols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="sortable num score-cell-header"
                  title={col.label}
                >
                  {col.icon} {col.label.split(" ")[0]}{sortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(({ city, overall }) => (
              <tr key={city.id}>
                <td>
                  <button
                    className="table-city-name"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.name}
                  </button>
                </td>
                <td className="table-state">{regionToState(city.region)}</td>
                <td className="table-metro">{city.region}</td>
                <td className="num">{city.medianRent}</td>
                <td
                  className="num score-cell overall-col"
                  style={{ color: scoreColor(overall), fontWeight: 700 }}
                >
                  {fmt(overall)}
                </td>
                {scoreCols.map((col) => {
                  const val = city.scores[col.key];
                  return (
                    <td
                      key={col.key}
                      className="num score-cell"
                      style={{ color: scoreColor(val) }}
                    >
                      {fmt(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
            {sortedRows.length === 0 && (
              <tr>
                <td colSpan={5 + scoreCols.length} className="table-empty">
                  No cities in this state.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="table-footnote">
        Showing {sortedRows.length} {sortedRows.length === 1 ? "city" : "cities"}.
        Sort: <strong>{sortKey}</strong> ({sortDir}). Overall column uses your current category weights.
      </p>
    </div>
  );
}
