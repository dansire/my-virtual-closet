import { describe, it, expect } from 'vitest'
import { dateKey, monthMatrix, assignOutfit, unassignOutfit, countPlannedInMonth } from '../services/calendarService'

describe('calendarService', () => {
  it('dateKey da formato AAAA-MM-DD', () => {
    expect(dateKey(new Date(2026, 10, 5))).toBe('2026-11-05')
  })

  it('monthMatrix devuelve semanas completas que empiezan en lunes', () => {
    const days = monthMatrix(new Date(2026, 10, 15))
    expect(days.length % 7).toBe(0)
    expect(days[0].getDay()).toBe(1)
    expect(days.some((d) => dateKey(d) === '2026-11-30')).toBe(true)
  })

  it('asigna y quita outfits sin modificar el original', () => {
    const original = { '2026-11-01': 'a' }
    const next = assignOutfit(original, '2026-11-02', 'b')
    expect(next).toEqual({ '2026-11-01': 'a', '2026-11-02': 'b' })
    expect(original).toEqual({ '2026-11-01': 'a' })
    expect(unassignOutfit(next, '2026-11-01')).toEqual({ '2026-11-02': 'b' })
  })

  it('cuenta solo días del mes con outfits que existen', () => {
    const planner = { '2026-11-01': 'a', '2026-11-02': 'borrado', '2026-12-01': 'a' }
    expect(countPlannedInMonth(planner, [{ id: 'a' }], '2026-11')).toBe(1)
  })
})
