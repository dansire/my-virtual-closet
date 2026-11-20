import { useCallback } from 'react'
import { useCloset } from './useContexts'
import { createWishItem } from '../services/wishlistService'
import { deleteImage } from '../services/imageService'

export function useWishlist() {
  const { wishlist, setWishlist } = useCloset()

  const add = useCallback(
    (data) => {
      const item = createWishItem(data)
      setWishlist((prev) => [item, ...prev])
      return item
    },
    [setWishlist],
  )

  const update = useCallback(
    (id, changes) => setWishlist((prev) => prev.map((w) => (w.id === id ? { ...w, ...changes } : w))),
    [setWishlist],
  )

  const toggleAcquired = useCallback(
    (id) => setWishlist((prev) => prev.map((w) => (w.id === id ? { ...w, acquired: !w.acquired } : w))),
    [setWishlist],
  )

  // Elimina el elemento y también su imagen.
  const remove = useCallback(
    async (id) => {
      const item = wishlist.find((w) => w.id === id)
      setWishlist((prev) => prev.filter((w) => w.id !== id))
      if (item?.imageId) {
        try {
          await deleteImage(item.imageId)
        } catch (error) {
          console.error('Error borrando imagen', error)
        }
      }
    },
    [wishlist, setWishlist],
  )

  // Al mover al armario la imagen pasa a la prenda, así que NO se borra.
  const removeKeepImage = useCallback((id) => setWishlist((prev) => prev.filter((w) => w.id !== id)), [setWishlist])

  return { wishlist, add, update, toggleAcquired, remove, removeKeepImage }
}
