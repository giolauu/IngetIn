import { Router } from 'express';
import dayjs from 'dayjs';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const FIELDS = ['title', 'category', 'amount', 'due_date', 'type'];

// Ambil hanya field yang boleh diisi user
function pickFields(body) {
  const data = {};
  for (const key of FIELDS) if (body[key] !== undefined) data[key] = body[key];
  return data;
}

// GET /api/reminders → semua pengingat milik user
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', req.user.id)
    .order('due_date', { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// POST /api/reminders → tambah pengingat
router.post('/', async (req, res) => {
  const payload = pickFields(req.body);
  if (!payload.title || !payload.due_date) {
    return res.status(400).json({ message: 'Judul dan tanggal jatuh tempo wajib diisi' });
  }

  const { data, error } = await supabase
    .from('reminders')
    .insert({ ...payload, user_id: req.user.id })
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data);
});

// PUT /api/reminders/:id → edit pengingat
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('reminders')
    .update(pickFields(req.body))
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ message: error.message });
  if (!data) return res.status(404).json({ message: 'Pengingat tidak ditemukan' });
  res.json(data);
});

// DELETE /api/reminders/:id → hapus pengingat
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ message: error.message });
  if (!data) return res.status(404).json({ message: 'Pengingat tidak ditemukan' });
  res.json({ message: 'Pengingat dihapus' });
});

// PATCH /api/reminders/:id/done → tandai sudah dibayar/selesai
router.patch('/:id/done', async (req, res) => {
  const { data: reminder, error: findError } = await supabase
    .from('reminders')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (findError) return res.status(500).json({ message: findError.message });
  if (!reminder) return res.status(404).json({ message: 'Pengingat tidak ditemukan' });

  // 1. Simpan ke riwayat
  const { error: logError } = await supabase
    .from('reminder_logs')
    .insert({ reminder_id: reminder.id, note: req.body?.note ?? null });
  if (logError) return res.status(500).json({ message: logError.message });

  // 2. Bulanan → geser ke bulan depan, sekali → status selesai
  const update =
    reminder.type === 'bulanan'
      ? { due_date: dayjs(reminder.due_date).add(1, 'month').format('YYYY-MM-DD') }
      : { status: 'selesai' };

  const { data, error } = await supabase
    .from('reminders')
    .update(update)
    .eq('id', reminder.id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// GET /api/reminders/:id/logs → riwayat satu pengingat
router.get('/:id/logs', async (req, res) => {
  const { data: reminder } = await supabase
    .from('reminders')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (!reminder) return res.status(404).json({ message: 'Pengingat tidak ditemukan' });

  const { data, error } = await supabase
    .from('reminder_logs')
    .select('*')
    .eq('reminder_id', reminder.id)
    .order('done_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

export default router;