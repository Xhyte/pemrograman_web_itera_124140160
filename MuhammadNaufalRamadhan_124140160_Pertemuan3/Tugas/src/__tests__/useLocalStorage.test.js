import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('memakai nilai awal jika localStorage kosong', () => {
    const { result } = renderHook(() => useLocalStorage('kunci', 'awal'))
    expect(result.current[0]).toBe('awal')
  })

  it('menyimpan perubahan nilai ke localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('kunci', []))
    act(() => {
      result.current[1](['buku'])
    })
    expect(JSON.parse(localStorage.getItem('kunci'))).toEqual(['buku'])
  })

  it('membaca data yang sudah tersimpan sebelumnya', () => {
    localStorage.setItem('kunci', JSON.stringify(['tersimpan']))
    const { result } = renderHook(() => useLocalStorage('kunci', []))
    expect(result.current[0]).toEqual(['tersimpan'])
  })
})
