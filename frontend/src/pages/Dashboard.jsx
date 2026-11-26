import { useEffect, useState, useMemo, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SummaryCards from '../components/reminders/SummaryCards';
import ReminderGroup from '../components/reminders/ReminderGroup';
import ReminderFormModal from '../components/reminders/ReminderFormModal';
import DoneModal from '../components/reminders/DoneModal';
import DeleteModal from '../components/reminders/DeleteModal';
import HistoryModal from '../components/reminders/HistoryModal';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  markReminderDone,
} from '../api/reminders';
import { getReminderStatus } from '../utils/date';
import dayjs from '../utils/date';
import {
  AlertTriangle,
  Clock,
  CalendarDays,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  BellRing,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk form modal (tambah / edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);

  // State untuk modal aksi
  const [doneModalReminder, setDoneModalReminder] = useState(null);
  const [submittingDone, setSubmittingDone] = useState(false);

  const [deleteModalReminder, setDeleteModalReminder] = useState(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [historyModalReminder, setHistoryModalReminder] = useState(null);

  // Fungsi muat data
  const loadReminders = useCallback(async () => {
    try {
      setError('');
      const data = await getReminders();
      setReminders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat data pengingat');
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
          setError(err.response?.data?.message || err.message || 'Gagal memuat data pengingat');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Pengelompokan pengingat berdasarkan status
  const groupedReminders = useMemo(() => {
    const overdue = [];
    const thisWeek = [];
    const upcoming = [];
    const completed = [];

    reminders.forEach((r) => {
      const status = getReminderStatus(r);
      if (status === 'selesai') {
        completed.push(r);
      } else if (status === 'terlambat') {
        overdue.push(r);
      } else if (status === 'minggu-ini') {
        thisWeek.push(r);
      } else {
        upcoming.push(r);
      }
    });

    return { overdue, thisWeek, upcoming, completed };
  }, [reminders]);

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

  // Handler: Tandai Selesai
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

  const todayFormatted = dayjs().format('dddd, D MMMM YYYY');
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Teman';

  return (
    <AppLayout onOpenAddModal={handleOpenAdd}>
      <div className="space-y-7">
        {/* Header Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">
              {todayFormatted}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {userName}! 👋
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Pantau seluruh tagihan dan jadwal pentingmu agar semua urusan beres tepat waktu.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadReminders}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 focus:ring-white/40"
              title="Perbarui data"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={handleOpenAdd}
              className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-none border-none font-semibold"
            >
              Tambah Pengingat
            </Button>
          </div>
        </div>

        {/* Ringkasan Metrik / Summary Cards */}
        <SummaryCards reminders={reminders} />

        {/* Loading / Error / Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium">Memuat daftar pengingat...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
            <p className="text-sm font-semibold text-red-700">Terjadi kesalahan: {error}</p>
            <Button variant="outline" size="sm" onClick={loadReminders}>
              Coba Lagi
            </Button>
          </div>
        ) : reminders.length === 0 ? (
          <EmptyState
            title="Belum ada pengingat"
            description="Mulai catat tagihan listrik, cicilan, servis berkala, atau langganan rutinmu sekarang agar tidak ada yang terlewat."
            actionLabel="Buat Pengingat Pertama"
            onAction={handleOpenAdd}
            icon={BellRing}
          />
        ) : (
          <div className="space-y-8">
            {/* 1. Terlambat (jika ada) */}
            {groupedReminders.overdue.length > 0 && (
              <ReminderGroup
                title="Perlu Perhatian (Terlambat)"
                count={groupedReminders.overdue.length}
                icon={AlertTriangle}
                badgeColor="bg-red-100 text-red-800"
                description="Tagihan yang telah melewati batas tanggal jatuh tempo"
                reminders={groupedReminders.overdue}
                defaultOpen={true}
                onMarkDone={(r) => setDoneModalReminder(r)}
                onEdit={handleOpenEdit}
                onDelete={(r) => setDeleteModalReminder(r)}
                onViewLogs={(r) => setHistoryModalReminder(r)}
              />
            )}

            {/* 2. Minggu Ini (<= 7 hari) */}
            <ReminderGroup
              title="Jatuh Tempo Minggu Ini (≤ 7 Hari)"
              count={groupedReminders.thisWeek.length}
              icon={Clock}
              badgeColor="bg-amber-100 text-amber-800"
              description="Jadwal pembayaran dan kegiatan dalam 7 hari ke depan"
              reminders={groupedReminders.thisWeek}
              defaultOpen={true}
              emptyMessage="Hore! Tidak ada tagihan jatuh tempo dalam 7 hari ke depan."
              onMarkDone={(r) => setDoneModalReminder(r)}
              onEdit={handleOpenEdit}
              onDelete={(r) => setDeleteModalReminder(r)}
              onViewLogs={(r) => setHistoryModalReminder(r)}
            />

            {/* 3. Akan Datang (> 7 hari) */}
            <ReminderGroup
              title="Akan Datang"
              count={groupedReminders.upcoming.length}
              icon={CalendarDays}
              badgeColor="bg-indigo-100 text-indigo-800"
              description="Jadwal pengingat yang masih lebih dari 7 hari ke depan"
              reminders={groupedReminders.upcoming}
              defaultOpen={true}
              emptyMessage="Belum ada pengingat terjadwal di masa mendatang."
              onMarkDone={(r) => setDoneModalReminder(r)}
              onEdit={handleOpenEdit}
              onDelete={(r) => setDeleteModalReminder(r)}
              onViewLogs={(r) => setHistoryModalReminder(r)}
            />

            {/* 4. Selesai (Collapsible) */}
            <ReminderGroup
              title="Sudah Selesai"
              count={groupedReminders.completed.length}
              icon={CheckCircle2}
              badgeColor="bg-emerald-100 text-emerald-800"
              description="Daftar pengingat sekali bayar yang telah diselesaikan"
              reminders={groupedReminders.completed}
              defaultOpen={false}
              collapsible={true}
              emptyMessage="Belum ada pengingat yang ditandai selesai."
              onMarkDone={(r) => setDoneModalReminder(r)}
              onEdit={handleOpenEdit}
              onDelete={(r) => setDeleteModalReminder(r)}
              onViewLogs={(r) => setHistoryModalReminder(r)}
            />
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      <ReminderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingReminder}
        loading={submittingForm}
      />

      {/* Modal Tandai Selesai */}
      <DoneModal
        isOpen={Boolean(doneModalReminder)}
        onClose={() => setDoneModalReminder(null)}
        reminder={doneModalReminder}
        onConfirm={handleConfirmDone}
        loading={submittingDone}
      />

      {/* Modal Hapus */}
      <DeleteModal
        isOpen={Boolean(deleteModalReminder)}
        onClose={() => setDeleteModalReminder(null)}
        reminder={deleteModalReminder}
        onConfirm={handleConfirmDelete}
        loading={submittingDelete}
      />

      {/* Modal Riwayat */}
      <HistoryModal
        isOpen={Boolean(historyModalReminder)}
        onClose={() => setHistoryModalReminder(null)}
        reminder={historyModalReminder}
      />
    </AppLayout>
  );
}
