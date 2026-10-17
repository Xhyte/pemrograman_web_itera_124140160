// ===== Konstanta =====
const STORAGE_KEY = "miniPosKeranjang";
const MIN_HARGA = 500;
const BATAS_DISKON = 50000;
const PERSEN_DISKON = 0.1;
const KODE_PROMO = "HEMAT10";

// ===== State =====
let keranjang = [];

// ===== Elemen DOM =====
const formBarang = document.getElementById("form-barang");
const inputNama = document.getElementById("nama-barang");
const inputHarga = document.getElementById("harga-barang");
const inputQty = document.getElementById("qty-barang");
const errorNama = document.getElementById("error-nama");
const errorHarga = document.getElementById("error-harga");
const errorQty = document.getElementById("error-qty");

const tabelKeranjang = document.getElementById("tabel-keranjang");
const pesanKosong = document.getElementById("keranjang-kosong");

const elTotalBelanja = document.getElementById("total-belanja");
const inputPromo = document.getElementById("kode-promo");
const infoPromo = document.getElementById("info-promo");
const labelDiskon = document.getElementById("label-diskon");
const elNominalDiskon = document.getElementById("nominal-diskon");
const elTotalAkhir = document.getElementById("total-akhir");
const inputBayar = document.getElementById("uang-bayar");
const elKembalian = document.getElementById("kembalian");
const elStatusBayar = document.getElementById("status-bayar");
const btnReset = document.getElementById("btn-reset");

// ===== Utilitas =====
function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function tampilkanError(input, elError, pesan) {
  elError.textContent = pesan;
  input.classList.toggle("invalid", pesan !== "");
}

// ===== Validasi =====
function validasiNama(nama) {
  if (nama.trim() === "") return "Nama barang wajib diisi.";
  if (nama.trim().length < 3) return "Nama barang minimal 3 karakter.";
  return "";
}

function validasiHarga(nilai) {
  if (nilai.trim() === "") return "Harga satuan wajib diisi.";
  const harga = Number(nilai);
  if (isNaN(harga)) return "Harga satuan harus berupa angka.";
  if (harga <= 0) return "Harga satuan harus berupa angka positif.";
  if (harga < MIN_HARGA) return "Harga satuan minimal Rp 500.";
  return "";
}

function validasiQty(nilai) {
  if (nilai.trim() === "") return "Jumlah wajib diisi.";
  const qty = Number(nilai);
  if (isNaN(qty)) return "Jumlah harus berupa angka.";
  if (!Number.isInteger(qty)) return "Jumlah harus berupa bilangan bulat.";
  if (qty < 1) return "Jumlah minimal 1.";
  return "";
}

// ===== LocalStorage =====
function simpanKeranjang() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
}

function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    keranjang = Array.isArray(data) ? data : [];
  } catch (e) {
    keranjang = [];
  }
}

// ===== Manajemen Keranjang =====
function tambahBarang(nama, harga, qty) {
  keranjang.push({ nama: nama.trim(), harga: harga, qty: qty });
  simpanKeranjang();
  renderKeranjang();
  hitungTotal();
}

function hapusBarang(index) {
  keranjang.splice(index, 1);
  simpanKeranjang();
  renderKeranjang();
  hitungTotal();
}

function resetTransaksi() {
  if (keranjang.length > 0 && !confirm("Kosongkan keranjang dan mulai transaksi baru?")) {
    return;
  }
  keranjang = [];
  localStorage.removeItem(STORAGE_KEY);
  inputPromo.value = "";
  inputBayar.value = "";
  renderKeranjang();
  hitungTotal();
}

function renderKeranjang() {
  tabelKeranjang.innerHTML = "";

  keranjang.forEach(function (item, index) {
    const tr = document.createElement("tr");

    const kolom = [
      index + 1,
      item.nama,
      formatRupiah(item.harga),
      item.qty,
      formatRupiah(item.harga * item.qty),
    ];

    kolom.forEach(function (isi, i) {
      const td = document.createElement("td");
      td.textContent = isi; // textContent mencegah injeksi HTML
      if (i >= 2) td.className = "num";
      tr.appendChild(td);
    });

    const tdAksi = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-hapus";
    btn.textContent = "Hapus";
    btn.addEventListener("click", function () {
      hapusBarang(index);
    });
    tdAksi.appendChild(btn);
    tr.appendChild(tdAksi);

    tabelKeranjang.appendChild(tr);
  });

  pesanKosong.style.display = keranjang.length === 0 ? "block" : "none";
}

