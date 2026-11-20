import { Link } from 'react-router-dom'
import { Shirt, Sparkles, Heart, ShoppingBag } from 'lucide-react'
import { useCloset } from '../hooks/useContexts'
import { getGreeting, getDayNumber } from '../utils/dateUtils'
import { STYLE_TIPS } from '../constants'
import { resolveItems } from '../services/outfitService'
import StatCard from '../components/dashboard/StatCard'
import QuickActions from '../components/dashboard/QuickActions'
import OutfitOfTheDay from '../components/dashboard/OutfitOfTheDay'
import EmptyState from '../components/common/EmptyState'
import PieceThumb from '../components/clothing/PieceThumb'
import OutfitPreview from '../components/outfits/OutfitPreview'
import '../styles/dashboard.css'

const newestFirst = (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')

export default function Dashboard() {
  const { clothing, outfits, wishlist, userName } = useCloset()

  const favorites = clothing.filter((c) => c.favorite).length + outfits.filter((o) => o.favorite).length
  const pendingWishes = wishlist.filter((w) => !w.acquired).length
  const recentClothing = [...clothing].sort(newestFirst).slice(0, 6)
  const recentOutfits = [...outfits].sort(newestFirst).slice(0, 3)

  // Cambia cada día; con varios outfits no se repite el mismo todos los días.
  const day = getDayNumber()
  const outfitOfTheDay = outfits.length ? outfits[day % outfits.length] : null
  const tip = STYLE_TIPS[day % STYLE_TIPS.length]

  return (
    <>
      <section className="hero">
        <h1>{getGreeting(userName)}</h1>
        <p>
          {clothing.length === 0
            ? 'Tu armario digital está listo. Empieza registrando tu primera prenda.'
            : 'Qué bueno verte de nuevo. Tu armario te está esperando.'}
        </p>
        <div className="hero-actions">
          <Link to="/armario/nueva" className="btn btn-primary">Agregar prenda</Link>
          <Link to="/outfits/crear" className="btn btn-ghost">Crear outfit</Link>
        </div>
        {!userName && (
          <p className="hero-note"><Link to="/configuracion" style={{ textDecoration: 'underline' }}>Agrega tu nombre</Link> para personalizar tu experiencia.</p>
        )}
      </section>

      <section className="stats-grid" aria-label="Resumen del armario">
        <StatCard icon={Shirt} label="Prendas" value={clothing.length} />
        <StatCard icon={Sparkles} label="Outfits" value={outfits.length} />
        <StatCard icon={Heart} label="Favoritos" value={favorites} />
        <StatCard icon={ShoppingBag} label="Por comprar" value={pendingWishes} />
      </section>

      <div className="dash-grid">
        <section className="card">
          <div className="section-title"><h2>Outfit del día</h2></div>
          <OutfitOfTheDay outfit={outfitOfTheDay} clothing={clothing} />
        </section>

        <section className="card tip-card">
          <div className="section-title"><h2>Inspiración</h2></div>
          <div className="tip">
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </div>
        </section>
      </div>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title">
          <h2>Prendas recientes</h2>
          <Link to="/armario">Ver todas</Link>
        </div>
        {recentClothing.length === 0 ? (
          <EmptyState icon={Shirt} title="Sin prendas todavía" text="Cuando agregues prendas, las más nuevas aparecerán aquí." />
        ) : (
          <div className="recent-grid">
            {recentClothing.map((item) => (
              <Link key={item.id} to={`/armario/editar/${item.id}`} className="recent-tile">
                <div className="recent-img"><PieceThumb item={item} /></div>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title">
          <h2>Outfits recientes</h2>
          <Link to="/outfits">Ver todos</Link>
        </div>
        {recentOutfits.length === 0 ? (
          <EmptyState icon={Sparkles} title="Sin outfits todavía" text="Tus últimas combinaciones aparecerán aquí." />
        ) : (
          <div className="recent-outfits">
            {recentOutfits.map((outfit) => (
              <Link key={outfit.id} to="/outfits" className="recent-outfit">
                <OutfitPreview pieces={resolveItems(outfit, clothing)} compact />
                <span>{outfit.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-title"><h2>Accesos rápidos</h2></div>
        <QuickActions />
      </section>
    </>
  )
}