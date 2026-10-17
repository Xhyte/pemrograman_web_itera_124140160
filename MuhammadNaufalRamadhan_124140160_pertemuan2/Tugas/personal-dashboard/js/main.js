// js/main.js
// Pengendali antarmuka: render DOM, event handler, dan memanggil DashboardApp
import { DashboardApp } from "./DashboardApp.js";

const app = new DashboardApp();
const $ = (selector) => document.querySelector(selector);

let editingId = null; // id tugas yang sedang diedit (null = mode tambah)

// ---------- Helper ----------
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });

const deadlineLabel = ({ deadline, done, isOverdue, daysLeft }) => {
  if (done) return `<span class="badge badge--done">Selesai</span>`;
  if (!deadline) return "Tanpa deadline";
  if (isOverdue) return `<span class="badge badge--overdue">Terlambat</span> · ${formatDate(deadline)}`;
  if (daysLeft <= 2) return `<span class="badge badge--soon">${daysLeft <= 1 ? "Hari ini/besok" : `${daysLeft} hari lagi`}</span> · ${formatDate(deadline)}`;
  return `${daysLeft} hari lagi · ${formatDate(deadline)}`;
};

// ---------- Render dengan template literals ----------
const renderTask = (task) => {
  const { id, title, course, priority, done } = task;
  return `
    <li class="task task--${priority} ${done ? "task--done" : ""}">
      <input type="checkbox" data-action="toggle" data-id="${id}" ${done ? "checked" : ""}
        aria-label="Tandai selesai: ${escapeHtml(title)}">
      <div>
        <div class="task__title">${escapeHtml(title)}</div>
        <div class="task__meta">${escapeHtml(course)} · Prioritas ${priority} · ${deadlineLabel(task)}</div>
      </div>
      <div class="task__actions">
        <button type="button" class="mini" data-action="edit" data-id="${id}">Edit</button>
        <button type="button" class="mini mini--danger" data-action="delete" data-id="${id}">Hapus</button>
      </div>
    </li>
  `;
};

const render = () => {
  const { visibleTasks, stats: { total, done, overdue } } = app;

  $("#taskList").innerHTML = visibleTasks.length
    ? visibleTasks.map(renderTask).join("")
    : `<li class="empty">Belum ada tugas di tampilan ini. Tambahkan lewat formulir.</li>`;

  $("#stats").textContent = `${total} tugas · ${done} selesai · ${overdue} terlambat`;

  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === app.filter);
  });
};

// ---------- Form tambah / edit ----------
const form = $("#taskForm");

const showError = (message = "") => {
  const el = $("#formError");
  el.textContent = message;
  el.hidden = !message;
};

const resetForm = () => {
  editingId = null;
  form.reset();
  $("#formTitle").textContent = "Tambah tugas";
  $("#submitBtn").textContent = "Tambah tugas";
  $("#cancelBtn").hidden = true;
  showError();
};

const startEdit = (id) => {
  const task = app.getTask(id);
  if (!task) return;

  const { title, course, deadline, priority } = task;
  const { elements } = form; // form.title bentrok dengan atribut title milik elemen, jadi pakai elements
  elements.title.value = title;
  elements.course.value = course;
  elements.deadline.value = deadline;
  elements.priority.value = priority;

  editingId = id;
  $("#formTitle").textContent = "Edit tugas";
  $("#submitBtn").textContent = "Simpan perubahan";
  $("#cancelBtn").hidden = false;
  elements.title.focus();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { title, course, deadline, priority } = Object.fromEntries(new FormData(form));

  if (!title.trim()) {
    showError("Judul tugas wajib diisi.");
    return;
  }

  const data = { title: title.trim(), course: course.trim() || "Umum", deadline, priority };
  if (editingId) {
    app.updateTask(editingId, data);
  } else {
    app.addTask(data);
  }

  resetForm();
  render();
});

$("#cancelBtn").addEventListener("click", resetForm);

// ---------- Aksi pada daftar (event delegation) ----------
$("#taskList").addEventListener("click", ({ target }) => {
  const { action, id } = target.dataset;
  if (!action) return;

  if (action === "edit") startEdit(id);
  if (action === "delete" && confirm("Hapus tugas ini?")) {
    if (editingId === id) resetForm();
    app.deleteTask(id);
    render();
  }
});

$("#taskList").addEventListener("change", ({ target }) => {
  if (target.dataset.action === "toggle") {
    app.toggleTask(target.dataset.id);
    render();
  }
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    app.setFilter(button.dataset.filter);
    render();
  });
});

// ---------- Data eksternal (async/await) ----------
async function loadWeather() {
  const el = $("#weatherText");
  try {
    const { temperature, windspeed, label } = await app.fetchWeather();
    el.textContent = `${temperature}°C · ${label} · angin ${windspeed} km/j`;
  } catch (error) {
    el.textContent = "Cuaca belum bisa dimuat. Periksa koneksi internet.";
  }
}

async function loadQuote() {
  const el = $("#quoteText");
  el.textContent = "Memuat kutipan...";
  try {
    const { quote, author } = await app.fetchQuote();
    el.textContent = `“${quote}” — ${author}`;
  } catch (error) {
    el.textContent = "Kutipan belum bisa dimuat. Periksa koneksi internet.";
  }
}

async function seedIfFirstRun() {
  if (!app.isFirstRun) return;
  $("#status").textContent = "Mengambil contoh tugas awal...";
  try {
    await app.seedFromApi();
    $("#status").textContent = "Contoh tugas awal dimuat dari API. Silakan edit atau hapus.";
  } catch (error) {
    app.save(); // tandai sudah pernah dibuka walau tanpa data awal
    $("#status").textContent = "Contoh tugas awal tidak bisa dimuat (offline). Mulai dengan menambah tugas sendiri.";
  }
  render();
}

// ---------- Inisialisasi ----------
$("#today").textContent = new Date().toLocaleDateString("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});
$("#quoteBtn").addEventListener("click", loadQuote);

render();
seedIfFirstRun();
loadWeather();
loadQuote();
