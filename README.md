# IngatIn — Web App Pengingat Tagihan & Jadwal Rutin

> **Tema:** *Tech for Convenience – Make Daily Life Easier*  
> Aplikasi web modern untuk mencatat, memantau, dan mengelola tagihan serta jadwal rutin agar terhindar dari denda dan keterlambatan.

---

## 📌 Tentang IngatIn

Di tengah kesibukan sehari-hari, banyak orang sering lupa membayar tagihan berkala (listrik PLN, internet WiFi, air PDAM, cicilan kendaraan) atau jadwal rutin (servis motor/mobil berkala, perpanjangan langganan hiburan). Keterlambatan pembayaran kerap menimbulkan biaya denda keterlambatan hingga pemutusan layanan.

**IngatIn** hadir sebagai solusi praktis, ringan, dan elegan. Pengguna dapat:
- Mencatat jadwal dan nominal tagihan dengan kategori yang terorganisir.
- Melihat ringkasan keuangan dan tenggat waktu jatuh tempo secara instan.
- Menandai tagihan yang sudah dibayar lengkap dengan catatan riwayat pembayaran.
- Memanfaatkan fitur **Rutin Bulanan**, di mana tagihan bulanan yang ditandai selesai akan otomatis dimajukan tanggal jatuh temponya ke bulan berikutnya.

---

## ✨ Fitur Utama

### 1. 📊 Ringkasan Cerdas (Summary Metrics)
- **Terlambat:** Jumlah tagihan aktif yang telah melewati tanggal jatuh tempo (indikator merah darurat).
- **Jatuh Tempo ≤ 7 Hari:** Tagihan yang segera jatuh tempo dalam minggu ini (indikator kuning/oranye).
- **Total Tagihan Bulan Ini:** Otomatis mengakumulasi estimasi pengeluaran tagihan aktif di bulan berjalan dalam format mata uang Rupiah (`Rp xxx.xxx`).
- **Sudah Selesai:** Total tagihan dan jadwal yang telah diselesaikan.

### 2. 🗂 Pengelompokan Status Visual
Pengingat di Dashboard dikelompokkan secara visual untuk memudahkan prioritas:
1. **Perlu Perhatian (Terlambat):** Kartu beraksen merah menyala.
2. **Jatuh Tempo Minggu Ini (≤ 7 Hari):** Kartu beraksen kuning/oranye perhatian.
3. **Akan Datang:** Jadwal yang jatuh tempo lebih dari 7 hari ke depan.
4. **Sudah Selesai:** Tagihan yang telah beres (dilengkapi fitur *collapse/expand*).

Tiap kartu pengingat dilengkapi:
- Badge kategori dengan ikon unik (Tagihan, Cicilan, Langganan, Servis, Lainnya).
- Nominal tagihan dengan format Rupiah standar Indonesia (`Intl.NumberFormat`).
- Label sisa hari dinamis ("Hari ini", "Besok", "3 hari lagi", "Terlambat 2 hari").
- Tanggal jatuh tempo dalam format bahasa Indonesia (`D MMM YYYY`).
- Badge tipe pengulangan (Sekali / Bulanan).

### 3. 🔄 Otomatisasi Jadwal Bulanan
- Untuk pengingat bertipe **Bulanan**, saat ditandai "Selesai", sistem backend akan otomatis memajukan tanggal jatuh tempo ke 1 bulan berikutnya (`+1 month`).
- Modal konfirmasi secara transparan menampilkan tanggal jatuh tempo periode berikutnya sebelum pengguna menekan tombol konfirmasi.

### 4. 📜 Riwayat Aktivitas & Catatan (Activity Logs)
- Setiap kali pengingat diselesaikan, pengguna dapat menambahkan catatan opsional (misal: `"Dibayar via transfer BCA, no ref: 9912"` atau `"Ganti oli dan kampas rem depan"`).
- Pengguna dapat melihat linimasa riwayat penyelesaian kapan saja melalui tombol **Riwayat**.

### 5. 🔍 Filter & Pencarian Lengkap (Halaman "Semua Pengingat")
- Pencarian judul teks secara real-time.
- Filter berdasarkan Kategori (Tagihan, Cicilan, Langganan, Servis, Lainnya).
- Filter berdasarkan Status (Semua, Aktif, Terlambat, Selesai).
- Filter berdasarkan Tipe (Semua, Sekali, Bulanan).
- Tombol satu klik untuk **Reset Filter**.

