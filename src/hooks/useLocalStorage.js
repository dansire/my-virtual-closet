import { useState, useEffect } from 'react'
import { load, save } from '../services/storageService'

// Igual que useState, pero el valor persiste en localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => load(key, initialValue))

  useEffect(() => {
    save(key, value)
  }, [key, value])

  return [value, setValue]
}