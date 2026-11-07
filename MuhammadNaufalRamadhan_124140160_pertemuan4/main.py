"""Program utama"""

# mengimpor seluruh modul
import math_operations

# mengimpor fungsi/konstanta tertentu langsung
from math_operations import (
    PI,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
    keliling_lingkaran,
    luas_lingkaran,
)

# mengimpor modul dengan alias
import math_operations as mo


def garis(judul: str) -> None:
    """Mencetak judul bagian dengan pembatas

    Parameter:
        judul (str): teks judul bagian

    Return:
        None
    """
    print(f"\n{'=' * 46}\n{judul}\n{'=' * 46}")


def uji_persegi() -> None:
    """Menguji fungsi luas dan keliling persegi (import modul penuh)"""
    garis("1. PERSEGI")
    for sisi in (4, 7.5, 12):
        luas = math_operations.luas_persegi(sisi)
        keliling = math_operations.keliling_persegi(sisi)
        print(f"Sisi {sisi:>5} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")


def uji_persegi_panjang() -> None:
    """Menguji fungsi luas dan keliling persegi panjang (alias)"""
    garis("2. PERSEGI PANJANG")
    for panjang, lebar in ((10, 5), (8.5, 3.2), (20, 15)):
        luas = mo.luas_persegi_panjang(panjang, lebar)
        keliling = mo.keliling_persegi_panjang(panjang, lebar)
        print(f"P={panjang:>5}, L={lebar:>4} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")


def uji_lingkaran() -> None:
    """Menguji fungsi luas dan keliling lingkaran (import langsung)"""
    garis("3. LINGKARAN")
    print(f"Konstanta PI = {PI}")
    for jari_jari in (3, 7, 10.5):
        luas = luas_lingkaran(jari_jari)
        keliling = keliling_lingkaran(jari_jari)
        print(f"r={jari_jari:>5} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")


def uji_suhu() -> None:
    """Menguji fungsi konversi suhu (import langsung)"""
    garis("4. KONVERSI SUHU")
    print(f"{'Celsius':>8} | {'Fahrenheit':>10} | {'Kelvin':>8}")
    print("-" * 33)
    for celsius in (0, 25, 37, 100, -40):
        fahrenheit = celsius_ke_fahrenheit(celsius)
        kelvin = celsius_ke_kelvin(celsius)
        print(f"{celsius:>8.2f} | {fahrenheit:>10.2f} | {kelvin:>8.2f}")


def main() -> None:
    """Menjalankan seluruh pengujian modul math_operations"""
    print("PENGUJIAN MODUL math_operations")
    uji_persegi()
    uji_persegi_panjang()
    uji_lingkaran()
    uji_suhu()


if __name__ == "__main__":
    main()
