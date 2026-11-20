import { useMemo, useState } from 'react'
import { addMonths, subMonths, format, isSameMonth, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CalendarPlus, RefreshCw, Trash2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ConfirmModal from '../components/common/ConfirmModal'
import DayCell from '../components/calendar/DayCell'
import OutfitPickerModal from '../components/calendar/OutfitPickerModal'
import OutfitPreview from '../components/outfits/OutfitPreview'
import { useClothing } from '../hooks/useClothing'
import { useOutfits } from '../hooks/useOutfits'
import { usePlanner } from '../hooks/usePlanner'
import { useToast } from '../hooks/useContexts'
import { dateKey, monthMatrix, countPlannedInMonth } from '../services/calendarService'
import { resolveItems } from '../services/outfitService'
import { labelOf } from '../utils/labels'
import { OCCASIONS } from '../constants'
import '../styles/outfits.css'

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

export default function Calendar() {
  const { clothing } = useClothing()
  const { outfits } = useOutfits()
  const { planner, assign, unassign } = usePlanner()
  const { showToast } = useToast()

  const [month, setMonth] = useState(() => new Date())
  const [selected, setSelected] = useState(() => dateKey(new Date()))
  const [picking, setPicking] = useState(false)
  const [pendingId, setPendingId] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const days = useMemo(() => monthMatrix(month), [month])
  const outfitOn = (key) => {
    const id = planner[key]
    return id ? outfits.find((o) => o.id === id) ?? null : null
  }

  const selectedOutfit = outfitOn(selected)
  const selectedDate = parseISO(selected)
  const planned = countPlannedInMonth(planner, outfits, format(month, 'yyyy-MM'))

  const handleSelect = (date) => {
    setSelected(dateKey(date))
    if (!isSameMonth(date, month)) setMonth(date)
  }

  const doAssign = (outfitId) => {
    assign(selected, outfitId)
    setPendingId(null)
    showToast('Outfit asignado a ese día')
  }

  const handleChoose = (outfitId) => {
    setPicking(false)
    const current = planner[selected]
    if (current === outfitId) {
      showToast('Ese outfit ya está asignado a este día')
      return
    }
    // Si ya había otro outfit ese día, se pide confirmación antes de reemplazarlo.
    if (current && outfitOn(selected)) setPendingId(outfitId)
    else doAssign(outfitId)
  }

  const handleRemove = () => {
    unassign(selected)
    setConfirmRemove(false)
    showToast('Se quitó el outfit de ese día')
  }

  return (
    <>
      <PageHeader title="Calendario" subtitle="Planifica qué te pondrás cada día." />

      <div className="cal-layout">
        <section className="card" aria-label="Calendario mensual">
          <div className="cal-head">
            <h2 className="cal-title">{format(month, 'MMMM yyyy', { locale: es })}</h2>
            <div className="cal-nav">
              <button type="button" className="icon-btn" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Mes anterior"><ChevronLeft size={18} /></button>
              <button type="button" className="btn btn-ghost" onClick={() => handleSelect(new Date())}>Hoy</button>
              <button type="button" className="icon-btn" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Mes siguiente"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="cal-weekdays" aria-hidden="true">
            {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="cal-grid">
            {days.map((date) => {
              const key = dateKey(date)
              const outfit = outfitOn(key)
              return (
                <DayCell
                  key={key}
                  date={date}
                  inMonth={isSameMonth(date, month)}
                  isToday={isToday(date)}
                  isSelected={key === selected}
                  outfit={outfit}
                  pieces={outfit ? resolveItems(outfit, clothing) : []}
                  onSelect={handleSelect}
                />
              )
            })}
          </div>
          <p className="meta" style={{ marginTop: '0.75rem' }}>
            {planned === 0 ? 'Aún no hay días planificados este mes.' : `${planned} ${planned === 1 ? 'día planificado' : 'días planificados'} este mes.`}
          </p>
        </section>

        <aside className="card cal-panel" aria-live="polite">
          <h3 className="cal-panel-date">{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</h3>
          {selectedOutfit ? (
            <>
              <OutfitPreview pieces={resolveItems(selectedOutfit, clothing)} />
              <h3 style={{ marginTop: '0.9rem' }}>{selectedOutfit.name}</h3>
              <p className="meta">{labelOf(OCCASIONS, selectedOutfit.occasion)}</p>
              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setPicking(true)}><RefreshCw size={15} /> Cambiar</button>
                <button type="button" className="btn btn-ghost" onClick={() => setConfirmRemove(true)}><Trash2 size={15} /> Quitar</button>
              </div>
            </>
          ) : (
            <div className="cal-empty">
              <p>No hay un outfit planificado para este día.</p>
              <button type="button" className="btn btn-primary" onClick={() => setPicking(true)}><CalendarPlus size={16} /> Asignar outfit</button>
            </div>
          )}
        </aside>
      </div>

      {picking && (
        <OutfitPickerModal outfits={outfits} clothing={clothing} currentId={planner[selected]} onSelect={handleChoose} onClose={() => setPicking(false)} />
      )}

      <ConfirmModal
        open={Boolean(pendingId)}
        title="¿Reemplazar el outfit de este día?"
        message={`Ese día ya tiene "${selectedOutfit?.name ?? 'un outfit'}" asignado. Si continúas, se cambiará por el nuevo.`}
        confirmLabel="Reemplazar"
        onConfirm={() => doAssign(pendingId)}
        onCancel={() => setPendingId(null)}
      />
      <ConfirmModal
        open={confirmRemove}
        title="¿Quitar el outfit de este día?"
        message="El outfit seguirá guardado en Mis outfits."
        confirmLabel="Quitar"
        onConfirm={handleRemove}
        onCancel={() => setConfirmRemove(false)}
      />
    </>
  )
}