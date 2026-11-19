import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Navegación móvil">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}>
          <Icon size={20} />
          <span>{label.replace('Agregar prenda', 'Agregar').replace('Lista de deseos', 'Deseos').replace('Configuración', 'Ajustes')}</span>
        </NavLink>
      ))}
    </nav>
  )
}