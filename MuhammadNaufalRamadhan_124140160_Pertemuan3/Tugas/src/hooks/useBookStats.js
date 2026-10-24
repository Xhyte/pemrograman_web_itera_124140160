import { useMemo } from 'react'

// Custom hook, menghitung statistik dari daftar buku
// useMemo dipakai agar perhitungan hanya diulang saat daftar buku berubah
export default function useBookStats(books) {
  return useMemo(() => {
    const stats = {
      total: books.length,
      milik: 0,
      baca: 0,
      beli: 0,
    }
    books.forEach((book) => {
      if (stats[book.status] !== undefined) {
        stats[book.status] += 1
      }
    })
    return stats
  }, [books])
}
