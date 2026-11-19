import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { OCCASIONS, STYLES } from '../../constants'

const labelOf = (list, value) => list.find((i) => i.value === value)?.label ?? value

export default function OutfitOfTheDay({ outfit }) {
  if (!outfit) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Aún no hay sugerencia"
        text="Guarda tu primer outfit y cada día te sugeriremos uno."
        actionTo="/outfits/crear"
        actionLabel="Crear outfit"
      />
    )
  }

  const pieces = Object.values(outfit.items ?? {}).filter(Boolean).length

  return (
    <div>
      <h3>{outfit.name}</h3>
      <p style={{ color: 'var(--text-soft)', margin: '0.4rem 0 0.8rem' }}>
        {outfit.description || 'Un look listo para estrenar hoy.'}
      </p>
      <span className="tag">{labelOf(OCCASIONS, outfit.occasion)}</span>
      <span className="tag">{labelOf(STYLES, outfit.style)}</span>
      <span className="tag">{pieces} prendas</span>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/outfits" className="btn btn-ghost">Ver mis outfits</Link>
      </p>
    </div>
  )
}