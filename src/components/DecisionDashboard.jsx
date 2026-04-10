import { categories } from "../data/cities";

export default function DecisionDashboard({ cities, userData, onUpdate, onSelectCity }) {
  const favoriteIds = Object.keys(userData.data)
    .filter((id) => userData.data[id]?.isFavorite)
    .map(Number);

  const favoriteCities = cities
    .filter((c) => favoriteIds.includes(c.id))
    .sort((a, b) => {
      const rA = userData.getEntry(a.id).personalRating || 0;
      const rB = userData.getEntry(b.id).personalRating || 0;
      return rB - rA;
    });

  const ratedCities = cities
    .filter((c) => userData.getEntry(c.id).personalRating)
    .sort((a, b) => {
      const rA = userData.getEntry(a.id).personalRating || 0;
      const rB = userData.getEntry(b.id).personalRating || 0;
      return rB - rA;
    });

  if (favoriteCities.length === 0 && ratedCities.length === 0) {
    return (
      <div className="dashboard">
        <h1>My Picks</h1>
        <div className="dashboard-empty">
          <p>No favorites or ratings yet.</p>
          <p>
            Browse cities and click the <strong>star</strong> to favorite them, or give them
            a <strong>personal rating</strong> in the detail view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>My Picks</h1>

      {/* Top Picks */}
      {favoriteCities.length > 0 && (
        <section className="dash-section">
          <h2>Favorites ({favoriteCities.length})</h2>
          <div className="dash-picks">
            {favoriteCities.map((city) => {
              const entry = userData.getEntry(city.id);
              const computedAvg =
                categories.reduce((s, c) => s + city.scores[c.key], 0) / categories.length;
              return (
                <div key={city.id} className="dash-pick-card">
                  <div className="dash-pick-header">
                    <button className="dash-pick-name" onClick={() => onSelectCity(city)}>
                      {city.name}
                    </button>
                    <div className="dash-pick-scores">
                      {entry.personalRating && (
                        <span className="dash-my-score">My: {entry.personalRating}/10</span>
                      )}
                      <span className="dash-computed-score">
                        Data: {computedAvg.toFixed(1)}/10
                      </span>
                    </div>
                  </div>

                  <div className="dash-pick-body">
                    {entry.notes && (
                      <div className="dash-notes">
                        <strong>Notes:</strong>
                        <p>{entry.notes}</p>
                      </div>
                    )}

                    <div className="dash-proscons">
                      {entry.pros.length > 0 && (
                        <div className="dash-pros">
                          <strong>Pros:</strong>
                          <ul>
                            {entry.pros.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.cons.length > 0 && (
                        <div className="dash-cons">
                          <strong>Cons:</strong>
                          <ul>
                            {entry.cons.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="dash-pick-meta">
                    <span>{city.region}</span>
                    <span>{city.medianRent}/mo</span>
                    <span>{city.costOfLiving}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Rated */}
      {ratedCities.length > 0 && (
        <section className="dash-section">
          <h2>My Ratings</h2>
          <div className="dash-ratings-table-wrap">
            <table className="dash-ratings-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>My Rating</th>
                  <th>Data Score</th>
                  <th>Difference</th>
                  <th>Rent</th>
                </tr>
              </thead>
              <tbody>
                {ratedCities.map((city) => {
                  const entry = userData.getEntry(city.id);
                  const computedAvg =
                    categories.reduce((s, c) => s + city.scores[c.key], 0) / categories.length;
                  const diff = (entry.personalRating - computedAvg).toFixed(1);
                  return (
                    <tr key={city.id}>
                      <td>
                        <button className="dash-pick-name" onClick={() => onSelectCity(city)}>
                          {city.name}
                        </button>
                      </td>
                      <td className="dash-my-score">{entry.personalRating}/10</td>
                      <td>{computedAvg.toFixed(1)}/10</td>
                      <td className={Number(diff) > 0 ? "dash-pos" : Number(diff) < 0 ? "dash-neg" : ""}>
                        {Number(diff) > 0 ? "+" : ""}{diff}
                      </td>
                      <td>{city.medianRent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
