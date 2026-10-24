import { renderHook } from '@testing-library/react'
import useBookStats from '../hooks/useBookStats'

describe('useBookStats', () => {
  it('menghitung total dan jumlah per status dengan benar', () => {
    const books = [
      { id: 1, title: 'A', author: 'X', status: 'milik' },
      { id: 2, title: 'B', author: 'Y', status: 'baca' },
      { id: 3, title: 'C', author: 'Z', status: 'baca' },
      { id: 4, title: 'D', author: 'W', status: 'beli' },
    ]
    const { result } = renderHook(() => useBookStats(books))
    expect(result.current).toEqual({ total: 4, milik: 1, baca: 2, beli: 1 })
  })

  it('mengembalikan nol semua jika tidak ada buku', () => {
    const { result } = renderHook(() => useBookStats([]))
    expect(result.current).toEqual({ total: 0, milik: 0, baca: 0, beli: 0 })
  })
})
