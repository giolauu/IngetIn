import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Interceptor request: sisipkan Supabase JWT token
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor response: jika 401 Unauthorized, otomatis signOut dan redirect ke login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
