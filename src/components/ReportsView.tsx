import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  Clock,
  CreditCard,
  Award,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateReportMetrics, formatCurrency, exportOrdersToExcel } from '../utils/rules';

export const ReportsView: React.FC = () => {
  const { orders, settings, currentUser } = useApp();

  const [dateRangeFilter, setDateRangeFilter] = useState<'today' | '7days' | 'month' | 'custom'>('today');
  const [customStart, setCustomStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showPrintReportModal, setShowPrintReportModal] = useState<boolean>(false);

  // Compute filter dates
  let startDate: string | undefined = undefined;
  let endDate: string | undefined = undefined;

  const todayStr = new Date().toISOString().split('T')[0];

  if (dateRangeFilter === 'today') {
    startDate = todayStr;
    endDate = todayStr;
  } else if (dateRangeFilter === '7days') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    startDate = d.toISOString().split('T')[0];
    endDate = todayStr;
  } else if (dateRangeFilter === 'month') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    startDate = d.toISOString().split('T')[0];
    endDate = todayStr;
  } else if (dateRangeFilter === 'custom') {
    startDate = customStart;
    endDate = customEnd;
  }

  const metrics = calculateReportMetrics(orders, startDate, endDate);

  const handleExportExcel = () => {
    const blob = exportOrdersToExcel(orders, settings.currency);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan-Penjualan-PosyMart-${startDate || 'all'}-sd-${endDate || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Filter & Export Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Periode:</span>
          </span>
          <button
            onClick={() => setDateRangeFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              dateRangeFilter === 'today'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setDateRangeFilter('7days')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              dateRangeFilter === '7days'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setDateRangeFilter('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              dateRangeFilter === 'month'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setDateRangeFilter('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              dateRangeFilter === 'custom'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Kustom
          </button>
        </div>

        {/* Custom date range inputs */}
        {dateRangeFilter === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="p-1.5 rounded-lg border border-gray-200 text-xs"
            />
            <span className="text-gray-400">s/d</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="p-1.5 rounded-lg border border-gray-200 text-xs"
            />
          </div>
        )}

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            title="Download Spreadsheet Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>
          <button
            onClick={() => setShowPrintReportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-50 text-[#21938c] border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
            title="Cetak atau Simpan PDF Laporan Penjualan"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Key Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Penjualan (Omzet)</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#21938c] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.totalSales, settings.currency)}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Subtotal: {formatCurrency(metrics.totalSubtotal, settings.currency)} + Pajak
            </p>
          </div>
        </div>

        {/* Keuntungan Kotor (Profit) */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Keuntungan Kotor (Profit)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(metrics.grossProfit, settings.currency)}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Margin: {metrics.profitMarginPercent}% dari HPP
            </p>
          </div>
        </div>

        {/* Total Transaksi & AOV */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Transaksi</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">{metrics.totalOrders} Struk</div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              AOV: {formatCurrency(metrics.avgOrderValue, settings.currency)} / order
            </p>
          </div>
        </div>

        {/* Total Item Terjual */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Item Terjual</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">{metrics.totalItemsSold} Pcs/Cup</div>
            <p className="text-[11px] text-purple-700 font-medium mt-0.5">
              Rata-rata {(metrics.totalOrders > 0 ? metrics.totalItemsSold / metrics.totalOrders : 0).toFixed(1)} item/order
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Top Products & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 5 Best Selling Products */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#21938c]" />
              <span>5 Produk Terlaris (Top Selling)</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">Berdasarkan Kuantitas</span>
          </div>

          {metrics.topProducts.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">Belum ada data penjualan pada periode ini</p>
          ) : (
            <div className="space-y-3">
              {metrics.topProducts.map((item, idx) => {
                const maxQty = metrics.topProducts[0].quantity;
                const progressWidth = Math.max(10, (item.quantity / maxQty) * 100);

                return (
                  <div key={item.product.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-teal-50 text-[#21938c] text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-gray-800">{item.product.name}</span>
                        <span className="text-[10px] text-gray-400">({item.product.category})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          {formatCurrency(item.revenue, settings.currency)}
                        </span>
                        <span className="text-gray-400 text-[11px] ml-1.5">({item.quantity} {item.product.unit})</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#21938c] h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Methods Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#21938c]" />
              <span>Metode Pembayaran</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">Distribusi Omzet</span>
          </div>

          <div className="space-y-3">
            {[
              { key: 'cash', label: 'Tunai (Cash)', color: 'bg-emerald-500', bgLight: 'bg-emerald-50 text-emerald-700' },
              { key: 'qris', label: 'QRIS', color: 'bg-[#21938c]', bgLight: 'bg-teal-50 text-teal-800' },
              { key: 'debit', label: 'Debit / Kredit', color: 'bg-blue-500', bgLight: 'bg-blue-50 text-blue-700' },
              { key: 'transfer', label: 'Transfer Bank', color: 'bg-indigo-500', bgLight: 'bg-indigo-50 text-indigo-700' }
            ].map((method) => {
              const data = metrics.paymentMethodMap[method.key as keyof typeof metrics.paymentMethodMap];
              const pct = metrics.totalSales > 0 ? ((data.total / metrics.totalSales) * 100).toFixed(1) : '0';

              return (
                <div key={method.key} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${method.color}`} />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{method.label}</p>
                      <p className="text-[10px] text-gray-400">{data.count} Transaksi ({pct}%)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(data.total, settings.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hourly Sales Activity / Peak Hours */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#21938c]" />
              <span>Aktivitas Penjualan per Jam (Peak Hours)</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Analisis jam paling sibuk untuk optimasi shift kasir</p>
          </div>
        </div>

        {/* Visual Mini Hourly Bars */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 items-end h-28 pt-4 pb-2 border-b border-gray-100">
          {metrics.hourlySales.map((h, i) => {
            const maxHourSales = Math.max(...metrics.hourlySales.map((item) => item.sales), 1);
            const barHeightPct = Math.max(8, (h.sales / maxHourSales) * 100);

            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[9px] p-1.5 rounded-md whitespace-nowrap z-20 pointer-events-none shadow-lg">
                  <p className="font-bold">{h.hour}</p>
                  <p>{formatCurrency(h.sales, settings.currency)}</p>
                  <p>{h.orders} order</p>
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    h.sales > 0 ? 'bg-[#21938c] group-hover:bg-[#1b7c76]' : 'bg-gray-100'
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                />
                <span className="text-[8px] text-gray-400 mt-1 truncate hidden sm:block">
                  {i % 3 === 0 ? i : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 pt-1">
          <span>00:00 (Pagi)</span>
          <span>12:00 (Siang Peak)</span>
          <span>23:00 (Malam)</span>
        </div>
      </div>

      {/* Formatted Printable Daily Report Modal */}
      {showPrintReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 print:hidden">
              <h3 className="text-base font-bold text-gray-900">Laporan Penjualan Siap Cetak / PDF</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="px-3.5 py-1.5 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintReportModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div className="p-6 my-4 bg-white border border-gray-200 rounded-xl font-sans text-xs text-gray-800 space-y-4">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-extrabold uppercase text-[#21938c]">{settings.storeName}</h2>
                <p className="text-xs text-gray-600 font-medium">LAPORAN PENJUALAN HARIAN &amp; LABA BERSIH</p>
                <p className="text-[11px] text-gray-500">{settings.address} • Telp: {settings.phone}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Periode: {startDate || 'Awal'} s/d {endDate || 'Sekarang'} | Dicetak: {new Date().toLocaleString('id-ID')}
                </p>
              </div>

              {/* Financial Summary Table */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[11px]">1. Ringkasan Keuangan</h4>
                <table className="w-full border-collapse border border-gray-200 text-xs">
                  <tbody>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="p-2 font-semibold">Total Penjualan Kotor (Gross Sales)</td>
                      <td className="p-2 text-right font-bold">{formatCurrency(metrics.totalSales, settings.currency)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 font-semibold">Total Modal HPP (Cost of Goods Sold)</td>
                      <td className="p-2 text-right font-semibold text-gray-700">{formatCurrency(metrics.totalCost, settings.currency)}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-emerald-50">
                      <td className="p-2 font-bold text-emerald-800">Keuntungan Kotor (Gross Profit)</td>
                      <td className="p-2 text-right font-extrabold text-emerald-800">{formatCurrency(metrics.grossProfit, settings.currency)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">Persentase Margin Keuntungan</td>
                      <td className="p-2 text-right font-bold">{metrics.profitMarginPercent}%</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">Total Pajak Terkumpul</td>
                      <td className="p-2 text-right">{formatCurrency(metrics.totalTax, settings.currency)}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Total Struk Transaksi Selesai</td>
                      <td className="p-2 text-right font-bold">{metrics.totalOrders} Struk</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Top Products */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[11px]">2. Produk Terlaris</h4>
                <table className="w-full border-collapse border border-gray-200 text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Nama Produk</th>
                      <th className="p-2 text-center">Kuantitas</th>
                      <th className="p-2 text-right">Total Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topProducts.map((p) => (
                      <tr key={p.product.id} className="border-b border-gray-200">
                        <td className="p-2 font-medium">{p.product.name}</td>
                        <td className="p-2 text-center">{p.quantity} {p.product.unit}</td>
                        <td className="p-2 text-right font-bold">{formatCurrency(p.revenue, settings.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="text-gray-500 mb-12">Kasir Bertugas,</p>
                  <p className="font-bold underline">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-12">Manajer / Pemilik,</p>
                  <p className="font-bold underline">John Doe (Admin)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
