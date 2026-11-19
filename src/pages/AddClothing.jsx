import { useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import ClothingForm from '../components/clothing/ClothingForm'
import { useClothing } from '../hooks/useClothing'
import '../styles/wardrobe.css'

export default function AddClothing() {
  const { id } = useParams()
  const { getById } = useClothing()
  const item = id ? getById(id) : undefined

  if (id && !item) {
    return (
      <>
        <PageHeader title="Editar prenda" />
        <EmptyState icon={SearchX} title="No encontramos esta prenda" text="Puede que ya se haya eliminado." actionTo="/armario" actionLabel="Volver al armario" />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={item ? 'Editar prenda' : 'Agregar prenda'}
        subtitle={item ? 'Actualiza los datos de tu prenda.' : 'Registra una nueva prenda en tu armario.'}
      />
      {/* key: al cambiar de prenda, el formulario se reinicia */}
      <ClothingForm key={id ?? 'new'} item={item} />
    </>
  )
}