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
  Eye,
  EyeOff,
  Edit2,
  Trash2,
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
    updateUser,
    deleteUser,
    settings,
    orders
  } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [pinPromptUser, setPinPromptUser] = useState<User | null>(null);
  const [enteredSecret, setEnteredSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Form State for Adding New User
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as Role,
    pin: '',
    password: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  });

  // Form State for Editing Existing User
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as Role,
    pin: '',
    password: '',
    phone: '',
    isActive: true
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
    setEnteredSecret('');
    setShowSecret(false);
    setPinError(false);
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinPromptUser) return;

    const success = verifyPinAndLogin(pinPromptUser.id, enteredSecret);
    if (success) {
      setPinPromptUser(null);
      setEnteredSecret('');
      setShowSecret(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !formData.name || !formData.pin) return;

    const cleanName = formData.name.trim();
    const defaultPassword = `${cleanName.toLowerCase().replace(/\s+/g, '')}123`;

    addUser({
      name: cleanName,
      email: formData.email.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@ammarkafe.com`,
      role: formData.role,
      pin: formData.pin.trim(),
      password: formData.password.trim() || defaultPassword,
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
      password: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });
    setNoticeMessage(`Akun ${cleanName} berhasil ditambahkan!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleStartEdit = (u: User) => {
    if (!isAdmin) return;
    setEditingUser(u);
    setEditFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      pin: u.pin,
      password: u.password,
      phone: u.phone || '',
      isActive: u.isActive
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingUser) return;

    updateUser(editingUser.id, {
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      role: editFormData.role,
      pin: editFormData.pin.trim(),
      password: editFormData.password.trim(),
      phone: editFormData.phone.trim(),
      isActive: editFormData.isActive
    });

    setEditingUser(null);
    setNoticeMessage(`Perubahan akun ${editFormData.name} berhasil disimpan!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!isAdmin || !userToDelete) return;
    const name = userToDelete.name;
    const success = deleteUser(userToDelete.id);
    setUserToDelete(null);
    if (success) {
      setNoticeMessage(`Akun ${name} berhasil dihapus.`);
    } else {
      setNoticeMessage(`Tidak dapat menghapus akun ${name}.`);
    }
    setTimeout(() => setNoticeMessage(null), 3000);
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

      {/* Notice Message Toast */}
      {noticeMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Users List & Switch Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Daftar Akun Pengguna</h3>
            <p className="text-xs text-gray-400">
              {isAdmin
                ? 'Kelola akun kasir, ubah kredensial sandi/PIN, atau beralih akun'
                : 'Pilih akun kasir untuk beralih menggunakan otentikasi kata sandi/PIN'}
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] flex items-center gap-1.5 shadow-xs self-start sm:self-auto transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Akun Kasir</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Akses Khusus Admin untuk Tambah/Edit/Hapus Kasir</span>
            </div>
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
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {u.role}
                    </span>

                    {/* ONLY Admin can see Edit & Delete buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 ml-0.5">
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="p-1 rounded-lg text-gray-400 hover:text-[#21938c] hover:bg-teal-50 transition-colors"
                          title={`Edit akun ${u.name}`}
                          aria-label={`Edit akun ${u.name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== 'usr-1' && !isSelf && (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title={`Hapus akun ${u.name}`}
                            aria-label={`Hapus akun ${u.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-1 text-[11px]">
                  <div className="flex items-center justify-between text-gray-600 font-mono">
                    <span>Sandi: <strong className="text-gray-900">{u.password}</strong></span>
                    <span>PIN: <strong className="text-gray-900">{u.pin}</strong></span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Status: {u.isActive ? 'Aktif' : 'Non-aktif'}</span>

                    {isSelf ? (
                      <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-[#21938c] font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bertugas</span>
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Password / PIN Prompt Modal */}
      {pinPromptUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#21938c] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900">Masukan Sandi atau PIN</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Otentikasi untuk beralih ke <strong>{pinPromptUser.name}</strong>
            </p>
            <div className="my-2 p-2 rounded-xl bg-teal-50/70 border border-teal-200 text-[11px] text-teal-900 font-mono">
              Sandi Demo: <strong>{pinPromptUser.password}</strong> &bull; PIN: <strong>{pinPromptUser.pin}</strong>
            </div>

            <form onSubmit={handleVerifyPin} className="mt-4 space-y-3">
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  autoFocus
                  placeholder="Masukkan kata sandi atau 4 digit PIN..."
                  value={enteredSecret}
                  onChange={(e) => {
                    setEnteredSecret(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center text-sm font-semibold p-3 pr-10 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#21938c]"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <p className="text-xs text-rose-600 font-medium">Kata sandi atau PIN salah, silakan coba lagi</p>
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
                  Verifikasi &amp; Masuk
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
                <label className="font-bold text-gray-700 block mb-1">Kata Sandi Akun</label>
                <input
                  type="text"
                  placeholder="Contoh: kasir123 (opsional, bawaan nama+123)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">4 Digit PIN Login Cepat</label>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Akun Kasir</h3>
                <p className="text-[11px] text-gray-500">Perbarui profil dan kredensial login kasir</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="py-3 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Tingkat Akses (Role)</label>
                <select
                  disabled={editingUser.id === 'usr-1'}
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as Role })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="cashier">Kasir (Transaksi &amp; Struk)</option>
                  <option value="admin">Administrator (Akses Penuh)</option>
                </select>
                {editingUser.id === 'usr-1' && (
                  <p className="text-[10px] text-amber-700 mt-0.5">Role ammar dikunci sebagai Administrator utama</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kata Sandi</label>
                  <input
                    type="text"
                    required
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-mono focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">PIN 4 Digit</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={editFormData.pin}
                    onChange={(e) => setEditFormData({ ...editFormData, pin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-center font-mono tracking-widest focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nomor Telepon / WA</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  placeholder="0812xxxx"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Status Akun</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editIsActive"
                      checked={editFormData.isActive}
                      onChange={() => setEditFormData({ ...editFormData, isActive: true })}
                      className="text-[#21938c] focus:ring-[#21938c]"
                    />
                    <span className="text-xs text-gray-700 font-medium">Aktif</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editIsActive"
                      checked={!editFormData.isActive}
                      onChange={() => setEditFormData({ ...editFormData, isActive: false })}
                      className="text-[#21938c] focus:ring-[#21938c]"
                    />
                    <span className="text-xs text-gray-700 font-medium">Non-aktif</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#21938c] text-white font-bold hover:bg-[#1b7c76] transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900">Hapus Akun Kasir?</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun kasir <strong>{userToDelete.name}</strong> ({userToDelete.email})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition-colors"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
