import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BellRing,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Menu,
  X,
  User,
  PlusCircle,
} from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ onOpenAddModal }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Pengguna';

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                  IngatIn
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                  Kelola Tagihan & Jadwal
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink to="/reminders" className={navLinkClass}>
                <CalendarDays className="w-4 h-4" />
                Semua Pengingat
              </NavLink>
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {onOpenAddModal && (
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={onOpenAddModal}
              >
                Tambah Pengingat
              </Button>
            )}

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 border border-slate-200/70 rounded-full">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {displayName}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
              title="Keluar dari akun"
            >
              Keluar
            </Button>
          </div>

          {/* Mobile Action & Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                aria-label="Tambah pengingat"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {/* User info mobile */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {displayName}
              </span>
              <span className="text-xs text-slate-500 truncate">{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/reminders"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CalendarDays className="w-5 h-5" />
              Semua Pengingat
            </NavLink>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
