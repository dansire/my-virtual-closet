const PREFIX = 'mvc:'

export const KEYS = {
  clothing: 'clothing',
  outfits: 'outfits',
  planner: 'planner',
  wishlist: 'wishlist',
  theme: 'theme',
  userName: 'userName',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch (error) {
    console.error('Error leyendo', key, error)
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error guardando', key, error)
    return false
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}