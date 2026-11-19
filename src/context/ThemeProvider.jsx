import { useEffect } from 'react'
import { ThemeContext } from './contexts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KEYS } from '../services/storageService'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(KEYS.theme, 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}