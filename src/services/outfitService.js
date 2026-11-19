import { OUTFIT_SLOTS } from '../constants/outfitSlots'
import { todayString } from './clothingService'

export const DEFAULT_OUTFIT_FILTERS = { search: '', occasion: '', style: '', onlyFavorites: false }

export function countPieces(items) {
  return Object.values(items ?? {}).filter(Boolean).length
}

// Pone o quita una prenda de un espacio. Un vestido reemplaza a parte superior e inferior.
export function applyPiece(items, slotKey, clothingId) {
  const next = { ...items }
  if (!clothingId) {
    delete next[slotKey]
    return next
  }
  next[slotKey] = clothingId
  if (slotKey === 'dress') {
    delete next.top
    delete next.bottom
  }
  if (slotKey === 'top' || slotKey === 'bottom') delete next.dress
  return next
}

// Devuelve un objeto { campo: 'mensaje' }. Vacío = datos válidos.
export function validateOutfit(data) {
  const errors = {}
  const name = data.name?.trim() ?? ''
  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length > 60) errors.name = 'Máximo 60 caracteres.'
  if (!data.occasion) errors.occasion = 'Elige una ocasión.'
  if (!data.style) errors.style = 'Elige un estilo.'
  if (countPieces(data.items) < 2) errors.items = 'Elige al menos 2 prendas para el outfit.'
  if ((data.description ?? '').length > 200) errors.description = 'Máximo 200 caracteres.'
  return errors
}

export function createOutfit(data) {
  return {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    description: data.description?.trim() ?? '',
    occasion: data.occasion,
    style: data.style,
    items: { ...data.items },
    createdAt: todayString(),
    favorite: false,
  }
}

export function duplicateOutfit(outfit) {
  return {
    ...outfit,
    id: crypto.randomUUID(),
    name: `${outfit.name} (copia)`,
    items: { ...outfit.items },
    createdAt: todayString(),
    favorite: false,
  }
}

// Une cada espacio del outfit con su prenda real. Si la prenda ya no existe: missing = true.
export function resolveItems(outfit, clothing) {
  return OUTFIT_SLOTS.filter((slot) => outfit.items?.[slot.key]).map((slot) => {
    const id = outfit.items[slot.key]
    const item = clothing.find((c) => c.id === id) ?? null
    return { slot, id, item, missing: !item }
  })
}

export function filterOutfits(list, filters) {
  const query = filters.search.trim().toLowerCase()
  return list.filter(
    (o) =>
      (!query || o.name.toLowerCase().includes(query)) &&
      (!filters.occasion || o.occasion === filters.occasion) &&
      (!filters.style || o.style === filters.style) &&
      (!filters.onlyFavorites || o.favorite),
  )
}
