import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PieceThumb from '../clothing/PieceThumb'

export default function PiecePickerModal({ slot, options, selectedId, onSelect, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="picker-title">Elegir: {slot.label}</h3>

        {options.length === 0 ? (
          <p>
            Todavía no tienes prendas de esta categoría.{' '}
            <Link to="/armario/nueva" style={{ textDecoration: 'underline' }}>Agregar una prenda</Link>
          </p>
        ) : (
          <div className="picker-grid">
            {options.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`picker-item${item.id === selectedId ? ' selected' : ''}`}
                onClick={() => onSelect(item.id)}
                aria-pressed={item.id === selectedId}
              >
                <PieceThumb item={item} />
                <span>{item.name}</span>
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
