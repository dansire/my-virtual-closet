import { Link } from 'react-router-dom'
import { PlusCircle, Sparkles, CalendarDays, Heart } from 'lucide-react'

const ACTIONS = [
  { to: '/armario/nueva', label: 'Agregar prenda', icon: PlusCircle },
  { to: '/outfits/crear', label: 'Crear outfit', icon: Sparkles },
  { to: '/calendario', label: 'Planificar', icon: CalendarDays },
  { to: '/deseos', label: 'Lista de deseos', icon: Heart },
]

export default function QuickActions() {
  return (
    <div className="quick-grid">
      {ACTIONS.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} className="quick-link">
          <Icon size={18} /> {label}
        </Link>
      ))}
    </div>
  )
}