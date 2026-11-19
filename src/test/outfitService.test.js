import { describe, it, expect } from 'vitest'
import {
  applyPiece, countPieces, validateOutfit, resolveItems, filterOutfits, DEFAULT_OUTFIT_FILTERS,
} from '../services/outfitService'

const valid = { name: 'Look de universidad', occasion: 'universidad', style: 'casual', items: { top: '1', bottom: '2' } }

describe('applyPiece', () => {
  it('agrega, reemplaza y quita prendas', () => {
    let items = applyPiece({}, 'top', '1')
    expect(items).toEqual({ top: '1' })
    items = applyPiece(items, 'top', '9')
    expect(items).toEqual({ top: '9' })
    expect(applyPiece(items, 'top', null)).toEqual({})
  })

  it('un vestido quita parte superior e inferior, y al revés', () => {
    const withDress = applyPiece({ top: '1', bottom: '2', shoes: '3' }, 'dress', '7')
    expect(withDress).toEqual({ shoes: '3', dress: '7' })
    expect(applyPiece(withDress, 'top', '1')).toEqual({ shoes: '3', top: '1' })
  })

  it('no modifica el objeto original', () => {
    const original = { top: '1' }
    applyPiece(original, 'bottom', '2')
    expect(original).toEqual({ top: '1' })
  })
})

describe('validateOutfit', () => {
  it('acepta un outfit completo', () => {
    expect(validateOutfit(valid)).toEqual({})
  })

  it('exige nombre, ocasión, estilo y al menos 2 prendas', () => {
    expect(Object.keys(validateOutfit({}))).toEqual(['name', 'occasion', 'style', 'items'])
    expect(validateOutfit({ ...valid, items: { top: '1' } }).items).toBeDefined()
  })

  it('countPieces ignora valores vacíos', () => {
    expect(countPieces({ top: '1', bottom: null })).toBe(1)
  })
})

describe('resolveItems', () => {
  it('marca como eliminadas las prendas que ya no existen', () => {
    const clothing = [{ id: '1', name: 'Blusa' }]
    const pieces = resolveItems({ items: { top: '1', shoes: 'borrada' } }, clothing)
    expect(pieces).toHaveLength(2)
    expect(pieces[0].missing).toBe(false)
    expect(pieces[1].missing).toBe(true)
  })
})

describe('filterOutfits', () => {
  const list = [
    { id: 'a', name: 'Look oficina', occasion: 'trabajo', style: 'formal', favorite: true },
    { id: 'b', name: 'Look playa', occasion: 'viajes', style: 'casual', favorite: false },
  ]

  it('filtra por nombre, ocasión, estilo y favoritos combinados', () => {
    expect(filterOutfits(list, DEFAULT_OUTFIT_FILTERS)).toHaveLength(2)
    expect(filterOutfits(list, { ...DEFAULT_OUTFIT_FILTERS, search: 'PLAYA' })).toHaveLength(1)
    expect(filterOutfits(list, { ...DEFAULT_OUTFIT_FILTERS, occasion: 'trabajo', style: 'formal' })).toHaveLength(1)
    expect(filterOutfits(list, { ...DEFAULT_OUTFIT_FILTERS, occasion: 'trabajo', style: 'casual' })).toHaveLength(0)
    expect(filterOutfits(list, { ...DEFAULT_OUTFIT_FILTERS, onlyFavorites: true })).toHaveLength(1)
  })
})