// ===== Kalkulator =====
function hitungTotalBelanja() {
  return keranjang.reduce(function (jumlah, item) {
    return jumlah + item.harga * item.qty;
  }, 0);
}

function hitungTotal() {
  const total = hitungTotalBelanja();
  const kode = inputPromo.value.trim().toUpperCase();
  const promoValid = kode === KODE_PROMO;
  const diskonOtomatis = total >= BATAS_DISKON;

  // Info kode promo
  infoPromo.className = "info";
  if (kode === "") {
    infoPromo.textContent = "Diskon 10% otomatis jika belanja minimal Rp 50.000.";
  } else if (promoValid) {
    infoPromo.textContent = "Kode promo HEMAT10 berhasil dipakai.";
    infoPromo.classList.add("ok");
  } else {
    infoPromo.textContent = "Kode promo tidak dikenal.";
    infoPromo.classList.add("bad");
  }

  // Diskon 10% (otomatis atau kode promo), tidak ditumpuk
  let diskon = 0;
  let keterangan = "";
  if (total > 0 && (diskonOtomatis || promoValid)) {
    diskon = total * PERSEN_DISKON;
    keterangan = promoValid ? "(10% - HEMAT10)" : "(10% - belanja ≥ Rp 50.000)";
  }

  const totalAkhir = total - diskon;

  elTotalBelanja.textContent = formatRupiah(total);
  labelDiskon.textContent = keterangan;
  elNominalDiskon.textContent = "- " + formatRupiah(diskon);
  elTotalAkhir.textContent = formatRupiah(totalAkhir);

  hitungKembalian(totalAkhir);
}

function hitungKembalian(totalAkhir) {
  if (totalAkhir === undefined) {
    // dipanggil dari event input uang bayar
    hitungTotal();
    return;
  }

  elStatusBayar.className = "status";
  const teks = inputBayar.value.trim();

  if (teks === "") {
    elKembalian.textContent = formatRupiah(0);
    elStatusBayar.textContent = "";
    return;
  }

  const bayar = Number(teks);
  if (isNaN(bayar) || bayar < 0) {
    elKembalian.textContent = formatRupiah(0);
    elStatusBayar.textContent = "Nominal uang bayar tidak valid.";
    elStatusBayar.classList.add("bad");
    return;
  }

  if (totalAkhir === 0) {
    elKembalian.textContent = formatRupiah(0);
    elStatusBayar.textContent = "Keranjang masih kosong.";
    elStatusBayar.classList.add("bad");
    return;
  }

  if (bayar < totalAkhir) {
    elKembalian.textContent = formatRupiah(0);
    elStatusBayar.textContent = "Uang belum mencukupi, kurang " + formatRupiah(totalAkhir - bayar) + ".";
    elStatusBayar.classList.add("bad");
  } else {
    elKembalian.textContent = formatRupiah(bayar - totalAkhir);
    elStatusBayar.textContent = "Pembayaran mencukupi.";
    elStatusBayar.classList.add("ok");
  }
}

// ===== Event Listener =====
formBarang.addEventListener("submit", function (e) {
  e.preventDefault();

  const pesanNama = validasiNama(inputNama.value);
  const pesanHarga = validasiHarga(inputHarga.value);
  const pesanQty = validasiQty(inputQty.value);

  tampilkanError(inputNama, errorNama, pesanNama);
  tampilkanError(inputHarga, errorHarga, pesanHarga);
  tampilkanError(inputQty, errorQty, pesanQty);

  // Cegah barang masuk keranjang jika ada yang tidak valid
  if (pesanNama || pesanHarga || pesanQty) return;

  tambahBarang(inputNama.value, Number(inputHarga.value), Number(inputQty.value));
  formBarang.reset();
  inputNama.focus();
});

// Hapus pesan error saat pengguna mulai memperbaiki input
inputNama.addEventListener("input", function () { tampilkanError(inputNama, errorNama, ""); });
inputHarga.addEventListener("input", function () { tampilkanError(inputHarga, errorHarga, ""); });
inputQty.addEventListener("input", function () { tampilkanError(inputQty, errorQty, ""); });

inputPromo.addEventListener("input", hitungTotal);
inputBayar.addEventListener("input", function () { hitungKembalian(); });
btnReset.addEventListener("click", resetTransaksi);

// ===== Inisialisasi =====
muatKeranjang();
renderKeranjang();
hitungTotal();