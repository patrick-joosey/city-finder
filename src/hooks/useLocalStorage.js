import { useState, useCallback } from "react";

const SCHEMA_VERSION = 2; // Bump when data shape changes

export default function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      // Schema migration: if stored version is outdated, merge with defaults
      if (parsed._v !== SCHEMA_VERSION && typeof defaultValue === "object" && !Array.isArray(defaultValue)) {
        const merged = { ...defaultValue, ...parsed };
        delete merged._v;
        return merged;
      }
      const { _v, ...data } = parsed;
      return data.value !== undefined ? data.value : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(
            key,
            JSON.stringify({ _v: SCHEMA_VERSION, value: next })
          );
        } catch {
          // Storage full or unavailable - still update in-memory state
        }
        return next;
      });
    },
    [key]
  );

  const reset = useCallback(() => {
    setStoredValue(defaultValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, reset];
}
