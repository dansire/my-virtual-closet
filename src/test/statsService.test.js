import { describe, it, expect } from 'vitest'
import { categoryStats, styleStats, colorStats, mostUsedPieces, monthlyEvolution } from '../services/statsService'

const clothing = [
  { id: '1', name: 'Blusa', category: 'blusas', style: 'casual', mainColor: '#FFFFFF', createdAt: '2026-01-10' },
  { id: '2', name: 'Camiseta', category: 'blusas', style: 'casual', mainColor: '#1F1F1F', createdAt: '2026-01-20' },
  { id: '3', name: 'Jean', category: 'jeans', style: 'urbano', mainColor: '#7FA6C9', createdAt: '2026-03-02' },
]

describe('statsService', () => {
  it('cuenta por categoría, estilo y color con sus etiquetas', () => {
    expect(categoryStats(clothing)[0]).toMatchObject({ value: 'blusas', name: 'Blusas y camisetas', count: 2 })
    expect(styleStats(clothing)[0]).toMatchObject({ value: 'casual', count: 2 })
    expect(colorStats(clothing)).toHaveLength(3)
  })

  it('devuelve listas vacías sin datos', () => {
    expect(categoryStats([])).toEqual([])
    expect(monthlyEvolution([])).toEqual([])
  })

  it('calcula las prendas más usadas en outfits', () => {
    const outfits = [{ items: { top: '1', bottom: '3' } }, { items: { top: '1' } }]
    const result = mostUsedPieces(clothing, outfits)
    expect(result[0].item.id).toBe('1')
    expect(result[0].uses).toBe(2)
    expect(result).toHaveLength(2)
  })

  it('la evolución es acumulada y rellena los meses vacíos', () => {
    const evolution = monthlyEvolution(clothing)
    expect(evolution.map((e) => e.month)).toEqual(['2026-01', '2026-02', '2026-03'])
    expect(evolution.map((e) => e.total)).toEqual([2, 2, 3])
  })
})
