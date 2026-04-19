import useLocalStorage from "./useLocalStorage";
import { useCallback } from "react";

const emptyEntry = () => ({
  notes: "",
  pros: [],
  cons: [],
  personalRating: null,
  isFavorite: false,
});

// Generate a stable id for pros/cons items so React keys survive reorders/deletes.
// Uses crypto.randomUUID when available, falls back to timestamp + random for older browsers.
const newId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

// Migrate legacy pros/cons that were stored as string[] to {id, text}[]
const migrateList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map((item) =>
    typeof item === "string" ? { id: newId(), text: item } : item,
  );
};

const normalizeEntry = (entry) => ({
  ...emptyEntry(),
  ...entry,
  pros: migrateList(entry?.pros),
  cons: migrateList(entry?.cons),
});

export default function useUserData() {
  const [data, setData] = useLocalStorage("cmp-user-data", {});

  const getEntry = useCallback(
    (cityId) => normalizeEntry(data[cityId]),
    [data],
  );

  const update = useCallback(
    (cityId, patch) => {
      setData((prev) => ({
        ...prev,
        [cityId]: { ...normalizeEntry(prev[cityId]), ...patch },
      }));
    },
    [setData],
  );

  const setNotes = useCallback((cityId, text) => update(cityId, { notes: text }), [update]);

  const addPro = useCallback(
    (cityId, text) => {
      const entry = normalizeEntry(data[cityId]);
      update(cityId, { pros: [...entry.pros, { id: newId(), text }] });
    },
    [data, update],
  );

  const removePro = useCallback(
    (cityId, id) => {
      const entry = normalizeEntry(data[cityId]);
      update(cityId, { pros: entry.pros.filter((p) => p.id !== id) });
    },
    [data, update],
  );

  const addCon = useCallback(
    (cityId, text) => {
      const entry = normalizeEntry(data[cityId]);
      update(cityId, { cons: [...entry.cons, { id: newId(), text }] });
    },
    [data, update],
  );

  const removeCon = useCallback(
    (cityId, id) => {
      const entry = normalizeEntry(data[cityId]);
      update(cityId, { cons: entry.cons.filter((c) => c.id !== id) });
    },
    [data, update],
  );

  const setPersonalRating = useCallback(
    (cityId, rating) => update(cityId, { personalRating: rating }),
    [update],
  );

  const toggleFavorite = useCallback(
    (cityId) => {
      const entry = normalizeEntry(data[cityId]);
      update(cityId, { isFavorite: !entry.isFavorite });
    },
    [data, update],
  );

  const getFavoriteIds = useCallback(
    () => Object.keys(data).filter((id) => data[id]?.isFavorite).map(Number),
    [data],
  );

  return {
    data,
    getEntry,
    setNotes,
    addPro,
    removePro,
    addCon,
    removeCon,
    setPersonalRating,
    toggleFavorite,
    getFavoriteIds,
  };
}
