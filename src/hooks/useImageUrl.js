import { useState, useEffect } from 'react'
import { getImage } from '../services/imageService'

// Convierte una imagen guardada en IndexedDB en una URL que <img> puede mostrar.
export function useImageUrl(imageId) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!imageId) return undefined
    let active = true
    let objectUrl = null
    getImage(imageId)
      .then((blob) => {
        if (blob && active) {
          objectUrl = URL.createObjectURL(blob)
          setUrl(objectUrl)
        }
      })
      .catch((error) => console.error('Error leyendo imagen', error))
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [imageId])

  return imageId ? url : null
}
