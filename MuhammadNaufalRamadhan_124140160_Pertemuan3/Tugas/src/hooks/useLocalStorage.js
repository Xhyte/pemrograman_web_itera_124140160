import { useState, useEffect } from 'react'

// Custom hook, state yang otomatis tersimpan di localStorage
// Dipakai seperti useState, tetapi nilainya tetap ada setelah halaman di-refresh
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      // Jika data rusak / localStorage tidak tersedia, pakai nilai awal
      return initialValue
    }
  })

  // Setiap value berubah, simpan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // abaikan error penyimpanan (misalnya storage penuh)
    }
  }, [key, value])

  return [value, setValue]
}
