import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  RotateCcw,
  Percent,
  ShieldCheck,
  Settings,
  Headphones,
  ChevronDown,
  LogOut,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    users,
    switchUser,
    verifyPinAndLogin,
    lockScreen,
    settings,
    t
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authTargetUser, setAuthTargetUser] = useState<User | null>(null);
  const [enteredSecret, setEnteredSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'sales', label: t('navSales'), icon: ShoppingBag },
    { id: 'products', label: t('navProducts'), icon: Package },
    { id: 'customers', label: t('navCustomers'), icon: Users },
    { id: 'orders', label: t('navOrders'), icon: ClipboardList },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
    { id: 'returns', label: t('navReturns'), icon: RotateCcw },
    { id: 'discounts', label: t('navDiscounts'), icon: Percent },
    { id: 'users', label: t('navUsers'), icon: ShieldCheck },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    onCloseMobile();
  };

  const handleUserClick = (target: User) => {
    if (target.id === currentUser.id) {
      setIsUserMenuOpen(false);
      return;
    }
    setAuthTargetUser(target);
    setEnteredSecret('');
    setShowSecret(false);
    setAuthError(null);
    setIsUserMenuOpen(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authTargetUser) return;

    const success = verifyPinAndLogin(authTargetUser.id, enteredSecret);
    if (success) {
      setAuthTargetUser(null);
      setEnteredSecret('');
      setAuthError(null);
    } else {
      setAuthError('Kata sandi atau PIN salah. Silakan coba lagi.');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#21938c] text-white flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Close button on mobile */}
        <div>
          <div className="flex items-center justify-between px-3 mb-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs text-white">
                <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white capitalize">{settings.storeName || 'ammar kafe'}</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-[#21938c] font-semibold shadow-sm shadow-teal-950/10'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#21938c]' : 'text-white/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Help Card & User Profile */}
        <div className="pt-4 border-t border-white/15 space-y-3">
          {/* Need Help Card */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-3 hover:bg-white/15 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{t('needHelp')}</p>
              <p className="text-[11px] text-white/75 truncate">{t('contactSupport')}</p>
            </div>
          </div>

          {/* User Profile Pill Card with Switch User dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all flex items-center justify-between gap-2.5 text-left"
              aria-label="Menu Akun Pengguna"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate capitalize">{currentUser.name}</p>
                  <p className="text-[10px] text-white/75 capitalize tracking-wide flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-300' : 'bg-emerald-300'}`} />
                    {currentUser.role === 'admin' ? 'Admin' : 'Kasir'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/75 transition-transform shrink-0 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Switch User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-800 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="px-2 py-1.5 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ganti Pengguna</p>
                  <span className="text-[10px] text-teal-700 font-bold flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Wajib Sandi
                  </span>
                </div>
                <div className="py-1 space-y-1">
                  {users.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelf
                            ? 'bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200" />
                          <div className="truncate min-w-0">
                            <p className="truncate font-semibold capitalize text-gray-900">{user.name}</p>
                            <p className="text-[10px] text-teal-700 font-mono">Sandi: {user.password}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-medium shrink-0 ml-1.5 ${
                          user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {user.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1 border-t border-gray-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setActiveView('users');
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-teal-700 hover:bg-teal-50 font-medium transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Kelola Akun Kasir</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      lockScreen();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Kunci POS / Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Password Authentication Modal when switching user in Sidebar */}
      {authTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-gray-800 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#21938c] mx-auto flex items-center justify-center mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900">Masukan Kata Sandi</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Otentikasi untuk login sebagai <strong className="capitalize text-gray-800">{authTargetUser.name}</strong>
            </p>

            {/* Quick Demo Helper Box */}
            <div className="my-3 p-2.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-[11px] text-teal-900 font-mono flex items-center justify-between">
              <div>
                <span>Sandi: <strong>{authTargetUser.password}</strong></span>
                <span className="mx-1 text-gray-400">|</span>
                <span>PIN: <strong>{authTargetUser.pin}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setEnteredSecret(authTargetUser.password)}
                className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition-colors"
              >
                Isi Sandi
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-3 space-y-3">
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  autoFocus
                  placeholder="Masukkan kata sandi atau PIN..."
                  value={enteredSecret}
                  onChange={(e) => {
                    setEnteredSecret(e.target.value);
                    setAuthError(null);
                  }}
                  className="w-full text-center text-sm font-semibold p-3 pr-10 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#21938c] focus:ring-2 focus:ring-[#21938c]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showSecret ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                  {authError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTargetUser(null);
                    setEnteredSecret('');
                    setAuthError(null);
                  }}
                  className="py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Masuk Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
