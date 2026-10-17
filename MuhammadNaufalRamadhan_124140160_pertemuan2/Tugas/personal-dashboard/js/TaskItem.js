// js/TaskItem.js
// Model data untuk satu item tugas kuliah

export class TaskItem {
  // Default parameters + destructuring langsung di parameter constructor
  constructor({
    id = TaskItem.createId(),
    title,
    course = "Umum",
    deadline = "",
    priority = "sedang",
    done = false,
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.title = title;
    this.course = course;
    this.deadline = deadline;
    this.priority = priority;
    this.done = done;
    this.createdAt = createdAt;
  }

  static createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  static fromJSON(data) {
    return new TaskItem(data);
  }

  // Tugas terlambat: belum selesai dan lewat dari akhir hari deadline
  get isOverdue() {
    return !this.done && Boolean(this.deadline) && new Date(`${this.deadline}T23:59:59`) < new Date();
  }

  // Selisih hari menuju deadline (null jika tidak ada deadline)
  get daysLeft() {
    if (!this.deadline) return null;
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((new Date(`${this.deadline}T23:59:59`) - new Date()) / msPerDay);
  }

  // Immutable update: mengembalikan TaskItem baru, objek lama tidak diubah
  with(changes) {
    return new TaskItem({ ...this.toJSON(), ...changes });
  }

  toJSON() {
    const { id, title, course, deadline, priority, done, createdAt } = this;
    return { id, title, course, deadline, priority, done, createdAt };
  }
}
