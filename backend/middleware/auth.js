import { supabase } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ada' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ message: 'Token tidak valid' });

  req.user = data.user;   // req.user.id dipakai untuk query
  next();
}