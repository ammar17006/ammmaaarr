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
  Filter,
  Users,
  UserCheck,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calculateReportMetrics,
  calculateCashierPerformance,
  formatCurrency,
  exportOrdersToExcel,
  CashierPerformance
} from '../utils/rules';

export const ReportsView: React.FC = () => {
  const { orders, settings, currentUser, users } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'cashier'>('sales');
  const [dateRangeFilter, setDateRangeFilter] = useState<'today' | '7days' | 'month' | 'custom'>('today');
  const [customStart, setCustomStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCashierFilter, setSelectedCashierFilter] = useState<string>('all');
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

  // Filter orders by cashier if specific cashier selected
  const filteredOrdersByCashier = orders.filter((o) => {
    if (selectedCashierFilter === 'all') return true;
    return o.cashierName.toLowerCase() === selectedCashierFilter.toLowerCase();
  });

  const metrics = calculateReportMetrics(filteredOrdersByCashier, startDate, endDate);
  const cashierPerformances = calculateCashierPerformance(orders, startDate, endDate);

  const filteredCashierList = cashierPerformances.filter((c) => {
    if (selectedCashierFilter === 'all') return true;
    return c.cashierName.toLowerCase() === selectedCashierFilter.toLowerCase();
  });

  const handleExportExcel = () => {
    const blob = exportOrdersToExcel(filteredOrdersByCashier, settings.currency);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan-Penjualan-Ammar-Kafe-${startDate || 'all'}-sd-${endDate || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Find user avatar helper
  const getCashierAvatar = (name: string) => {
    const u = users.find((usr) => usr.name.toLowerCase() === name.toLowerCase());
    return u?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  };

  const getCashierRole = (name: string) => {
    const u = users.find((usr) => usr.name.toLowerCase() === name.toLowerCase());
    return u?.role === 'admin' ? 'Administrator' : 'Kasir';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Main Report Tabs & Filters */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#21938c] text-[11px] font-bold mb-1 border border-teal-100">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Laporan Analitik ammar kafe</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Laporan Penjualan &amp; Kinerja Kasir</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau omzet, profit harian, dan evaluasi performa transaksi setiap kasir bertugas
          </p>
        </div>

        {/* Tab Switcher: Ringkasan vs Kinerja Kasir */}
        <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-2xl border border-gray-200 self-start md:self-auto">
          <button
            onClick={() => setActiveReportTab('sales')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReportTab === 'sales'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ringkasan Penjualan</span>
          </button>
          <button
            onClick={() => setActiveReportTab('cashier')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeReportTab === 'cashier'
                ? 'bg-[#21938c] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kinerja Kasir ({cashierPerformances.length})</span>
          </button>
        </div>
      </div>

      {/* Date & Filter Toolbar */}
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

        {/* Filter Kasir Dropdown & Export Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-end md:self-auto">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedCashierFilter}
              onChange={(e) => setSelectedCashierFilter(e.target.value)}
              className="text-xs font-bold text-gray-700 bg-transparent focus:outline-hidden"
            >
              <option value="all">Semua Kasir ({users.length})</option>
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.role === 'admin' ? 'Admin' : 'Kasir'})
                </option>
              ))}
            </select>
          </div>

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
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: RINGKASAN PENJUALAN */}
      {activeReportTab === 'sales' && (
        <div className="space-y-6">
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
                <span className="text-xs font-semibold text-gray-500">Total Transaksi Selesai</span>
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
                <span className="text-xs font-semibold text-gray-500">Total Item Terjual</span>
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

          {/* Banner Peringkat Kasir Ringkas */}
          <div className="bg-gradient-to-r from-teal-50 via-white to-teal-50/40 p-4 rounded-2xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-[#21938c] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Ringkasan Kinerja Kasir Bertugas ({cashierPerformances.length} Kasir Aktif)
                </p>
                <p className="text-[11px] text-gray-500">
                  {cashierPerformances.length > 0
                    ? `Peraih omzet tertinggi: ${cashierPerformances[0].cashierName} (${formatCurrency(cashierPerformances[0].totalSales, settings.currency)})`
                    : 'Belum ada data kasir'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveReportTab('cashier')}
              className="px-4 py-2 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <span>Lihat Detail Kinerja Kasir</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
                          <span className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-teal-50 text-[#21938c] text-[10px] font-black flex items-center justify-center border border-teal-100">
                              {idx + 1}
                            </span>
                            <span>{item.product.name}</span>
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.quantity} {item.product.unit} ({formatCurrency(item.revenue, settings.currency)})
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#21938c]"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#21938c]" />
                  <span>Metode Pembayaran</span>
                </h3>
                <span className="text-xs text-gray-400 font-medium">Arus Kas</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'cash', label: 'Tunai (Cash)', color: 'bg-emerald-500' },
                  { key: 'qris', label: 'QRIS Digital', color: 'bg-teal-500' },
                  { key: 'debit', label: 'Kartu Debit', color: 'bg-blue-500' },
                  { key: 'transfer', label: 'Transfer Bank', color: 'bg-purple-500' }
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
        </div>
      )}

      {/* VIEW 2: KINERJA KASIR (CASHIER PERFORMANCE) */}
      {activeReportTab === 'cashier' && (
        <div className="space-y-6">
          {/* Top Cashier KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Kasir Performa Tertinggi</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {cashierPerformances[0]?.cashierName || '-'}
                </div>
                <p className="text-[11px] text-[#21938c] font-bold mt-0.5">
                  Omzet: {formatCurrency(cashierPerformances[0]?.totalSales || 0, settings.currency)} ({cashierPerformances[0]?.salesPercentage || 0}%)
                </p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Transaksi Kasir</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900">
                  {cashierPerformances.reduce((sum, c) => sum + c.totalOrders, 0)} Struk
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Rata-rata {(cashierPerformances.length > 0 ? (cashierPerformances.reduce((sum, c) => sum + c.totalOrders, 0) / cashierPerformances.length).toFixed(1) : 0)} order / kasir
                </p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Penerimaan Tunai (Laci Kasir)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(cashierPerformances.reduce((sum, c) => sum + c.cashTotal, 0), settings.currency)}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Uang fisik cash tersimpan di laci kasir
                </p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Penerimaan Digital (QRIS/EDC)</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(cashierPerformances.reduce((sum, c) => sum + (c.qrisTotal + c.debitTotal + c.transferTotal), 0), settings.currency)}
                </div>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">
                  Rekening digital kafe (non-tunai)
                </p>
              </div>
            </div>
          </div>

          {/* Cashier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCashierList.map((cashier, idx) => {
              const avatarUrl = getCashierAvatar(cashier.cashierName);
              const roleLabel = getCashierRole(cashier.cashierName);

              return (
                <div
                  key={cashier.cashierName}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div>
                    {/* Header: Photo, Name, Badge & Rank */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt={cashier.cashierName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-gray-900 capitalize">
                              {cashier.cashierName}
                            </h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              roleLabel === 'Administrator'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-teal-50 text-[#21938c] border border-teal-100'
                            }`}>
                              {roleLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400">Peringkat #{idx + 1} Penjualan</p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-teal-50 text-[#21938c] text-xs font-black flex items-center justify-center border border-teal-100">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Total Sales Progress */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-500">Total Omzet Penjualan</span>
                        <span className="text-xs font-black text-[#21938c]">{cashier.salesPercentage}% Kafe</span>
                      </div>
                      <div className="text-xl font-extrabold text-gray-900">
                        {formatCurrency(cashier.totalSales, settings.currency)}
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#21938c]"
                          style={{ width: `${Math.min(100, Math.max(5, cashier.salesPercentage))}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium">Transaksi Selesai</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">{cashier.totalOrders} Struk</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium">Rata-rata/Order (AOV)</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                          {formatCurrency(cashier.avgOrderValue, settings.currency)}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium">Total Item Terjual</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">{cashier.totalItemsSold} Pcs</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium">Menu Terlaris Kasir</p>
                        <p className="text-xs font-bold text-teal-800 truncate mt-0.5" title={cashier.topItemName}>
                          {cashier.topItemName} ({cashier.topItemQuantity})
                        </p>
                      </div>
                    </div>

                    {/* Cashier Payment Breakdown (Audit Kas) */}
                    <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] space-y-1.5">
                      <p className="font-bold text-gray-700 text-xs mb-1">Rincian Pembayaran Masuk:</p>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Uang Tunai (Laci Kas):</span>
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(cashier.cashTotal, settings.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          <span>QRIS Digital:</span>
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(cashier.qrisTotal, settings.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>Debit &amp; Transfer:</span>
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(cashier.debitTotal + cashier.transferTotal, settings.currency)}
                        </span>
                      </div>
                      {cashier.refundOrdersCount > 0 && (
                        <div className="flex justify-between items-center text-rose-600 pt-1 border-t border-dashed border-gray-200">
                          <span>Retur / Dibatalkan:</span>
                          <span className="font-bold">
                            {cashier.refundOrdersCount} order ({formatCurrency(cashier.refundTotal, settings.currency)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Kasir ammar kafe</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Shift Aktif</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabel Lengkap Performa & Rekapitulasi Kasir */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#21938c]" />
                  <span>Tabel Rekapitulasi &amp; Audit Kinerja Kasir</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Gunakan data setoran tunai &amp; digital untuk rekonsiliasi kas harian
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {filteredCashierList.length} Kasir Terdata
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Peringkat</th>
                    <th className="py-3 px-4">Nama Kasir</th>
                    <th className="py-3 px-3">Role / Jabatan</th>
                    <th className="py-3 px-3 text-center">Jumlah Struk</th>
                    <th className="py-3 px-3 text-right">Total Omzet</th>
                    <th className="py-3 px-3 text-right">Rata-rata / Order</th>
                    <th className="py-3 px-3 text-right">Setoran Tunai (Laci)</th>
                    <th className="py-3 px-3 text-right">Setoran Digital</th>
                    <th className="py-3 px-4 text-center">Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCashierList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400">
                        Tidak ada data kinerja kasir pada periode ini
                      </td>
                    </tr>
                  ) : (
                    filteredCashierList.map((c, i) => (
                      <tr key={c.cashierName} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#21938c]">
                          #{i + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 capitalize flex items-center gap-2">
                          <img
                            src={getCashierAvatar(c.cashierName)}
                            alt={c.cashierName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{c.cashierName}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            getCashierRole(c.cashierName) === 'Administrator'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-50 text-[#21938c]'
                          }`}>
                            {getCashierRole(c.cashierName)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-gray-800">
                          {c.totalOrders} order
                        </td>
                        <td className="py-3.5 px-3 text-right font-black text-gray-900">
                          {formatCurrency(c.totalSales, settings.currency)}
                        </td>
                        <td className="py-3.5 px-3 text-right text-gray-600">
                          {formatCurrency(c.avgOrderValue, settings.currency)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                          {formatCurrency(c.cashTotal, settings.currency)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-teal-700">
                          {formatCurrency(c.qrisTotal + c.debitTotal + c.transferTotal, settings.currency)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-50 text-[#21938c] border border-teal-100">
                            {c.salesPercentage}%
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
      )}

      {/* Formatted Printable Daily Report Modal */}
      {showPrintReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 print:hidden">
              <h3 className="text-base font-bold text-gray-900">Laporan Penjualan &amp; Kinerja Kasir Siap Cetak</h3>
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
                <p className="text-xs text-gray-600 font-medium">LAPORAN PENJUALAN &amp; AUDIT KINERJA KASIR</p>
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

              {/* Cashier Performance Table in Print View */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[11px]">2. Rekapitulasi Kinerja Kasir Bertugas</h4>
                <table className="w-full border-collapse border border-gray-200 text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Nama Kasir</th>
                      <th className="p-2 text-center">Struk</th>
                      <th className="p-2 text-right">Setoran Tunai</th>
                      <th className="p-2 text-right">Setoran Digital</th>
                      <th className="p-2 text-right">Total Omzet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashierPerformances.map((c) => (
                      <tr key={c.cashierName} className="border-b border-gray-200">
                        <td className="p-2 font-bold capitalize">{c.cashierName}</td>
                        <td className="p-2 text-center">{c.totalOrders}</td>
                        <td className="p-2 text-right">{formatCurrency(c.cashTotal, settings.currency)}</td>
                        <td className="p-2 text-right">{formatCurrency(c.qrisTotal + c.debitTotal + c.transferTotal, settings.currency)}</td>
                        <td className="p-2 text-right font-bold">{formatCurrency(c.totalSales, settings.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Products */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[11px]">3. Produk Terlaris</h4>
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
                  <p className="font-bold underline capitalize">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-12">Manajer / Pemilik,</p>
                  <p className="font-bold underline">ammar (Admin)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
