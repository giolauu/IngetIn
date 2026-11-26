import dayjs from 'dayjs';
import 'dayjs/locale/id';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('id');

/**
 * Format tanggal ke bahasa Indonesia (contoh: "5 Des 2026")
 */
export function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return dayjs(dateStr).format('D MMM YYYY');
}

/**
 * Format tanggal lengkap dengan jam (contoh: "5 Des 2026, 14:30")
 */
export function formatTanggalLengkap(dateTimeStr) {
  if (!dateTimeStr) return '-';
  return dayjs(dateTimeStr).format('D MMM YYYY, HH:mm');
}

/**
 * Mendapatkan status reminder berdasarkan status db dan tanggal jatuh tempo:
 * - 'selesai': reminder sudah ditandai selesai
 * - 'terlambat': aktif dan tanggal jatuh tempo sebelum hari ini
 * - 'minggu-ini': aktif dan jatuh tempo dalam 0 - 7 hari ke depan
 * - 'akan-datang': aktif dan jatuh tempo lebih dari 7 hari ke depan
 */
export function getReminderStatus(reminder) {
  if (!reminder) return 'akan-datang';
  if (reminder.status === 'selesai') return 'selesai';

  const today = dayjs().startOf('day');
  const dueDate = dayjs(reminder.due_date).startOf('day');
  const diffDays = dueDate.diff(today, 'day');

  if (diffDays < 0) return 'terlambat';
  if (diffDays <= 7) return 'minggu-ini';
  return 'akan-datang';
}

/**
 * Label ramah untuk sisa waktu menuju jatuh tempo
 */
export function getDaysLeftLabel(reminder) {
  if (!reminder) return '-';
  if (reminder.status === 'selesai') return 'Selesai';

  const today = dayjs().startOf('day');
  const dueDate = dayjs(reminder.due_date).startOf('day');
  const diff = dueDate.diff(today, 'day');

  if (diff < 0) {
    return `Terlambat ${Math.abs(diff)} hari`;
  }
  if (diff === 0) {
    return 'Hari ini';
  }
  if (diff === 1) {
    return 'Besok';
  }
  return `${diff} hari lagi`;
}

/**
 * Menghitung tanggal jatuh tempo periode berikutnya (+1 bulan)
 */
export function getNextMonthDate(dateStr) {
  if (!dateStr) return '';
  return dayjs(dateStr).add(1, 'month').format('YYYY-MM-DD');
}

export default dayjs;
