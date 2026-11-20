import { todayString } from './clothingService'

export const WISH_DEFAULT_FILTERS = { category: '', showAcquired: true }

const PRIORITY_ORDER = { alta: 0, media: 1, baja: 2 }

const hasPrice = (value) => value !== '' && value !== null && value !== undefined

// Devuelve un objeto { campo: 'mensaje' }. Vacío = datos válidos.
export function validateWishItem(data) {
  const errors = {}
  const name = data.name?.trim() ?? ''
  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length > 60) errors.name = 'Máximo 60 caracteres.'
  if (!data.category) errors.category = 'Elige una categoría.'
  if (!data.priority) errors.priority = 'Elige una prioridad.'
  if (hasPrice(data.estimatedPrice)) {
    const price = Number(data.estimatedPrice)
    if (Number.isNaN(price) || price < 0) errors.estimatedPrice = 'Ingresa un precio válido.'
  }
  if (data.link && !/^https?:\/\/\S+$/i.test(data.link.trim())) {
    errors.link = 'El enlace debe empezar con http:// o https://'
  }
  if ((data.description ?? '').length > 200) errors.description = 'Máximo 200 caracteres.'
  return errors
}

export function createWishItem(data) {
  return {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    imageId: data.imageId ?? null,
    category: data.category,
    color: data.color ?? '',
    estimatedPrice: hasPrice(data.estimatedPrice) ? Number(data.estimatedPrice) : null,
    link: data.link?.trim() ?? '',
    priority: data.priority,
    description: data.description?.trim() ?? '',
    acquired: false,
    createdAt: todayString(),
  }
}

export function sortByPriority(list) {
  return [...list].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.name.localeCompare(b.name, 'es'),
  )
}

export function filterWishlist(list, filters) {
  return list.filter(
    (item) => (!filters.category || item.category === filters.category) && (filters.showAcquired || !item.acquired),
  )
}

// Presupuesto = suma de lo que todavía no se ha comprado.
export function totalBudget(list) {
  return list.filter((i) => !i.acquired).reduce((sum, i) => sum + (i.estimatedPrice || 0), 0)
}

export const formatPrice = (value) => `$${new Intl.NumberFormat('es').format(value)}`
