import { LayoutGrid } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function Outfits() {
  return (
    <>
      <PageHeader title="Mis outfits" subtitle="Tus combinaciones guardadas." />
      <EmptyState icon={LayoutGrid} title="Galería en camino" text="Esta sección se construye en la Fase 6." />
    </>
  )
}