import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Calendar,
  HelpCircle,
  ArrowRight,
  Printer,
  DollarSign,
  AlertTriangle,
  FileText,
  Clock,
  User,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatCurrency } from '../utils/rules';

export const ReturnsView: React.FC = () => {
  const {
    orders,
    refundOrder,
    setActiveReceiptOrder,
    settings,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'process' | 'history'>('process');
  const [search, setSearch] = useState('');
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('Salah Input Menu oleh Kasir');
  const [customReasonNote, setCustomReasonNote] = useState('');
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const refundedOrders = orders.filter((o) => o.status === 'refunded');

  const filteredCompletedOrders = completedOrders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.invoiceNumber.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      o.cashierName.toLowerCase().includes(q)
    );
  });

  const filteredRefundedOrders = refundedOrders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.invoiceNumber.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      o.cashierName.toLowerCase().includes(q) ||
      (o.refundReason && o.refundReason.toLowerCase().includes(q))
    );
  });

  const handleOpenRefundModal = (order: Order) => {
    setSelectedOrderForRefund(order);
    setRefundReason('Salah Input Menu oleh Kasir');
    setCustomReasonNote('');
    setIsConfirmChecked(false);
  };

  const handleExecuteRefund = () => {
    if (!selectedOrderForRefund || !isConfirmChecked) return;

    const finalReason = customReasonNote.trim()
      ? `${refundReason} (${customReasonNote.trim()})`
      : refundReason;

    refundOrder(selectedOrderForRefund.id, finalReason);
    const invoice = selectedOrderForRefund.invoiceNumber;
    setSelectedOrderForRefund(null);

    setToastMessage(`Transaksi ${invoice} berhasil diretur! Stok produk otomatis dikembalikan ke inventaris.`);
    setActiveTab('history');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalRefundAmount = refundedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#21938c] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold mb-1 border border-rose-100">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pusat Layanan Retur &amp; Pengembalian Dana</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Retur &amp; Refund Pesanan</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Solusi mudah membatalkan pesanan, mengembalikan dana pelanggan, dan memulihkan stok inventaris otomatis
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700">
            <span className="text-gray-400 block text-[10px]">Total Dana Diretur</span>
            <span className="font-extrabold text-rose-600 text-sm">
              {formatCurrency(totalRefundAmount, settings.currency)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 font-bold">
            <span className="text-rose-400 block text-[10px]">Jumlah Retur</span>
            <span className="text-sm">{refundedOrders.length} Pesanan</span>
          </div>
        </div>
      </div>

      {/* PANDUAN CARA MERETUR DAN REFUND (SANGAT JELAS) */}
      <div className="bg-gradient-to-br from-teal-900 via-[#1b7c76] to-[#21938c] text-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold">Panduan &amp; Cara Mudah Melakukan Retur / Refund</h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Ikuti 4 langkah sederhana berikut saat pelanggan membatalkan pesanan atau terjadi komplain menu:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Langkah 1 */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-white text-[#21938c] font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] text-teal-200 font-bold uppercase">Langkah 1</span>
            </div>
            <h3 className="text-xs font-bold text-white">Cari Transaksi Pelanggan</h3>
            <p className="text-[11px] text-teal-100/80 leading-relaxed">
              Buka tab <strong>"Cari &amp; Proses Retur"</strong> di bawah, ketik nomor invoice atau nama pelanggan.
            </p>
          </div>

          {/* Langkah 2 */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-white text-[#21938c] font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] text-teal-200 font-bold uppercase">Langkah 2</span>
            </div>
            <h3 className="text-xs font-bold text-white">Klik "Proses Retur"</h3>
            <p className="text-[11px] text-teal-100/80 leading-relaxed">
              Tekan tombol merah <strong>"Proses Retur"</strong> pada baris transaksi yang ingin dibatalkan.
            </p>
          </div>

          {/* Langkah 3 */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-white text-[#21938c] font-black text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] text-teal-200 font-bold uppercase">Langkah 3</span>
            </div>
            <h3 className="text-xs font-bold text-white">Pilih Alasan Retur</h3>
            <p className="text-[11px] text-teal-100/80 leading-relaxed">
              Pilih alasan pembatalan (salah input, pesanan rusak/tumpah, komplain rasa, atau pembatalan pembeli).
            </p>
          </div>

          {/* Langkah 4 */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-white text-[#21938c] font-black text-xs flex items-center justify-center">
                4
              </span>
              <span className="text-[10px] text-teal-200 font-bold uppercase">Langkah 4</span>
            </div>
            <h3 className="text-xs font-bold text-white">Stok Kembali Otomatis!</h3>
            <p className="text-[11px] text-teal-100/80 leading-relaxed">
              Kembalikan uang ke pelanggan. Sistem otomatis <strong>menambah kembali stok barang</strong> ke inventaris.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'process'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cari &amp; Proses Retur ({completedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Riwayat Retur Selesai ({refundedOrders.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari No. Invoice, Kasir, atau Pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c] bg-[#f8fafc]"
          />
        </div>
      </div>

      {/* TAB 1: CARI & PROSES RETUR TRANSAKSI */}
      {activeTab === 'process' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="font-bold text-xs text-gray-800">
              Daftar Transaksi Selesai yang Dapat Diretur
            </span>
            <span className="text-[11px] text-gray-500">
              Pilih transaksi di bawah untuk membatalkan dan mengembalikan dana
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-3">Waktu Transaksi</th>
                  <th className="py-3 px-3">Kasir Bertugas</th>
                  <th className="py-3 px-3">Pelanggan</th>
                  <th className="py-3 px-3">Menu Pesanan</th>
                  <th className="py-3 px-3">Metode Bayar</th>
                  <th className="py-3 px-3 text-right">Total Bayar</th>
                  <th className="py-3 px-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompletedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Tidak ada transaksi yang cocok dengan pencarian
                    </td>
                  </tr>
                ) : (
                  filteredCompletedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {order.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}{' '}
                        <span className="text-[10px] text-gray-400 block">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-gray-800 capitalize">
                        {order.cashierName}
                      </td>
                      <td className="py-3.5 px-3 text-gray-700">
                        {order.customerName || 'Pelanggan Umum'}
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 max-w-[200px] truncate" title={order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}>
                        {order.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-gray-900">
                        {formatCurrency(order.total, settings.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenRefundModal(order)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Proses Retur &amp; Refund</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RIWAYAT TRANSAKSI YANG TELAH DIRETUR */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-bold text-xs text-gray-800">
            Riwayat Transaksi yang Telah Diretur / Dikembalikan (Audit Trail)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-3">Waktu Retur</th>
                  <th className="py-3 px-3">Kasir Pemroses</th>
                  <th className="py-3 px-3">Alasan Retur / Pembatalan</th>
                  <th className="py-3 px-3">Menu yang Dikembalikan</th>
                  <th className="py-3 px-3 text-right">Nilai Refund</th>
                  <th className="py-3 px-3 text-center">Status Stok</th>
                  <th className="py-3 px-4 text-right">Struk Refund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRefundedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Belum ada transaksi yang diretur
                    </td>
                  </tr>
                ) : (
                  filteredRefundedOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{o.invoiceNumber}</td>
                      <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                        {o.refundedAt
                          ? new Date(o.refundedAt).toLocaleString('id-ID')
                          : new Date(o.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-gray-800 capitalize">{o.cashierName}</td>
                      <td className="py-3.5 px-3 text-rose-700 font-medium">
                        {o.refundReason || 'Pembatalan Transaksi'}
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 max-w-[200px] truncate" title={o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}>
                        {o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-rose-600">
                        {formatCurrency(o.total, settings.currency)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Stok Otomatis Dipulihkan</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveReceiptOrder(o)}
                          className="px-2.5 py-1.5 rounded-xl bg-teal-50 text-[#21938c] hover:bg-teal-100 font-bold text-xs transition-colors inline-flex items-center gap-1"
                          title="Cetak Bukti Refund"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Bukti</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PROSES RETUR & REFUND INTERAKTIF */}
      {selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Konfirmasi Retur &amp; Refund</h3>
                  <p className="text-xs text-gray-500 font-mono">Invoice: {selectedOrderForRefund.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForRefund(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Refund Amount Box */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-rose-800 font-semibold block text-[11px]">Uang yang Harus Dikembalikan ke Pelanggan:</span>
                  <div className="text-2xl font-black text-rose-600 mt-0.5">
                    {formatCurrency(selectedOrderForRefund.total, settings.currency)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-rose-700">
                  <span className="font-bold uppercase bg-white/80 px-2 py-0.5 rounded-md border border-rose-200">
                    Metode: {selectedOrderForRefund.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items returning to inventory */}
              <div>
                <label className="font-bold text-gray-800 block mb-1.5">
                  Daftar Menu yang Akan Dikembalikan ke Stok:
                </label>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                  {selectedOrderForRefund.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-gray-800 font-medium">
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>+{item.quantity} unit ke stok</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Pilih Alasan Retur / Pembatalan:
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:border-[#21938c] focus:outline-hidden bg-white"
                >
                  <option value="Salah Input Menu oleh Kasir">Salah Input Menu oleh Kasir</option>
                  <option value="Pesanan Dibatalkan oleh Pelanggan">Pesanan Dibatalkan oleh Pelanggan</option>
                  <option value="Makanan / Minuman Rusak atau Tumpah">Makanan / Minuman Rusak atau Tumpah</option>
                  <option value="Komplain Rasa / Kualitas Menu">Komplain Rasa / Kualitas Menu</option>
                  <option value="Pergantian Menu yang Berbeda">Pergantian Menu yang Berbeda</option>
                  <option value="Lainnya">Alasan Lainnya</option>
                </select>
              </div>

              {/* Custom Note */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Keterangan singkat kronologi retur..."
                  value={customReasonNote}
                  onChange={(e) => setCustomReasonNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#21938c] focus:outline-hidden bg-white"
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="confirm-refund-check"
                  checked={isConfirmChecked}
                  onChange={(e) => setIsConfirmChecked(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <label htmlFor="confirm-refund-check" className="text-[11px] text-amber-900 font-semibold cursor-pointer leading-relaxed">
                  Saya mengonfirmasi bahwa dana sebesar <strong>{formatCurrency(selectedOrderForRefund.total, settings.currency)}</strong> telah dikembalikan kepada pelanggan dan stok barang akan dipulihkan ke inventaris kafe.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForRefund(null)}
                  className="py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRefund}
                  disabled={!isConfirmChecked}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Konfirmasi &amp; Pulihkan Stok</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
