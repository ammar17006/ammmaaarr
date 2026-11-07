import React, { useState, useRef } from 'react';
import {
  Settings,
  Store,
  DollarSign,
  Cloud,
  CloudUpload,
  Download,
  Upload,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    isOffline,
    setIsOffline,
    pendingSyncCount,
    syncWithCloud,
    cloudSyncStatus,
    exportBackupJSON,
    restoreBackupJSON,
    resetToDefaultData,
    t
  } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreBackupJSON(content);
      if (success) {
        setRestoreMessage('Data berhasil dipulihkan (Restore Sukses)!');
      } else {
        setRestoreMessage('Gagal memulihkan: Format file JSON tidak valid.');
      }
      setTimeout(() => setRestoreMessage(null), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Symmetrical Header) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#21938c] text-[11px] font-bold mb-1 border border-teal-100">
            <Settings className="w-3.5 h-3.5" />
            <span>Konfigurasi &amp; Preferensi ammar kafe</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Pengaturan Toko &amp; Sistem POS</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Atur profil kafe, alamat nota struk, cadangan cloud, mode offline, dan keamanan data
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={syncWithCloud}
            disabled={cloudSyncStatus === 'syncing'}
            className="px-4 py-2.5 rounded-2xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            <span>Sinkronkan Cloud</span>
          </button>
        </div>
      </div>

      {/* Symmetrical Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kolom Kiri: Profil Toko & Struk Kasir */}
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#21938c]" />
                <span>Informasi Toko &amp; Struk Kasir</span>
              </h3>
              {isAdmin ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#21938c] border border-teal-100">
                  Format Cetak
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>Khusus Administrator</span>
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Toko / Bisnis</label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                    !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Contoh: Nikmati Kopi Pilihan & Santapan Hangat"
                  className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                    !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                      !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Alamat Email Toko</label>
                  <input
                    type="email"
                    disabled={!isAdmin}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                      !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Alamat Lengkap (Tercetak di Struk)</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                    !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mata Uang Transaksi</label>
                  <div className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-xs flex items-center justify-between">
                    <span className="font-semibold">Rupiah (Rp - IDR)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Aktif</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">{t('taxRateLabel')}</label>
                  <select
                    disabled={!isAdmin}
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                    className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                      !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c] bg-white'
                    }`}
                  >
                    <option value="0.10">10% (PB1 Resto/Kafe)</option>
                    <option value="0.11">11% (PPN Indonesia)</option>
                    <option value="0.08">8% (Standard POS)</option>
                    <option value="0">0% (Bebas Pajak)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Pesan Footer Struk Pembayaran</label>
                <textarea
                  rows={2}
                  disabled={!isAdmin}
                  value={formData.receiptFooter}
                  onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                  placeholder="Terima kasih atas kunjungan Anda di ammar kafe!"
                  className={`w-full p-2.5 rounded-xl border border-gray-200 transition-colors ${
                    !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:outline-hidden focus:border-[#21938c]'
                  }`}
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan ammar kafe berhasil disimpan!</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              {isAdmin ? (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] shadow-sm transition-all active:scale-95"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Mode Kasir:</strong> Hanya Administrator (<strong>ammar</strong>) yang dapat mengubah profil toko, kontak, alamat, dan format struk kasir.
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Cloud Sync, Mode Offline, Backup & Restore, Factory Reset */}
        <div className="space-y-6">
          {/* Card 1: Cloud Backup & Sync */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#21938c] flex items-center justify-center shrink-0">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>Keamanan Data &amp; Sinkronisasi Cloud</span>
                  </h3>
                  <p className="text-xs text-gray-500">Backup otomatis data inventaris dan penjualan ke cloud</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Otomatis
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
              <div>
                <p className="font-bold text-gray-800">Status Cadangan Terakhir</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleString('id-ID') : 'Hari ini'}
                </p>
              </div>
              <button
                type="button"
                onClick={syncWithCloud}
                disabled={cloudSyncStatus === 'syncing'}
                className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
              >
                {cloudSyncStatus === 'syncing' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5 text-[#21938c]" />
                )}
                <span>Sinkronkan Sekarang</span>
              </button>
            </div>
          </div>

          {/* Card 2: Mode Offline (Symmetrical Layout) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  isOffline ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Mode Offline (Offline First)</h3>
                  <p className="text-xs text-gray-500">Kasir tetap beroperasi normal tanpa koneksi internet</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isOffline}
                  onChange={(e) => setIsOffline(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Status Koneksi:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                  isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isOffline ? 'Offline (Mode Simulasi)' : 'Online (Terhubung)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Saat internet terputus, kasir tetap dapat mencetak struk dan memproses penjualan.
                Data disimpan di memori lokal dan akan diunggah otomatis saat online kembali.
              </p>
              {pendingSyncCount > 0 && (
                <div className="mt-2 p-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-2 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{pendingSyncCount} transaksi menunggu sinkronisasi online</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Manual Backup & Restore JSON */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#21938c]" />
                <span>Cadangan &amp; Pemulihan Data Manual</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">.JSON</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Unduh Backup Data</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Download seluruh katalog produk, pesanan, dan pelanggan dalam 1 file JSON aman.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportBackupJSON}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#21938c]" />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Pulihkan File Data</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Upload file backup JSON untuk memulihkan seluruh data transaksi dan inventaris.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload &amp; Restore</span>
                </button>
              </div>
            </div>

            {restoreMessage && (
              <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{restoreMessage}</span>
              </div>
            )}

            {/* Factory Reset Inside Card */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-gray-800">Reset ke Data Bawaan Demo</p>
                <p className="text-[11px] text-gray-400">Kembalikan produk dan transaksi awal ammar kafe</p>
              </div>
              {isAdmin ? (
                showResetConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-rose-600">Yakin reset?</span>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetConfirm(false);
                        resetToDefaultData();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
                    >
                      Ya, Reset
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo</span>
                  </button>
                )
              ) : (
                <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                  Khusus Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
