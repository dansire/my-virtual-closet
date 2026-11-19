export const DEFAULT_FILTERS = {
  search: '',
  category: '',
  color: '',
  season: '',
  style: '',
  onlyFavorites: false,
}

export function todayString() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function createClothing(data) {
  return {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    category: data.category,
    subcategory: data.subcategory ?? '',
    mainColor: data.mainColor,
    secondaryColors: data.secondaryColors ?? [],
    style: data.style,
    season: data.season,
    description: data.description ?? '',
    imageId: data.imageId ?? null,
    createdAt: data.createdAt || todayString(),
    usageStatus: 'disponible',
    favorite: false,
  }
}

// Devuelve un objeto { campo: 'mensaje' }. Vacío = datos válidos.
export function validateClothing(data) {
  const errors = {}
  const name = data.name?.trim() ?? ''
  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length > 60) errors.name = 'Máximo 60 caracteres.'
  if (!data.category) errors.category = 'Elige una categoría.'
  if (!data.mainColor) errors.mainColor = 'Elige un color principal.'
  if (!data.season) errors.season = 'Elige una temporada.'
  if (!data.style) errors.style = 'Elige un estilo.'
  if (!data.createdAt) errors.createdAt = 'La fecha es obligatoria.'
  else if (Number.isNaN(Date.parse(data.createdAt))) errors.createdAt = 'Fecha no válida.'
  else if (data.createdAt > todayString()) errors.createdAt = 'La fecha no puede ser futura.'
  if ((data.description ?? '').length > 300) errors.description = 'Máximo 300 caracteres.'
  return errors
}

// Todos los filtros se combinan (AND).
export function filterClothing(list, filters) {
  const query = filters.search.trim().toLowerCase()
  return list.filter(
    (item) =>
      (!query || item.name.toLowerCase().includes(query)) &&
      (!filters.category || item.category === filters.category) &&
      (!filters.color || item.mainColor === filters.color || item.secondaryColors?.includes(filters.color)) &&
      (!filters.season || item.season === filters.season) &&
      (!filters.style || item.style === filters.style) &&
      (!filters.onlyFavorites || item.favorite),
  )
}

export function sortClothing(list, sortBy) {
  const copy = [...list]
  const byName = (a, b) => a.name.localeCompare(b.name, 'es')
  if (sortBy === 'az') return copy.sort(byName)
  if (sortBy === 'za') return copy.sort((a, b) => byName(b, a))
  if (sortBy === 'oldest') return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
