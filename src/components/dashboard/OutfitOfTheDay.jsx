import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import OutfitPreview from '../outfits/OutfitPreview'
import { OCCASIONS, STYLES } from '../../constants'
import { labelOf } from '../../utils/labels'
import { resolveItems } from '../../services/outfitService'

export default function OutfitOfTheDay({ outfit, clothing }) {
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

  return (
    <div className="otd">
      <OutfitPreview pieces={resolveItems(outfit, clothing)} />
      <div className="otd-info">
        <h3>{outfit.name}</h3>
        <p className="meta">{outfit.description || 'Un look listo para estrenar hoy.'}</p>
        <div className="chips">
          <span className="tag">{labelOf(OCCASIONS, outfit.occasion)}</span>
          <span className="tag">{labelOf(STYLES, outfit.style)}</span>
        </div>
        <div className="otd-actions">
          <Link to="/calendario" className="btn btn-primary">Planificar</Link>
          <Link to="/outfits" className="btn btn-ghost">Ver mis outfits</Link>
        </div>
      </div>
    </div>
  )
}
