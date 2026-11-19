import { Home, Shirt, PlusCircle, Sparkles, LayoutGrid, CalendarDays, Heart, BarChart3, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/armario', label: 'Mi armario', icon: Shirt },
  { to: '/armario/nueva', label: 'Agregar prenda', icon: PlusCircle },
  { to: '/outfits/crear', label: 'Crear outfit', icon: Sparkles },
  { to: '/outfits', label: 'Mis outfits', icon: LayoutGrid },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/deseos', label: 'Lista de deseos', icon: Heart },
  { to: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]