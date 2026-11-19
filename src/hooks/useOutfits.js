import { useCallback } from 'react'
import { useCloset } from './useContexts'
import { createOutfit, duplicateOutfit } from '../services/outfitService'

// CRUD de outfits. Al borrar un outfit también se limpia del calendario.
export function useOutfits() {
  const { outfits, setOutfits, setPlanner } = useCloset()

  const getById = useCallback((id) => outfits.find((o) => o.id === id), [outfits])

  const add = useCallback(
    (data) => {
      const outfit = createOutfit(data)
      setOutfits((prev) => [outfit, ...prev])
      return outfit
    },
    [setOutfits],
  )

  const update = useCallback(
    (id, changes) => setOutfits((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o))),
    [setOutfits],
  )

  const toggleFavorite = useCallback(
    (id) => setOutfits((prev) => prev.map((o) => (o.id === id ? { ...o, favorite: !o.favorite } : o))),
    [setOutfits],
  )

  const duplicate = useCallback(
    (id) => {
      const source = outfits.find((o) => o.id === id)
      if (!source) return null
      const copy = duplicateOutfit(source)
      setOutfits((prev) => [copy, ...prev])
      return copy
    },
    [outfits, setOutfits],
  )

  const remove = useCallback(
    (id) => {
      setOutfits((prev) => prev.filter((o) => o.id !== id))
      setPlanner((prev) => Object.fromEntries(Object.entries(prev).filter(([, outfitId]) => outfitId !== id)))
    },
    [setOutfits, setPlanner],
  )

  return { outfits, getById, add, update, toggleFavorite, duplicate, remove }
}
