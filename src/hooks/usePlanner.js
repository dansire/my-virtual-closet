import { useCallback } from 'react'
import { useCloset } from './useContexts'
import { assignOutfit, unassignOutfit } from '../services/calendarService'

export function usePlanner() {
  const { planner, setPlanner } = useCloset()
  const assign = useCallback((key, outfitId) => setPlanner((prev) => assignOutfit(prev, key, outfitId)), [setPlanner])
  const unassign = useCallback((key) => setPlanner((prev) => unassignOutfit(prev, key)), [setPlanner])
  return { planner, assign, unassign }
}
