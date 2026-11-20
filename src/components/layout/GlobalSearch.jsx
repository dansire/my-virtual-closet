import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Shirt, Sparkles, Heart } from 'lucide-react'
import { useCloset } from '../../hooks/useContexts'

export default function GlobalSearch() {
  const { clothing, outfits, wishlist } = useCloset()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const has = (text) => text.toLowerCase().includes(q)
    return [
      ...clothing.filter((c) => has(c.name)).slice(0, 4).map((c) => ({ key: `c-${c.id}`, type: 'Prenda', name: c.name, to: `/armario/editar/${c.id}`, Icon: Shirt })),
      ...outfits.filter((o) => has(o.name)).slice(0, 4).map((o) => ({ key: `o-${o.id}`, type: 'Outfit', name: o.name, to: `/outfits/editar/${o.id}`, Icon: Sparkles })),
      ...wishlist.filter((w) => has(w.name)).slice(0, 4).map((w) => ({ key: `w-${w.id}`, type: 'Deseo', name: w.name, to: '/deseos', Icon: Heart })),
    ]
  }, [query, clothing, outfits, wishlist])

  const go = (to) => {
    navigate(to)
    setQuery('')
    setOpen(false)
  }

  return (
    <div
      className="header-search"
      ref={boxRef}
      onBlur={(event) => {
        if (!boxRef.current?.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <Search size={16} />
      <input
        type="search"
        aria-label="Buscar en toda la aplicación"
        placeholder="Buscar prendas, outfits, deseos..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim().length >= 2 && (
        <ul className="search-results" onMouseDown={(e) => e.preventDefault()}>
          {results.length === 0 ? (
            <li className="search-empty">Sin resultados</li>
          ) : (
            results.map(({ key, name, type, to, Icon }) => (
              <li key={key}>
                <button type="button" onClick={() => go(to)}>
                  <Icon size={16} />
                  <span>{name}</span>
                  <small>{type}</small>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
