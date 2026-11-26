import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CATEGORIES } from '../../utils/categories';
import { AlertCircle } from 'lucide-react';

function ReminderFormInner({
  initialData,
  onClose,
  onSubmit,
  loading,
}) {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState((initialData?.category || 'tagihan').toLowerCase());
  const [amount, setAmount] = useState(
    initialData?.amount !== null && initialData?.amount !== undefined ? initialData.amount : ''
  );
  const [dueDate, setDueDate] = useState(
    initialData?.due_date || new Date().toISOString().split('T')[0]
  );
  const [type, setType] = useState(initialData?.type || 'sekali');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Judul pengingat wajib diisi');
      return;
    }
    if (!dueDate) {
      setError('Tanggal jatuh tempo wajib diisi');
      return;
    }

    const payload = {
      title: title.trim(),
      category: category.toLowerCase(),
      amount: amount === '' ? null : Number(amount),
      due_date: dueDate,
      type,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan pengingat');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Judul */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Judul Pengingat <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Contoh: Tagihan Listrik PLN, Cicilan Motor, Netflix"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Kategori & Tipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tipe Pengulangan
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('sekali')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                type === 'sekali'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sekali Selesai
            </button>
            <button
              type="button"
              onClick={() => setType('bulanan')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                type === 'bulanan'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Rutin Bulanan
            </button>
          </div>
        </div>
      </div>

      {/* Nominal & Tanggal Jatuh Tempo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nominal (Rp) <span className="text-slate-400 font-normal lowercase">(opsional)</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tanggal Jatuh Tempo <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          />
        </div>
      </div>

      {type === 'bulanan' && (
        <p className="text-xs text-indigo-600 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 leading-relaxed">
          ℹ️ Pengingat bulanan akan otomatis memajukan tanggal jatuh tempo ke 1 bulan berikutnya setiap kali Anda menandainya selesai.
        </p>
      )}

      {/* Footer Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {isEditing ? 'Simpan Perubahan' : 'Tambah Pengingat'}
        </Button>
      </div>
    </form>
  );
}

export default function ReminderFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Pengingat' : 'Tambah Pengingat Baru'}
      subtitle={
        isEditing
          ? 'Perbarui rincian jadwal atau tagihan'
          : 'Catat tagihan atau jadwal rutin agar tidak terlewat'
      }
    >
      {isOpen && (
        <ReminderFormInner
          key={initialData?.id || 'create-new'}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}
    </Modal>
  );
}
