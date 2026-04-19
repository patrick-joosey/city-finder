import { useState } from "react";
import { categories } from "../data/cities";

// Renders the grid's filter stack:
//   - Region chips (multi-select)
//   - Search + sort + show-filters + share row
//   - Expandable weights & min-scores panel
//
// Stateless except for the expand/collapse state of the weights panel
// and the ephemeral "Link copied!" toast after clicking Share.

export default function FilterControls({
  allRegions,
  selectedRegions,
  setSelectedRegions,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  weights,
  setWeights,
  minScores,
  setMinScores,
  onReset,
  onShare,
  shareMsg,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region],
    );
  };

  return (
    <div className="controls">
      <div className="region-chips">
        {allRegions.map((region) => (
          <button
            key={region}
            className={`region-chip ${selectedRegions.includes(region) ? "active" : ""}`}
            aria-pressed={selectedRegions.includes(region)}
            onClick={() => toggleRegion(region)}
          >
            {region}
          </button>
        ))}
        {selectedRegions.length > 0 && (
          <button
            className="region-chip region-clear"
            onClick={() => setSelectedRegions([])}
          >
            Clear
          </button>
        )}
      </div>

      <div className="controls-row">
        <div className="search-control">
          <input
            type="text"
            className="search-input"
            placeholder="Search cities..."
            aria-label="Search cities by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-control">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="overall">Overall Weighted Score</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="filter-toggle"
          aria-expanded={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide" : "Show"} Weights & Filters
        </button>
        <button className="btn-share" onClick={onShare}>
          {shareMsg || "Share"}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Category Weights</h3>
            <button className="btn btn-reset" onClick={onReset}>
              Reset All
            </button>
          </div>
          <p className="filter-hint">
            Adjust importance of each category (0 = ignore, 3 = very important)
          </p>
          <div className="weights-grid">
            {categories.map((cat) => (
              <div key={cat.key} className="weight-control">
                <label htmlFor={`weight-${cat.key}`}>
                  {cat.icon} {cat.label}
                </label>
                <input
                  id={`weight-${cat.key}`}
                  type="range"
                  min="0"
                  max="3"
                  step="0.5"
                  value={weights[cat.key] ?? 1}
                  onChange={(e) =>
                    setWeights((w) => ({
                      ...w,
                      [cat.key]: parseFloat(e.target.value),
                    }))
                  }
                />
                <span className="weight-value">{weights[cat.key] ?? 1}x</span>
              </div>
            ))}
          </div>

          <h3>Minimum Scores</h3>
          <p className="filter-hint">Filter out cities below your minimum threshold</p>
          <div className="weights-grid">
            {categories.map((cat) => (
              <div key={cat.key} className="weight-control">
                <label htmlFor={`min-${cat.key}`}>
                  {cat.icon} {cat.label}
                </label>
                <input
                  id={`min-${cat.key}`}
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={minScores[cat.key] ?? 0}
                  onChange={(e) =>
                    setMinScores((m) => ({
                      ...m,
                      [cat.key]: parseInt(e.target.value),
                    }))
                  }
                />
                <span className="weight-value">{minScores[cat.key] ?? 0}+</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
