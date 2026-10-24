import PropTypes from 'prop-types'
import './BookList.css'

export const STATUS_LABEL = {
  milik: 'Milik',
  baca: 'Sedang dibaca',
  beli: 'Ingin dibeli',
}

// Menampilkan daftar buku
function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty-text">Belum ada buku yang ditampilkan.</p>
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-item">
          <div className="book-info">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
            <span className={`badge badge-${book.status}`}>
              {STATUS_LABEL[book.status]}
            </span>
          </div>
          <div className="book-actions">
            <button type="button" onClick={() => onEdit(book)}>
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(book.id)}
            >
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default BookList
