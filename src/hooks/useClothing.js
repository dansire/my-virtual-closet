import { useCallback } from 'react'
import { useCloset } from './useContexts'
import { createClothing } from '../services/clothingService'
import { deleteImage } from '../services/imageService'

// CRUD de prendas: los componentes usan esto y no tocan el almacenamiento.
export function useClothing() {
  const { clothing, setClothing } = useCloset()

  const getById = useCallback((id) => clothing.find((c) => c.id === id), [clothing])

  const add = useCallback(
    (data) => {
      const item = createClothing(data)
      setClothing((prev) => [item, ...prev])
      return item
    },
    [setClothing],
  )

  const update = useCallback(
    (id, changes) => setClothing((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c))),
    [setClothing],
  )

  const toggleFavorite = useCallback(
    (id) => setClothing((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))),
    [setClothing],
  )

  const remove = useCallback(
    async (id) => {
      const item = clothing.find((c) => c.id === id)
      setClothing((prev) => prev.filter((c) => c.id !== id))
      if (item?.imageId) {
        try {
          await deleteImage(item.imageId)
        } catch (error) {
          console.error('Error borrando imagen', error)
        }
      }
    },
    [clothing, setClothing],
  )

  return { clothing, getById, add, update, toggleFavorite, remove }
}
