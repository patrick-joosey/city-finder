import { useState, useCallback } from "react";
import cities, { categories } from "./data/cities";
import useUserData from "./hooks/useUserData";
import useGridFilters from "./hooks/useGridFilters";
import CityCard from "./components/CityCard";
import CityDetail from "./components/CityDetail";
import CompareView from "./components/CompareView";
import MethodologyView from "./components/MethodologyView";
import DecisionDashboard from "./components/DecisionDashboard";
import TravelTimeView from "./components/TravelTimeView";
import RankingsView from "./components/RankingsView";
import HeaderNav from "./components/HeaderNav";
import FilterControls from "./components/FilterControls";
import GridToolbar from "./components/GridToolbar";
import "./App.css";

function App() {
  const [view, setView] = useState("grid");
  const [selectedCity, setSelectedCity] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [expandedScoreIds, setExpandedScoreIds] = useState(new Set());
  const [shareMsg, setShareMsg] = useState("");
  const userData = useUserData();

  const filters = useGridFilters({ cities, categories, setCompareIds });

  const toggleScoresExpanded = (id) => {
    setExpandedScoreIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAllScores = () => setExpandedScoreIds(new Set(cities.map((c) => c.id)));
  const collapseAllScores = () => setExpandedScoreIds(new Set());

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const openDetail = (city) => {
    setSelectedCity(city);
    setView("detail");
  };

  const allRegions = [...new Set(cities.map((c) => c.region))].sort();

  const handleShare = useCallback(() => {
    const { weights, minScores, sortBy, selectedRegions, searchTerm } = filters;
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
    navigator.clipboard.writeText(url)
      .then(() => {
        setShareMsg("Link copied!");
        setTimeout(() => setShareMsg(""), 2000);
      })
      .catch(() => {
        setShareMsg("Could not copy");
        setTimeout(() => setShareMsg(""), 2000);
      });
  }, [filters, compareIds]);

  return (
    <div className="app">
      <HeaderNav view={view} setView={setView} compareCount={compareIds.length} />

      <main className="main">
        {view === "grid" && (
          <>
            <FilterControls
              allRegions={allRegions}
              selectedRegions={filters.selectedRegions}
              setSelectedRegions={filters.setSelectedRegions}
              searchTerm={filters.searchTerm}
              setSearchTerm={filters.setSearchTerm}
              sortBy={filters.sortBy}
              setSortBy={filters.setSortBy}
              weights={filters.weights}
              setWeights={filters.setWeights}
              minScores={filters.minScores}
              setMinScores={filters.setMinScores}
              onReset={filters.reset}
              onShare={handleShare}
              shareMsg={shareMsg}
            />

            {compareIds.length > 0 && compareIds.length < 2 && (
              <div className="compare-hint">
                Select {2 - compareIds.length} more city to compare
              </div>
            )}

            <GridToolbar
              count={filters.filteredAndSorted.length}
              onExpandAll={expandAllScores}
              onCollapseAll={collapseAllScores}
            />

            <div className="city-grid">
              {filters.filteredAndSorted.map((city, index) => (
                <CityCard
                  key={city.id}
                  city={city}
                  rank={index + 1}
                  weightedScore={filters.scoreFor(city)}
                  onSelect={() => openDetail(city)}
                  isComparing={compareIds.includes(city.id)}
                  onToggleCompare={() => toggleCompare(city.id)}
                  userEntry={userData.getEntry(city.id)}
                  onToggleFavorite={() => userData.toggleFavorite(city.id)}
                  scoresExpanded={expandedScoreIds.has(city.id)}
                  onToggleScores={() => toggleScoresExpanded(city.id)}
                />
              ))}
              {filters.filteredAndSorted.length === 0 && (
                <div className="no-results">
                  <p>
                    No cities match your filters. Try lowering your minimum scores or
                    clearing your search.
                  </p>
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

        {view === "rankings" && (
          <RankingsView
            cities={cities}
            weights={filters.weights}
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
        <p>Move Planner — Your Wellness-Focused Relocation Guide</p>
      </footer>
    </div>
  );
}

export default App;
