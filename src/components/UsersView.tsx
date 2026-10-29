import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Lock,
  UserCheck,
  Clock,
  DollarSign,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import { formatCurrency } from '../utils/rules';

export const UsersView: React.FC = () => {
  const {
    users,
    currentUser,
    switchUser,
    verifyPinAndLogin,
    addUser,
    settings,
    orders
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pinPromptUser, setPinPromptUser] = useState<User | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as Role,
    pin: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  });

  // Calculate current user's shift sales
  const currentShiftOrders = orders.filter((o) => o.cashierId === currentUser.id && o.status === 'completed');
  const shiftCashSales = currentShiftOrders
    .filter((o) => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0);
  const shiftNonCashSales = currentShiftOrders
    .filter((o) => o.paymentMethod !== 'cash')
    .reduce((sum, o) => sum + o.total, 0);
  const shiftTotalSales = shiftCashSales + shiftNonCashSales;

  const handlePromptLogin = (u: User) => {
    if (u.id === currentUser.id) return;
    setPinPromptUser(u);
    setEnteredPin('');
    setPinError(false);
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinPromptUser) return;

    const success = verifyPinAndLogin(pinPromptUser.id, enteredPin);
    if (success) {
      setPinPromptUser(null);
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pin) return;

    addUser({
      name: formData.name.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@posymart.com`,
      role: formData.role,
      pin: formData.pin.trim(),
      phone: formData.phone.trim() || '-',
      avatar: formData.avatar,
      isActive: true
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      pin: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Active Session & Shift Banner */}
      <div className="bg-gradient-to-r from-[#21938c] to-[#166964] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                currentUser.role === 'admin' ? 'bg-amber-400 text-amber-950' : 'bg-teal-200 text-teal-950'
              }`}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Kasir Bertugas'}
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">{currentUser.email}</p>
            <p className="text-xs text-white/80">PIN: **** (Terproteksi)</p>
          </div>
        </div>

        {/* Current Shift Summary */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center text-xs">
          <div>
            <span className="text-white/70 block text-[10px]">Transaksi Shift</span>
            <span className="text-base font-bold">{currentShiftOrders.length} Struk</span>
          </div>
          <div>
            <span className="text-white/70 block text-[10px]">Kas Tunai Masuk</span>
            <span className="text-base font-bold">{formatCurrency(shiftCashSales, settings.currency)}</span>
          </div>
          <div>
            <span className="text-white/70 block text-[10px]">Total Omzet Shift</span>
            <span className="text-base font-bold text-amber-300">
              {formatCurrency(shiftTotalSales, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Role Permissions Matrix Explanation */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#21938c]" />
          <span>Tingkat Hak Akses Multi-Level (Role Matrix)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="font-bold text-amber-900 block mb-1">Role: Administrator (Owner / Manajer)</span>
            <ul className="space-y-1 text-amber-800 text-[11px] list-disc list-inside">
              <li>Akses penuh ke seluruh menu sistem POS &amp; Pengaturan Toko</li>
              <li>Melihat Margin Keuntungan &amp; Laporan Keuangan Harian Mendalam</li>
              <li>Menambah, mengedit, dan menghapus data inventaris produk</li>
              <li>Mengelola akun kasir &amp; otorisasi retur/refund transaksi</li>
            </ul>
          </div>
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100">
            <span className="font-bold text-[#21938c] block mb-1">Role: Kasir (Front-line POS Operator)</span>
            <ul className="space-y-1 text-teal-800 text-[11px] list-disc list-inside">
              <li>Membuka transaksi penjualan, scan/tambah produk ke keranjang</li>
              <li>Menerima pembayaran Tunai, QRIS, Kartu Debit, &amp; Transfer</li>
              <li>Cetak struk ke printer thermal Bluetooth/USB &amp; cetak ulang struk</li>
              <li>Terproteksi dari pengubahan harga modal &amp; data konfigurasi sistem</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users List & Switch Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Daftar Akun Pengguna</h3>
            <p className="text-xs text-gray-400">Klik "Ganti Akun" untuk beralih dengan otentikasi PIN</p>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Akun Kasir</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const isSelf = u.id === currentUser.id;

            return (
              <div
                key={u.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelf
                    ? 'border-[#21938c] bg-teal-50/30 ring-2 ring-[#21938c]/15'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{u.name}</h4>
                      <p className="text-[11px] text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400 font-mono">
                    PIN Demo: <strong className="text-gray-700">{u.pin}</strong>
                  </span>

                  {isSelf ? (
                    <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-[#21938c] font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePromptLogin(u)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#21938c] hover:text-white text-gray-700 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Login Akun Ini</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PIN Prompt Modal */}
      {pinPromptUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#21938c] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900">Masukan PIN Akun</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Otentikasi untuk beralih ke <strong>{pinPromptUser.name}</strong>
            </p>
            <p className="text-[11px] text-[#21938c] font-mono mt-1">
              (PIN Demo: {pinPromptUser.pin})
            </p>

            <form onSubmit={handleVerifyPin} className="mt-4 space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="4 Digit PIN"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className="w-full text-center tracking-[1em] text-xl font-bold p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#21938c]"
              />

              {pinError && (
                <p className="text-xs text-rose-600 font-medium">PIN salah, silakan coba lagi</p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinPromptUser(null)}
                  className="py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76]"
                >
                  Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Tambah Akun Kasir Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="py-3 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Kasir</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Kasir"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Tingkat Akses (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                >
                  <option value="cashier">Kasir (Transaksi &amp; Struk)</option>
                  <option value="admin">Admin (Akses Penuh Sistem)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">4 Digit PIN Login</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="Contoh: 5566"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-center tracking-widest font-mono text-sm focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">No. HP / WhatsApp</label>
                <input
                  type="text"
                  placeholder="0812xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#21938c] text-white font-bold hover:bg-[#1b7c76]"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
