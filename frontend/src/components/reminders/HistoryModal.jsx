import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getReminderLogs } from '../../api/reminders';
import { formatTanggalLengkap } from '../../utils/date';
import { History, FileText, CalendarCheck, AlertCircle } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  reminder,
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !reminder?.id) {
      return;
    }

    let isMounted = true;
    getReminderLogs(reminder.id)
      .then((data) => {
        if (isMounted) {
          setLogs(data || []);
          setError('');
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Gagal memuat riwayat');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, reminder?.id]);

  if (!reminder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Riwayat Penyelesaian"
      subtitle={`Catatan aktivitas untuk "${reminder.title}"`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Spinner size="md" />
            <span className="text-xs">Memuat riwayat...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
            <div className="w-10 h-10 rounded-xl bg-slate-200/60 text-slate-500 flex items-center justify-center mx-auto mb-2">
              <History className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Belum ada riwayat</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Pengingat ini belum pernah ditandai selesai sebelumnya.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {logs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700">
                  <CalendarCheck className="w-2.5 h-2.5" />
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-3.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-700">
                      Diselesaikan
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatTanggalLengkap(log.done_at)}
                    </span>
                  </div>

                  {log.note ? (
                    <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed whitespace-pre-wrap">{log.note}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block mt-1">
                      Tanpa catatan
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
