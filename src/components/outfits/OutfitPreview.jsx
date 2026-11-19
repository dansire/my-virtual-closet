import { Ban, Sparkles } from 'lucide-react'
import PieceThumb from '../clothing/PieceThumb'

function Tile({ piece }) {
  if (piece.missing) {
    return (
      <div className="preview-tile missing" title="Esta prenda ya no está en tu armario">
        <Ban size={18} />
        <span>Prenda eliminada</span>
      </div>
    )
  }
  return (
    <div className="preview-tile" title={piece.item.name}>
      <PieceThumb item={piece.item} />
    </div>
  )
}

// Composición visual del outfit: una cuadrícula con las prendas elegidas.
export default function OutfitPreview({ pieces, compact = false }) {
  const size = compact ? ' compact' : ''
  if (pieces.length === 0) {
    return (
      <div className={`outfit-preview empty${size}`}>
        <Sparkles size={22} />
        <span>Aún sin prendas</span>
      </div>
    )
  }
  return (
    <div className={`outfit-preview${size}`} data-count={pieces.length}>
      {pieces.map((piece) => (
        <Tile key={piece.slot.key} piece={piece} />
      ))}
    </div>
  )
}
