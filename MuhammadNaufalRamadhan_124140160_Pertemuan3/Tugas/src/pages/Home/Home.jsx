import { useState } from 'react'
import { useBooks } from '../../context/BookContext'
import BookForm from '../../components/BookForm/BookForm'
import BookList from '../../components/BookList/BookList'
import BookFilter from '../../components/BookFilter/BookFilter'
import './Home.css'

// Halaman utama
function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [editingBook, setEditingBook] = useState(null)
  const [status, setStatus] = useState('semua')
  const [search, setSearch] = useState('')

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data)
      setEditingBook(null)
    } else {
      addBook(data)
    }
  }

  const handleDelete = (id) => {
    deleteBook(id)
    // jika buku yang sedang diedit dihapus, batalkan mode edit
    if (editingBook && editingBook.id === id) setEditingBook(null)
  }

  // Terapkan filter status dan pencarian (judul atau penulis)
  const keyword = search.trim().toLowerCase()
  const filteredBooks = books.filter((book) => {
    const matchStatus = status === 'semua' || book.status === status
    const matchSearch =
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    return matchStatus && matchSearch
  })

  return (
    <div className="home">
      <BookForm
        onSubmit={handleSubmit}
        editingBook={editingBook}
        onCancel={() => setEditingBook(null)}
      />
      <section>
        <h2>Daftar Buku</h2>
        <BookFilter
          status={status}
          search={search}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
        />
        <BookList
          books={filteredBooks}
          onEdit={setEditingBook}
          onDelete={handleDelete}
        />
      </section>
    </div>
  )
}

export default Home
