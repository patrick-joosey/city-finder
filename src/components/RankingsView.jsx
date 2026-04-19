import { useState, useMemo } from "react";
import { categories } from "../data/cities";
import { getWeightedScore } from "../utils/score";

// Region → color mapping
const regionColors = {
  "Front Range": "#4ecb71",
  "Denver Metro": "#42A5F5",
  "Northern Front Range": "#66BB6A",
  "Roaring Fork Valley": "#00C9A7",
  "Central Mountains": "#FFA726",
  "Southwest": "#FF9800",
  "Northwest": "#80DEEA",
  "Maryland": "#CE93D8",
  "Baltimore": "#AB47BC",
  "Washington DC": "#F06292",
  "DC Metro": "#E91E63",
  "Idaho": "#FFCA28",
  "North Carolina": "#26A69A",
  "Oregon": "#8BC34A",
  "Arizona": "#FF7043",
  "New Mexico": "#D4E157",
  "Tampa": "#29B6F6",
  "Austin": "#FDD835",
};

const getRegionColor = (region) => regionColors[region] || "#8899aa";

// Score zone labels
const zones = [
  { min: 8.5, max: 10, label: "Excellent", color: "#4ecb71" },
  { min: 7.5, max: 8.5, label: "Great", color: "#66BB6A" },
  { min: 6.5, max: 7.5, label: "Good", color: "#FFA726" },
  { min: 5.5, max: 6.5, label: "Moderate", color: "#FF9800" },
  { min: 1, max: 5.5, label: "Below Avg", color: "#EF5350" },
];

const PLOT_LEFT = 60;
const PLOT_RIGHT = 940;
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT;
const VIEW_W = 1000;
const VIEW_H = 500;
const DOT_R = 8;
const MIN_SCORE = 4;
const MAX_SCORE = 10;

