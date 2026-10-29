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
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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
    switchUser
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'discounts', label: 'Discounts', icon: Percent },
    { id: 'users', label: 'Users', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    onCloseMobile();
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
              <span className="text-2xl font-bold tracking-tight text-white">PosyMart</span>
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
              <p className="text-xs font-semibold text-white truncate">Need Help?</p>
              <p className="text-[11px] text-white/75 truncate">Contact support</p>
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
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
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
                <div className="px-2 py-1.5 border-b border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ganti Pengguna</p>
                </div>
                <div className="py-1 space-y-1">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        user.id === currentUser.id
                          ? 'bg-teal-50 text-teal-800 font-semibold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{user.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-medium ${
                        user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setActiveView('users');
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-teal-700 hover:bg-teal-50 font-medium"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Kelola Akun Kasir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
