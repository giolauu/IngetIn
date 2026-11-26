import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatTanggal, getNextMonthDate } from '../../utils/date';
import { CheckCircle2, Repeat } from 'lucide-react';

export default function DoneModal({
  isOpen,
  onClose,
  reminder,
  onConfirm,
  loading = false,
}) {
  const [note, setNote] = useState('');
  const isMonthly = reminder?.type === 'bulanan';
  const nextDueDate = isMonthly ? getNextMonthDate(reminder.due_date) : null;

  async function handleConfirm() {
    await onConfirm(reminder.id, note.trim());
    setNote('');
  }

  if (!reminder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tandai Selesai"
      subtitle="Catat penyelesaian tagihan atau jadwal rutin ini"
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Pengingat
          </div>
          <div className="text-base font-bold text-slate-800 mt-0.5">
            {reminder.title}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Jatuh tempo saat ini: <span className="font-medium text-slate-700">{formatTanggal(reminder.due_date)}</span>
          </div>
        </div>

        {/* Info pengulangan bulanan */}
        {isMonthly ? (
          <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3 text-xs text-indigo-900 leading-relaxed">
            <Repeat className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Tipe Rutin Bulanan</p>
              <p className="mt-0.5">
                Pengingat ini akan tetap aktif dan tanggal jatuh tempo berikutnya otomatis maju ke{' '}
                <strong className="text-indigo-700 font-bold underline">
                  {formatTanggal(nextDueDate)}
                </strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengingat tipe sekali selesai akan dipindahkan ke daftar Selesai.</span>
          </div>
        )}

        {/* Catatan opsional */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Catatan Tambahan <span className="text-slate-400 font-normal lowercase">(opsional)</span>
          </label>
          <textarea
            rows="3"
            placeholder="Contoh: Dibayar lewat BCA Mobile, No Ref: #98124, Ganti oli gardan sekalian"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Catatan akan disimpan ke dalam riwayat penyelesaian.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            loading={loading}
            icon={CheckCircle2}
          >
            Konfirmasi Selesai
          </Button>
        </div>
      </div>
    </Modal>
  );
}
