import { categories } from "../data/cities";
import ScoreBar from "./ScoreBar";

export default function CityCard({
  city, rank, weightedScore, onSelect, isComparing, onToggleCompare,
  userEntry, onToggleFavorite,
}) {
  const isFav = userEntry?.isFavorite;
  const myRating = userEntry?.personalRating;

  return (
    <div className={`city-card ${isComparing ? "comparing" : ""} ${isFav ? "favorited" : ""}`}>
      <div className="card-image" onClick={onSelect}>
        <img src={city.image} alt={city.name} loading="lazy" onError={(e) => { e.target.style.background = 'linear-gradient(135deg, #1a2733, #243447)'; e.target.src = ''; }} />
        <div className="card-rank">#{rank}</div>
        <div className="card-score-badge">{weightedScore.toFixed(1)}</div>
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
        </div>

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

        <div className="card-actions">
          <button className="btn btn-primary" onClick={onSelect}>
            View Details
          </button>
          <button
            className={`btn ${isFav ? "btn-fav-active" : "btn-outline"} btn-fav`}
            onClick={onToggleFavorite}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
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
