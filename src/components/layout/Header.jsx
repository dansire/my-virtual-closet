import { Moon, Sun, Shirt } from 'lucide-react'
import { useTheme } from '../../hooks/useContexts'
import { getTodayLabel } from '../../utils/dateUtils'
import GlobalSearch from './GlobalSearch'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="header">
      <div className="header-brand"><Shirt size={22} /> My Virtual Closet</div>
      <GlobalSearch />
      <span className="header-date">{getTodayLabel()}</span>
      <button
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
