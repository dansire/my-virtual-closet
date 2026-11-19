import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, Search, SearchX, Plus, FilterX } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import ConfirmModal from '../components/common/ConfirmModal'
import OutfitCard from '../components/outfits/OutfitCard'
import OutfitDetailModal from '../components/outfits/OutfitDetailModal'
import { useClothing } from '../hooks/useClothing'
import { useOutfits } from '../hooks/useOutfits'
import { useToast } from '../hooks/useContexts'
import { OCCASIONS, STYLES } from '../constants'
import { DEFAULT_OUTFIT_FILTERS, filterOutfits, resolveItems } from '../services/outfitService'
import '../styles/wardrobe.css'
import '../styles/outfits.css'
import '../styles/outfit-gallery.css'

export default function Outfits() {
  const { clothing } = useClothing()
  const { outfits, toggleFavorite, duplicate, remove } = useOutfits()
  const { showToast } = useToast()
  const [filters, setFilters] = useState(DEFAULT_OUTFIT_FILTERS)
  const [selected, setSelected] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const visible = useMemo(
    () => filterOutfits(outfits, filters).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [outfits, filters],
  )

  const patch = (changes) => setFilters((prev) => ({ ...prev, ...changes }))
  const hasFilters = Object.values(filters).some((v) => v !== '' && v !== false)

  const handleDuplicate = (id) => {
    const copy = duplicate(id)
    if (copy) showToast(`Se creó "${copy.name}"`)
  }

  const confirmDelete = () => {
    const outfit = toDelete
    setToDelete(null)
    remove(outfit.id)
    showToast(`"${outfit.name}" se eliminó`)
  }

  // El detalle se recalcula con los datos actuales, así refleja prendas borradas.
  const current = selected ? outfits.find((o) => o.id === selected) : null

  return (
    <>
      <PageHeader title="Mis outfits" subtitle="Tus combinaciones guardadas." />

      {outfits.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="Aún no tienes outfits" text="Combina tus prendas y guarda tu primer look." actionTo="/outfits/crear" actionLabel="Crear outfit" />
      ) : (
        <>
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input type="search" aria-label="Buscar outfit por nombre" placeholder="Buscar por nombre..." value={filters.search} onChange={(e) => patch({ search: e.target.value })} />
            </div>
          </div>
          <div className="filters">
            <select aria-label="Filtrar por ocasión" value={filters.occasion} onChange={(e) => patch({ occasion: e.target.value })}>
              <option value="">Todas las ocasiones</option>
              {OCCASIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select aria-label="Filtrar por estilo" value={filters.style} onChange={(e) => patch({ style: e.target.value })}>
              <option value="">Todos los estilos</option>
              {STYLES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="results-line">
            <span>Mostrando {visible.length} de {outfits.length} outfits</span>
            <label className="check">
              <input type="checkbox" checked={filters.onlyFavorites} onChange={(e) => patch({ onlyFavorites: e.target.checked })} />
              Solo favoritos
            </label>
            {hasFilters && (
              <button type="button" className="btn btn-ghost" onClick={() => setFilters(DEFAULT_OUTFIT_FILTERS)}>
                <FilterX size={16} /> Limpiar filtros
              </button>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><SearchX size={26} /></span>
              <h3>Sin resultados</h3>
              <p>Ningún outfit coincide con esos filtros.</p>
              <button type="button" className="btn btn-primary" onClick={() => setFilters(DEFAULT_OUTFIT_FILTERS)}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="outfit-grid">
              {visible.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  clothing={clothing}
                  onView={(o) => setSelected(o.id)}
                  onToggleFavorite={toggleFavorite}
                  onDuplicate={handleDuplicate}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          )}

          <p style={{ marginTop: '1.5rem' }}>
            <Link to="/outfits/crear" className="btn btn-primary"><Plus size={16} /> Crear outfit</Link>
          </p>
        </>
      )}

      {current && <OutfitDetailModal outfit={current} pieces={resolveItems(current, clothing)} onClose={() => setSelected(null)} />}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="¿Eliminar este outfit?"
        message={toDelete ? `"${toDelete.name}" se borrará, y también su asignación en el calendario. Tus prendas no se eliminan.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
