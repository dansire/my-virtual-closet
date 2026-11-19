import { describe, it, expect, beforeEach } from 'vitest'
import { load, save, remove } from '../services/storageService'

describe('storageService', () => {
  beforeEach(() => localStorage.clear())

  it('devuelve el valor por defecto si no hay datos', () => {
    expect(load('nada', [])).toEqual([])
  })

  it('guarda y recupera datos', () => {
    save('clothing', [{ id: '1', name: 'Blusa' }])
    expect(load('clothing', [])).toEqual([{ id: '1', name: 'Blusa' }])
  })

  it('elimina datos', () => {
    save('temp', 'x')
    remove('temp')
    expect(load('temp', null)).toBeNull()
  })
})