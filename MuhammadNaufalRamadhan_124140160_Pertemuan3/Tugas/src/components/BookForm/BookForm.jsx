import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './BookForm.css'

const emptyForm = { title: '', author: '', status: 'milik' }

// Form tambah / edit buku
function BookForm({ onSubmit, editingBook = null, onCancel = () => {} }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  // Saat mode edit, isi form dengan data buku yang dipilih
  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        status: editingBook.status,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingBook])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // hapus pesan error ketika pengguna mulai mengetik lagi
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validasi judul dan penulis wajib diisi
  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Judul wajib diisi'
    if (!form.author.trim()) newErrors.author = 'Penulis wajib diisi'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
    })
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingBook ? 'Edit Buku' : 'Tambah Buku'}</h2>

      <label htmlFor="title">Judul</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        className={errors.title ? 'input-error' : ''}
        placeholder="Judul buku"
      />
      {errors.title && <p className="error-text">{errors.title}</p>}

      <label htmlFor="author">Penulis</label>
      <input
        id="author"
        name="author"
        type="text"
        value={form.author}
        onChange={handleChange}
        className={errors.author ? 'input-error' : ''}
        placeholder="Nama penulis"
      />
      {errors.author && <p className="error-text">{errors.author}</p>}

      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="milik">Milik</option>
        <option value="baca">Sedang dibaca</option>
        <option value="beli">Ingin dibeli</option>
      </select>

      <div className="form-actions">
        <button type="submit">{editingBook ? 'Simpan' : 'Tambah'}</button>
        {editingBook && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editingBook: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
  }),
  onCancel: PropTypes.func,
}

export default BookForm
