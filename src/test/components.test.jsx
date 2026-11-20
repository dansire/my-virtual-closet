import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Shirt } from 'lucide-react'
import ConfirmModal from '../components/common/ConfirmModal'
import EmptyState from '../components/common/EmptyState'

describe('ConfirmModal', () => {
  it('no se muestra cuando está cerrado', () => {
    render(<ConfirmModal open={false} title="¿Eliminar?" message="Texto" onConfirm={() => {}} onCancel={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('llama a confirmar y a cancelar con sus botones', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmModal open title="¿Eliminar?" message="Texto" onConfirm={onConfirm} onCancel={onCancel} />)

    expect(screen.getByRole('dialog', { name: '¿Eliminar?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('se puede cerrar con la tecla Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ConfirmModal open title="¿Eliminar?" message="Texto" onConfirm={() => {}} onCancel={onCancel} />)
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('EmptyState', () => {
  it('muestra el mensaje y un enlace de acción', () => {
    render(
      <MemoryRouter>
        <EmptyState icon={Shirt} title="Tu armario está vacío" text="Agrega tu primera prenda." actionTo="/armario/nueva" actionLabel="Agregar prenda" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Tu armario está vacío' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agregar prenda' })).toHaveAttribute('href', '/armario/nueva')
  })
})
