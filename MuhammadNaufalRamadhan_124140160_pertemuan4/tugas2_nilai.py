"""Tugas 2: Program pengelolaan data nilai mahasiswa"""

BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30

DATA_MAHASISWA = [
    {"nama": "Birro", "nim": "124130007",
     "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Sahal", "nim": "124140167",
     "nilai_uts": 78, "nilai_uas": 72, "nilai_tugas": 80},
    {"nama": "Wafi", "nim": "124140043",
     "nilai_uts": 65, "nilai_uas": 60, "nilai_tugas": 70},
    {"nama": "Qinthafa", "nim": "124140155",
     "nilai_uts": 55, "nilai_uas": 52, "nilai_tugas": 60},
    {"nama": "Iffan", "nim": "124430154",
     "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 50},
    {"nama": "Naufal", "nim": "124140160",
     "nilai_uts": 92, "nilai_uas": 88, "nilai_tugas": 95},
]


def hitung_nilai_akhir(uts: float, uas: float, tugas: float) -> float:
    """Menghitung nilai akhir berbobot.

    Rumus: (30% * UTS) + (40% * UAS) + (30% * Tugas)

    Parameter:
        uts (float): nilai UTS
        uas (float): nilai UAS
        tugas (float): nilai tugas

    Return:
        float: nilai akhir
    """
    return (BOBOT_UTS * uts) + (BOBOT_UAS * uas) + (BOBOT_TUGAS * tugas)


def tentukan_grade(nilai_akhir: float) -> str:
    """Menentukan grade berdasarkan nilai akhir

    Parameter:
        nilai_akhir (float): nilai akhir mahasiswa

    Return:
        str: grade A, B, C, D, atau E
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    return "E"


def proses_data(daftar: list) -> None:
    """Menambahkan kunci nilai_akhir dan grade ke setiap dictionary

    Parameter:
        daftar (list): list berisi dictionary data mahasiswa

    Return:
        None: data dimodifikasi langsung (in-place)
    """
    for mhs in daftar:
        mhs["nilai_akhir"] = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])


def cetak_tabel(daftar: list) -> None:
    """Mencetak data mahasiswa dalam format tabel rapi

    Parameter:
        daftar (list): list dictionary mahasiswa yang sudah diproses

    Return:
        None
    """
    garis = "+" + "-" * 5 + "+" + "-" * 22 + "+" + "-" * 13 \
        + "+" + "-" * 13 + "+" + "-" * 7 + "+"
    print(garis)
    print(f"| {'No':<3} | {'Nama':<20} | {'NIM':<11} "
          f"| {'Nilai Akhir':>11} | {'Grade':^5} |")
    print(garis)
    for nomor, mhs in enumerate(daftar, start=1):
        print(f"| {nomor:<3} | {mhs['nama']:<20} | {mhs['nim']:<11} "
              f"| {mhs['nilai_akhir']:>11.2f} | {mhs['grade']:^5} |")
    print(garis)


def cetak_info(judul: str, mhs: dict) -> None:
    """Mencetak informasi lengkap satu mahasiswa

    Parameter:
        judul (str): judul yang ditampilkan
        mhs (dict): data mahasiswa.

    Return:
        None
    """
    print(f"\n{judul}")
    print(f"  Nama        : {mhs['nama']}")
    print(f"  NIM         : {mhs['nim']}")
    print(f"  Nilai Akhir : {mhs['nilai_akhir']:.2f}")
    print(f"  Grade       : {mhs['grade']}")


def main() -> None:
    """Menjalankan program pengelolaan nilai mahasiswa"""
    proses_data(DATA_MAHASISWA)

    print("=== DATA NILAI MAHASISWA ===")
    cetak_tabel(DATA_MAHASISWA)

    tertinggi = max(DATA_MAHASISWA, key=lambda m: m["nilai_akhir"])
    terendah = min(DATA_MAHASISWA, key=lambda m: m["nilai_akhir"])

    cetak_info("Mahasiswa dengan nilai akhir TERTINGGI:", tertinggi)
    cetak_info("Mahasiswa dengan nilai akhir TERENDAH:", terendah)


if __name__ == "__main__":
    main()
