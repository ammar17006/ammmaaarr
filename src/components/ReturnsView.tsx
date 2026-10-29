import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/rules';

export const ReturnsView: React.FC = () => {
  const { orders, refundOrder, settings, currentUser } = useApp();
  const [search, setSearch] = useState('');

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const refundedOrders = orders.filter((o) => o.status === 'refunded');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#21938c]" />
            <span>Manajemen Retur &amp; Pengembalian Dana (Refund)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Membatalkan pesanan akan secara otomatis mengembalikan stok barang ke inventaris
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-100">
            {refundedOrders.length} Pesanan Diretur
          </span>
        </div>
      </div>

      {/* Refunded History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-xs text-gray-800">
          Riwayat Transaksi yang Telah Diretur / Dikembalikan
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Kasir</th>
                <th className="py-3 px-3">Item Diretur</th>
                <th className="py-3 px-3 text-right">Nilai Refund</th>
                <th className="py-3 px-4 text-center">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refundedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Belum ada transaksi yang diretur
                  </td>
                </tr>
              ) : (
                refundedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.invoiceNumber}</td>
                    <td className="py-3 px-3 text-gray-500">{new Date(o.createdAt).toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-gray-700">{o.cashierName}</td>
                    <td className="py-3 px-3 text-gray-600">
                      {o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">
                      {formatCurrency(o.total, settings.currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 w-fit mx-auto">
                        <PackageCheck className="w-3 h-3" />
                        <span>Stok Dipulihkan</span>
                      </span>
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
