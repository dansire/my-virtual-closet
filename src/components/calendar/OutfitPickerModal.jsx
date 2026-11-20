import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import OutfitPreview from '../outfits/OutfitPreview'
import { resolveItems } from '../../services/outfitService'

export default function OutfitPickerModal({ outfits, clothing, currentId, onSelect, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="outfit-picker-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="outfit-picker-title">Elige un outfit</h3>
        {outfits.length === 0 ? (
          <p>
            Todavía no tienes outfits guardados.{' '}
            <Link to="/outfits/crear" style={{ textDecoration: 'underline' }}>Crear un outfit</Link>
          </p>
        ) : (
          <div className="picker-grid outfit-picker-grid">
            {outfits.map((outfit) => (
              <button
                key={outfit.id}
                type="button"
                className={`picker-item${outfit.id === currentId ? ' selected' : ''}`}
                onClick={() => onSelect(outfit.id)}
              >
                <OutfitPreview pieces={resolveItems(outfit, clothing)} compact />
                <span>{outfit.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} autoFocus>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
