import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, X } from 'lucide-react'
import { useClothing } from '../../hooks/useClothing'
import { useOutfits } from '../../hooks/useOutfits'
import { useToast } from '../../hooks/useContexts'
import { OUTFIT_SLOTS } from '../../constants/outfitSlots'
import { OCCASIONS, STYLES } from '../../constants'
import { applyPiece, validateOutfit, resolveItems } from '../../services/outfitService'
import PieceThumb from '../clothing/PieceThumb'
import OutfitPreview from './OutfitPreview'
import PiecePickerModal from './PiecePickerModal'

export default function OutfitForm({ outfit }) {
  const navigate = useNavigate()
  const { clothing } = useClothing()
  const { add, update } = useOutfits()
  const { showToast } = useToast()
  const isEdit = Boolean(outfit)

  const [values, setValues] = useState(() => ({
    name: outfit?.name ?? '',
    description: outfit?.description ?? '',
    occasion: outfit?.occasion ?? '',
    style: outfit?.style ?? '',
    items: outfit?.items ?? {},
  }))
  const [errors, setErrors] = useState({})
  const [pickerSlot, setPickerSlot] = useState(null)

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const changePiece = (slotKey, clothingId) => {
    setValues((prev) => ({ ...prev, items: applyPiece(prev.items, slotKey, clothingId) }))
    setErrors((prev) => ({ ...prev, items: undefined }))
    setPickerSlot(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validateOutfit(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      showToast('Revisa los campos marcados', 'error')
      return
    }
    if (isEdit) {
      update(outfit.id, { ...values, name: values.name.trim(), description: values.description.trim() })
      showToast('Outfit actualizado')
    } else {
      add(values)
      showToast('Outfit guardado')
    }
    navigate('/outfits')
  }

  const pieces = resolveItems({ items: values.items }, clothing)
  const activeSlot = OUTFIT_SLOTS.find((s) => s.key === pickerSlot)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="builder-grid">
        <div className="card">
          <div className="field">
            <label htmlFor="outfit-name">Nombre del outfit *</label>
            <input id="outfit-name" value={values.name} maxLength={70} placeholder="Ej: Look de universidad" onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="outfit-occasion">Ocasión *</label>
              <select id="outfit-occasion" value={values.occasion} onChange={(e) => setField('occasion', e.target.value)} aria-invalid={Boolean(errors.occasion)}>
                <option value="">Selecciona...</option>
                {OCCASIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.occasion && <span className="form-error" role="alert">{errors.occasion}</span>}
            </div>
            <div className="field">
              <label htmlFor="outfit-style">Estilo *</label>
              <select id="outfit-style" value={values.style} onChange={(e) => setField('style', e.target.value)} aria-invalid={Boolean(errors.style)}>
                <option value="">Selecciona...</option>
                {STYLES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.style && <span className="form-error" role="alert">{errors.style}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="outfit-description">Descripción</label>
            <textarea id="outfit-description" rows={2} value={values.description} maxLength={220} placeholder="Cuándo te lo pondrías, qué lo hace especial..." onChange={(e) => setField('description', e.target.value)} />
            {errors.description && <span className="form-error" role="alert">{errors.description}</span>}
          </div>

          <p className="slots-title">Prendas del outfit *</p>
          <div className="slot-list">
            {OUTFIT_SLOTS.map((slot) => {
              const id = values.items[slot.key]
              const item = id ? clothing.find((c) => c.id === id) : null
              const gone = Boolean(id) && !item
              return (
                <div key={slot.key} className="slot-card">
                  <div className="slot-media">{item ? <PieceThumb item={item} /> : <Plus size={20} />}</div>
                  <div className="slot-info">
                    <strong>{slot.label}</strong>
                    <small className={gone ? 'gone' : ''}>{gone ? 'Prenda eliminada' : item ? item.name : 'Sin elegir'}</small>
                  </div>
                  <div className="slot-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setPickerSlot(slot.key)}>
                      {id ? <><RefreshCw size={14} /> Cambiar</> : <><Plus size={14} /> Elegir</>}
                    </button>
                    {id && (
                      <button type="button" className="icon-btn" onClick={() => changePiece(slot.key, null)} aria-label={`Quitar ${slot.label}`}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {errors.items && <span className="form-error" role="alert">{errors.items}</span>}
          <p className="hint" style={{ color: 'var(--text-soft)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Al elegir un vestido se quitan la parte superior y la inferior.
          </p>
        </div>

        <aside className="card builder-side" aria-label="Vista previa del outfit">
          <h3 style={{ marginBottom: '0.75rem' }}>Vista previa</h3>
          <OutfitPreview pieces={pieces} />
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/outfits')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Guardar cambios' : 'Guardar outfit'}</button>
          </div>
        </aside>
      </div>

      {activeSlot && (
        <PiecePickerModal
          slot={activeSlot}
          options={clothing.filter((c) => activeSlot.categories.includes(c.category))}
          selectedId={values.items[activeSlot.key]}
          onSelect={(id) => changePiece(activeSlot.key, id)}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </form>
  )
}
