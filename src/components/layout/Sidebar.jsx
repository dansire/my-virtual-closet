import { NavLink } from 'react-router-dom'
import { Shirt } from 'lucide-react'
import { NAV_ITEMS } from './navItems'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Shirt size={26} />
        <span>My Virtual Closet</span>
      </div>
      <nav className="nav" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}