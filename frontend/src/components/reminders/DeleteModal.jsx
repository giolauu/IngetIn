import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  reminder,
  onConfirm,
  loading = false,
}) {
  if (!reminder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Pengingat"
      subtitle="Tindakan ini tidak dapat dibatalkan"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Apakah Anda yakin ingin menghapus?</p>
            <p className="text-red-700">
              Pengingat <strong className="text-slate-900 font-bold">"{reminder.title}"</strong> beserta seluruh riwayatnya akan dihapus permanen.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(reminder.id)}
            loading={loading}
          >
            Hapus Pengingat
          </Button>
        </div>
      </div>
    </Modal>
  );
}
