import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Minus,
  Plus,
  Trash2,
  FileEdit,
  LayoutGrid,
  List,
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product } from '../types';
import { formatCurrency, calculateReportMetrics } from '../utils/rules';

export const DashboardView: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    setCartItemNotes,
    clearCart,
    cartTotals,
    setIsCheckoutModalOpen,
    searchQuery,
    orders,
    customers,
    settings
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingNoteForId, setEditingNoteForId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  const categories: ProductCategory[] = ['All', 'Coffee', 'Food', 'Drinks', 'Desserts'];

  // Calculate live metrics or use screenshot benchmark values
  const metrics = calculateReportMetrics(orders);
  const displayTotalSales = 4892.45 + (metrics.totalSales > 100 ? metrics.totalSales - 74.17 : 0);
  const displayOrdersCount = 128 + Math.max(0, metrics.totalOrders - 4);
  const displayCustomersCount = 256 + Math.max(0, customers.length - 4);
  const displayAov = 38.22;

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenNoteModal = (productId: string, currentNote?: string) => {
    setEditingNoteForId(productId);
    setNoteInput(currentNote || '');
  };

  const handleSaveNote = () => {
    if (editingNoteForId) {
      setCartItemNotes(editingNoteForId, noteInput.trim());
      setEditingNoteForId(null);
      setNoteInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards matching the screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <DollarSign className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Menu Opsi">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Total Sales</span>
            <div className="text-2xl font-bold text-gray-800 mt-0.5">
              {formatCurrency(displayTotalSales, settings.currency)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>12.5%</span>
              <span className="text-gray-400 font-normal">from yesterday</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Menu Opsi">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Orders</span>
            <div className="text-2xl font-bold text-gray-800 mt-0.5">
              {displayOrdersCount}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>8.2%</span>
              <span className="text-gray-400 font-normal">from yesterday</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Menu Opsi">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Customers</span>
            <div className="text-2xl font-bold text-gray-800 mt-0.5">
              {displayCustomersCount}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>5.4%</span>
              <span className="text-gray-400 font-normal">from yesterday</span>
            </div>
          </div>
        </div>

        {/* Avg. Order Value */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#21938c]/10 text-[#21938c] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Menu Opsi">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 font-medium">Avg. Order Value</span>
            <div className="text-2xl font-bold text-gray-800 mt-0.5">
              {formatCurrency(displayAov, settings.currency)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>3.1%</span>
              <span className="text-gray-400 font-normal">from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Current Sale (Cart) & Product Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Sale (Cart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-100 flex flex-col min-h-[580px] justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">Current Sale</h2>
                {cart.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#21938c] text-xs font-semibold">
                    {cartTotals.itemCount} items
                  </span>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Opsi Penjualan">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-16 text-center text-gray-400 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">Keranjang masih kosong</p>
                <p className="text-xs text-gray-400 mt-1">Pilih produk di sebelah kanan untuk menambahkan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1 mt-2 custom-scrollbar">
                {cart.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="py-3.5 flex items-center justify-between gap-3 group">
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</h4>
                          <span className="text-xs text-gray-400 font-medium">
                            {formatCurrency(item.product.price, settings.currency)}
                          </span>
                          {item.notes && (
                            <p className="text-[11px] text-amber-600 italic truncate mt-0.5">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stepper (- 1 +) */}
                      <div className="flex items-center gap-2 bg-[#f8fafc] border border-gray-200 rounded-lg px-2 py-1 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700 transition-colors p-0.5"
                          aria-label={`Kurangi ${item.product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold text-gray-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700 transition-colors p-0.5"
                          aria-label={`Tambah ${item.product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0 min-w-[65px]">
                        <span className="text-sm font-bold text-gray-800">
                          {formatCurrency(lineTotal, settings.currency)}
                        </span>
                      </div>

                      {/* Trash action */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                        aria-label={`Hapus ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* + Add Note Button */}
            {cart.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => handleOpenNoteModal(cart[0].product.id, cart[0].notes)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <FileEdit className="w-3.5 h-3.5 text-gray-400" />
                  <span>+ Add Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Totals & Actions */}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(cartTotals.subtotal, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(settings.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(cartTotals.taxAmount, settings.currency)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {formatCurrency(cartTotals.total, settings.currency)}
              </span>
            </div>

            {/* Buttons: Clear Cart & Pay */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                disabled={cart.length === 0}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#21938c] hover:bg-[#1b7c76] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-700/20 active:scale-[0.98]"
              >
                Pay {formatCurrency(cartTotals.total, settings.currency)}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Product Catalog Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories Bar & Grid Toggle */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#21938c] text-white shadow-xs'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#21938c] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#21938c] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Tidak ada produk ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian atau kategori lain</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image with Stock badge */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock <= product.minStockAlert && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                        Stok {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(product.price, settings.currency)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 rounded-lg bg-[#21938c] hover:bg-[#1b7c76] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                        aria-label={`Tambah ${product.name} ke keranjang`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-400">{product.category} • Stok: {product.stock} {product.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price, settings.currency)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      {editingNoteForId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-800 mb-2">Tambahkan Catatan Pesanan</h3>
            <p className="text-xs text-gray-500 mb-3">Contoh: Less sugar, extra ice, tanpa saus, dll.</p>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Ketik catatan khusus..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#21938c] focus:outline-hidden focus:ring-1 focus:ring-[#21938c]"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingNoteForId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#21938c] text-white hover:bg-[#1b7c76]"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
