import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookList from '../components/BookList/BookList'

const books = [
  { id: 1, title: 'Bumi', author: 'Tere Liye', status: 'milik' },
  { id: 2, title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'beli' },
]

describe('BookList', () => {
  it('menampilkan pesan kosong jika tidak ada buku', () => {
    render(<BookList books={[]} onEdit={() => {}} onDelete={() => {}} />)
    expect(
      screen.getByText('Belum ada buku yang ditampilkan.')
    ).toBeInTheDocument()
  })

  it('menampilkan semua buku beserta penulisnya', () => {
    render(<BookList books={books} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Bumi')).toBeInTheDocument()
    expect(screen.getByText('Andrea Hirata')).toBeInTheDocument()
  })

  it('memanggil onDelete dan onEdit saat tombol diklik', async () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<BookList books={books} onEdit={onEdit} onDelete={onDelete} />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Hapus' })[0])
    expect(onDelete).toHaveBeenCalledWith(1)

    await userEvent.click(screen.getAllByRole('button', { name: 'Edit' })[1])
    expect(onEdit).toHaveBeenCalledWith(books[1])
  })
})
