import { Link } from 'react-router-dom'
import { Shirt, Sparkles, Heart } from 'lucide-react'
import { useCloset } from '../hooks/useContexts'
import { getGreeting, getDayNumber } from '../utils/dateUtils'
import { STYLE_TIPS } from '../constants'
import StatCard from '../components/dashboard/StatCard'
import QuickActions from '../components/dashboard/QuickActions'
import OutfitOfTheDay from '../components/dashboard/OutfitOfTheDay'
import EmptyState from '../components/common/EmptyState'
import '../styles/dashboard.css'

export default function Dashboard() {
  const { clothing, outfits, userName } = useCloset()

  const favorites = clothing.filter((c) => c.favorite).length + outfits.filter((o) => o.favorite).length

  const recentClothing = [...clothing]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 4)

  const recentOutfits = [...outfits]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 3)

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
        {!userName && (
          <p><Link to="/configuracion" style={{ textDecoration: 'underline' }}>Agrega tu nombre</Link> para personalizar tu experiencia.</p>
        )}
      </section>

      <section className="stats-grid" aria-label="Resumen del armario">
        <StatCard icon={Shirt} label="Prendas" value={clothing.length} />
        <StatCard icon={Sparkles} label="Outfits" value={outfits.length} />
        <StatCard icon={Heart} label="Favoritos" value={favorites} />
      </section>

      <div className="dash-grid">
        <section className="card">
          <div className="section-title"><h2>Outfit del día</h2></div>
          <OutfitOfTheDay outfit={outfitOfTheDay} />
        </section>

        <section className="card">
          <div className="section-title"><h2>Inspiración</h2></div>
          <div className="tip">
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </div>
        </section>
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="section-title">
            <h2>Prendas recientes</h2>
            <Link to="/armario">Ver todas</Link>
          </div>
          {recentClothing.length === 0 ? (
            <EmptyState icon={Shirt} title="Sin prendas todavía" text="Cuando agregues prendas, las más nuevas aparecerán aquí." />
          ) : (
            <ul className="mini-list">
              {recentClothing.map((item) => (
                <li key={item.id}>
                  <span className="swatch" style={{ background: item.mainColor }} />
                  <div>{item.name}<small>{item.category}</small></div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="section-title">
            <h2>Outfits recientes</h2>
            <Link to="/outfits">Ver todos</Link>
          </div>
          {recentOutfits.length === 0 ? (
            <EmptyState icon={Sparkles} title="Sin outfits todavía" text="Tus últimas combinaciones aparecerán aquí." />
          ) : (
            <ul className="mini-list">
              {recentOutfits.map((o) => (
                <li key={o.id}><div>{o.name}<small>{o.occasion}</small></div></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card">
        <div className="section-title"><h2>Accesos rápidos</h2></div>
        <QuickActions />
      </section>
    </>
  )
}