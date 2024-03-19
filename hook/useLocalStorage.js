import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      setStoredValue(item ? item : initialValue);
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
    }
  }, [key, initialValue]);

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting data to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
