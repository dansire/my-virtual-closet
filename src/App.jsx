import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Wardrobe from './pages/Wardrobe'
import AddClothing from './pages/AddClothing'
import OutfitBuilder from './pages/OutfitBuilder'
import Outfits from './pages/Outfits'
import Calendar from './pages/Calendar'
import Wishlist from './pages/Wishlist'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="armario" element={<Wardrobe />} />
        <Route path="armario/nueva" element={<AddClothing />} />
        <Route path="armario/editar/:id" element={<AddClothing />} />
        <Route path="outfits/crear" element={<OutfitBuilder />} />
        <Route path="outfits/editar/:id" element={<OutfitBuilder />} />
        <Route path="outfits" element={<Outfits />} />
        <Route path="calendario" element={<Calendar />} />
        <Route path="deseos" element={<Wishlist />} />
        <Route path="estadisticas" element={<Statistics />} />
        <Route path="configuracion" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}