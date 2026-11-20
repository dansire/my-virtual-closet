import { CATEGORIES, STYLES } from '../constants'
import { COLORS } from '../constants/colors'
import { labelOf } from '../utils/labels'

function countBy(list, getKey) {
  const map = new Map()
  list.forEach((item) => {
    const key = getKey(item)
    if (key === null || key === undefined) return
    map.set(key, (map.get(key) ?? 0) + 1)
  })
  return map
}

function distribution(list, field, labels) {
  return [...countBy(list, (i) => i[field])]
    .map(([value, count]) => ({ value, name: labelOf(labels, value), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
}

export const categoryStats = (clothing) => distribution(clothing, 'category', CATEGORIES)
export const styleStats = (clothing) => distribution(clothing, 'style', STYLES)
export const colorStats = (clothing) => distribution(clothing, 'mainColor', COLORS)

// Prendas que más aparecen en los outfits guardados.
export function mostUsedPieces(clothing, outfits, limit = 5) {
  const uses = new Map()
  outfits.forEach((outfit) =>
    Object.values(outfit.items ?? {}).forEach((id) => {
      if (id) uses.set(id, (uses.get(id) ?? 0) + 1)
    }),
  )
  return clothing
    .filter((c) => uses.has(c.id))
    .map((item) => ({ item, uses: uses.get(item.id) }))
    .sort((a, b) => b.uses - a.uses || a.item.name.localeCompare(b.item.name, 'es'))
    .slice(0, limit)
}

// Prendas agregadas por mes, con total acumulado (rellena meses sin actividad).
export function monthlyEvolution(clothing) {
  const perMonth = countBy(clothing, (i) => i.createdAt?.slice(0, 7))
  if (perMonth.size === 0) return []
  const months = [...perMonth.keys()].sort()
  let [year, month] = months[0].split('-').map(Number)
  const [endYear, endMonth] = months[months.length - 1].split('-').map(Number)
  const result = []
  let total = 0
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    const added = perMonth.get(key) ?? 0
    total += added
    result.push({ month: key, added, total })
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return result
}
