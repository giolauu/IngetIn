import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import remindersRouter from './routes/reminders.js';

const app = express();

// CORS: izinkan localhost (development) dan domain frontend Vercel (production)
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Halaman root, supaya URL backend tidak menampilkan "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ app: 'IngatIn API', status: 'running' });
});

// Tes koneksi database
app.get('/api/health', async (req, res) => {
  const { error } = await supabase.from('reminders').select('id').limit(1);
  res.json({ server: 'ok', database: error ? error.message : 'connected' });
});

app.use('/api/reminders', remindersRouter);

// app.listen hanya dijalankan di laptop. Di Vercel, app di-export lalu dijalankan sebagai Vercel Function
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
}

export default app;