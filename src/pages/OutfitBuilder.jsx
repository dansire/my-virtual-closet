import { Sparkles } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function OutfitBuilder() {
  return (
    <>
      <PageHeader title="Crear outfit" subtitle="Combina tus prendas y diseña un look." />
      <EmptyState icon={Sparkles} title="El creador de outfits llega pronto" text="Esta sección se construye en la Fase 5." />
    </>
  )
}