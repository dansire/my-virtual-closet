import { BarChart3 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function Statistics() {
  return (
    <>
      <PageHeader title="Estadísticas" subtitle="Conoce tu armario con datos reales." />
      <EmptyState icon={BarChart3} title="Gráficos en camino" text="Esta sección se construye en la Fase 9." />
    </>
  )
}