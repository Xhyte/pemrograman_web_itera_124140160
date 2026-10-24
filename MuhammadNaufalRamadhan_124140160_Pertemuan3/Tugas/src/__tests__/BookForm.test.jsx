import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookForm from '../components/BookForm/BookForm'

describe('BookForm', () => {
  it('menampilkan pesan error jika judul dan penulis kosong', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Tambah' }))

    expect(screen.getByText('Judul wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Penulis wajib diisi')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('memanggil onSubmit dengan data yang benar jika form valid', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Judul'), 'Laskar Pelangi')
    await userEvent.type(screen.getByLabelText('Penulis'), 'Andrea Hirata')
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'baca')
    await userEvent.click(screen.getByRole('button', { name: 'Tambah' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'baca',
    })
  })

  it('mengisi form dengan data buku saat mode edit', () => {
    const book = { id: 1, title: 'Bumi', author: 'Tere Liye', status: 'milik' }
    render(<BookForm onSubmit={() => {}} editingBook={book} />)

    expect(screen.getByLabelText('Judul')).toHaveValue('Bumi')
    expect(screen.getByLabelText('Penulis')).toHaveValue('Tere Liye')
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })
})
