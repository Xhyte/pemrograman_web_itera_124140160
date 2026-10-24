import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import Home from './pages/Home/Home'
import Stats from './pages/Stats/Stats'
import './index.css'

// Komponen utama
function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <header className="navbar">
          <h1>Manajemen Buku</h1>
          <nav>
            <NavLink to="/" end>
              Beranda
            </NavLink>
            <NavLink to="/stats">Statistik</NavLink>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
      </BrowserRouter>
    </BookProvider>
  )
}

export default App