function scoreToX(score) {
  const clamped = Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
  return PLOT_LEFT + ((clamped - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * PLOT_WIDTH;
}

export default function RankingsView({ cities, weights, onSelectCity }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Compute positions with vertical jitter to avoid overlap
  const plotData = useMemo(() => {
    const scored = cities.map((c) => ({
      city: c,
      score: getWeightedScore(c, weights),
    })).sort((a, b) => b.score - a.score);

    // Assign Y positions - spread dots vertically, jitter close ones
    const positioned = [];
    const yBase = VIEW_H * 0.45;
    const ySpread = VIEW_H * 0.35;

    for (let i = 0; i < scored.length; i++) {
      const x = scoreToX(scored[i].score);
      // Check for overlapping x positions and stagger vertically
      let y = yBase;
      let attempts = 0;
      const jitterStep = DOT_R * 2.5;
      while (attempts < 20) {
        const overlap = positioned.some(
          (p) => Math.abs(p.x - x) < DOT_R * 2.2 && Math.abs(p.y - y) < DOT_R * 2.2
        );
        if (!overlap) break;
        // Alternate above/below center
        attempts++;
        y = yBase + (attempts % 2 === 0 ? 1 : -1) * Math.ceil(attempts / 2) * jitterStep;
      }
      positioned.push({ ...scored[i], x, y, rank: i + 1 });
    }
    return positioned;
  }, [cities, weights]);

  const hoveredDot = hoveredId !== null ? plotData.find((d) => d.city.id === hoveredId) : null;

  // Get top 3 categories for tooltip
  const getTopCategories = (city) => {
    return categories
      .map((cat) => ({ ...cat, score: city.scores[cat.key] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return (
    <div className="rankings-view">
      <div className="rankings-header">
        <h1>City Rankings</h1>
        <p className="rankings-subtitle">
          All {cities.length} cities plotted on a 1-10 scale by weighted overall score. Hover for details, click to explore.
        </p>
      </div>

      {/* Legend */}
      <div className="rankings-legend">
        {Object.entries(regionColors).map(([region, color]) => {
          const count = cities.filter((c) => c.region === region).length;
          if (count === 0) return null;
          return (
            <span key={region} className="rankings-legend-item">
              <span className="rankings-legend-dot" style={{ background: color }} />
              {region} ({count})
            </span>
          );
        })}
      </div>

      <div className="rankings-plot-wrapper">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="rankings-plot"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-labelledby="rankings-title rankings-desc"
        >
          <title id="rankings-title">City rankings scatter plot</title>
          <desc id="rankings-desc">
            A horizontal number line from 4 to 10 showing every city plotted by its weighted overall score.
            Dots are color-coded by region. Score zones are labeled Below Average, Moderate, Good, Great, and Excellent.
          </desc>
          {/* Zone backgrounds */}
          {zones.map((zone) => {
            const x1 = scoreToX(Math.max(MIN_SCORE, zone.min));
            const x2 = scoreToX(Math.min(MAX_SCORE, zone.max));
            return (
              <g key={zone.label}>
                <rect
                  x={x1} y={30} width={x2 - x1} height={VIEW_H - 80}
                  fill={zone.color} opacity={0.06} rx={4}
                />
                <text
                  x={(x1 + x2) / 2} y={22}
                  textAnchor="middle" fill={zone.color} fontSize="11" fontWeight="600" opacity={0.8}
                >
                  {zone.label}
                </text>
              </g>
            );
          })}

          {/* Grid lines */}
          {Array.from({ length: (MAX_SCORE - MIN_SCORE) * 2 + 1 }, (_, i) => MIN_SCORE + i * 0.5).map((tick) => {
            const x = scoreToX(tick);
            const isMajor = tick === Math.floor(tick);
            return (
              <g key={tick}>
                <line
                  x1={x} y1={30} x2={x} y2={VIEW_H - 50}
                  stroke="#2a3f52" strokeWidth={isMajor ? 1 : 0.5}
                  strokeDasharray={isMajor ? "none" : "2,4"}
                />
                {isMajor && (
                  <text x={x} y={VIEW_H - 32} textAnchor="middle" fill="#8899aa" fontSize="13" fontWeight="600">
                    {tick}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axis line */}
          <line
            x1={PLOT_LEFT} y1={VIEW_H - 50} x2={PLOT_RIGHT} y2={VIEW_H - 50}
            stroke="#3d5a73" strokeWidth={2}
          />

          {/* Dots */}
          {plotData.map((d) => {
            const isHovered = hoveredId === d.city.id;
            const color = getRegionColor(d.city.region);
            return (
              <g
                key={d.city.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredId(d.city.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectCity(d.city)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle cx={d.x} cy={d.y} r={DOT_R + 5} fill={color} opacity={0.25} />
                )}
                <circle
                  cx={d.x} cy={d.y} r={isHovered ? DOT_R + 2 : DOT_R}
                  fill={color}
                  stroke={isHovered ? "#fff" : "#0f1923"}
                  strokeWidth={isHovered ? 2 : 1.5}
                  style={{ transition: "all 0.15s" }}
                />
                {/* Rank label inside dot */}
                <text
                  x={d.x} y={d.y + 3.5}
                  textAnchor="middle" fill="#0f1923" fontSize="8" fontWeight="700"
                  style={{ pointerEvents: "none" }}
                >
                  {d.rank}
                </text>
              </g>
            );
          })}

          {/* Axis label */}
          <text x={VIEW_W / 2} y={VIEW_H - 8} textAnchor="middle" fill="#8899aa" fontSize="12">
            Weighted Overall Score
          </text>
        </svg>

        {/* Tooltip */}
        {hoveredDot && (
          <div
            className="rankings-tooltip"
            style={{
              left: `${(hoveredDot.x / VIEW_W) * 100}%`,
              top: hoveredDot.y > VIEW_H * 0.5 ? "10%" : "75%",
            }}
          >
            <div className="rankings-tooltip-header">
              <span className="rankings-tooltip-rank">#{hoveredDot.rank}</span>
              <strong>{hoveredDot.city.name}</strong>
              <span className="rankings-tooltip-score">{hoveredDot.score.toFixed(2)}</span>
            </div>
            <div className="rankings-tooltip-region">{hoveredDot.city.region} | {hoveredDot.city.medianRent}/mo</div>
            <div className="rankings-tooltip-cats">
              <span className="rankings-tooltip-label">Top strengths:</span>
              {getTopCategories(hoveredDot.city).map((cat) => (
                <span key={cat.key} className="rankings-tooltip-cat">
                  {cat.icon} {cat.label}: {cat.score}
                </span>
              ))}
            </div>
            <div className="rankings-tooltip-hint">Click to view details</div>
          </div>
        )}
      </div>

      {/* Text ranking list below */}
      <div className="rankings-list">
        {plotData.map((d) => (
          <div
            key={d.city.id}
            className={`rankings-list-item ${hoveredId === d.city.id ? "hovered" : ""}`}
            onMouseEnter={() => setHoveredId(d.city.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectCity(d.city)}
          >
            <span className="rankings-list-rank">#{d.rank}</span>
            <span
              className="rankings-list-dot"
              style={{ background: getRegionColor(d.city.region) }}
            />
            <span className="rankings-list-name">{d.city.name}</span>
            <span className="rankings-list-region">{d.city.region}</span>
            <span className="rankings-list-score">{d.score.toFixed(2)}</span>
            <div className="rankings-list-bar-bg">
              <div
                className="rankings-list-bar-fill"
                style={{
                  width: `${((d.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100}%`,
                  background: getRegionColor(d.city.region),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
