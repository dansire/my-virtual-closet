import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function getTodayLabel() {
  return format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
}

// Número de días desde 1970: cambia cada día, sirve para rotar sugerencias.
export function getDayNumber() {
  return Math.floor(Date.now() / 86400000)
}

export function getGreeting(name) {
  const hour = new Date().getHours()
  const base = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  return name ? `${base}, ${name}` : base
}