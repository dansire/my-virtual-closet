import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Plus, SearchX } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ConfirmModal from '../components/common/ConfirmModal'
import WishlistCard from '../components/wishlist/WishlistCard'
import WishlistFormModal from '../components/wishlist/WishlistFormModal'
import { useWishlist } from '../hooks/useWishlist'
import { useToast } from '../hooks/useContexts'
import { CATEGORIES } from '../constants'
import { saveImage, deleteImage } from '../services/imageService'
import { WISH_DEFAULT_FILTERS, filterWishlist, sortByPriority, totalBudget, formatPrice } from '../services/wishlistService'
import '../styles/wardrobe.css'

export default function Wishlist() {
  const navigate = useNavigate()
  const { wishlist, add, update, toggleAcquired, remove } = useWishlist()
  const { showToast } = useToast()
  const [filters, setFilters] = useState(WISH_DEFAULT_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const visible = useMemo(() => sortByPriority(filterWishlist(wishlist, filters)), [wishlist, filters])
  const budget = totalBudget(wishlist)
  const pending = wishlist.filter((w) => !w.acquired).length

  const openForm = (item = null) => {
    setEditing(item)
    setFormOpen(true)
  }

  const handleSubmit = async ({ values, imageBlob }) => {
    try {
      let imageId = editing?.imageId ?? null
      if (imageBlob) {
        const newId = await saveImage(imageBlob)
        if (editing?.imageId) await deleteImage(editing.imageId)
        imageId = newId
      }
      if (editing) {
        update(editing.id, { ...values, name: values.name.trim(), link: values.link.trim(), description: values.description.trim(), estimatedPrice: values.estimatedPrice === '' ? null : Number(values.estimatedPrice), imageId })
        showToast('Deseo actualizado')
      } else {
        add({ ...values, imageId })
        showToast('Agregado a tu lista de deseos')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (error) {
      showToast('No se pudo guardar', 'error')
      throw error
    }
  }

  const confirmDelete = async () => {
    const item = toDelete
    setToDelete(null)
    await remove(item.id)
    showToast(`"${item.name}" se eliminó de tu lista`)
  }

  // Lleva los datos al formulario del armario; el deseo se quita solo cuando se guarda la prenda.
  const moveToCloset = (item) =>
    navigate('/armario/nueva', {
      state: {
        prefill: {
          name: item.name,
          category: item.category,
          mainColor: item.color,
          description: item.description,
          imageId: item.imageId,
          wishlistId: item.id,
        },
      },
    })

  return (
    <>
      <PageHeader title="Lista de deseos" subtitle="Lo que quieres sumar a tu armario." />

      <section className="card wish-summary" aria-label="Resumen de la lista">
        <div>
          <div className="stat-label">Presupuesto estimado</div>
          <div className="stat-value">{formatPrice(budget)}</div>
        </div>
        <div>
          <div className="stat-label">Pendientes</div>
          <div className="stat-value">{pending}</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openForm()}><Plus size={16} /> Agregar deseo</button>
      </section>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Heart size={26} /></span>
          <h3>Tu lista está vacía</h3>
          <p>Guarda aquí las prendas que sueñas con tener y ve cuánto sumarían.</p>
          <button type="button" className="btn btn-primary" onClick={() => openForm()}>Agregar primer deseo</button>
        </div>
      ) : (
        <>
          <div className="filters">
            <select aria-label="Filtrar por categoría" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label className="check">
              <input type="checkbox" checked={filters.showAcquired} onChange={(e) => setFilters((f) => ({ ...f, showAcquired: e.target.checked }))} />
              Mostrar adquiridas
            </label>
          </div>

          {visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><SearchX size={26} /></span>
              <h3>Sin resultados</h3>
              <p>No hay elementos con esos filtros.</p>
              <button type="button" className="btn btn-primary" onClick={() => setFilters(WISH_DEFAULT_FILTERS)}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="wish-grid">
              {visible.map((item) => (
                <WishlistCard key={item.id} item={item} onEdit={openForm} onDelete={setToDelete} onToggleAcquired={toggleAcquired} onMoveToCloset={moveToCloset} />
              ))}
            </div>
          )}
        </>
      )}

      {formOpen && (
        <WishlistFormModal key={editing?.id ?? 'new'} item={editing} onSubmit={handleSubmit} onClose={() => { setFormOpen(false); setEditing(null) }} />
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="¿Eliminar de la lista de deseos?"
        message={toDelete ? `"${toDelete.name}" se quitará de tu lista.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}