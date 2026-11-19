import { Link } from 'react-router-dom'
import { Shirt, Heart, Pencil, Trash2 } from 'lucide-react'
import { useImageUrl } from '../../hooks/useImageUrl'
import { CATEGORIES, SEASONS, STYLES } from '../../constants'
import { labelOf } from '../../utils/labels'

export default function ClothingCard({ item, view, onToggleFavorite, onDelete }) {
  const imageUrl = useImageUrl(item.imageId)

  return (
    <article className={`clothing-card ${view}`}>
      <div className="clothing-media">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} />
        ) : (
          <span className="media-placeholder"><Shirt size={32} /></span>
        )}
        <button
          type="button"
          className={`fav-btn${item.favorite ? ' on' : ''}`}
          onClick={() => onToggleFavorite(item.id)}
          aria-pressed={item.favorite}
          aria-label={item.favorite ? `Quitar ${item.name} de favoritos` : `Marcar ${item.name} como favorito`}
        >
          <Heart size={18} fill={item.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="clothing-info">
        <h3>{item.name}</h3>
        <p className="meta">
          {labelOf(CATEGORIES, item.category)}
          {item.subcategory ? `, ${item.subcategory}` : ''}
        </p>
        <div className="chips">
          <span className="swatch" style={{ background: item.mainColor }} title="Color principal" />
          {item.secondaryColors?.map((c) => (
            <span key={c} className="swatch small" style={{ background: c }} title="Color secundario" />
          ))}
          <span className="tag">{labelOf(STYLES, item.style)}</span>
          <span className="tag">{labelOf(SEASONS, item.season)}</span>
        </div>
        <div className="card-actions">
          <Link to={`/armario/editar/${item.id}`} className="icon-btn" aria-label={`Editar ${item.name}`}>
            <Pencil size={16} />
          </Link>
          <button type="button" className="icon-btn" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.name}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
