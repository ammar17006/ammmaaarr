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
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    isOffline,
    setIsOffline,
    pendingSyncCount,
    syncWithCloud,
    cloudSyncStatus,
    exportBackupJSON,
    restoreBackupJSON,
    resetToDefaultData
  } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-6 max-w-4xl">
      {/* Cloud Backup & Offline Status Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#21938c] flex items-center justify-center shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>Keamanan Data &amp; Sinkronisasi Cloud</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Otomatis
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Semua transaksi tersimpan lokal &amp; di-backup otomatis ke server cloud
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Terakhir di-backup: {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleString('id-ID') : 'Hari ini'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncWithCloud}
            disabled={cloudSyncStatus === 'syncing'}
            className="px-4 py-2.5 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            <span>Sinkronkan Sekarang</span>
          </button>
        </div>
      </div>

      {/* Offline Mode Configuration Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isOffline ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Mode Offline (Offline First)</h3>
              <p className="text-xs text-gray-500">
                Aplikasi tetap berfungsi 100% normal tanpa koneksi internet
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOffline}
              onChange={(e) => setIsOffline(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="pt-3 text-xs text-gray-600 space-y-1.5">
          <p>
            Status Saat Ini:{' '}
            <strong className={isOffline ? 'text-amber-600' : 'text-emerald-600'}>
              {isOffline ? 'Mode Offline Aktif (Simulasi)' : 'Online (Terhubung)'}
            </strong>
          </p>
          <p className="text-[11px] text-gray-400">
            Saat koneksi terputus, kasir dapat terus mencetak struk dan memproses transaksi.
            Data disimpan di penyimpanan lokal perangkat dan akan di-upload otomatis begitu internet kembali.
          </p>
          {pendingSyncCount > 0 && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{pendingSyncCount} transaksi menunggu sinkronisasi online</span>
            </div>
          )}
        </div>
      </div>

      {/* Store Profile Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
          <Store className="w-4 h-4 text-[#21938c]" />
          <span>Informasi Toko &amp; Struk Kasir</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Nama Toko / Bisnis</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Tagline / Slogan</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Contoh: Coffee & Artisan Bakery"
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nomor Telepon / WhatsApp</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Alamat Email Toko</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-gray-700 block mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Mata Uang (Currency)</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'USD' | 'IDR' })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            >
              <option value="USD">USD ($) - Sesuai Cuplikan Layar</option>
              <option value="IDR">Rupiah (Rp) - Format Indonesia</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Persentase Pajak (PPN / Tax)</label>
            <select
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            >
              <option value="0.08">8% (Tax Sesuai Screenshot)</option>
              <option value="0.11">11% (PPN Indonesia)</option>
              <option value="0.10">10% (PB1 Resto/Kafe)</option>
              <option value="0">0% (Bebas Pajak)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-gray-700 block mb-1">Pesan Footer Struk</label>
            <textarea
              rows={2}
              value={formData.receiptFooter}
              onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              placeholder="Terima kasih atas kunjungan Anda!"
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Manual Backup & Restore Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
          Cadangan &amp; Pemulihan Data Manual (Backup / Restore)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <p className="text-xs font-bold text-gray-800">Unduh Backup Data JSON</p>
            <p className="text-[11px] text-gray-500">
              Download seluruh data produk, riwayat transaksi, dan pelanggan dalam 1 file JSON aman.
            </p>
            <button
              onClick={exportBackupJSON}
              className="mt-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <p className="text-xs font-bold text-gray-800">Pulihkan dari File JSON</p>
            <p className="text-[11px] text-gray-500">
              Import file backup JSON sebelumnya untuk mengembalikan seluruh data sistem.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload &amp; Restore</span>
            </button>
          </div>
        </div>

        {restoreMessage && (
          <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold">
            {restoreMessage}
          </div>
        )}

        {/* Factory Reset */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-800">Reset ke Data Bawaan Demo</p>
            <p className="text-[11px] text-gray-400">Kembalikan produk dan transaksi awal sesuai tampilan PosyMart</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset seluruh data aplikasi ke pengaturan demo awal?')) {
                resetToDefaultData();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
