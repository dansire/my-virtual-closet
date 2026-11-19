import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shirt, SearchX, Plus } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import ConfirmModal from '../components/common/ConfirmModal'
import ClothingCard from '../components/clothing/ClothingCard'
import ClothingFilters from '../components/clothing/ClothingFilters'
import { useClothing } from '../hooks/useClothing'
import { useToast } from '../hooks/useContexts'
import { DEFAULT_FILTERS, filterClothing, sortClothing } from '../services/clothingService'
import '../styles/wardrobe.css'

export default function Wardrobe() {
  const { clothing, toggleFavorite, remove } = useClothing()
  const { showToast } = useToast()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('recent')
  const [view, setView] = useState('grid')
  const [toDelete, setToDelete] = useState(null)

  // Se recalcula solo cuando cambian las prendas, los filtros o el orden.
  const visible = useMemo(() => sortClothing(filterClothing(clothing, filters), sortBy), [clothing, filters, sortBy])

  const patchFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }))

  const confirmDelete = async () => {
    const item = toDelete
    setToDelete(null)
    await remove(item.id)
    showToast(`"${item.name}" se eliminó de tu armario`)
  }

  return (
    <>
      <PageHeader title="Mi armario" subtitle="Todas tus prendas en un solo lugar." />

      {clothing.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="Tu armario está vacío"
          text="Agrega tu primera prenda con una foto y empieza a organizar tu estilo."
          actionTo="/armario/nueva"
          actionLabel="Agregar prenda"
        />
      ) : (
        <>
          <ClothingFilters
            filters={filters}
            onChange={patchFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            view={view}
            onViewChange={setView}
            shown={visible.length}
            total={clothing.length}
          />

          {visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><SearchX size={26} /></span>
              <h3>Sin resultados</h3>
              <p>Ninguna prenda coincide con esos filtros.</p>
              <button type="button" className="btn btn-primary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className={`clothing-grid ${view}`}>
              {visible.map((item) => (
                <ClothingCard key={item.id} item={item} view={view} onToggleFavorite={toggleFavorite} onDelete={setToDelete} />
              ))}
            </div>
          )}

          <p style={{ marginTop: '1.5rem' }}>
            <Link to="/armario/nueva" className="btn btn-primary"><Plus size={16} /> Agregar prenda</Link>
          </p>
        </>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="¿Eliminar esta prenda?"
        message={toDelete ? `"${toDelete.name}" se borrará de tu armario. Esta acción no se puede deshacer.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}