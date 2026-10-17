// js/DashboardApp.js
// Mengelola state aplikasi, localStorage, dan pemanggilan fetch() data eksternal
import { TaskItem } from "./TaskItem.js";

const STORAGE_KEY = "dashboard-tugas-kuliah:tasks";

const API = {
  weather: "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true",
  quote: "https://dummyjson.com/quotes/random",
  todos: "https://jsonplaceholder.typicode.com/todos?_limit=5"
};

// Kode cuaca WMO (Open-Meteo) -> teks Bahasa Indonesia
const WEATHER_LABEL = {
  0: "Cerah", 1: "Cerah berawan", 2: "Berawan sebagian", 3: "Mendung",
  45: "Berkabut", 48: "Berkabut", 51: "Gerimis ringan", 53: "Gerimis", 55: "Gerimis lebat",
  61: "Hujan ringan", 63: "Hujan", 65: "Hujan lebat",
  80: "Hujan lokal ringan", 81: "Hujan lokal", 82: "Hujan lokal lebat",
  95: "Badai petir", 96: "Badai petir dan es", 99: "Badai petir dan es"
};

export class DashboardApp {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
    this.filter = "all";

    const saved = this.load();
    this.isFirstRun = saved === null; // belum pernah ada data tersimpan
    this.tasks = saved ?? [];
  }

  // ---------- localStorage ----------
  load() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw === null) return null;
      return JSON.parse(raw).map((data) => TaskItem.fromJSON(data));
    } catch (error) {
      console.error("Gagal membaca localStorage:", error);
      return [];
    }
  }

  save() {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Gagal menyimpan ke localStorage:", error);
    }
  }

  // ---------- CRUD (state selalu dibuat baru dengan spread/map/filter) ----------
  addTask({ title, course, deadline, priority }) {
    const task = new TaskItem({ title, course: course || undefined, deadline, priority });
    this.tasks = [...this.tasks, task];
    this.save();
    return task;
  }

  updateTask(id, changes) {
    this.tasks = this.tasks.map((task) => (task.id === id ? task.with(changes) : task));
    this.save();
  }

  toggleTask(id) {
    const target = this.tasks.find((task) => task.id === id);
    if (target) this.updateTask(id, { done: !target.done });
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }

  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  // ---------- Tampilan data ----------
  setFilter(filter) {
    this.filter = filter;
  }

  get visibleTasks() {
    const byFilter = {
      all: () => true,
      pending: ({ done }) => !done,
      done: ({ done }) => done
    };

    return this.tasks
      .filter(byFilter[this.filter] ?? byFilter.all)
      .sort((a, b) => (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"));
  }

  get stats() {
    return this.tasks.reduce(
      (acc, task) => ({
        total: acc.total + 1,
        done: acc.done + (task.done ? 1 : 0),
        overdue: acc.overdue + (task.isOverdue ? 1 : 0)
      }),
      { total: 0, done: 0, overdue: 0 }
    );
  }

  // ---------- Asynchronous (async/await + fetch) ----------
  async fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Permintaan gagal (HTTP ${response.status})`);
    return response.json();
  }

  async fetchWeather() {
    const { current_weather: { temperature, windspeed, weathercode } } = await this.fetchJson(API.weather);
    return {
      temperature,
      windspeed,
      label: WEATHER_LABEL[weathercode] ?? "Kondisi tidak diketahui"
    };
  }

  async fetchQuote() {
    const { quote, author } = await this.fetchJson(API.quote);
    return { quote, author };
  }

  // Isi daftar tugas awal dari JSONPlaceholder (hanya saat pertama kali dibuka)
  async seedFromApi() {
    const todos = await this.fetchJson(API.todos);
    const msPerDay = 24 * 60 * 60 * 1000;

    const seeded = todos.map(({ title, completed }, index) => {
      const deadline = new Date(Date.now() + (index + 1) * msPerDay).toISOString().slice(0, 10);
      const judul = title.charAt(0).toUpperCase() + title.slice(1);
      return new TaskItem({ title: judul, course: "Contoh dari API", deadline, done: completed });
    });

    this.tasks = [...this.tasks, ...seeded];
    this.save();
  }
}
