import { formatTanggal, getReminderStatus, getDaysLeftLabel } from '../../utils/date';
import { formatRupiah } from '../../utils/currency';
import { getCategoryMeta } from '../../utils/categories';
import CategoryIcon from '../ui/CategoryIcon';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  History,
  Repeat,
  CalendarCheck,
} from 'lucide-react';

export default function ReminderCard({
  reminder,
  onMarkDone,
  onEdit,
  onDelete,
  onViewLogs,
}) {
  const status = getReminderStatus(reminder);
  const categoryMeta = getCategoryMeta(reminder.category);
  const daysLeftLabel = getDaysLeftLabel(reminder);
  const isDone = reminder.status === 'selesai';

  // Penentuan styling status
  const statusStyles = {
    terlambat: {
      cardBorder: 'border-red-300 bg-red-50/20 hover:border-red-400 shadow-xs shadow-red-100',
      badgeVariant: 'terlambat',
      accentDot: 'bg-red-500',
    },
    'minggu-ini': {
      cardBorder: 'border-amber-300 bg-amber-50/20 hover:border-amber-400 shadow-xs shadow-amber-100',
      badgeVariant: 'minggu-ini',
      accentDot: 'bg-amber-500',
    },
    'akan-datang': {
      cardBorder: 'border-slate-200/90 bg-white hover:border-indigo-300 shadow-xs',
      badgeVariant: 'akan-datang',
      accentDot: 'bg-indigo-500',
    },
    selesai: {
      cardBorder: 'border-slate-200 bg-slate-50/70 opacity-80 hover:opacity-100',
      badgeVariant: 'selesai',
      accentDot: 'bg-emerald-500',
    },
  };

  const currentStyle = statusStyles[status] || statusStyles['akan-datang'];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${currentStyle.cardBorder}`}
    >
      <div>
        {/* Header Kartu: Kategori & Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${categoryMeta.badgeClass}`}
            >
              <CategoryIcon name={categoryMeta.iconName} className="w-3.5 h-3.5" />
              {categoryMeta.label}
            </span>

            {/* Type badge */}
            <Badge variant={reminder.type === 'bulanan' ? 'bulanan' : 'sekali'}>
              {reminder.type === 'bulanan' ? (
                <>
                  <Repeat className="w-3 h-3" />
                  Bulanan
                </>
              ) : (
                'Sekali'
              )}
            </Badge>
          </div>

          {/* Sisa Waktu / Status Badge */}
          <Badge variant={currentStyle.badgeVariant} size="sm">
            <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.accentDot}`} />
            {daysLeftLabel}
          </Badge>
        </div>

        {/* Judul Pengingat */}
        <h4
          className={`text-base font-semibold text-slate-900 leading-snug mb-1 line-clamp-2 ${
            isDone ? 'line-through text-slate-500' : ''
          }`}
          title={reminder.title}
        >
          {reminder.title}
        </h4>

        {/* Nominal Tagihan */}
        <div className="text-lg font-bold text-slate-800 mb-3">
          {formatRupiah(reminder.amount)}
        </div>

        {/* Info Jatuh Tempo */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Jatuh tempo:</span>
          <span className="font-medium text-slate-700">
            {formatTanggal(reminder.due_date)}
          </span>
        </div>
      </div>

      {/* Aksi / Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        {/* Tombol Utama: Sudah Bayar/Selesai jika belum selesai */}
        {!isDone ? (
          <Button
            variant="success"
            size="sm"
            icon={Check}
            onClick={() => onMarkDone(reminder)}
            className="flex-1"
          >
            Selesai
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 py-1.5">
            <CalendarCheck className="w-4 h-4" />
            <span>Telah diselesaikan</span>
          </div>
        )}

        {/* Secondary Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewLogs(reminder)}
            title="Lihat Riwayat"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(reminder)}
            title="Edit Pengingat"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(reminder)}
            title="Hapus Pengingat"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
