import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export const dateKey = (date) => format(date, 'yyyy-MM-dd')

// Días a mostrar en la cuadrícula del mes (semanas de lunes a domingo).
export function monthMatrix(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export const assignOutfit = (planner, key, outfitId) => ({ ...planner, [key]: outfitId })

export function unassignOutfit(planner, key) {
  const next = { ...planner }
  delete next[key]
  return next
}

// Cuántos días del mes (AAAA-MM) tienen un outfit que todavía existe.
export function countPlannedInMonth(planner, outfits, monthPrefix) {
  return Object.entries(planner).filter(
    ([key, id]) => key.startsWith(monthPrefix) && outfits.some((o) => o.id === id),
  ).length
}
