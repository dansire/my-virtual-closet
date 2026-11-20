import { describe, it, expect } from 'vitest'
import { parseBackup, collectImageIds } from '../services/backupService'

const validBackup = {
  app: 'my-virtual-closet',
  version: 1,
  data: { clothing: [{ id: '1', imageId: 'img1' }], outfits: [], planner: {}, wishlist: [{ id: '2', imageId: 'img1' }, { id: '3', imageId: 'img2' }], userName: 'Dani' },
  images: {},
}

describe('parseBackup', () => {
  it('acepta una copia válida', () => {
    const result = parseBackup(JSON.stringify(validBackup))
    expect(result.data.clothing).toHaveLength(1)
    expect(result.images).toEqual({})
  })

  it('rechaza texto que no es JSON', () => {
    expect(() => parseBackup('esto no es json')).toThrow('JSON válido')
  })

  it('rechaza archivos de otra aplicación', () => {
    expect(() => parseBackup(JSON.stringify({ hola: 'mundo' }))).toThrow('no es una copia')
  })

  it('rechaza copias incompletas o de una versión más nueva', () => {
    const incomplete = { ...validBackup, data: { clothing: [] } }
    expect(() => parseBackup(JSON.stringify(incomplete))).toThrow('incompleta')
    expect(() => parseBackup(JSON.stringify({ ...validBackup, version: 99 }))).toThrow('más nueva')
  })
})

describe('collectImageIds', () => {
  it('junta los ids de prendas y deseos sin repetir', () => {
    expect(collectImageIds(validBackup.data).sort()).toEqual(['img1', 'img2'])
  })
})
