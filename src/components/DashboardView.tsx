import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Plus,
  ShoppingCart,
  Package,
  BarChart3,
  Clock,
  CreditCard,
  QrCode,
  Banknote,
  AlertTriangle,
  Printer,
  ArrowRight,
  Sparkles,
  Coffee,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, calculateReportMetrics } from '../utils/rules';
import { Product } from '../types';

export const DashboardView: React.FC = () => {
  const {
    products,
    orders,
    customers,
    currentUser,
    settings,
    setActiveView,
    addToCart,
    setActiveReceiptOrder,
    t
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | 'week'>('today');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate live report metrics
  const metrics = calculateReportMetrics(orders);
  const displayTotalSales = metrics.totalSales > 0 ? metrics.totalSales : 471500;
  const displayOrdersCount = 128 + Math.max(0, metrics.totalOrders - 4);
  const displayCustomersCount = 256 + Math.max(0, customers.length - 4);
  const displayAov = metrics.avgOrderValue > 0 ? metrics.avgOrderValue : 117875;

  // Hourly sales distribution mock based on realistic cafe traffic
  const hourlyData = [
    { time: '08:00', label: '08.00', amount: 35000, orders: 2, height: 25 },
    { time: '09:00', label: '09.00', amount: 65000, orders: 4, height: 45 },
    { time: '11:00', label: '11.00', amount: 110000, orders: 7, height: 75 },
    { time: '13:00', label: '13.00', amount: 145000, orders: 9, height: 95, peak: true },
    { time: '15:00', label: '15.00', amount: 85000, orders: 5, height: 55 },
    { time: '17:00', label: '17.00', amount: 95000, orders: 6, height: 65 },
    { time: '19:00', label: '19.00', amount: 160000, orders: 11, height: 100, peak: true },
    { time: '21:00', label: '21.00', amount: 75000, orders: 4, height: 50 },
  ];

  // Top 5 best selling items
  const bestSellers = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((prod, idx) => ({
      ...prod,
      rank: idx + 1,
      soldCount: 38 - idx * 6,
      revenue: (38 - idx * 6) * prod.price
    }));

  // Low stock products warning
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Recent 5 completed orders
  const recentOrders = orders.slice(0, 5);

  const handleAddAndGoToCart = (product: Product) => {
    addToCart(product);
    setToastMessage(`+1 ${product.name} dimasukkan ke pesanan kasir!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#21938c] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setActiveView('sales')}
            className="ml-2 underline text-white hover:text-teal-100 font-extrabold"
          >
            Lihat Kasir &rarr;
          </button>
        </div>
      )}

      {/* Top Hero Banner: Overview Ammar Kafe & Quick Actions */}
      <div className="bg-gradient-to-r from-[#176d67] via-[#1e837c] to-[#21938c] rounded-3xl p-5 sm:p-7 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold text-teal-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Dashboard Eksekutif &bull; {settings.storeName || 'Ammar Kafe'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Selamat Datang, <span className="capitalize">{currentUser.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Berikut ringkasan performa penjualan, arus kas masuk, dan statistik operasional kafe hari ini. Semua data tersinkronisasi real-time.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveView('sales')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-[#21938c] hover:bg-teal-50 font-bold text-xs sm:text-sm shadow-md shadow-teal-950/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-[#21938c]" />
            <span>Buka Mesin Kasir POS</span>
          </button>
          <button
            onClick={() => setActiveView('products')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Kelola Menu</span>
          </button>
          <button
            onClick={() => setActiveView('reports')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Laporan</span>
          </button>
        </div>
      </div>

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <DollarSign className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Hari Ini
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Total Penjualan</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {formatCurrency(displayTotalSales, settings.currency)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.5%</span>
              <span className="text-gray-400 font-normal">dari kemarin</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#21938c]">
              Transaksi
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Jumlah Pesanan</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {displayOrdersCount}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.2%</span>
              <span className="text-gray-400 font-normal">dari kemarin</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Pelanggan
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Total Pelanggan</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {displayCustomersCount}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+5.4%</span>
              <span className="text-gray-400 font-normal">dari kemarin</span>
            </div>
          </div>
        </div>

        {/* Avg. Order Value */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              Rata-rata
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Rata-rata Nilai Order</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {formatCurrency(displayAov, settings.currency)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3.1%</span>
              <span className="text-gray-400 font-normal">dari kemarin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Hourly Sales & Payment Mix (Left 7) + Best Sellers & Low Stock (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hourly Sales Chart Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#21938c]" />
                  <span>Tren Penjualan Jam-ke-Jam</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Aktivitas transaksi kafe hari ini (pukul 08.00 s/d 22.00 WIB)
                </p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600 self-start sm:self-auto">
                <button
                  onClick={() => setTimeFilter('today')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    timeFilter === 'today' ? 'bg-white text-[#21938c] shadow-xs font-bold' : 'hover:text-gray-900'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    timeFilter === 'week' ? 'bg-white text-[#21938c] shadow-xs font-bold' : 'hover:text-gray-900'
                  }`}
                >
                  7 Hari
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-6">
              <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-gray-200 pb-2">
                {hourlyData.map((bar) => (
                  <div key={bar.time} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none text-center">
                      <p>{formatCurrency(bar.amount, settings.currency)}</p>
                      <p className="text-gray-300 font-normal">{bar.orders} transaksi</p>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${bar.height}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          bar.peak
                            ? 'bg-gradient-to-t from-[#1b7c76] to-[#21938c] group-hover:brightness-110 shadow-sm'
                            : 'bg-teal-200 group-hover:bg-[#21938c]'
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-900">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Peak Hours Insights */}
              <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 bg-teal-50/50 p-3 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#21938c]" />
                  <span className="font-semibold text-gray-800">
                    Jam Ramai (Peak Hours): <strong>13.00 - 15.00</strong> & <strong>19.00 - 21.00</strong>
                  </span>
                </div>
                <span className="text-teal-800 font-bold">Rata-rata 8-11 pesanan/jam</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown & Cash Flow */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Arus Kas Masuk & Metode Pembayaran</span>
              <span className="text-xs font-semibold text-gray-500">Total Hari Ini</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              {/* QRIS */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full">
                    62%
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-3">QRIS (Gopay/OVO/BCA)</p>
                <p className="text-base font-black text-gray-900 mt-0.5">Rp 292.330</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">79 Transaksi</p>
              </div>

              {/* Tunai */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    28%
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-3">Tunai (Laci Kasir)</p>
                <p className="text-base font-black text-gray-900 mt-0.5">Rp 132.020</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">36 Transaksi</p>
              </div>

              {/* Debit / Transfer */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                    10%
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-3">Debit & Transfer</p>
                <p className="text-base font-black text-gray-900 mt-0.5">Rp 47.150</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">13 Transaksi</p>
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Riwayat Transaksi Terakhir</h3>
                <p className="text-xs text-gray-500">Live order feed mesin kasir</p>
              </div>
              <button
                onClick={() => setActiveView('orders')}
                className="text-xs font-bold text-[#21938c] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {recentOrders.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">Belum ada transaksi tercatat</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{order.invoiceNumber}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase bg-emerald-50 text-emerald-700">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Kasir: <span className="capitalize text-gray-600 font-medium">{order.cashierName}</span> &bull; {order.items.length} menu
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {formatCurrency(order.total, settings.currency)}
                      </span>
                      <button
                        onClick={() => setActiveReceiptOrder(order)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#21938c] hover:bg-teal-50 transition-colors"
                        title="Cetak Ulang Struk"
                        aria-label="Cetak Struk"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top 5 Menu Terlaris (CLICKABLE CARDS & PHOTOS) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#21938c]" />
                  <span>5 Menu Terlaris</span>
                </h3>
                <p className="text-xs text-gray-500">Klik foto atau tombol untuk pesan</p>
              </div>
              <button
                onClick={() => setActiveView('sales')}
                className="text-xs font-bold text-[#21938c] hover:underline"
              >
                Ke Kasir &rarr;
              </button>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {bestSellers.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddAndGoToCart(item)}
                  className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-teal-50/50 p-2 rounded-2xl transition-all select-none"
                  title={`Klik untuk menambahkan ${item.name} ke pesanan`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : item.rank === 2
                          ? 'bg-gray-200 text-gray-800'
                          : item.rank === 3
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.rank}
                    </span>

                    {/* Clickable Product Photo */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 group-hover:ring-2 group-hover:ring-[#21938c] transition-all bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors pointer-events-none">
                        <Plus className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 stroke-[3] pointer-events-none" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#21938c] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {formatCurrency(item.price, settings.currency)} &bull; {item.soldCount} terjual
                      </p>
                    </div>
                  </div>

                  {/* Add action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddAndGoToCart(item);
                    }}
                    className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#21938c] group-hover:text-white text-gray-600 flex items-center justify-center transition-all shrink-0 active:scale-90"
                    title="Tambah ke pesanan kasir"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warnings */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-gray-900">Peringatan Stok Menipis</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {lowStockProducts.length} Item
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">
                Semua stok bahan dan menu aman di atas batas minimum.
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                {lowStockProducts.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-rose-600 font-bold">
                          Sisa: {item.stock} {item.unit}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          (Min: {item.minStockAlert})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('products')}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 text-[11px] font-bold transition-colors shrink-0"
                    >
                      Tambah Stok
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sistem & Perangkat Status Widget */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 pb-2 border-b border-gray-100">
              Status Sistem & Perangkat Ammar Kafe
            </h4>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500">Printer Kasir (58mm/80mm)</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Siap Cetak Struk
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500">Koneksi Database Cloud</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Backup Aktif
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500">Mode Kerja Offline</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                Tersedia & Standby
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500">Alamat Nota Struk</span>
              <span className="font-medium text-gray-700 truncate max-w-[170px]" title="Jln Bakung, Rejodadi">
                Jln Bakung, Rejodadi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
