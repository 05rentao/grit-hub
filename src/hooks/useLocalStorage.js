// useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, defaultValue) {
  // console.log("useLocalStorage", key, defaultValue);
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.error("Failed to parse localStorage item", e);
      return defaultValue;
    }
  });

  // when value changes, write to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [key, value]);

  // console.log("value", value)
  return [value, setValue];
}
