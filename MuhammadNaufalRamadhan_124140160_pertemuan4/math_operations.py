"""Modul matematika geometri (luas & keliling) dan konversi suhu"""

PI = 3.14159
SUHU_NOL_MUTLAK_C = -273.15


# Persegi 
def luas_persegi(sisi: float) -> float:
    """Menghitung luas persegi

    Parameter:
        sisi (float): panjang sisi

    Return:
        float: luas persegi (sisi * sisi).
    """
    return sisi * sisi


def keliling_persegi(sisi: float) -> float:
    """Menghitung keliling persegi

    Parameter:
        sisi (float): panjang sisi

    Return:
        float: keliling persegi (4 * sisi)
    """
    return 4 * sisi


# Persegi Panjang
def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung luas persegi panjang

    Parameter:
        panjang (float): panjang
        lebar (float): lebar

    Return:
        float: luas persegi panjang (panjang * lebar)
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung keliling persegi panjang

    Parameter:
        panjang (float): panjang
        lebar (float): lebar

    Return:
        float: keliling persegi panjang (2 * (panjang + lebar))
    """
    return 2 * (panjang + lebar)


# Lingkaran
def luas_lingkaran(jari_jari: float) -> float:
    """Menghitung luas lingkaran

    Parameter:
        jari_jari (float): jari-jari lingkaran

    Return:
        float: luas lingkaran (PI * r * r)
    """
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari: float) -> float:
    """Menghitung keliling lingkaran

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Return:
        float: keliling lingkaran (2 * PI * r)
    """
    return 2 * PI * jari_jari


# Konversi Suhu
def celsius_ke_fahrenheit(celsius: float) -> float:
    """Mengonversi suhu Celsius ke Fahrenheit

    Parameter:
        celsius (float): suhu dalam derajat Celsius

    Return:
        float: suhu dalam Fahrenheit (C * 9/5 + 32)
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius: float) -> float:
    """Mengonversi suhu Celsius ke Kelvin

    Parameter:
        celsius (float): suhu dalam derajat Celsius

    Return:
        float: suhu dalam Kelvin (C + 273.15)
    """
    return celsius - SUHU_NOL_MUTLAK_C


if __name__ == "__main__":
    print("[TEST MODUL] luas lingkaran r=7 :", luas_lingkaran(7))
    print("[TEST MODUL] 100 C ke Fahrenheit:", celsius_ke_fahrenheit(100))
