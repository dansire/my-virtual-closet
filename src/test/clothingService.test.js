import { describe, it, expect } from 'vitest'
import { validateClothing, filterClothing, sortClothing, DEFAULT_FILTERS, todayString } from '../services/clothingService'

const valid = {
  name: 'Blusa de lino',
  category: 'blusas',
  mainColor: '#FFFFFF',
  season: 'verano',
  style: 'casual',
  createdAt: '2026-01-10',
}

const items = [
  { id: '1', name: 'Jean azul', category: 'jeans', mainColor: '#7FA6C9', secondaryColors: [], season: 'todas', style: 'casual', favorite: true, createdAt: '2026-01-02' },
  { id: '2', name: 'Blusa rosa', category: 'blusas', mainColor: '#D9A6AD', secondaryColors: ['#FFFFFF'], season: 'verano', style: 'romantico', favorite: false, createdAt: '2026-03-05' },
  { id: '3', name: 'Abrigo beige', category: 'chaquetas', mainColor: '#E9DFD2', secondaryColors: [], season: 'invierno', style: 'clasico', favorite: false, createdAt: '2026-02-01' },
]

describe('validateClothing', () => {
  it('acepta datos completos', () => {
    expect(validateClothing(valid)).toEqual({})
  })

  it('exige los campos obligatorios', () => {
    const errors = validateClothing({})
    expect(Object.keys(errors)).toEqual(['name', 'category', 'mainColor', 'season', 'style', 'createdAt'])
  })

  it('rechaza fechas futuras y nombres muy largos', () => {
    const errors = validateClothing({ ...valid, name: 'x'.repeat(61), createdAt: '2999-01-01' })
    expect(errors.name).toBeDefined()
    expect(errors.createdAt).toBeDefined()
  })

  it('todayString tiene formato AAAA-MM-DD', () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('filterClothing', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterClothing(items, DEFAULT_FILTERS)).toHaveLength(3)
  })

  it('busca por nombre sin importar mayúsculas', () => {
    expect(filterClothing(items, { ...DEFAULT_FILTERS, search: 'BLUSA' })).toHaveLength(1)
  })

  it('combina varios filtros', () => {
    const result = filterClothing(items, { ...DEFAULT_FILTERS, category: 'blusas', season: 'verano' })
    expect(result.map((i) => i.id)).toEqual(['2'])
    expect(filterClothing(items, { ...DEFAULT_FILTERS, category: 'jeans', season: 'verano' })).toHaveLength(0)
  })

  it('filtra por color secundario y por favoritos', () => {
    expect(filterClothing(items, { ...DEFAULT_FILTERS, color: '#FFFFFF' })).toHaveLength(1)
    expect(filterClothing(items, { ...DEFAULT_FILTERS, onlyFavorites: true })).toHaveLength(1)
  })
})

describe('sortClothing', () => {
  it('ordena alfabéticamente y por fecha', () => {
    expect(sortClothing(items, 'az').map((i) => i.id)).toEqual(['3', '2', '1'])
    expect(sortClothing(items, 'recent').map((i) => i.id)).toEqual(['2', '3', '1'])
    expect(sortClothing(items, 'oldest').map((i) => i.id)).toEqual(['1', '3', '2'])
  })
})