### 6. 🛡️ Keamanan & Aksesibilitas
- Frontend hanya menggunakan **Supabase Publishable/Anon Key**. Tidak ada secret key yang terekspos ke klien.
- Seluruh manipulasi data pengingat dilakukan melalui Express REST API dengan header `Authorization: Bearer <access_token>` dari sesi Supabase Auth.
- Interceptor respons Axios otomatis mendeteksi status **401 Unauthorized** untuk membersihkan sesi dan mengarahkan pengguna kembali ke halaman Login.
- Notifikasi umpan balik instan menggunakan sistem **Toast custom** buatan sendiri (tanpa library eksternal).
- Modal konfirmasi khusus yang ramah (tanpa `window.confirm` bawaan browser).
- Desain mobile-first dengan navigasi menu responsif (drawer mobile).

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Tooling:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (JavaScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Utility:** [Day.js](https://day.js.org/) (dengan ekstensi & locale Indonesia `id`)
- **Autentikasi Klien:** `@supabase/supabase-js`

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Supabase GoTrue Auth)
- **Middleware:** `cors`, `dotenv`

---

## 📂 Struktur Direktori Frontend

```text
frontend/src/
├── api/
│   ├── axios.js               # Instance Axios dengan interceptor JWT & auto-logout 401
│   └── reminders.js           # Fungsi API (CRUD, markDone, getLogs)
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx      # Layout pembungkus utama & footer
│   │   └── Navbar.jsx         # Navigasi desktop & drawer mobile
│   ├── reminders/
│   │   ├── DeleteModal.jsx    # Modal konfirmasi hapus pengingat
│   │   ├── DoneModal.jsx      # Modal konfirmasi selesai + catatan + info bulan berikutnya
│   │   ├── HistoryModal.jsx   # Modal riwayat logs penyelesaian
│   │   ├── ReminderCard.jsx   # Komponen kartu pengingat
│   │   ├── ReminderFormModal.jsx # Modal form tambah & edit terpadu
│   │   ├── ReminderGroup.jsx  # Pengelompokan kartu (collapsible)
│   │   └── SummaryCards.jsx   # 4 kartu ringkasan metrik keuangan & jadwal
│   └── ui/
│       ├── Badge.jsx          # Badge status & tipe
│       ├── Button.jsx         # Tombol serbaguna (variants, loading state, icon)
│       ├── CategoryIcon.jsx   # Render dinamis ikon kategori Lucide
│       ├── EmptyState.jsx     # Tampilan placeholder saat data kosong
│       ├── Modal.jsx          # Accessible dialog modal (backdrop blur, ESC close)
│       └── Spinner.jsx        # Indikator loading
├── context/
│   ├── AuthContext.jsx        # Provider sesi login & metadata pengguna
│   └── ToastContext.jsx       # Provider notifikasi toast instan
├── pages/
│   ├── AllReminders.jsx       # Halaman daftar semua pengingat dengan filter & pencarian
│   ├── Dashboard.jsx          # Halaman beranda utama
│   ├── Login.jsx              # Halaman masuk
│   └── Register.jsx           # Halaman pendaftaran akun baru
├── utils/
│   ├── categories.js          # Definisi label & skema warna kategori
│   ├── currency.js            # Helper format Rupiah (Intl.NumberFormat)
│   └── date.js                # Helper tanggal Day.js, sisa hari, dan status
├── App.jsx                    # Definisi rute aplikasi
└── main.jsx                   # Entry point aplikasi
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Akun dan project [Supabase](https://supabase.com/).

---

### 2. Konfigurasi Environment Variables

#### Backend (`backend/.env`)
Pastikan file `.env` di folder `backend/` berisi konfigurasi berikut:
```env
PORT=3000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### Frontend (`frontend/.env`)
Pastikan file `.env` di folder `frontend/` berisi konfigurasi berikut:
```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-publishable-key>
VITE_API_URL=http://localhost:3000/api
```

---

### 3. Menjalankan Backend

Buka terminal dan masuk ke folder `backend`:
```bash
cd backend
npm install
npm run dev
```
Server Express akan berjalan di `http://localhost:3000`.

---

### 4. Menjalankan Frontend

Buka terminal baru dan masuk ke folder `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Vite dev server akan berjalan di `http://localhost:5173`. Buka URL tersebut di browser.

---

### 5. Memverifikasi Build & Linting

Untuk memastikan tidak ada kesalahan sintaks atau tipe:
```bash
cd frontend
npm run lint
npm run build
```

---

## 📡 Dokumentasi Endpoint REST API

Semua endpoint di bawah ini membutuhkan header `Authorization: Bearer <token_supabase>`.

| Method | Endpoint | Deskripsi | Body Request |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reminders` | Mendapatkan semua pengingat milik user (urut `due_date` asc) | - |
| `POST` | `/api/reminders` | Membuat pengingat baru | `{ title*, due_date*, category, amount, type }` |
| `PUT` | `/api/reminders/:id` | Memperbarui pengingat | `{ title, due_date, category, amount, type }` |
| `DELETE` | `/api/reminders/:id` | Menghapus pengingat | - |
| `PATCH` | `/api/reminders/:id/done` | Menandai pengingat selesai (bulanan: `due_date + 1 bulan`) | `{ note? }` |
| `GET` | `/api/reminders/:id/logs` | Mengambil riwayat penyelesaian satu pengingat | - |

---

## 👥 Kontributor

Dikembangkan untuk **NMC Weekly Class 2**  
*Tech for Convenience – Make Daily Life Easier*
