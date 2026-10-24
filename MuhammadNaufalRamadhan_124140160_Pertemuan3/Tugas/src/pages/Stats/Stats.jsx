import { useBooks } from '../../context/BookContext'
import useBookStats from '../../hooks/useBookStats'
import './Stats.css'

// Halaman statistik
function Stats() {
  const { books } = useBooks()
  const stats = useBookStats(books)

  return (
    <div className="stats">
      <h2>Statistik Buku</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span>Total Buku</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.milik}</span>
          <span>Milik</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.baca}</span>
          <span>Sedang Dibaca</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.beli}</span>
          <span>Ingin Dibeli</span>
        </div>
      </div>
    </div>
  )
}

export default Stats
