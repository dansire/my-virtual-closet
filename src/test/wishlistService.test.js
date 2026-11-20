import { describe, it, expect } from 'vitest'
import { validateWishItem, sortByPriority, filterWishlist, totalBudget, WISH_DEFAULT_FILTERS } from '../services/wishlistService'

const valid = { name: 'Blazer beige', category: 'chaquetas', priority: 'alta', estimatedPrice: '120000', link: 'https://tienda.com/blazer' }

const list = [
  { id: '1', name: 'Zapatos', category: 'zapatos', priority: 'baja', estimatedPrice: 100, acquired: false },
  { id: '2', name: 'Blazer', category: 'chaquetas', priority: 'alta', estimatedPrice: 300, acquired: false },
  { id: '3', name: 'Bolso', category: 'bolsos', priority: 'media', estimatedPrice: 50, acquired: true },
]

describe('validateWishItem', () => {
  it('acepta datos válidos', () => {
    expect(validateWishItem(valid)).toEqual({})
  })

  it('exige nombre, categoría y prioridad', () => {
    expect(Object.keys(validateWishItem({}))).toEqual(['name', 'category', 'priority'])
  })

  it('rechaza precios y enlaces inválidos', () => {
    const errors = validateWishItem({ ...valid, estimatedPrice: '-5', link: 'tienda.com' })
    expect(errors.estimatedPrice).toBeDefined()
    expect(errors.link).toBeDefined()
    expect(validateWishItem({ ...valid, estimatedPrice: '' , link: '' })).toEqual({})
  })
})

describe('lista de deseos', () => {
  it('ordena por prioridad (alta primero)', () => {
    expect(sortByPriority(list).map((i) => i.id)).toEqual(['2', '3', '1'])
  })

  it('filtra por categoría y oculta adquiridas', () => {
    expect(filterWishlist(list, { ...WISH_DEFAULT_FILTERS, category: 'zapatos' })).toHaveLength(1)
    expect(filterWishlist(list, { ...WISH_DEFAULT_FILTERS, showAcquired: false })).toHaveLength(2)
  })

  it('el presupuesto suma solo lo pendiente', () => {
    expect(totalBudget(list)).toBe(400)
  })
})
