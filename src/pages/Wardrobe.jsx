import { Shirt } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function Wardrobe() {
  return (
    <>
      <PageHeader title="Mi armario" subtitle="Todas tus prendas en un solo lugar." />
      <EmptyState icon={Shirt} title="Aquí vivirá tu armario" text="Esta sección se construye en la Fase 3." />
    </>
  )
}