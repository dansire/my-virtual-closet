import { Heart } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'

export default function Wishlist() {
  return (
    <>
      <PageHeader title="Lista de deseos" subtitle="Lo que quieres sumar a tu armario." />
      <EmptyState icon={Heart} title="Tu wishlist llega pronto" text="Esta sección se construye en la Fase 8." />
    </>
  )
}