import { categories } from "../data/cities";

export default function CompareView({ cities, onBack, onSelectCity }) {
  const getBest = (key) => {
    let best = 0;
    cities.forEach((c) => {
      if (c.scores[key] > best) best = c.scores[key];
    });
    return best;
  };

  return (
    <div className="compare-view">
      <button className="btn btn-back" onClick={onBack}>
        &larr; Back to All Cities
      </button>
      <h2>City Comparison</h2>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Category</th>
              {cities.map((c) => (
                <th key={c.id}>
                  <button className="compare-city-name" onClick={() => onSelectCity(c)}>
                    {c.name}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="compare-row-meta">
              <td>Population</td>
              {cities.map((c) => (
                <td key={c.id}>{c.population}</td>
              ))}
            </tr>
            <tr className="compare-row-meta">
              <td>Median Rent</td>
              {cities.map((c) => (
                <td key={c.id}>{c.medianRent}</td>
              ))}
            </tr>
            <tr className="compare-row-meta">
              <td>Median Home Price</td>
              {cities.map((c) => (
                <td key={c.id}>{c.medianHome}</td>
              ))}
            </tr>
            <tr className="compare-row-meta">
              <td>Cost of Living</td>
              {cities.map((c) => (
                <td key={c.id}>{c.costOfLiving}</td>
              ))}
            </tr>
            <tr className="compare-row-meta">
              <td>Vibe</td>
              {cities.map((c) => (
                <td key={c.id} className="compare-vibe">{c.vibe}</td>
              ))}
            </tr>

            <tr className="compare-divider">
              <td colSpan={cities.length + 1}>Scores</td>
            </tr>

            {categories.map((cat) => {
              const best = getBest(cat.key);
              return (
                <tr key={cat.key} className="compare-row-score">
                  <td>
                    <span className="compare-cat-icon">{cat.icon}</span> {cat.label}
                  </td>
                  {cities.map((c) => (
                    <td key={c.id}>
                      <div className="compare-score-cell">
                        <div
                          className="compare-bar"
                          style={{
                            width: `${c.scores[cat.key] * 10}%`,
                            backgroundColor: cat.color,
                            opacity: c.scores[cat.key] === best ? 1 : 0.5,
                          }}
                        />
                        <span className={c.scores[cat.key] === best ? "compare-best" : ""}>
                          {c.scores[cat.key]}/10
                          {c.scores[cat.key] === best && " ★"}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr className="compare-divider">
              <td colSpan={cities.length + 1}>Overall</td>
            </tr>
            <tr className="compare-row-total">
              <td><strong>Average Score</strong></td>
              {cities.map((c) => {
                const avg = categories.reduce((s, cat) => s + c.scores[cat.key], 0) / categories.length;
                return (
                  <td key={c.id}>
                    <strong>{avg.toFixed(1)}/10</strong>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
