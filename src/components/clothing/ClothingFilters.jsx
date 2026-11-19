import { Search, LayoutGrid, List, FilterX } from 'lucide-react'
import { CATEGORIES, SEASONS, STYLES } from '../../constants'
import { COLORS } from '../../constants/colors'

function Select({ label, value, onChange, options, allLabel }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export default function ClothingFilters({
  filters, onChange, onClear, sortBy, onSortChange, view, onViewChange, shown, total,
}) {
  const hasFilters = Object.entries(filters).some(([, v]) => v !== '' && v !== false)

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            aria-label="Buscar prenda por nombre"
            placeholder="Buscar por nombre..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
        <select aria-label="Ordenar prendas" value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="sort-select">
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguas</option>
          <option value="az">Nombre A-Z</option>
          <option value="za">Nombre Z-A</option>
        </select>
        <div className="view-toggle" role="group" aria-label="Tipo de vista">
          <button type="button" className={`icon-btn${view === 'grid' ? ' active' : ''}`} onClick={() => onViewChange('grid')} aria-label="Vista de cuadrícula" aria-pressed={view === 'grid'}>
            <LayoutGrid size={18} />
          </button>
          <button type="button" className={`icon-btn${view === 'list' ? ' active' : ''}`} onClick={() => onViewChange('list')} aria-label="Vista de lista" aria-pressed={view === 'list'}>
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="filters">
        <Select label="Filtrar por categoría" value={filters.category} onChange={(category) => onChange({ category })} options={CATEGORIES} allLabel="Todas las categorías" />
        <Select label="Filtrar por color" value={filters.color} onChange={(color) => onChange({ color })} options={COLORS} allLabel="Todos los colores" />
        <Select label="Filtrar por temporada" value={filters.season} onChange={(season) => onChange({ season })} options={SEASONS} allLabel="Todas las temporadas" />
        <Select label="Filtrar por estilo" value={filters.style} onChange={(style) => onChange({ style })} options={STYLES} allLabel="Todos los estilos" />
      </div>

      <div className="results-line">
        <span>Mostrando {shown} de {total} prendas</span>
        <label className="check">
          <input type="checkbox" checked={filters.onlyFavorites} onChange={(e) => onChange({ onlyFavorites: e.target.checked })} />
          Solo favoritas
        </label>
        {hasFilters && (
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            <FilterX size={16} /> Limpiar filtros
          </button>
        )}
      </div>
    </>
  )
}
