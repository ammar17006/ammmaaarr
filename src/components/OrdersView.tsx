import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Printer,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatCurrency, exportOrdersToExcel } from '../utils/rules';

export const OrdersView: React.FC = () => {
  const {
    orders,
    setActiveReceiptOrder,
    refundOrder,
    settings,
    currentUser
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'refunded'>('all');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
      o.cashierName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const blob = exportOrdersToExcel(filteredOrders, settings.currency);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Riwayat-Transaksi-PosyMart-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari No. Invoice, Kasir, atau Pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 text-xs rounded-xl border border-gray-200 bg-[#f8fafc] text-gray-700"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="refunded">Dibatalkan / Retur</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 self-end md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Ekspor Riwayat Excel</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Kasir</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Metode</th>
                <th className="py-3 px-3 text-right">Total Tagihan</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {o.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      <span className="block text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-700 font-medium">
                      {o.cashierName}
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      {o.customerName || 'Pelanggan Umum'}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate" title={o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}>
                      {o.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      {formatCurrency(o.total, settings.currency)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {o.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Retur / Refund
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveReceiptOrder(o)}
                          className="p-1.5 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                          title="Lihat & Cetak Ulang Struk"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {currentUser.role === 'admin' && o.status === 'completed' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Batalkan transaksi ${o.invoiceNumber} dan kembalikan stok?`)) {
                                refundOrder(o.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Retur / Refund Transaksi"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
