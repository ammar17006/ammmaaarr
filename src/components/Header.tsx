import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  Printer,
  Wifi,
  WifiOff,
  CloudUpload,
  RefreshCw,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenMobileCart: () => void;
  onOpenPrinterModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenMobileCart,
  onOpenPrinterModal
}) => {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    cartTotals,
    isOffline,
    setIsOffline,
    pendingSyncCount,
    syncWithCloud,
    cloudSyncStatus,
    printerConfig,
    settings,
    toggleCurrency
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Stok Menipis: Cookie', desc: 'Sisa stok tinggal 6 pcs', time: '10m lalu', type: 'warning' },
    { id: 2, title: 'Sinkronisasi Cloud Berhasil', desc: '14 transaksi tersimpan aman', time: '1 jam lalu', type: 'info' },
    { id: 3, title: 'Printer Siap', desc: `${printerConfig.deviceName || 'Thermal 58mm'} terhubung`, time: '2 jam lalu', type: 'success' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Left: Hamburger & Greetings */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-hidden"
          aria-label="Toggle Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            Welcome back, {currentUser.name.split(' ')[0]}!
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Sync/Offline, Printer, Currency, Notifications, Cart */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-between md:justify-end">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64 md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything... ⌘K"
            className="w-full bg-[#f8fafc] border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-hidden focus:border-[#21938c] focus:ring-2 focus:ring-[#21938c]/15 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-200/60 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Currency Switcher */}
        <button
          onClick={toggleCurrency}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          title={`Ubah mata uang (Saat ini: ${settings.currency})`}
        >
          <Coins className="w-4 h-4 text-[#21938c]" />
          <span>{settings.currency}</span>
        </button>

        {/* Offline / Online Status Pill with manual toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            isOffline
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
          title={isOffline ? 'Mode Offline Aktif (Klik untuk Online)' : 'Terhubung ke Internet (Klik untuk simulasi Offline)'}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden sm:inline">Offline</span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                  {pendingSyncCount}
                </span>
              )}
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Online</span>
            </>
          )}
        </button>

        {/* Cloud Sync Button */}
        <button
          onClick={syncWithCloud}
          disabled={cloudSyncStatus === 'syncing'}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors relative"
          title="Backup & Sinkronisasi Cloud"
          aria-label="Sinkronisasi Cloud"
        >
          {cloudSyncStatus === 'syncing' ? (
            <RefreshCw className="w-4 h-4 text-[#21938c] animate-spin" />
          ) : cloudSyncStatus === 'synced' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <CloudUpload className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Printer Status Button */}
        <button
          onClick={onOpenPrinterModal}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
            printerConfig.isConnected
              ? 'bg-teal-50 text-[#21938c] border border-teal-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title="Pengaturan Printer Thermal Struk"
          aria-label="Pengaturan Printer"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden md:inline font-medium">
            {printerConfig.isConnected ? 'Printer Siap' : 'Printer'}
          </span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#21938c] text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800">Notifikasi</span>
                <span className="text-[10px] text-[#21938c] font-semibold cursor-pointer">Tandai telah dibaca</span>
              </div>
              <div className="py-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-gray-50 hover:bg-teal-50/50 transition-colors text-left">
                    <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                    <p className="text-[11px] text-gray-500">{n.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cart Trigger */}
        <button
          onClick={onOpenMobileCart}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#21938c] text-white text-xs font-semibold shadow-sm"
          aria-label="Keranjang Kasir"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{cartTotals.itemCount}</span>
        </button>
      </div>
    </header>
  );
};
