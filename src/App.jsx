import { useState, useMemo, useCallback, useEffect } from "react";
import cities, { categories } from "./data/cities";
import useLocalStorage from "./hooks/useLocalStorage";
import useUserData from "./hooks/useUserData";
import CityCard from "./components/CityCard";
import CityDetail from "./components/CityDetail";
import CompareView from "./components/CompareView";
import MethodologyView from "./components/MethodologyView";
import DecisionDashboard from "./components/DecisionDashboard";
import TravelTimeView from "./components/TravelTimeView";
import "./App.css";

const defaultWeights = Object.fromEntries(categories.map((c) => [c.key, 1]));
const defaultMinScores = Object.fromEntries(categories.map((c) => [c.key, 0]));

function App() {
  const [view, setView] = useState("grid");
  const [selectedCity, setSelectedCity] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [sortBy, setSortBy] = useLocalStorage("cmp-sortBy", "overall");
  const [weights, setWeights, resetWeights] = useLocalStorage("cmp-weights", defaultWeights);
  const [minScores, setMinScores, resetMinScores] = useLocalStorage("cmp-minScores", defaultMinScores);
  const [searchTerm, setSearchTerm] = useLocalStorage("cmp-search", "");
  const [selectedRegions, setSelectedRegions] = useLocalStorage("cmp-regions", []);
  const [showFilters, setShowFilters] = useState(false);
  const userData = useUserData();

  // Load state from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("w")) {
      const vals = params.get("w").split(",").map(Number);
      if (vals.length === categories.length) {
        setWeights(Object.fromEntries(categories.map((c, i) => [c.key, vals[i]])));
      }
    }
    if (params.has("m")) {
      const vals = params.get("m").split(",").map(Number);
      if (vals.length === categories.length) {
        setMinScores(Object.fromEntries(categories.map((c, i) => [c.key, vals[i]])));
      }
    }
    if (params.has("sort")) setSortBy(params.get("sort"));
    if (params.has("regions")) setSelectedRegions(params.get("regions").split(","));
    if (params.has("q")) setSearchTerm(params.get("q"));
    if (params.has("compare")) setCompareIds(params.get("compare").split(",").map(Number));
    // Clean URL after loading
    if (params.toString()) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const allRegions = [...new Set(cities.map((c) => c.region))].sort();

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const getWeightedScore = (city) => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return 0;
    const score = categories.reduce((sum, cat) => {
      return sum + city.scores[cat.key] * (weights[cat.key] || 0);
    }, 0);
    return score / totalWeight;
  };

  const filteredAndSorted = useMemo(() => {
    let result = cities.filter((city) => {
      // Name search
      if (searchTerm && !city.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Region filter
      if (selectedRegions.length > 0 && !selectedRegions.includes(city.region)) {
        return false;
      }
      // Min score filters
      return categories.every((cat) => city.scores[cat.key] >= (minScores[cat.key] || 0));
    });

    if (sortBy === "overall") {
      result.sort((a, b) => getWeightedScore(b) - getWeightedScore(a));
    } else {
      result.sort((a, b) => (b.scores[sortBy] || 0) - (a.scores[sortBy] || 0));
    }

    return result;
  }, [sortBy, weights, minScores, searchTerm, selectedRegions]);

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const openDetail = (city) => {
    setSelectedCity(city);
    setView("detail");
  };

  const [shareMsg, setShareMsg] = useState("");

  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    const w = categories.map((c) => weights[c.key] ?? 1).join(",");
    if (w !== categories.map(() => "1").join(",")) params.set("w", w);
    const m = categories.map((c) => minScores[c.key] ?? 0).join(",");
    if (m !== categories.map(() => "0").join(",")) params.set("m", m);
    if (sortBy !== "overall") params.set("sort", sortBy);
    if (selectedRegions.length > 0) params.set("regions", selectedRegions.join(","));
    if (searchTerm) params.set("q", searchTerm);
    if (compareIds.length > 0) params.set("compare", compareIds.join(","));
    const url = `${window.location.origin}${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg("Link copied!");
      setTimeout(() => setShareMsg(""), 2000);
    }).catch(() => {
      setShareMsg("Could not copy");
      setTimeout(() => setShareMsg(""), 2000);
    });
  }, [weights, minScores, sortBy, selectedRegions, searchTerm, compareIds]);

  const handleResetFilters = () => {
    resetWeights();
    resetMinScores();
    setSearchTerm("");
    setSortBy("overall");
    setSelectedRegions([]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-icon">🏔️</span>
            <div>
              <h1>Move Planner</h1>
              <p className="subtitle">
                Find your ideal home based on wellness, recovery & outdoor living
              </p>
            </div>
          </div>
          <nav className="header-nav">
            <button
              className={`nav-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
            >
              All Cities
            </button>
            {compareIds.length >= 2 && (
              <button
                className={`nav-btn compare-btn ${view === "compare" ? "active" : ""}`}
                onClick={() => setView("compare")}
              >
                Compare ({compareIds.length})
              </button>
            )}
            <button
              className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
              onClick={() => setView("dashboard")}
            >
              My Picks
            </button>
            <button
              className={`nav-btn ${view === "travel" ? "active" : ""}`}
              onClick={() => setView("travel")}
            >
              Travel Time
            </button>
            <button
              className={`nav-btn ${view === "methodology" ? "active" : ""}`}
              onClick={() => setView("methodology")}
            >
              Raw Data
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {view === "grid" && (
          <>
            <div className="controls">
              <div className="region-chips">
                {allRegions.map((region) => (
                  <button
                    key={region}
                    className={`region-chip ${selectedRegions.includes(region) ? "active" : ""}`}
                    onClick={() => toggleRegion(region)}
                  >
                    {region}
                  </button>
                ))}
                {selectedRegions.length > 0 && (
                  <button className="region-chip region-clear" onClick={() => setSelectedRegions([])}>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="sort-control">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Hide" : "Show"} Weights & Filters
                </button>
                <button className="btn-share" onClick={handleShare}>
                  {shareMsg || "Share"}
                </button>
              </div>

              {showFilters && (
                <div className="filters-panel">
                  <div className="filters-header">
                    <h3>Category Weights</h3>
                    <button className="btn btn-reset" onClick={handleResetFilters}>
                      Reset All
                    </button>
                  </div>
                  <p className="filter-hint">
                    Adjust importance of each category (0 = ignore, 3 = very important)
                  </p>
                  <div className="weights-grid">
                    {categories.map((cat) => (
                      <div key={cat.key} className="weight-control">
                        <label>
                          {cat.icon} {cat.label}
                        </label>
                        <input
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
                        <label>
                          {cat.icon} {cat.label}
                        </label>
                        <input
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

            {compareIds.length > 0 && compareIds.length < 2 && (
              <div className="compare-hint">
                Select {2 - compareIds.length} more city to compare
              </div>
            )}

            <div className="city-grid">
              {filteredAndSorted.map((city, index) => (
                <CityCard
                  key={city.id}
                  city={city}
                  rank={index + 1}
                  weightedScore={getWeightedScore(city)}
                  onSelect={() => openDetail(city)}
                  isComparing={compareIds.includes(city.id)}
                  onToggleCompare={() => toggleCompare(city.id)}
                  userEntry={userData.getEntry(city.id)}
                  onToggleFavorite={() => userData.toggleFavorite(city.id)}
                />
              ))}
              {filteredAndSorted.length === 0 && (
                <div className="no-results">
                  <p>No cities match your filters. Try lowering your minimum scores or clearing your search.</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === "detail" && selectedCity && (
          <CityDetail
            city={selectedCity}
            onBack={() => setView("grid")}
            userData={userData}
          />
        )}

        {view === "compare" && (
          <CompareView
            cities={cities.filter((c) => compareIds.includes(c.id))}
            onBack={() => setView("grid")}
            onSelectCity={openDetail}
          />
        )}

        {view === "dashboard" && (
          <DecisionDashboard
            cities={cities}
            userData={userData}
            onSelectCity={openDetail}
          />
        )}

        {view === "travel" && (
          <TravelTimeView
            onBack={() => setView("grid")}
            onSelectCity={openDetail}
          />
        )}

        {view === "methodology" && (
          <MethodologyView onBack={() => setView("grid")} />
        )}
      </main>

      <footer className="footer">
        <p>Move Planner - Your Wellness-Focused Relocation Guide</p>
      </footer>
    </div>
  );
}

export default App;
