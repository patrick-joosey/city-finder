import { useEffect, useState } from "react";
import { loadUsAtlas, getStatePath, regionToState, getCachedAtlas } from "../data/usAtlas";

// Renders a semi-transparent SVG outline of the state the city is in,
// fit to its card's dimensions. Pulls from the shared us-atlas cache
// (kicked off on module import), so the fetch happens once for the whole page.
//
// Used as an absolutely-positioned decorative layer inside CityCard.

const VIEW_W = 200;
const VIEW_H = 200;

export default function StateBackdrop({ region }) {
  const stateName = regionToState(region);
  const [atlasReady, setAtlasReady] = useState(!!getCachedAtlas());

  useEffect(() => {
    if (atlasReady) return;
    let cancelled = false;
    loadUsAtlas()
      .then(() => !cancelled && setAtlasReady(true))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [atlasReady]);

  if (!atlasReady) return null;
  const d = getStatePath(stateName, VIEW_W, VIEW_H);
  if (!d) return null;

  return (
    <svg
      className="state-backdrop"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
