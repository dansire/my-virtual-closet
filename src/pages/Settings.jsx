import { useRef, useState } from 'react'
import { Download, Upload, RotateCcw, Moon, Sun } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ConfirmModal from '../components/common/ConfirmModal'
import { useCloset, useTheme, useToast } from '../hooks/useContexts'
import { buildBackup, parseBackup, restoreBackup, resetAll } from '../services/backupService'
import { todayString } from '../services/clothingService'

const HELP = [
  ['Agregar una prenda', 'Ve a "Agregar prenda", completa el formulario, sube una foto y guarda. Las fotos se comprimen y se guardan en tu navegador.'],
  ['Crear un outfit', 'En "Crear outfit" elige una prenda por espacio. Necesitas nombre, ocasión, estilo y al menos 2 prendas.'],
  ['Planificar tu semana', 'En "Calendario" toca un día y asigna uno de tus outfits. Si ya había uno, se te pide confirmar el cambio.'],
  ['Lista de deseos', 'Guarda lo que quieres comprar. Al marcarlo como comprado puedes moverlo a tu armario con un clic.'],
  ['Copias de seguridad', 'Exporta un archivo JSON con todo (incluidas las fotos) y guárdalo. Puedes importarlo después o en otro dispositivo.'],
]

export default function Settings() {
  const { userName, setUserName, clothing, outfits, planner, wishlist } = useCloset()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [name, setName] = useState(userName)
  const [pending, setPending] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const saveName = (event) => {
    event.preventDefault()
    setUserName(name.trim())
    showToast('Nombre guardado')
  }

  const chooseTheme = (target) => {
    if (theme !== target) toggleTheme()
  }

  const handleExport = async () => {
    setBusy(true)
    try {
      const backup = await buildBackup({ clothing, outfits, planner, wishlist, userName })
      const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `my-virtual-closet-${todayString()}.json`
      link.click()
      URL.revokeObjectURL(url)
      showToast('Copia de seguridad descargada')
    } catch (error) {
      console.error(error)
      showToast('No se pudo crear la copia', 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      setPending(parseBackup(await file.text()))
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const confirmImport = async () => {
    setBusy(true)
    try {
      await restoreBackup(pending)
      setPending(null)
      showToast('Copia importada. Recargando...')
      setTimeout(() => window.location.reload(), 700)
    } catch (error) {
      console.error(error)
      showToast('No se pudo importar la copia', 'error')
      setBusy(false)
    }
  }

  const confirmResetAll = async () => {
    setBusy(true)
    try {
      await resetAll()
      setConfirmReset(false)
      showToast('Información restablecida. Recargando...')
      setTimeout(() => window.location.reload(), 700)
    } catch (error) {
      console.error(error)
      showToast('No se pudo restablecer', 'error')
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Configuración" subtitle="Personaliza tu experiencia y cuida tus datos." />

      <div className="settings-grid">
        <section className="card">
          <h2 className="chart-title">Perfil</h2>
          <form onSubmit={saveName}>
            <div className="field">
              <label htmlFor="userName">Tu nombre</label>
              <input id="userName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Daniela" maxLength={30} />
            </div>
            <button type="submit" className="btn btn-primary">Guardar nombre</button>
          </form>
        </section>

        <section className="card">
          <h2 className="chart-title">Apariencia</h2>
          <div className="theme-choice" role="group" aria-label="Tema de color">
            <button type="button" className={`btn btn-ghost${theme === 'light' ? ' chosen' : ''}`} aria-pressed={theme === 'light'} onClick={() => chooseTheme('light')}><Sun size={16} /> Claro</button>
            <button type="button" className={`btn btn-ghost${theme === 'dark' ? ' chosen' : ''}`} aria-pressed={theme === 'dark'} onClick={() => chooseTheme('dark')}><Moon size={16} /> Oscuro</button>
          </div>
        </section>

        <section className="card settings-wide">
          <h2 className="chart-title">Tus datos</h2>
          <p className="meta" style={{ marginBottom: '1rem' }}>
            Hoy tienes {clothing.length} prendas, {outfits.length} outfits y {wishlist.length} deseos. Todo se guarda en este navegador.
          </p>
          <div className="data-actions">
            <button type="button" className="btn btn-ghost" onClick={handleExport} disabled={busy}><Download size={16} /> Exportar copia (JSON)</button>
            <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={busy}><Upload size={16} /> Importar copia</button>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden aria-label="Elegir archivo de copia de seguridad" />
            <button type="button" className="btn btn-danger" onClick={() => setConfirmReset(true)} disabled={busy}><RotateCcw size={16} /> Restablecer todo</button>
          </div>
        </section>

        <section className="card settings-wide">
          <h2 className="chart-title">Ayuda</h2>
          <div className="help-list">
            {HELP.map(([title, text]) => (
              <details key={title}>
                <summary>{title}</summary>
                <p>{text}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <ConfirmModal
        open={Boolean(pending)}
        title="¿Importar esta copia?"
        message={pending ? `Se reemplazará lo que tienes ahora por ${pending.data.clothing.length} prendas, ${pending.data.outfits.length} outfits y ${pending.data.wishlist.length} deseos de la copia.` : ''}
        confirmLabel="Importar"
        onConfirm={confirmImport}
        onCancel={() => setPending(null)}
      />
      <ConfirmModal
        open={confirmReset}
        title="¿Restablecer toda la información?"
        message="Se borrarán todas tus prendas, fotos, outfits, calendario y deseos. Esta acción no se puede deshacer. Si dudas, exporta una copia primero."
        confirmLabel="Restablecer"
        onConfirm={confirmResetAll}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  )
}