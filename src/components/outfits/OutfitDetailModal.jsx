import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, OCCASIONS, STYLES } from '../../constants'
import { labelOf } from '../../utils/labels'
import PieceThumb from '../clothing/PieceThumb'
import OutfitPreview from './OutfitPreview'

export default function OutfitDetailModal({ outfit, pieces, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
        <h3 id="detail-title">{outfit.name}</h3>
        <p style={{ marginBottom: '0.75rem' }}>
          {labelOf(OCCASIONS, outfit.occasion)} · {labelOf(STYLES, outfit.style)}
        </p>
        {outfit.description && <p style={{ marginTop: 0, marginBottom: '1rem' }}>{outfit.description}</p>}

        <OutfitPreview pieces={pieces} />

        <ul className="detail-list">
          {pieces.map((piece) => (
            <li key={piece.slot.key} className="detail-row">
              <div className="piece-box">{piece.item && <PieceThumb item={piece.item} />}</div>
              <div>
                <strong>{piece.slot.label}</strong>
                {piece.missing ? (
                  <small className="gone">Prenda eliminada: ya no está en tu armario</small>
                ) : (
                  <small>{piece.item.name} · {labelOf(CATEGORIES, piece.item.category)}</small>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <Link to={`/outfits/editar/${outfit.id}`} className="btn btn-ghost">Editar</Link>
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
