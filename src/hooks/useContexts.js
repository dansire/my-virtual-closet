import { useContext } from 'react'
import { ThemeContext, ToastContext, ClosetContext } from '../context/contexts'

function useRequired(context, name) {
  const value = useContext(context)
  if (!value) throw new Error(`${name} debe usarse dentro de su Provider`)
  return value
}

export const useTheme = () => useRequired(ThemeContext, 'useTheme')
export const useToast = () => useRequired(ToastContext, 'useToast')
export const useCloset = () => useRequired(ClosetContext, 'useCloset')