import Navbar from './Navbar';

export default function AppLayout({ children, onOpenAddModal }) {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans text-slate-800">
      <Navbar onOpenAddModal={onOpenAddModal} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200/70 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          IngatIn &copy; {new Date().getFullYear()} — Tech for Convenience: Kelola Tagihan & Jadwal Rutin dengan Nyaman.
        </div>
      </footer>
    </div>
  );
}
