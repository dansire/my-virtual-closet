import { useMemo } from 'react'
import { BarChart3, Shirt, Sparkles, Heart, Trophy } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import StatCard from '../components/dashboard/StatCard'
import { useCloset } from '../hooks/useContexts'
import { categoryStats, styleStats, colorStats, mostUsedPieces, monthlyEvolution } from '../services/statsService'

const ROSE = '#D9A6AD'
const GOLD = '#B89B5E'

function ChartCard({ title, children }) {
  return (
    <section className="card">
      <h2 className="chart-title">{title}</h2>
      <div className="chart-box">{children}</div>
    </section>
  )
}

export default function Statistics() {
  const { clothing, outfits } = useCloset()

  const categories = useMemo(() => categoryStats(clothing), [clothing])
  const styles = useMemo(() => styleStats(clothing), [clothing])
  const colors = useMemo(() => colorStats(clothing), [clothing])
  const evolution = useMemo(() => monthlyEvolution(clothing), [clothing])
  const topPieces = useMemo(() => mostUsedPieces(clothing, outfits), [clothing, outfits])
  const favorites = clothing.filter((c) => c.favorite).length + outfits.filter((o) => o.favorite).length

  if (clothing.length === 0) {
    return (
      <>
        <PageHeader title="Estadísticas" subtitle="Conoce tu armario con datos reales." />
        <EmptyState icon={BarChart3} title="Aún no hay datos suficientes" text="Agrega prendas a tu armario y aquí verás cómo se distribuyen por categoría, color y estilo." actionTo="/armario/nueva" actionLabel="Agregar prenda" />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Estadísticas" subtitle="Conoce tu armario con datos reales." />

      <section className="stats-grid" aria-label="Resumen">
        <StatCard icon={Shirt} label="Prendas" value={clothing.length} />
        <StatCard icon={Sparkles} label="Outfits" value={outfits.length} />
        <StatCard icon={Heart} label="Favoritos" value={favorites} />
        <StatCard icon={Trophy} label="Categoría principal" value={categories[0].name} />
      </section>

      <div className="chart-grid">
        <ChartCard title="Prendas por categoría">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={130} />
              <Tooltip />
              <Bar dataKey="count" name="Prendas" fill={ROSE} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución por color">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={colors} dataKey="count" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {colors.map((c) => <Cell key={c.value} fill={c.value} stroke="#c9bbb1" />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución por estilo">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={styles} margin={{ right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Prendas" fill={GOLD} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prendas agregadas en el tiempo">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolution} margin={{ right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" name="Total acumulado" stroke={GOLD} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="dash-grid" style={{ marginTop: '1.25rem' }}>
        <section className="card">
          <h2 className="chart-title">Categorías más numerosas</h2>
          <ol className="rank-list">
            {categories.slice(0, 3).map((c) => (
              <li key={c.value}><span>{c.name}</span><strong>{c.count}</strong></li>
            ))}
          </ol>
        </section>
        <section className="card">
          <h2 className="chart-title">Prendas más usadas en outfits</h2>
          {topPieces.length === 0 ? (
            <p className="meta">Todavía no usas prendas en outfits. Crea uno y aparecerán aquí.</p>
          ) : (
            <ol className="rank-list">
              {topPieces.map(({ item, uses }) => (
                <li key={item.id}><span>{item.name}</span><strong>{uses} {uses === 1 ? 'outfit' : 'outfits'}</strong></li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  )
}