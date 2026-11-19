import { Link } from 'react-router-dom'
import { Heart, Pencil, Copy, Trash2, TriangleAlert } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { OCCASIONS, STYLES } from '../../constants'
import { labelOf } from '../../utils/labels'
import { resolveItems } from '../../services/outfitService'
import OutfitPreview from './OutfitPreview'

export default function OutfitCard({ outfit, clothing, onView, onToggleFavorite, onDuplicate, onDelete }) {
  const pieces = resolveItems(outfit, clothing)
  const missing = pieces.filter((p) => p.missing).length

  return (
    <article className="outfit-card">
      <button type="button" className="outfit-preview-btn" onClick={() => onView(outfit)} aria-label={`Ver detalle de ${outfit.name}`}>
        <OutfitPreview pieces={pieces} compact />
      </button>
      <button
        type="button"
        className={`fav-btn${outfit.favorite ? ' on' : ''}`}
        onClick={() => onToggleFavorite(outfit.id)}
        aria-pressed={outfit.favorite}
        aria-label={outfit.favorite ? `Quitar ${outfit.name} de favoritos` : `Marcar ${outfit.name} como favorito`}
      >
        <Heart size={18} fill={outfit.favorite ? 'currentColor' : 'none'} />
      </button>

      <h3>{outfit.name}</h3>
      <div className="chips">
        <span className="tag">{labelOf(OCCASIONS, outfit.occasion)}</span>
        <span className="tag">{labelOf(STYLES, outfit.style)}</span>
      </div>
      <p className="meta">Creado el {format(parseISO(outfit.createdAt), "d 'de' MMM yyyy", { locale: es })}</p>
      {missing > 0 && (
        <span className="warn-tag"><TriangleAlert size={14} /> {missing === 1 ? '1 prenda eliminada' : `${missing} prendas eliminadas`}</span>
      )}

      <div className="card-actions">
        <Link to={`/outfits/editar/${outfit.id}`} className="icon-btn" aria-label={`Editar ${outfit.name}`}><Pencil size={16} /></Link>
        <button type="button" className="icon-btn" onClick={() => onDuplicate(outfit.id)} aria-label={`Duplicar ${outfit.name}`}><Copy size={16} /></button>
        <button type="button" className="icon-btn" onClick={() => onDelete(outfit)} aria-label={`Eliminar ${outfit.name}`}><Trash2 size={16} /></button>
      </div>
    </article>
  )
}
