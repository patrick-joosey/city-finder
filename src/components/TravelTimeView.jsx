import { useState, useEffect, useMemo } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import cities from "../data/cities";
import { cityFlights, destination, VIEW_BOX, VIEW_W, VIEW_H } from "../data/flights";

// d3-geo albersUsa projection scaled to fit our viewBox
const projection = geoAlbersUsa().scale(1280).translate([VIEW_W / 2, VIEW_H / 2]);
const pathGen = geoPath(projection);

// Project lat/lon to screen coordinates using the same projection as the map
function project(lat, lon) {
  const result = projection([lon, lat]);
  return result ? { x: result[0], y: result[1] } : null;
}

const BWI_COORDS = project(destination.lat, destination.lon);

export default function TravelTimeView({ onBack, onSelectCity }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [sortBy, setSortBy] = useState("time");
  const [usGeo, setUsGeo] = useState(null);

  // Load US TopoJSON on mount
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((res) => res.json())
      .then((data) => setUsGeo(data))
      .catch((err) => console.error("Failed to load US atlas:", err));
  }, []);

  const { nationPath, statesMeshPath } = useMemo(() => {
    if (!usGeo) return { nationPath: "", statesMeshPath: "" };
    const nation = feature(usGeo, usGeo.objects.nation);
    const statesMesh = mesh(usGeo, usGeo.objects.states, (a, b) => a !== b);
    return {
      nationPath: pathGen(nation) || "",
      statesMeshPath: pathGen(statesMesh) || "",
    };
  }, [usGeo]);

  const citiesWithFlights = cities
    .filter((c) => cityFlights[c.id])
    .map((c) => ({ ...c, flight: cityFlights[c.id] }));

  // Group by airport code + coords
  const uniqueAirports = {};
  citiesWithFlights.forEach((c) => {
    const key = c.flight.airportCode + "_" + c.flight.lat;
    if (!uniqueAirports[key]) {
      uniqueAirports[key] = {
        ...c.flight,
        cityNames: [c.name],
        cityIds: [c.id],
      };
    } else {
      uniqueAirports[key].cityNames.push(c.name);
      uniqueAirports[key].cityIds.push(c.id);
    }
  });

  const sortedCities = [...citiesWithFlights].sort((a, b) => {
    if (sortBy === "time") return a.flight.flightTimeHours - b.flight.flightTimeHours;
    if (sortBy === "cost") return a.flight.avgCostUsd - b.flight.avgCostUsd;
    if (sortBy === "distance") return a.flight.distanceMiles - b.flight.distanceMiles;
    return 0;
  });

  const getPathColor = (hours) => {
    if (hours === 0) return "#4ecb71";
    if (hours <= 2.5) return "#66BB6A";
    if (hours <= 4) return "#FFA726";
    if (hours <= 5) return "#FF9800";
    return "#EF5350";
  };

  const hoveredCity = hoveredId
    ? citiesWithFlights.find((c) => c.id === hoveredId)
    : null;

  return (
    <div className="travel-view">
      <button className="btn btn-back" onClick={onBack}>
        &larr; Back to All Cities
      </button>

      <div className="travel-header">
        <h1>Travel Time to Baltimore</h1>
        <p className="travel-subtitle">
          Flight paths, times, and costs from each city to BWI Airport (to visit family)
        </p>
      </div>

      <div className="travel-map-wrapper">
        <svg viewBox={VIEW_BOX} className="travel-map" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* US states */}
          {nationPath && (
            <g className="us-map">
              <path d={nationPath} fill="#1a2733" stroke="none" />
              <path d={statesMeshPath} fill="none" stroke="#2a3f52" strokeWidth="0.8" strokeLinejoin="round" />
              <path d={nationPath} fill="none" stroke="#3d5a73" strokeWidth="1.2" strokeLinejoin="round" />
            </g>
          )}

          {/* Flight paths */}
          {BWI_COORDS && Object.values(uniqueAirports).map((airport, i) => {
            if (airport.flightTimeHours === 0) return null;
            const from = project(airport.lat, airport.lon);
            if (!from) return null;
            const midX = (from.x + BWI_COORDS.x) / 2;
            const dx = BWI_COORDS.x - from.x;
            // Arc offset - higher for longer distances
            const arcHeight = Math.min(80, Math.abs(dx) * 0.15);
            const midY = (from.y + BWI_COORDS.y) / 2 - arcHeight;
            const isHovered = hoveredCity && airport.cityIds.includes(hoveredCity.id);
            return (
              <path
                key={i}
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${BWI_COORDS.x} ${BWI_COORDS.y}`}
                fill="none"
                stroke={getPathColor(airport.flightTimeHours)}
                strokeWidth={isHovered ? 3.5 : 2}
                strokeDasharray={airport.nonstop === false ? "5,4" : "none"}
                strokeLinecap="round"
                opacity={hoveredCity ? (isHovered ? 1 : 0.18) : 0.75}
                filter={isHovered ? "url(#glow)" : "none"}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}

          {/* BWI destination marker */}
          {BWI_COORDS && (
            <g>
              <circle cx={BWI_COORDS.x} cy={BWI_COORDS.y} r={14} fill="#4ecb71" opacity="0.25" />
              <circle cx={BWI_COORDS.x} cy={BWI_COORDS.y} r={8} fill="#4ecb71" opacity="0.5" />
              <circle cx={BWI_COORDS.x} cy={BWI_COORDS.y} r={5} fill="#4ecb71" stroke="#0f1923" strokeWidth="1.5" />
              <text
                x={BWI_COORDS.x + 12}
                y={BWI_COORDS.y + 4}
                fill="#4ecb71"
                fontSize="13"
                fontWeight="700"
                style={{ pointerEvents: "none" }}
              >
                BWI
              </text>
            </g>
          )}

          {/* Airport markers */}
          {Object.values(uniqueAirports).map((airport, i) => {
            if (airport.flightTimeHours === 0) return null;
            const coords = project(airport.lat, airport.lon);
            if (!coords) return null;
            const isHovered = hoveredCity && airport.cityIds.includes(hoveredCity.id);
            const color = getPathColor(airport.flightTimeHours);
            return (
              <g key={i} style={{ cursor: "pointer" }}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 8 : 5}
                  fill={color}
                  stroke="#0f1923"
                  strokeWidth="1.5"
                  style={{ transition: "all 0.2s" }}
                />
                <text
                  x={coords.x}
                  y={coords.y - 12}
                  fill="#e8edf2"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  style={{ pointerEvents: "none", textShadow: "0 0 3px #0f1923" }}
                >
                  {airport.airportCode}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="travel-legend">
          <div className="legend-title">Flight Time</div>
          <div className="legend-item"><span className="dot" style={{ background: "#66BB6A" }} />&lt; 2.5h</div>
          <div className="legend-item"><span className="dot" style={{ background: "#FFA726" }} />2.5 - 4h</div>
          <div className="legend-item"><span className="dot" style={{ background: "#FF9800" }} />4 - 5h</div>
          <div className="legend-item"><span className="dot" style={{ background: "#EF5350" }} />5h+</div>
          <div className="legend-item legend-dashed"><span className="dash" /> Connecting</div>
        </div>
      </div>

      <div className="travel-table-wrap">
        <div className="travel-sort">
          <label>Sort by:</label>
          <button className={sortBy === "time" ? "active" : ""} onClick={() => setSortBy("time")}>Flight Time</button>
          <button className={sortBy === "cost" ? "active" : ""} onClick={() => setSortBy("cost")}>Avg Cost</button>
          <button className={sortBy === "distance" ? "active" : ""} onClick={() => setSortBy("distance")}>Distance</button>
        </div>
        <table className="travel-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Airport</th>
              <th>Time to BWI</th>
              <th>Avg Cost</th>
              <th>Distance</th>
              <th>Nonstop?</th>
            </tr>
          </thead>
          <tbody>
            {sortedCities.map((c) => (
              <tr
                key={c.id}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={hoveredId === c.id ? "hover-row" : ""}
              >
                <td>
                  <button className="travel-city-name" onClick={() => onSelectCity(c)}>
                    {c.name}
                  </button>
                </td>
                <td>
                  <span className="airport-code">{c.flight.airportCode}</span>
                  <span className="airport-name">{c.flight.airportName}</span>
                </td>
                <td style={{ color: getPathColor(c.flight.flightTimeHours), fontWeight: 600 }}>
                  {c.flight.flightTime}
                </td>
                <td>{c.flight.avgCostUsd > 0 ? `$${c.flight.avgCostUsd}` : "—"}</td>
                <td>{c.flight.distanceMiles.toLocaleString()} mi</td>
                <td>
                  {c.flight.nonstop === null ? (
                    <span className="badge-local">Local</span>
                  ) : c.flight.nonstop ? (
                    <span className="badge-nonstop">✓ Nonstop</span>
                  ) : (
                    <span className="badge-connecting">Connects</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
