// Top-of-page navigation tabs. Stateless — receives the current view
// and a setView callback. Conditionally shows Compare only when at least
// 2 cities are selected for comparison.

const TABS = [
  { view: "grid", label: "All Cities" },
  { view: "dashboard", label: "My Picks" },
  { view: "rankings", label: "Rankings" },
  { view: "travel", label: "Travel Time" },
  { view: "methodology", label: "Raw Data" },
];

export default function HeaderNav({ view, setView, compareCount }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <span className="header-icon" aria-hidden="true">🏔️</span>
          <div>
            <h1>Move Planner</h1>
            <p className="subtitle">
              Find your ideal home based on wellness, recovery & outdoor living
            </p>
          </div>
        </div>
        <nav className="header-nav" role="tablist" aria-label="Main navigation">
          <button
            role="tab"
            aria-selected={view === "grid"}
            className={`nav-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            All Cities
          </button>
          {compareCount >= 2 && (
            <button
              role="tab"
              aria-selected={view === "compare"}
              className={`nav-btn compare-btn ${view === "compare" ? "active" : ""}`}
              onClick={() => setView("compare")}
            >
              Compare ({compareCount})
            </button>
          )}
          {TABS.filter((t) => t.view !== "grid").map((t) => (
            <button
              key={t.view}
              role="tab"
              aria-selected={view === t.view}
              className={`nav-btn ${view === t.view ? "active" : ""}`}
              onClick={() => setView(t.view)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
