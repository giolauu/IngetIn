import { useEffect, useState, useMemo, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderFormModal from '../components/reminders/ReminderFormModal';
import DoneModal from '../components/reminders/DoneModal';
import DeleteModal from '../components/reminders/DeleteModal';
import HistoryModal from '../components/reminders/HistoryModal';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  markReminderDone,
} from '../api/reminders';
import { getReminderStatus } from '../utils/date';
import { CATEGORIES } from '../utils/categories';
import {
  Search,
  RotateCcw,
  PlusCircle,
  CalendarDays,
  FileQuestion,
} from 'lucide-react';

export default function AllReminders() {
  const { showToast } = useToast();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);

  const [doneModalReminder, setDoneModalReminder] = useState(null);
  const [submittingDone, setSubmittingDone] = useState(false);

  const [deleteModalReminder, setDeleteModalReminder] = useState(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [historyModalReminder, setHistoryModalReminder] = useState(null);

  const loadReminders = useCallback(async () => {
    try {
      setError('');
      const data = await getReminders();
      setReminders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat pengingat');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getReminders()
      .then((data) => {
        if (isMounted) {
          setReminders(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Gagal memuat pengingat');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter logika di frontend
  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      // 1. Search Query (judul)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Kategori Filter
      if (categoryFilter !== 'all') {
        if ((item.category || 'tagihan').toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }

      // 3. Status Filter (aktif / terlambat / selesai)
      if (statusFilter !== 'all') {
        const itemStatus = getReminderStatus(item); // 'terlambat' | 'minggu-ini' | 'akan-datang' | 'selesai'
        if (statusFilter === 'selesai' && itemStatus !== 'selesai') return false;
        if (statusFilter === 'terlambat' && itemStatus !== 'terlambat') return false;
        if (statusFilter === 'aktif' && itemStatus === 'selesai') return false;
      }

      // 4. Tipe Filter (sekali / bulanan)
      if (typeFilter !== 'all') {
        if (item.type !== typeFilter) return false;
      }

      return true;
    });
  }, [reminders, searchQuery, categoryFilter, statusFilter, typeFilter]);

  // Reset filter
  function handleResetFilter() {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  }

  const isFiltered =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all';

  // Handler: Tambah / Edit
  function handleOpenAdd() {
    setEditingReminder(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(reminder) {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(payload) {
    setSubmittingForm(true);
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, payload);
        showToast('Pengingat berhasil diperbarui!', 'success');
      } else {
        await createReminder(payload);
        showToast('Pengingat baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      setEditingReminder(null);
      await loadReminders();
    } finally {
      setSubmittingForm(false);
    }
  }

  // Handler: Selesai
  async function handleConfirmDone(id, note) {
    setSubmittingDone(true);
    try {
      await markReminderDone(id, note);
      showToast('Pengingat berhasil ditandai selesai!', 'success');
      setDoneModalReminder(null);
      await loadReminders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyelesaikan pengingat', 'error');
    } finally {
      setSubmittingDone(false);
    }
  }

  // Handler: Hapus
  async function handleConfirmDelete(id) {
    setSubmittingDelete(true);
    try {
      await deleteReminder(id);
      showToast('Pengingat berhasil dihapus', 'success');
      setDeleteModalReminder(null);
      await loadReminders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus pengingat', 'error');
    } finally {
      setSubmittingDelete(false);
    }
  }

  return (
    <AppLayout onOpenAddModal={handleOpenAdd}>
      <div className="space-y-6">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <CalendarDays className="w-6 h-6 text-indigo-600" />
              Semua Pengingat
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Telusuri dan kelola seluruh jadwal dan tagihan yang terdaftar ({reminders.length} total)
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={handleOpenAdd}
          >
            Tambah Pengingat
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
          {/* Baris Pencarian */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul pengingat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Baris Dropdown Filter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Filter Kategori */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="terlambat">Terlambat</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            {/* Filter Tipe */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tipe
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">Semua Tipe</option>
                <option value="sekali">Sekali</option>
                <option value="bulanan">Bulanan</option>
              </select>
            </div>

            {/* Tombol Reset */}
            <div className="flex flex-col justify-end">
              <Button
                variant="outline"
                size="md"
                icon={RotateCcw}
                onClick={handleResetFilter}
                disabled={!isFiltered}
                className="w-full text-xs sm:text-sm py-2"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium">Memuat pengingat...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
            <p className="text-sm font-semibold text-red-700">Terjadi kesalahan: {error}</p>
            <Button variant="outline" size="sm" onClick={loadReminders}>
              Coba Lagi
            </Button>
          </div>
        ) : filteredReminders.length === 0 ? (
          <EmptyState
            title={isFiltered ? 'Pengingat tidak ditemukan' : 'Belum ada pengingat'}
            description={
              isFiltered
                ? 'Tidak ada pengingat yang cocok dengan kriteria filter atau pencarian Anda. Coba atur ulang filter.'
                : 'Belum ada jadwal yang disimpan. Mulai buat pengingat sekarang.'
            }
            actionLabel={isFiltered ? 'Atur Ulang Filter' : 'Tambah Pengingat Baru'}
            onAction={isFiltered ? handleResetFilter : handleOpenAdd}
            icon={isFiltered ? FileQuestion : CalendarDays}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Menampilkan {filteredReminders.length} dari {reminders.length} pengingat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onMarkDone={(r) => setDoneModalReminder(r)}
                  onEdit={handleOpenEdit}
                  onDelete={(r) => setDeleteModalReminder(r)}
                  onViewLogs={(r) => setHistoryModalReminder(r)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReminderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingReminder}
        loading={submittingForm}
      />

      <DoneModal
        isOpen={Boolean(doneModalReminder)}
        onClose={() => setDoneModalReminder(null)}
        reminder={doneModalReminder}
        onConfirm={handleConfirmDone}
        loading={submittingDone}
      />

      <DeleteModal
        isOpen={Boolean(deleteModalReminder)}
        onClose={() => setDeleteModalReminder(null)}
        reminder={deleteModalReminder}
        onConfirm={handleConfirmDelete}
        loading={submittingDelete}
      />

      <HistoryModal
        isOpen={Boolean(historyModalReminder)}
        onClose={() => setHistoryModalReminder(null)}
        reminder={historyModalReminder}
      />
    </AppLayout>
  );
}
