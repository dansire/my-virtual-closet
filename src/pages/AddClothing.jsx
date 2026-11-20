import { useParams, useLocation } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import ClothingForm from '../components/clothing/ClothingForm'
import { useClothing } from '../hooks/useClothing'
import '../styles/wardrobe.css'

export default function AddClothing() {
  const { id } = useParams()
  const location = useLocation()
  const { getById } = useClothing()
  const item = id ? getById(id) : undefined
  // Llega desde la lista de deseos con los datos del producto ya cargados.
  const prefill = id ? undefined : location.state?.prefill

  if (id && !item) {
    return (
      <>
        <PageHeader title="Editar prenda" />
        <EmptyState icon={SearchX} title="No encontramos esta prenda" text="Puede que ya se haya eliminado." actionTo="/armario" actionLabel="Volver al armario" />
      </>
    )
  }

  let title = 'Agregar prenda'
  let subtitle = 'Registra una nueva prenda en tu armario.'
  if (item) {
    title = 'Editar prenda'
    subtitle = 'Actualiza los datos de tu prenda.'
  } else if (prefill) {
    title = 'Mover al armario'
    subtitle = 'Completa los datos que faltan para sumarla a tu armario.'
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      {/* key: al cambiar de prenda, el formulario se reinicia */}
      <ClothingForm key={id ?? prefill?.wishlistId ?? 'new'} item={item} prefill={prefill} />
    </>
  )
}