import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import { useCloset, useTheme, useToast } from '../hooks/useContexts'

export default function Settings() {
  const { userName, setUserName } = useCloset()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [name, setName] = useState(userName)

  const handleSubmit = (event) => {
    event.preventDefault()
    setUserName(name.trim())
    showToast('Nombre guardado')
  }

  return (
    <>
      <PageHeader title="Configuración" subtitle="Personaliza tu experiencia." />
      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="userName">Tu nombre</label>
            <input id="userName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Daniela" maxLength={30} />
          </div>
          <button type="submit" className="btn btn-primary">Guardar nombre</button>
        </form>
        <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />
        <p style={{ marginBottom: '0.75rem' }}>Tema actual: <strong>{theme === 'dark' ? 'Oscuro' : 'Claro'}</strong></p>
        <button type="button" className="btn btn-ghost" onClick={toggleTheme}>Cambiar tema</button>
      </div>
    </>
  )
}