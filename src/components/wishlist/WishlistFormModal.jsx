import { useState, useRef, useEffect } from 'react'
import { ImagePlus } from 'lucide-react'
import { useImageUrl } from '../../hooks/useImageUrl'
import { validateWishItem } from '../../services/wishlistService'
import { validateImageFile, compressImage } from '../../services/imageService'
import { CATEGORIES, PRIORITIES } from '../../constants'
import { COLORS } from '../../constants/colors'

function Field({ id, label, error, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  )
}

export default function WishlistFormModal({ item, onClose, onSubmit }) {
  const [values, setValues] = useState(() => ({
    name: item?.name ?? '',
    category: item?.category ?? '',
    color: item?.color ?? '',
    estimatedPrice: item?.estimatedPrice ?? '',
    link: item?.link ?? '',
    priority: item?.priority ?? 'media',
    description: item?.description ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [newImage, setNewImage] = useState(null) // { blob, preview }
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const currentUrl = useImageUrl(item?.imageId)
  const previewRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const problem = validateImageFile(file)
    if (problem) {
      setImageError(problem)
      event.target.value = ''
      return
    }
    try {
      const blob = await compressImage(file)
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
      const preview = URL.createObjectURL(blob)
      previewRef.current = preview
      setNewImage({ blob, preview })
      setImageError('')
    } catch (error) {
      console.error(error)
      setImageError('No se pudo procesar la imagen. Prueba con otra.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validateWishItem(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    setSaving(true)
    try {
      await onSubmit({ values, imageBlob: newImage?.blob ?? null })
    } catch (error) {
      console.error(error)
      setSaving(false)
    }
  }

  const previewUrl = newImage?.preview ?? currentUrl

  return (
    <div className="modal-backdrop">
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="wish-form-title">
        <h3 id="wish-form-title">{item ? 'Editar deseo' : 'Agregar a la lista de deseos'}</h3>
        <form onSubmit={handleSubmit} noValidate style={{ marginTop: '1rem' }}>
          <div className="form-grid">
            <Field id="wish-name" label="Nombre *" error={errors.name} className="full">
              <input id="wish-name" value={values.name} maxLength={70} onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} placeholder="Ej: Blazer de lino beige" />
            </Field>
            <Field id="wish-category" label="Categoría *" error={errors.category}>
              <select id="wish-category" value={values.category} onChange={(e) => setField('category', e.target.value)} aria-invalid={Boolean(errors.category)}>
                <option value="">Selecciona...</option>
                {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id="wish-color" label="Color">
              <select id="wish-color" value={values.color} onChange={(e) => setField('color', e.target.value)}>
                <option value="">Sin definir</option>
                {COLORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id="wish-price" label="Precio estimado" error={errors.estimatedPrice}>
              <input id="wish-price" type="number" min="0" step="any" value={values.estimatedPrice} onChange={(e) => setField('estimatedPrice', e.target.value)} aria-invalid={Boolean(errors.estimatedPrice)} placeholder="0" />
            </Field>
            <Field id="wish-priority" label="Prioridad de compra *" error={errors.priority}>
              <select id="wish-priority" value={values.priority} onChange={(e) => setField('priority', e.target.value)} aria-invalid={Boolean(errors.priority)}>
                {PRIORITIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field id="wish-link" label="Enlace al producto (opcional)" error={errors.link} className="full">
              <input id="wish-link" value={values.link} onChange={(e) => setField('link', e.target.value)} aria-invalid={Boolean(errors.link)} placeholder="https://..." />
            </Field>
            <Field id="wish-description" label="Descripción" error={errors.description} className="full">
              <textarea id="wish-description" rows={2} value={values.description} maxLength={220} onChange={(e) => setField('description', e.target.value)} />
            </Field>
            <Field id="wish-image" label="Imagen" error={imageError} className="full">
              <div className="image-drop">
                <div className="image-preview">
                  {previewUrl ? <img src={previewUrl} alt="Vista previa del producto" /> : <ImagePlus size={28} />}
                </div>
                <input id="wish-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
              </div>
            </Field>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : item ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
