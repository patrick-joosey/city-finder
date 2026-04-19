import { categories } from "../data/cities";
import { citySources } from "../data/sources";
import ScoreBar from "./ScoreBar";
import PersonalNotes from "./PersonalNotes";
import CityGallery from "./CityGallery";

export default function CityDetail({ city, onBack, userData }) {
  const overallScore =
    categories.reduce((sum, cat) => sum + city.scores[cat.key], 0) / categories.length;

  const userEntry = userData?.getEntry(city.id);
  const myRating = userEntry?.personalRating;

  return (
    <div className="city-detail">
      <button className="btn btn-back" onClick={onBack}>
        &larr; Back to All Cities
      </button>

      <div className="detail-hero">
        <img src={city.image} alt={city.name} onError={(e) => { e.target.style.background = 'linear-gradient(135deg, #1a2733, #243447)'; e.target.src = ''; }} />
        <div className="detail-hero-overlay">
          <h1>{city.name}</h1>
          <p className="detail-region">{city.region}</p>
          <div className="detail-scores-badges">
            <div className="detail-overall-score">
              <span className="score-number">{overallScore.toFixed(1)}</span>
              <span className="score-label">Data Score</span>
            </div>
            {myRating && (
              <div className="detail-overall-score detail-my-score">
                <span className="score-number">{myRating}</span>
                <span className="score-label">My Rating</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="detail-meta">
        <div className="meta-item">
          <strong>Population</strong>
          <span>{city.population}</span>
        </div>
        <div className="meta-item">
          <strong>Elevation</strong>
          <span>{city.elevation}</span>
        </div>
        <div className="meta-item">
          <strong>Cost of Living</strong>
          <span>{city.costOfLiving}</span>
        </div>
        <div className="meta-item">
          <strong>Median Rent</strong>
          <span>{city.medianRent}</span>
        </div>
        <div className="meta-item">
          <strong>Median Home</strong>
          <span>{city.medianHome}</span>
        </div>
        <div className="meta-item">
          <strong>Vibe</strong>
          <span>{city.vibe}</span>
        </div>
      </div>

      <p className="detail-summary">{city.summary}</p>

      <CityGallery
        hero={city.image}
        gallery={city.gallery}
        cityName={city.name}
      />

      {/* Personal Notes Section */}
      {userData && (
        <PersonalNotes cityId={city.id} userData={userEntry} onUpdate={userData} />
      )}

      <div className="detail-scores-overview">
        <h2>Score Overview</h2>
        <div className="detail-scores-grid">
          {categories.map((cat) => (
            <ScoreBar
              key={cat.key}
              score={city.scores[cat.key]}
              color={cat.color}
              label={cat.label}
              icon={cat.icon}
            />
          ))}
        </div>
      </div>

      <div className="detail-categories">
        {categories.map((cat) => (
          <div key={cat.key} className="detail-category-card" style={{ borderTopColor: cat.color }}>
            <div className="detail-cat-header">
              <span className="detail-cat-icon">{cat.icon}</span>
              <h3>{cat.label}</h3>
              <span className="detail-cat-score" style={{ color: cat.color }}>
                {city.scores[cat.key]}/10
              </span>
            </div>
            <ul className="detail-cat-list">
              {city.details[cat.key]?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {citySources[city.id]?.[cat.key] && (
              <div className="detail-cat-sources">
                {citySources[city.id][cat.key].map((src, i) => (
                  <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="source-link">
                    {src.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
