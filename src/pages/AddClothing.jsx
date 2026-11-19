import { PlusCircle } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function AddClothing() {
  return (
    <>
      <PageHeader title="Agregar prenda" subtitle="Registra una nueva prenda en tu armario." />
      <EmptyState icon={PlusCircle} title="Formulario en camino" text="Esta sección se construye en la Fase 4." />
    </>
  )
}