import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import remindersRouter from './routes/reminders.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Tes koneksi database
app.get('/api/health', async (req, res) => {
  const { error } = await supabase.from('reminders').select('id').limit(1);
  res.json({ server: 'ok', database: error ? error.message : 'connected' });
});

app.use('/api/reminders', remindersRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server jalan di http://localhost:${process.env.PORT}`)
);