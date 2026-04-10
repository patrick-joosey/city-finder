import cities, { categories } from "../data/cities";
import { formulas, rawMetrics } from "../data/metrics";
import { citySources } from "../data/sources";

export default function MethodologyView({ onBack }) {
  return (
    <div className="methodology-view">
      <button className="btn btn-back" onClick={onBack}>
        &larr; Back to All Cities
      </button>

      <h1>Methodology & Raw Data</h1>
      <p className="methodology-intro">
        Each city is scored 1-10 across {categories.length} categories. Scores are{" "}
        <strong>computed from raw, measurable data</strong> using the formulas below.
        No score is hand-assigned - every number traces back to a specific metric and formula.
      </p>

      {/* ====== FORMULAS SECTION ====== */}
      <section className="methodology-section">
        <h2>Scoring Formulas</h2>
        {Object.entries(formulas).map(([key, f]) => {
          const cat = categories.find((c) => c.key === key);
          return (
            <div key={key} className="method-card" style={{ borderLeftColor: cat?.color }}>
              <h3>
                {cat?.icon} {f.name}
              </h3>
              <p className="method-desc">{f.description}</p>
              <div className="formula-box">
                <code>{f.formula}</code>
              </div>
              <table className="method-table">
                <thead>
                  <tr>
                    <th>Input Metric</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {f.metrics.map((m) => (
                    <tr key={m.key}>
                      <td>{m.label}</td>
                      <td className="method-unit">{m.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="method-sources">
                <strong>Sources:</strong> {f.sources.join(" | ")}
              </div>
            </div>
          );
        })}
      </section>

      {/* ====== RAW METRICS PER CITY ====== */}
      <section className="methodology-section">
        <h2>Raw Metrics by City</h2>
        <p className="method-desc">
          These are the actual data points fed into the formulas above. Denver neighborhoods
          share city-wide metrics for recovery meetings, gyms, nutrition, meditation, and
          outdoor rec, but have neighborhood-specific crime and walkability data.
        </p>
        {cities
          .slice()
          .sort((a, b) => {
            const avgA = categories.reduce((s, c) => s + a.scores[c.key], 0) / categories.length;
            const avgB = categories.reduce((s, c) => s + b.scores[c.key], 0) / categories.length;
            return avgB - avgA;
          })
          .map((city) => {
            const metrics = rawMetrics[city.id];
            if (!metrics) return null;
            return (
              <div key={city.id} className="raw-city-block">
                <h3>{city.name} <span className="raw-city-region">{city.region}</span></h3>
                <div className="raw-metrics-grid">
                  {Object.entries(formulas).map(([catKey, f]) => {
                    const cat = categories.find((c) => c.key === catKey);
                    const catMetrics = metrics[catKey];
                    return (
                      <div key={catKey} className="raw-metric-card">
                        <div className="raw-metric-header" style={{ borderBottomColor: cat?.color }}>
                          <span>{cat?.icon} {f.name}</span>
                          <span className="raw-metric-score" style={{ color: cat?.color }}>
                            {city.scores[catKey]}/10
                          </span>
                        </div>
                        <div className="raw-metric-items">
                          {f.metrics.map((m) => {
                            let val = catMetrics[m.key];
                            if (typeof val === "boolean") val = val ? "Yes" : "No";
                            return (
                              <div key={m.key} className="raw-metric-row">
                                <span className="raw-metric-label">{m.label}</span>
                                <span className="raw-metric-value">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                        {citySources[city.id]?.[catKey] && (
                          <div className="raw-metric-sources">
                            {citySources[city.id][catKey].map((src, i) => (
                              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="source-link">
                                {src.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </section>

      {/* ====== COMPUTED SCORES TABLE ====== */}
      <section className="methodology-section">
        <h2>Computed Score Summary</h2>
        <div className="raw-data-wrapper">
          <table className="raw-data-table">
            <thead>
              <tr>
                <th>City</th>
                {categories.map((cat) => (
                  <th key={cat.key} title={cat.label}>
                    {cat.icon}
                  </th>
                ))}
                <th>Avg</th>
              </tr>
            </thead>
            <tbody>
              {cities
                .slice()
                .sort((a, b) => {
                  const avgA = categories.reduce((s, c) => s + a.scores[c.key], 0) / categories.length;
                  const avgB = categories.reduce((s, c) => s + b.scores[c.key], 0) / categories.length;
                  return avgB - avgA;
                })
                .map((city) => {
                  const avg =
                    categories.reduce((s, c) => s + city.scores[c.key], 0) / categories.length;
                  return (
                    <tr key={city.id}>
                      <td className="raw-city-name">{city.name}</td>
                      {categories.map((cat) => {
                        const score = city.scores[cat.key];
                        return (
                          <td
                            key={cat.key}
                            className="raw-score"
                            style={{
                              backgroundColor: `rgba(${
                                score >= 7
                                  ? "78, 203, 113"
                                  : score >= 5
                                  ? "255, 167, 38"
                                  : "255, 107, 107"
                              }, ${score / 15})`,
                            }}
                          >
                            {score}
                          </td>
                        );
                      })}
                      <td className="raw-avg">{avg.toFixed(1)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <p className="raw-data-legend">
          Legend: <span className="legend-high">Green = 7+</span>{" "}
          <span className="legend-mid">Orange = 5-6</span>{" "}
          <span className="legend-low">Red = below 5</span>
        </p>
      </section>

      {/* ====== COST TABLE ====== */}
      <section className="methodology-section">
        <h2>Cost of Living Comparison</h2>
        <div className="raw-data-wrapper">
          <table className="raw-data-table cost-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Cost of Living</th>
                <th>Median Rent</th>
                <th>Median Home Price</th>
                <th>Population</th>
                <th>Elevation</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id}>
                  <td className="raw-city-name">{city.name}</td>
                  <td>{city.costOfLiving}</td>
                  <td>{city.medianRent}</td>
                  <td>{city.medianHome}</td>
                  <td>{city.population}</td>
                  <td>{city.elevation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== DISCLAIMER ====== */}
      <section className="methodology-section disclaimer">
        <h2>Disclaimer & Sources</h2>
        <p>
          All scores are computed from the raw metrics shown above using the formulas defined in
          this page. Raw data comes from: FBI UCR reports, NeighborhoodScout, DenverCrimes.com,
          CrimeGrade.org, SafeWise, DACCAA, local AA/NA intergroup offices, AllTrails, USFS/BLM
          land data, WalkScore.com, Yelp business counts, and city recreation department websites.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Denver neighborhoods share city-wide totals for recovery meetings, gyms, health food
          stores, yoga studios, and outdoor recreation (since residents can access all Denver
          resources), but have neighborhood-specific crime rates and walkability scores.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Data was collected in early 2026. Numbers may have changed. We recommend verifying
          current data and visiting in person before making a relocation decision.
        </p>
      </section>
    </div>
  );
}
