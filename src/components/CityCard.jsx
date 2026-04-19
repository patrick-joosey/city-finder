import { categories } from "../data/cities";
import { rawMetrics } from "../data/metrics";
import ScoreBar from "./ScoreBar";
import StateBackdrop from "./StateBackdrop";

// Color a young-adult density chip based on % of 25-34 year-olds in metro.
// Green = 20%+, yellow = 16-19%, orange = <16%.
function youngAdultClass(pct) {
  if (pct == null) return "";
  if (pct >= 20) return "chip-high";
  if (pct >= 16) return "chip-mid";
  return "chip-low";
}

export default function CityCard({
  city, rank, weightedScore, onSelect, isComparing, onToggleCompare,
  userEntry, onToggleFavorite, scoresExpanded, onToggleScores,
}) {
  const isFav = userEntry?.isFavorite;
  const myRating = userEntry?.personalRating;
  const pctAge25_34 = rawMetrics[city.id]?.youngAdults?.pctAge25_34;

  return (
    <div className={`city-card ${isComparing ? "comparing" : ""} ${isFav ? "favorited" : ""}`}>
      <StateBackdrop region={city.region} />
      <div className="card-image" onClick={onSelect}>
        <img src={city.image} alt={city.name} loading="lazy" onError={(e) => { e.target.style.background = 'linear-gradient(135deg, #1a2733, #243447)'; e.target.src = ''; }} />
        <div className="card-rank">#{rank}</div>
        <div className="card-score-badge">{weightedScore.toFixed(2)}</div>
        {myRating && <div className="card-my-rating">My: {myRating}</div>}
      </div>
      <div className="card-body">
        <div className="card-header" onClick={onSelect}>
          <h2>
            {isFav && <span className="card-fav-star">★ </span>}
            {city.name}
          </h2>
          <span className="card-region">{city.region}</span>
        </div>
        <p className="card-summary">{city.summary}</p>

        <div className="card-quick-stats">
          <span>Pop: {city.population}</span>
          <span>Elev: {city.elevation}</span>
          <span>Rent: {city.medianRent}</span>
          {pctAge25_34 != null && (
            <span
              className={`stat-chip ${youngAdultClass(pctAge25_34)}`}
              title="Percentage of metro population aged 25-34 — proxy for young professional density"
            >
              🎓 {pctAge25_34}% age 25-34
            </span>
          )}
        </div>

        <button
          className="scores-toggle"
          onClick={onToggleScores}
          aria-expanded={scoresExpanded}
          aria-label={scoresExpanded ? `Hide ${categories.length} category scores for ${city.name}` : `Show ${categories.length} category scores for ${city.name}`}
        >
          {scoresExpanded ? "▼ Hide scores" : `▶ Show all ${categories.length} scores`}
        </button>

        {scoresExpanded && (
          <div className="card-scores">
            {categories.map((cat) => (
              <ScoreBar
                key={cat.key}
                score={city.scores[cat.key]}
                color={cat.color}
                label={cat.label}
                icon={cat.icon}
                small
              />
            ))}
          </div>
        )}

        <div className="card-actions">
          <button className="btn btn-primary" onClick={onSelect}>
            View Details
          </button>
          <button
            className={`btn ${isFav ? "btn-fav-active" : "btn-outline"} btn-fav`}
            onClick={onToggleFavorite}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFav ? `Remove ${city.name} from favorites` : `Add ${city.name} to favorites`}
            aria-pressed={isFav}
          >
            {isFav ? "★" : "☆"}
          </button>
          <button
            className={`btn ${isComparing ? "btn-active" : "btn-outline"}`}
            onClick={onToggleCompare}
          >
            {isComparing ? "- Compare" : "+ Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}
