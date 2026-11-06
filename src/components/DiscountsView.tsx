import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Tag,
  Gift,
  CheckCircle2,
  Calendar,
  Sparkles,
  Scissors,
  Edit,
  Trash2,
  Power,
  Search,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/rules';
import { DiscountCoupon } from '../types';

export const DiscountsView: React.FC = () => {
  const {
    discounts,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    toggleDiscountStatus,
    appliedCoupon,
    applyDiscountCoupon,
    removeDiscountCoupon,
    setActiveView,
    settings,
    currentUser
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'nominal' | 'percentage'>('nominal');
  const [discountValue, setDiscountValue] = useState<number>(10000);
  const [minSpend, setMinSpend] = useState<number>(30000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const isAdmin = currentUser.role === 'admin';

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      showToast('Hanya Administrator (ammar) yang dapat menambah kupon diskon!');
      return;
    }
    setEditingCoupon(null);
    setCode('');
    setTitle('');
    setType('nominal');
    setDiscountValue(10000);
    setMinSpend(30000);
    setExpiryDate('2026-12-31');
    setDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: DiscountCoupon) => {
    if (!isAdmin) {
      showToast('Hanya Administrator (ammar) yang dapat mengedit kupon diskon!');
      return;
    }
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setTitle(coupon.title);
    setType(coupon.type);
    setDiscountValue(coupon.discountValue);
    setMinSpend(coupon.minSpend);
    setExpiryDate(coupon.expiryDate || '2026-12-31');
    setDescription(coupon.description || '');
    setIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Hanya Administrator (ammar) yang berhak menyimpan kupon diskon!');
      return;
    }
    if (!code.trim() || !title.trim() || discountValue <= 0) return;

    if (editingCoupon) {
      updateDiscount(editingCoupon.id, {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        type,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend) || 0,
        expiryDate,
        description: description.trim(),
        isActive
      });
      showToast(`Kupon ${code.toUpperCase()} berhasil diperbarui!`);
    } else {
      addDiscount({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        type,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend) || 0,
        expiryDate,
        description: description.trim(),
        isActive
      });
      showToast(`Kupon diskon ${code.toUpperCase()} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleApplyToCart = (coupon: DiscountCoupon) => {
    const result = applyDiscountCoupon(coupon);
    showToast(result.message);
    if (result.success) {
      setActiveView('sales');
    }
  };

  const filteredDiscounts = discounts.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && d.isActive) ||
      (statusFilter === 'inactive' && !d.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#21938c] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#21938c] text-[11px] font-bold mb-1 border border-teal-100">
            <Percent className="w-3.5 h-3.5" />
            <span>Promo &amp; Voucher Ammar Kafe</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Kupon Diskon &amp; Promo Kasir</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAdmin
              ? 'Mode Admin: Anda dapat menambah, mengedit potongan harga, dan mengaktifkan voucher untuk kasir'
              : 'Mode Kasir: Anda dapat melihat dan menerapkan kupon promo aktif saat transaksi pembayaran'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Kupon Baru</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Akses Khusus Admin untuk Tambah/Edit</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kode kupon, judul, atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c] bg-[#f8fafc]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
          >
            <option value="all">Semua Status ({discounts.length})</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif Saja</option>
          </select>
        </div>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDiscounts.map((coupon) => {
          const isCurrentlyApplied = appliedCoupon?.id === coupon.id;

          return (
            <div
              key={coupon.id}
              className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between relative group ${
                isCurrentlyApplied
                  ? 'border-[#21938c] ring-2 ring-[#21938c]/20 shadow-md bg-teal-50/20'
                  : coupon.isActive
                  ? 'border-gray-200/80 hover:border-teal-300 shadow-xs hover:shadow-md'
                  : 'border-gray-200 opacity-60 bg-gray-50/50'
              }`}
            >
              <div>
                {/* Header Card: Code & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-xl bg-teal-50 text-[#21938c] font-mono text-xs font-black tracking-wider flex items-center gap-1.5 border border-teal-100">
                      <Tag className="w-3.5 h-3.5 text-[#21938c]" />
                      <span>{coupon.code}</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Salin Kode Kupon"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAdmin ? (
                      <button
                        onClick={() => toggleDiscountStatus(coupon.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        title={coupon.isActive ? 'Klik untuk nonaktifkan kupon' : 'Klik untuk aktifkan kupon'}
                      >
                        <Power className="w-2.5 h-2.5" />
                        <span>{coupon.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    ) : (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        title="Status kupon promo"
                      >
                        <Power className="w-2.5 h-2.5" />
                        <span>{coupon.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Discount Value */}
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#21938c] transition-colors">
                  {coupon.title}
                </h3>
                <div className="mt-1.5 text-lg font-black text-[#21938c]">
                  {coupon.type === 'percentage'
                    ? `Diskon ${coupon.discountValue}%`
                    : `Hemat ${formatCurrency(coupon.discountValue, settings.currency)}`}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {coupon.description || 'Tidak ada keterangan khusus.'}
                </p>

                {/* Metadata */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Min. Belanja:</span>
                    <span className="font-bold text-gray-700">
                      {formatCurrency(coupon.minSpend, settings.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Berlaku s/d:</span>
                    <span className="font-medium text-gray-700">{coupon.expiryDate}</span>
                  </div>
                  {coupon.usageCount !== undefined && (
                    <div className="flex justify-between">
                      <span>Telah Digunakan:</span>
                      <span className="font-medium text-gray-700">{coupon.usageCount} kali</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(coupon)}
                      className="p-2 rounded-xl text-gray-500 hover:text-[#21938c] hover:bg-teal-50 transition-colors"
                      title="Edit Kupon Diskon (Khusus Admin)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteDiscount(coupon.id);
                        showToast(`Kupon ${coupon.code} berhasil dihapus.`);
                      }}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Kupon Diskon (Khusus Admin)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 italic">Promo Tersedia</span>
                )}

                {isCurrentlyApplied ? (
                  <button
                    onClick={() => {
                      removeDiscountCoupon();
                      showToast('Kupon dilepas dari keranjang kasir.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Diterapkan (Lepas)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyToCart(coupon)}
                    disabled={!coupon.isActive}
                    className="px-3 py-1.5 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Pakai di Kasir</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah & Edit Kupon Diskon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#21938c] flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingCoupon ? 'Edit Kupon Diskon' : 'Tambah Kupon Diskon Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kode Kupon */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kode Kupon / Voucher</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: DISKON20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-mono font-bold uppercase focus:border-[#21938c] focus:outline-hidden"
                  />
                </div>

                {/* Tipe Diskon */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jenis Potongan</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold focus:border-[#21938c] focus:outline-hidden bg-white"
                  >
                    <option value="nominal">Nominal Rupiah (Rp)</option>
                    <option value="percentage">Persentase (%)</option>
                  </select>
                </div>
              </div>

              {/* Judul Promo */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama / Judul Promo</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Promo Ngopi Santai Akhir Pekan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold focus:border-[#21938c] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nilai Diskon */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {type === 'percentage' ? 'Besar Diskon (%)' : 'Nilai Potongan (Rp)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold focus:border-[#21938c] focus:outline-hidden"
                  />
                </div>

                {/* Min Spend */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Minimal Belanja (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-bold focus:border-[#21938c] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tanggal Kedaluwarsa</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#21938c] focus:outline-hidden bg-white"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Deskripsi &amp; Ketentuan Promo</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat promo untuk kasir..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#21938c] focus:outline-hidden"
                />
              </div>

              {/* Status Aktif Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="coupon-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#21938c] focus:ring-[#21938c] w-4 h-4"
                />
                <label htmlFor="coupon-active" className="font-semibold text-gray-700 cursor-pointer">
                  Kupon Aktif dan Dapat Digunakan Kasir Saat Ini
                </label>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white font-bold shadow-xs transition-colors"
                >
                  {editingCoupon ? 'Simpan Perubahan' : 'Buat Kupon Diskon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
