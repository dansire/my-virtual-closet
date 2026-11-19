import { useParams } from 'react-router-dom'
import { SearchX, Shirt } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import OutfitForm from '../components/outfits/OutfitForm'
import { useClothing } from '../hooks/useClothing'
import { useOutfits } from '../hooks/useOutfits'
import '../styles/wardrobe.css'
import '../styles/outfits.css'

export default function OutfitBuilder() {
  const { id } = useParams()
  const { clothing } = useClothing()
  const { getById } = useOutfits()
  const outfit = id ? getById(id) : undefined

  if (id && !outfit) {
    return (
      <>
        <PageHeader title="Editar outfit" />
        <EmptyState icon={SearchX} title="No encontramos este outfit" text="Puede que ya se haya eliminado." actionTo="/outfits" actionLabel="Ir a mis outfits" />
      </>
    )
  }

  if (clothing.length === 0) {
    return (
      <>
        <PageHeader title="Crear outfit" subtitle="Combina tus prendas y diseña un look." />
        <EmptyState icon={Shirt} title="Primero agrega prendas" text="Necesitas prendas en tu armario para armar un outfit." actionTo="/armario/nueva" actionLabel="Agregar prenda" />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={outfit ? 'Editar outfit' : 'Crear outfit'}
        subtitle="Elige una prenda por espacio y mira cómo queda."
      />
      <OutfitForm key={id ?? 'new'} outfit={outfit} />
    </>
  )
}