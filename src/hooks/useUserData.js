import useLocalStorage from "./useLocalStorage";
import { useCallback } from "react";

const emptyEntry = () => ({
  notes: "",
  pros: [],
  cons: [],
  personalRating: null,
  isFavorite: false,
});

export default function useUserData() {
  const [data, setData] = useLocalStorage("cmp-user-data", {});

  const getEntry = useCallback(
    (cityId) => ({ ...emptyEntry(), ...data[cityId] }),
    [data]
  );

  const update = useCallback(
    (cityId, patch) => {
      setData((prev) => ({
        ...prev,
        [cityId]: { ...emptyEntry(), ...prev[cityId], ...patch },
      }));
    },
    [setData]
  );

  const setNotes = useCallback((cityId, text) => update(cityId, { notes: text }), [update]);

  const addPro = useCallback(
    (cityId, text) => {
      const entry = { ...emptyEntry(), ...data[cityId] };
      update(cityId, { pros: [...entry.pros, text] });
    },
    [data, update]
  );

  const removePro = useCallback(
    (cityId, index) => {
      const entry = { ...emptyEntry(), ...data[cityId] };
      update(cityId, { pros: entry.pros.filter((_, i) => i !== index) });
    },
    [data, update]
  );

  const addCon = useCallback(
    (cityId, text) => {
      const entry = { ...emptyEntry(), ...data[cityId] };
      update(cityId, { cons: [...entry.cons, text] });
    },
    [data, update]
  );

  const removeCon = useCallback(
    (cityId, index) => {
      const entry = { ...emptyEntry(), ...data[cityId] };
      update(cityId, { cons: entry.cons.filter((_, i) => i !== index) });
    },
    [data, update]
  );

  const setPersonalRating = useCallback(
    (cityId, rating) => update(cityId, { personalRating: rating }),
    [update]
  );

  const toggleFavorite = useCallback(
    (cityId) => {
      const entry = { ...emptyEntry(), ...data[cityId] };
      update(cityId, { isFavorite: !entry.isFavorite });
    },
    [data, update]
  );

  const getFavoriteIds = useCallback(
    () => Object.keys(data).filter((id) => data[id]?.isFavorite).map(Number),
    [data]
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
