import { useMemo } from 'react'
import { ClosetContext } from './contexts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KEYS } from '../services/storageService'

export function ClosetProvider({ children }) {
  const [clothing, setClothing] = useLocalStorage(KEYS.clothing, [])
  const [outfits, setOutfits] = useLocalStorage(KEYS.outfits, [])
  const [planner, setPlanner] = useLocalStorage(KEYS.planner, {})
  const [wishlist, setWishlist] = useLocalStorage(KEYS.wishlist, [])
  const [userName, setUserName] = useLocalStorage(KEYS.userName, '')

  const value = useMemo(
    () => ({
      clothing, setClothing,
      outfits, setOutfits,
      planner, setPlanner,
      wishlist, setWishlist,
      userName, setUserName,
    }),
    [clothing, setClothing, outfits, setOutfits, planner, setPlanner, wishlist, setWishlist, userName, setUserName],
  )

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>
}
