import { Check, ExternalLink, Pencil, Shirt, Trash2, Undo2 } from 'lucide-react'
import PieceThumb from '../clothing/PieceThumb'
import { CATEGORIES, PRIORITIES } from '../../constants'
import { labelOf } from '../../utils/labels'
import { formatPrice } from '../../services/wishlistService'

export default function WishlistCard({ item, onEdit, onDelete, onToggleAcquired, onMoveToCloset }) {
  const price = item.estimatedPrice !== null && item.estimatedPrice !== undefined ? formatPrice(item.estimatedPrice) : null

  return (
    <article className={`wish-card${item.acquired ? ' acquired' : ''}`}>
      <div className="wish-media">
        <PieceThumb item={{ imageId: item.imageId, name: item.name, mainColor: item.color }} />
      </div>
      <div className="wish-info">
        <div className="wish-top">
          <h3>{item.name}</h3>
          <span className={`priority priority-${item.priority}`}>{labelOf(PRIORITIES, item.priority)}</span>
        </div>
        <p className="meta">
          {labelOf(CATEGORIES, item.category)}
          {price ? `, ${price}` : ''}
          {item.acquired ? ', adquirida' : ''}
        </p>
        {item.description && <p className="wish-desc">{item.description}</p>}
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="wish-link">
            <ExternalLink size={14} /> Ver producto
          </a>
        )}
        <div className="card-actions wish-actions">
          {item.acquired ? (
            <>
              <button type="button" className="btn btn-primary" onClick={() => onMoveToCloset(item)}><Shirt size={15} /> Mover al armario</button>
              <button type="button" className="icon-btn" onClick={() => onToggleAcquired(item.id)} aria-label={`Desmarcar ${item.name} como adquirida`}><Undo2 size={16} /></button>
            </>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => onToggleAcquired(item.id)}><Check size={15} /> Ya la compré</button>
          )}
          <button type="button" className="icon-btn" onClick={() => onEdit(item)} aria-label={`Editar ${item.name}`}><Pencil size={16} /></button>
          <button type="button" className="icon-btn" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.name}`}><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  )
}
