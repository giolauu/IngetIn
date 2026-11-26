import { useMemo } from 'react';
import dayjs, { getReminderStatus } from '../../utils/date';
import { formatRupiah } from '../../utils/currency';
import {
  AlertTriangle,
  Clock,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

export default function SummaryCards({ reminders = [] }) {
  const summary = useMemo(() => {
    let overdueCount = 0;
    let upcoming7DaysCount = 0;
    let completedCount = 0;
    let totalActiveThisMonth = 0;

    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    reminders.forEach((r) => {
      const status = getReminderStatus(r);
      const isCompleted = r.status === 'selesai';

      if (status === 'terlambat') overdueCount += 1;
      if (status === 'minggu-ini') upcoming7DaysCount += 1;
      if (isCompleted) completedCount += 1;

      // Hitung total tagihan aktif bulan ini
      if (!isCompleted) {
        const due = dayjs(r.due_date);
        if (due.month() === currentMonth && due.year() === currentYear) {
          const val = Number(r.amount);
          if (!Number.isNaN(val) && val > 0) {
            totalActiveThisMonth += val;
          }
        }
      }
    });

    return {
      overdueCount,
      upcoming7DaysCount,
      completedCount,
      totalActiveThisMonth,
    };
  }, [reminders]);

  const cards = [
    {
      label: 'Terlambat',
      value: summary.overdueCount,
      subtitle: 'Perlu segera diselesaikan',
      icon: AlertTriangle,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderClass: summary.overdueCount > 0 ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-100',
    },
    {
      label: 'Jatuh Tempo ≤ 7 Hari',
      value: summary.upcoming7DaysCount,
      subtitle: 'Segera jatuh tempo minggu ini',
      icon: Clock,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      borderClass: summary.upcoming7DaysCount > 0 ? 'border-amber-200' : 'border-slate-100',
    },
    {
      label: 'Total Tagihan Bulan Ini',
      value: formatRupiah(summary.totalActiveThisMonth),
      subtitle: 'Pengingat aktif di bulan berjalan',
      icon: Wallet,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-slate-100',
      isCurrency: true,
    },
    {
      label: 'Sudah Selesai',
      value: summary.completedCount,
      subtitle: 'Tagihan & jadwal yang beres',
      icon: CheckCircle2,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-slate-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((c, index) => {
        const Icon = c.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-2xl p-5 border ${c.borderClass} shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {c.label}
              </span>
              <div className={`w-10 h-10 rounded-xl ${c.bgClass} ${c.colorClass} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className={`font-bold tracking-tight text-slate-900 ${c.isCurrency ? 'text-xl sm:text-2xl' : 'text-3xl'}`}>
                {c.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
