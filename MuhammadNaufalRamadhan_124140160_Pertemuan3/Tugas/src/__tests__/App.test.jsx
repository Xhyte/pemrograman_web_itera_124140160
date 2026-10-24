import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

async function tambahBuku(judul, penulis, status = 'milik') {
  await userEvent.type(screen.getByLabelText('Judul'), judul)
  await userEvent.type(screen.getByLabelText('Penulis'), penulis)
  await userEvent.selectOptions(screen.getByLabelText('Status'), status)
  await userEvent.click(screen.getByRole('button', { name: 'Tambah' }))
}

describe('App (integrasi)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('menambah buku baru ke daftar', async () => {
    render(<App />)
    await tambahBuku('Bumi', 'Tere Liye')
    expect(screen.getByText('Bumi')).toBeInTheDocument()
  })

  it('memfilter buku berdasarkan status', async () => {
    render(<App />)
    await tambahBuku('Bumi', 'Tere Liye', 'milik')
    await tambahBuku('Laskar Pelangi', 'Andrea Hirata', 'beli')

    await userEvent.selectOptions(screen.getByLabelText('Filter status'), 'beli')

    expect(screen.queryByText('Bumi')).not.toBeInTheDocument()
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
  })

  it('mencari buku berdasarkan nama penulis', async () => {
    render(<App />)
    await tambahBuku('Bumi', 'Tere Liye')
    await tambahBuku('Laskar Pelangi', 'Andrea Hirata')

    await userEvent.type(screen.getByLabelText('Cari buku'), 'andrea')

    expect(screen.queryByText('Bumi')).not.toBeInTheDocument()
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
  })

  it('mengedit dan menghapus buku', async () => {
    render(<App />)
    await tambahBuku('Bumi', 'Tere Liye')

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const judul = screen.getByLabelText('Judul')
    await userEvent.clear(judul)
    await userEvent.type(judul, 'Bulan')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(screen.getByText('Bulan')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(screen.queryByText('Bulan')).not.toBeInTheDocument()
  })

  it('menyimpan buku ke localStorage', async () => {
    render(<App />)
    await tambahBuku('Bumi', 'Tere Liye')
    const saved = JSON.parse(localStorage.getItem('books'))
    expect(saved).toHaveLength(1)
    expect(saved[0].title).toBe('Bumi')
  })
})
