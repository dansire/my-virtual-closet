import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus } from 'lucide-react'
import { useClothing } from '../../hooks/useClothing'
import { useToast } from '../../hooks/useContexts'
import { useImageUrl } from '../../hooks/useImageUrl'
import { useWishlist } from '../../hooks/useWishlist'
import { validateClothing, todayString } from '../../services/clothingService'
import { validateImageFile, compressImage, saveImage, deleteImage } from '../../services/imageService'
import { CATEGORIES, SEASONS, STYLES } from '../../constants'
import { COLORS } from '../../constants/colors'

function Field({ id, label, error, hint, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  )
}

export default function ClothingForm({ item, prefill }) {
  const navigate = useNavigate()
  const { add, update } = useClothing()
  const { showToast } = useToast()
  const { removeKeepImage } = useWishlist()
  const isEdit = Boolean(item)
  // Imagen de partida: la de la prenda al editar, o la del deseo al moverlo al armario.
  const baseImageId = item?.imageId ?? prefill?.imageId ?? null

  const [values, setValues] = useState(() => ({
    name: item?.name ?? prefill?.name ?? '',
    category: item?.category ?? prefill?.category ?? '',
    subcategory: item?.subcategory ?? '',
    mainColor: item?.mainColor ?? prefill?.mainColor ?? '',
    secondaryColors: item?.secondaryColors ?? [],
    season: item?.season ?? '',
    style: item?.style ?? '',
    description: item?.description ?? prefill?.description ?? '',
    createdAt: item?.createdAt ?? todayString(),
  }))
  const [errors, setErrors] = useState({})
  const [newImage, setNewImage] = useState(null) // { blob, preview }
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const currentUrl = useImageUrl(baseImageId)
  const previewRef = useRef(null)

  // Libera la URL temporal de la vista previa al salir del formulario.
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const toggleSecondary = (color) =>
    setValues((prev) => ({
      ...prev,
      secondaryColors: prev.secondaryColors.includes(color)
        ? prev.secondaryColors.filter((c) => c !== color)
        : [...prev.secondaryColors, color],
    }))

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
    const found = validateClothing(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      showToast('Revisa los campos marcados', 'error')
      return
    }

    setSaving(true)
    try {
      let imageId = baseImageId
      if (newImage) {
        const newId = await saveImage(newImage.blob)
        if (baseImageId) await deleteImage(baseImageId)
        imageId = newId
      }
      const data = {
        ...values,
        name: values.name.trim(),
        subcategory: values.subcategory.trim(),
        description: values.description.trim(),
        imageId,
      }
      if (isEdit) {
        update(item.id, data)
        showToast('Prenda actualizada')
      } else {
        add(data)
        if (prefill?.wishlistId) removeKeepImage(prefill.wishlistId)
        showToast('Prenda agregada a tu armario')
      }
      navigate('/armario')
    } catch (error) {
      console.error(error)
      showToast('No se pudo guardar la prenda', 'error')
      setSaving(false)
    }
  }

  const previewUrl = newImage?.preview ?? currentUrl

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field id="name" label="Nombre de la prenda *" error={errors.name} className="full">
          <input id="name" value={values.name} onChange={(e) => setField('name', e.target.value)} maxLength={70} aria-invalid={Boolean(errors.name)} placeholder="Ej: Blusa de lino blanca" />
        </Field>

        <Field id="category" label="Categoría *" error={errors.category}>
          <select id="category" value={values.category} onChange={(e) => setField('category', e.target.value)} aria-invalid={Boolean(errors.category)}>
            <option value="">Selecciona...</option>
            {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field id="subcategory" label="Subcategoría">
          <input id="subcategory" value={values.subcategory} onChange={(e) => setField('subcategory', e.target.value)} maxLength={40} placeholder="Ej: Manga larga" />
        </Field>

        <fieldset className="field full">
          <legend>Color principal *</legend>
          <div className="swatch-picker">
            {COLORS.map((c) => (
              <label key={c.value} className="swatch-option" title={c.label}>
                <input type="radio" name="mainColor" value={c.value} checked={values.mainColor === c.value} onChange={() => setField('mainColor', c.value)} aria-label={c.label} />
                <span style={{ background: c.value }} />
              </label>
            ))}
          </div>
          {errors.mainColor && <span className="error" role="alert">{errors.mainColor}</span>}
        </fieldset>

        <fieldset className="field full">
          <legend>Colores secundarios (opcional)</legend>
          <div className="swatch-picker">
            {COLORS.map((c) => (
              <label key={c.value} className="swatch-option" title={c.label}>
                <input type="checkbox" checked={values.secondaryColors.includes(c.value)} onChange={() => toggleSecondary(c.value)} aria-label={`${c.label} (secundario)`} />
                <span style={{ background: c.value }} />
              </label>
            ))}
          </div>
        </fieldset>

        <Field id="season" label="Temporada *" error={errors.season}>
          <select id="season" value={values.season} onChange={(e) => setField('season', e.target.value)} aria-invalid={Boolean(errors.season)}>
            <option value="">Selecciona...</option>
            {SEASONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field id="style" label="Estilo *" error={errors.style}>
          <select id="style" value={values.style} onChange={(e) => setField('style', e.target.value)} aria-invalid={Boolean(errors.style)}>
            <option value="">Selecciona...</option>
            {STYLES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field id="createdAt" label="Fecha de incorporación *" error={errors.createdAt}>
          <input id="createdAt" type="date" value={values.createdAt} max={todayString()} onChange={(e) => setField('createdAt', e.target.value)} aria-invalid={Boolean(errors.createdAt)} />
        </Field>

        <Field id="description" label="Descripción" error={errors.description} hint={`${values.description.length}/300`} className="full">
          <textarea id="description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} maxLength={320} placeholder="Tela, ocasión, con qué combina..." />
        </Field>

        <Field id="image" label="Fotografía" error={imageError} hint="JPG, PNG o WebP, máximo 8 MB. Se comprime automáticamente." className="full">
          <div className="image-drop">
            <div className="image-preview">
              {previewUrl ? <img src={previewUrl} alt="Vista previa de la prenda" /> : <ImagePlus size={30} />}
            </div>
            <input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
          </div>
        </Field>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/armario')} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar prenda'}
        </button>
      </div>
    </form>
  )
}