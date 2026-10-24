import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '../hooks/useLocalStorage'

// Context API, state daftar buku dipakai bersama oleh semua halaman/komponen
const BookContext = createContext(null)

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('books', [])

  // Tambah buku baru
  const addBook = (book) => {
    setBooks((prev) => [...prev, { ...book, id: Date.now() }])
  }

  // Edit buku berdasarkan id
  const updateBook = (id, data) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...data } : book))
    )
  }

  // Hapus buku berdasarkan id
  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id))
  }

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  )
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Hook kecil agar komponen lain mudah mengakses context
export function useBooks() {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBooks harus dipakai di dalam BookProvider')
  }
  return context
}
