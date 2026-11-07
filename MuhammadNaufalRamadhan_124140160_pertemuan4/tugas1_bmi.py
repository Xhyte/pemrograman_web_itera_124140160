"""Tugas 1: Program penghitung BMI (Body Mass Index) sederhana"""


def hitung_bmi(berat: float, tinggi: float) -> float:
    """Menghitung nilai BMI

    Parameter:
        berat (float): berat badan dalam kilogram (kg)
        tinggi (float): tinggi badan dalam centimeter (cm)

    Return:
        float: nilai BMI = berat / (tinggi * tinggi)
    """
    return berat / ((tinggi / 100) ** 2)


def tentukan_kategori(bmi: float) -> str:
    """Menentukan kategori BMI dengan percabangan if-elif-else

    Parameter:
        bmi (float): nilai BMI

    Return:
        str: kategori status berat badan
    """
    if bmi < 18.5:
        kategori = "Berat badan kurang"
    elif bmi < 25:
        kategori = "Berat badan normal"
    elif bmi < 30:
        kategori = "Berat badan berlebih"
    else:
        kategori = "Obesitas"
    return kategori


def baca_angka_positif(pesan: str) -> float:
    """Meminta input angka positif dari pengguna hingga valid

    Parameter:
        pesan (str): teks prompt yang ditampilkan ke pengguna

    Return:
        float: angka positif yang dimasukkan pengguna
    """
    while True:
        try:
            nilai = float(input(pesan).replace(",", "."))
        except ValueError:
            print("Input harus berupa angka. Silakan coba lagi.")
            continue
        if nilai <= 0:
            print("Nilai harus lebih besar dari 0. Silakan coba lagi.")
            continue
        return nilai


def main() -> None:
    """Menjalankan program: input data, hitung BMI, cetak hasil."""
    print("=== PROGRAM PENGHITUNG BMI ===")
    berat = baca_angka_positif("Masukkan berat badan (kg)  : ")
    tinggi = baca_angka_positif("Masukkan tinggi badan (cm)  : ")

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print("\n--- HASIL PERHITUNGAN ---")
    print(f"Berat badan : {berat:.2f} kg")
    print(f"Tinggi badan: {tinggi:.2f} cm")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {kategori}")


if __name__ == "__main__":
    main()
