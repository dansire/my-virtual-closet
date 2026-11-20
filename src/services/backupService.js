import { KEYS, save, remove } from './storageService'
import { getImage, saveImageWithId, clearImages } from './imageService'

export const BACKUP_VERSION = 1

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function dataUrlToBlob(url) {
  const response = await fetch(url)
  return response.blob()
}

export function collectImageIds(data) {
  const ids = new Set()
  ;[...(data.clothing ?? []), ...(data.wishlist ?? [])].forEach((item) => {
    if (item.imageId) ids.add(item.imageId)
  })
  return [...ids]
}

// Crea la copia de seguridad: datos + imágenes (en base64) en un solo objeto.
export async function buildBackup(data) {
  const images = {}
  for (const id of collectImageIds(data)) {
    const blob = await getImage(id)
    if (blob) images[id] = await blobToDataUrl(blob)
  }
  return {
    app: 'my-virtual-closet',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      clothing: data.clothing,
      outfits: data.outfits,
      planner: data.planner,
      wishlist: data.wishlist,
      userName: data.userName,
    },
    images,
  }
}

// Valida el texto de un archivo. Lanza un Error con un mensaje claro si algo está mal.
export function parseBackup(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  if (!parsed || parsed.app !== 'my-virtual-closet' || typeof parsed.data !== 'object' || parsed.data === null) {
    throw new Error('Este archivo no es una copia de seguridad de My Virtual Closet.')
  }
  const { data } = parsed
  const plannerOk = data.planner && typeof data.planner === 'object' && !Array.isArray(data.planner)
  if (!Array.isArray(data.clothing) || !Array.isArray(data.outfits) || !Array.isArray(data.wishlist) || !plannerOk) {
    throw new Error('La copia de seguridad está incompleta o dañada.')
  }
  if (parsed.version > BACKUP_VERSION) {
    throw new Error('Esta copia fue creada con una versión más nueva de la app.')
  }
  return { ...parsed, images: parsed.images ?? {} }
}

export async function restoreBackup(backup) {
  await clearImages()
  for (const [id, url] of Object.entries(backup.images)) {
    await saveImageWithId(id, await dataUrlToBlob(url))
  }
  save(KEYS.clothing, backup.data.clothing)
  save(KEYS.outfits, backup.data.outfits)
  save(KEYS.planner, backup.data.planner)
  save(KEYS.wishlist, backup.data.wishlist)
  save(KEYS.userName, backup.data.userName ?? '')
}

export async function resetAll() {
  await clearImages()
  ;[KEYS.clothing, KEYS.outfits, KEYS.planner, KEYS.wishlist, KEYS.userName].forEach(remove)
}
