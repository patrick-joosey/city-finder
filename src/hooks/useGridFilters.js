import { useMemo, useCallback, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { getWeightedScore } from "../utils/score";

// Encapsulates all grid-level filter state (sortBy, weights, minScores,
// searchTerm, selectedRegions) and returns the memoized filtered+sorted
// list of cities. Keeps App.jsx free of filter plumbing.
//
// Also handles:
//   - localStorage persistence (via useLocalStorage) so weights survive refresh
//   - URL param hydration on mount (so shareable links work)
//   - A reset() helper that zeroes everything back to defaults
//
// The `setCompareIds` param is only used to hydrate `compare=` from the URL
// on mount — the caller manages compareIds after that.

export default function useGridFilters({ cities, categories, setCompareIds }) {
  const defaultWeights = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.key, 1])),
    [categories],
  );
  const defaultMinScores = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.key, 0])),
    [categories],
  );

  const [sortBy, setSortBy] = useLocalStorage("cmp-sortBy", "overall");
  const [weights, setWeights, resetWeights] = useLocalStorage(
    "cmp-weights",
    defaultWeights,
  );
  const [minScores, setMinScores, resetMinScores] = useLocalStorage(
    "cmp-minScores",
    defaultMinScores,
  );
  const [searchTerm, setSearchTerm] = useLocalStorage("cmp-search", "");
  const [selectedRegions, setSelectedRegions] = useLocalStorage(
    "cmp-regions",
    [],
  );

  // Hydrate from URL query params on first mount, then scrub the URL clean.
  // We only want this to fire once — deps are intentionally empty. The
  // setters we call are stable across renders because useLocalStorage
  // wraps them in useCallback.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("w")) {
      const vals = params.get("w").split(",").map(Number);
      if (vals.length === categories.length) {
        setWeights(Object.fromEntries(categories.map((c, i) => [c.key, vals[i]])));
      }
    }
    if (params.has("m")) {
      const vals = params.get("m").split(",").map(Number);
      if (vals.length === categories.length) {
        setMinScores(Object.fromEntries(categories.map((c, i) => [c.key, vals[i]])));
      }
    }
    if (params.has("sort")) setSortBy(params.get("sort"));
    if (params.has("regions")) setSelectedRegions(params.get("regions").split(","));
    if (params.has("q")) setSearchTerm(params.get("q"));
    if (params.has("compare")) {
      setCompareIds(params.get("compare").split(",").map(Number));
    }
    if (params.toString()) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreFor = useCallback(
    (city) => getWeightedScore(city, weights),
    [weights],
  );

  const filteredAndSorted = useMemo(() => {
    const result = cities.filter((city) => {
      // Name search
      if (
        searchTerm &&
        !city.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // Region filter
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(city.region)
      ) {
        return false;
      }
      // Min score filters
      return categories.every(
        (cat) => city.scores[cat.key] >= (minScores[cat.key] || 0),
      );
    });

    if (sortBy === "overall") {
      result.sort((a, b) => scoreFor(b) - scoreFor(a));
    } else {
      result.sort(
        (a, b) => (b.scores[sortBy] || 0) - (a.scores[sortBy] || 0),
      );
    }
    return result;
  }, [cities, categories, sortBy, minScores, searchTerm, selectedRegions, scoreFor]);

  const reset = useCallback(() => {
    resetWeights();
    resetMinScores();
    setSearchTerm("");
    setSortBy("overall");
    setSelectedRegions([]);
  }, [resetWeights, resetMinScores, setSearchTerm, setSortBy, setSelectedRegions]);

  return {
    sortBy, setSortBy,
    weights, setWeights,
    minScores, setMinScores,
    searchTerm, setSearchTerm,
    selectedRegions, setSelectedRegions,
    filteredAndSorted,
    scoreFor,
    reset,
  };
}
