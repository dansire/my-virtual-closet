import { openDB } from 'idb'

const DB_NAME = 'mvc-images'
const STORE = 'images'

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_FILE_MB = 8

let dbPromise
function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE)
      },
    })
  }
  return dbPromise
}

// Devuelve un mensaje de error o null si el archivo es válido.
export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Formato no permitido. Usa JPG, PNG o WebP.'
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `La imagen pesa más de ${MAX_FILE_MB} MB.`
  return null
}

// Reduce el tamaño de la imagen con un canvas para ahorrar espacio.
export async function compressImage(file, maxSize = 900, quality = 0.8) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen'))),
      'image/jpeg',
      quality,
    )
  })
}

export async function saveImage(blob) {
  const id = crypto.randomUUID()
  const db = await getDb()
  await db.put(STORE, blob, id)
  return id
}

export async function getImage(id) {
  const db = await getDb()
  return db.get(STORE, id)
}

export async function deleteImage(id) {
  const db = await getDb()
  await db.delete(STORE, id)
}
