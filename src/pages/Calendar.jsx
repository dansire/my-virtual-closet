import { CalendarDays } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function Calendar() {
  return (
    <>
      <PageHeader title="Calendario" subtitle="Planifica qué te pondrás cada día." />
      <EmptyState icon={CalendarDays} title="Planificador en camino" text="Esta sección se construye en la Fase 7." />
    </>
  )
}