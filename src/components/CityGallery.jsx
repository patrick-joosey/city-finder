import { useState } from "react";

// A 6-photo gallery for the city detail page.
// Combines the hero image with the 5 gallery photos into a 2×3 grid.
// Clicking a thumbnail opens a full-size lightbox.

export default function CityGallery({ hero, gallery = [], cityName }) {
  const all = [hero, ...gallery].filter(Boolean).slice(0, 6);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (all.length === 0) return null;

  const onError = (e) => {
    e.target.style.background = "linear-gradient(135deg, #1a2733, #243447)";
    e.target.src = "";
  };

  return (
    <div className="city-gallery">
      <h2 className="city-gallery-title">
        Gallery
        <span className="city-gallery-count">{all.length} photos</span>
      </h2>
      <div className="city-gallery-grid">
        {all.map((src, i) => (
          <button
            key={i}
            className="city-gallery-tile"
            onClick={() => setLightboxIdx(i)}
            aria-label={`Open photo ${i + 1} of ${all.length} for ${cityName}`}
          >
            <img
              src={src}
              alt={`${cityName} photo ${i + 1}`}
              loading="lazy"
              onError={onError}
            />
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="city-gallery-lightbox"
          role="dialog"
          aria-label={`${cityName} photo ${lightboxIdx + 1} of ${all.length}`}
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="city-gallery-lightbox-close"
            aria-label="Close photo viewer"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
          >
            ✕
          </button>
          <button
            className="city-gallery-lightbox-nav prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((idx) => (idx - 1 + all.length) % all.length);
            }}
          >
            ‹
          </button>
          <img
            src={all[lightboxIdx].replace(/w=600&h=400/, "w=1400&h=900")}
            alt={`${cityName} photo ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
            onError={onError}
          />
          <button
            className="city-gallery-lightbox-nav next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((idx) => (idx + 1) % all.length);
            }}
          >
            ›
          </button>
          <div className="city-gallery-lightbox-count">
            {lightboxIdx + 1} / {all.length}
          </div>
        </div>
      )}
    </div>
  );
}
