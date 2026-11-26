import api from './axios';

/**
 * Mengambil semua pengingat milik user yang sedang login (urut due_date ascending)
 */
export async function getReminders() {
  const res = await api.get('/reminders');
  return res.data;
}

/**
 * Menambahkan pengingat baru
 * @param {Object} payload { title, due_date, category, amount, type }
 */
export async function createReminder(payload) {
  const res = await api.post('/reminders', payload);
  return res.data;
}

/**
 * Memperbarui pengingat
 * @param {string} id ID reminder (uuid)
 * @param {Object} payload { title, due_date, category, amount, type }
 */
export async function updateReminder(id, payload) {
  const res = await api.put(`/reminders/${id}`, payload);
  return res.data;
}

/**
 * Menghapus pengingat berdasarkan ID
 * @param {string} id ID reminder (uuid)
 */
export async function deleteReminder(id) {
  const res = await api.delete(`/reminders/${id}`);
  return res.data;
}

/**
 * Menandai pengingat sudah dibayar / selesai
 * @param {string} id ID reminder (uuid)
 * @param {string} [note] Catatan opsional
 */
export async function markReminderDone(id, note) {
  const res = await api.patch(`/reminders/${id}/done`, { note: note || null });
  return res.data;
}

/**
 * Mengambil riwayat log penyelesaian satu pengingat
 * @param {string} id ID reminder (uuid)
 */
export async function getReminderLogs(id) {
  const res = await api.get(`/reminders/${id}/logs`);
  return res.data;
}
