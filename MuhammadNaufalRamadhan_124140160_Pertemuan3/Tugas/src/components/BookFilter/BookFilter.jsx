import PropTypes from 'prop-types'
import './BookFilter.css'

// Filter berdasarkan status + kolom pencarian judul/penulis
function BookFilter({ status, search, onStatusChange, onSearchChange }) {
  return (
    <div className="book-filter">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari judul atau penulis..."
        aria-label="Cari buku"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter status"
      >
        <option value="semua">Semua status</option>
        <option value="milik">Milik</option>
        <option value="baca">Sedang dibaca</option>
        <option value="beli">Ingin dibeli</option>
      </select>
    </div>
  )
}

BookFilter.propTypes = {
  status: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

export default BookFilter
