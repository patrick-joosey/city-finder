import { useState } from "react";

export default function PersonalNotes({ cityId, userData, onUpdate }) {
  const { notes, pros, cons, personalRating, isFavorite } = userData;
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");

  const handleAddPro = () => {
    if (proInput.trim()) {
      onUpdate.addPro(cityId, proInput.trim());
      setProInput("");
    }
  };

  const handleAddCon = () => {
    if (conInput.trim()) {
      onUpdate.addCon(cityId, conInput.trim());
      setConInput("");
    }
  };

  return (
    <div className="personal-notes">
      <div className="pn-header">
        <h2>My Notes</h2>
        <button
          className={`pn-favorite ${isFavorite ? "is-fav" : ""}`}
          onClick={() => onUpdate.toggleFavorite(cityId)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
        </button>
      </div>

      {/* Personal Rating */}
      <div className="pn-rating">
        <label>My Rating:</label>
        <div className="pn-rating-dots">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              className={`pn-dot ${personalRating === n ? "active" : ""} ${
                personalRating && n <= personalRating ? "filled" : ""
              }`}
              onClick={() =>
                onUpdate.setPersonalRating(cityId, personalRating === n ? null : n)
              }
            >
              {n}
            </button>
          ))}
        </div>
        {personalRating && (
          <span className="pn-rating-value">{personalRating}/10</span>
        )}
      </div>

      {/* Freeform Notes */}
      <div className="pn-section">
        <label>Notes & Impressions</label>
        <textarea
          className="pn-textarea"
          placeholder="Write your thoughts about living here, visit notes, things to research..."
          value={notes}
          onChange={(e) => onUpdate.setNotes(cityId, e.target.value)}
          rows={4}
        />
      </div>

      {/* Pros & Cons */}
      <div className="pn-proscons">
        <div className="pn-column pn-pros">
          <h4>Pros</h4>
          <div className="pn-add-row">
            <input
              type="text"
              placeholder="Add a pro..."
              value={proInput}
              onChange={(e) => setProInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPro()}
            />
            <button onClick={handleAddPro}>+</button>
          </div>
          <ul>
            {pros.map((item) => (
              <li key={item.id}>
                <span>{item.text}</span>
                <button
                  className="pn-remove"
                  aria-label={`Remove pro: ${item.text}`}
                  onClick={() => onUpdate.removePro(cityId, item.id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pn-column pn-cons">
          <h4>Cons</h4>
          <div className="pn-add-row">
            <input
              type="text"
              placeholder="Add a con..."
              value={conInput}
              onChange={(e) => setConInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCon()}
            />
            <button onClick={handleAddCon}>+</button>
          </div>
          <ul>
            {cons.map((item) => (
              <li key={item.id}>
                <span>{item.text}</span>
                <button
                  className="pn-remove"
                  aria-label={`Remove con: ${item.text}`}
                  onClick={() => onUpdate.removeCon(cityId, item.id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
