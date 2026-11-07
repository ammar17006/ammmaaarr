import React, { useState } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  FileEdit,
  LayoutGrid,
  List,
  Search,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Tag,
  Coffee,
  Utensils,
  GlassWater,
  Cake,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product } from '../types';
import { formatCurrency } from '../utils/rules';

export const SalesView: React.FC = () => {
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
    setSearchQuery,
    currentUser,
    settings,
    appliedCoupon,
    orderDiscount,
    setActiveView,
    t
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingNoteForId, setEditingNoteForId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [lastAddedProduct, setLastAddedProduct] = useState<string | null>(null);

  const categories: { key: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'All', label: 'Semua Menu', icon: Layers },
    { key: 'Coffee', label: 'Kopi', icon: Coffee },
    { key: 'Food', label: 'Makanan', icon: Utensils },
    { key: 'Drinks', label: 'Minuman', icon: GlassWater },
    { key: 'Desserts', label: 'Dessert', icon: Cake },
  ];

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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setLastAddedProduct(product.name);
    setTimeout(() => {
      setLastAddedProduct((prev) => (prev === product.name ? null : prev));
    }, 1500);
  };

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
    <div className="space-y-4">
      {/* Top Banner & Kasir Status (Model Kupon Diskon & Promo Kasir) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#21938c] text-[11px] font-bold mb-1 border border-teal-100">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Mesin Kasir POS &bull; ammar kafe</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Penjualan Langsung &amp; Kasir</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
              Siap Transaksi
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kasir Bertugas: <strong className="text-gray-800 capitalize">{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Administrator' : 'Kasir'}) &bull; Klik foto produk atau tombol (+) untuk memasukkan pesanan
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {lastAddedProduct && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-in fade-in slide-in-from-right duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>+1 {lastAddedProduct} ditambahkan!</span>
            </div>
          )}

          <button
            onClick={() => setActiveView('discounts')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
            title="Lihat Daftar Kupon Promo"
          >
            <Tag className="w-3.5 h-3.5 text-[#21938c]" />
            <span>Kupon Promo</span>
          </button>

          <button
            onClick={() => setActiveView('returns')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
            title="Pusat Retur & Refund"
          >
            <span className="text-rose-600 font-bold">&bull;</span>
            <span>Retur &amp; Refund</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Cart + Right Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Current Sale (Cart) - Menempel ke atas saat scroll produk */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between min-h-[560px] lg:sticky lg:top-0 self-start">
          <div>
            {/* Header Keranjang */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Pesanan Saat Ini</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#21938c] border border-teal-200">
                  {cartTotals.itemCount} item
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-3 border border-gray-100 text-gray-300">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-700">Keranjang Masih Kosong</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Klik foto menu kopi, makanan, atau minuman di sebelah kanan untuk menambahkan pesanan
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar py-2">
                {cart.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-gray-400">
                            {formatCurrency(item.product.price, settings.currency)}
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 inline-block font-medium truncate max-w-full">
                              Catatan: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-200 rounded"
                          aria-label={`Kurangi ${item.product.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-200 rounded"
                          aria-label={`Tambah ${item.product.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0 min-w-[70px]">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {formatCurrency(lineTotal, settings.currency)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-300 hover:text-rose-600 transition-colors p-1"
                        aria-label={`Hapus ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Note & Discount Buttons */}
            {cart.length > 0 && (
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenNoteModal(cart[0].product.id, cart[0].notes)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <FileEdit className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t('addNote')}</span>
                </button>

                <button
                  onClick={() => setActiveView('discounts')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-xs font-bold text-[#21938c] hover:bg-teal-100 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{appliedCoupon ? `Kupon: ${appliedCoupon.code}` : '+ Kupon Promo'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Totals & Bayar Action */}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(cartTotals.subtotal, settings.currency)}
                </span>
              </div>
              {orderDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Diskon ({appliedCoupon?.code || 'Kupon'}):</span>
                  </span>
                  <span className="font-bold">
                    -{formatCurrency(orderDiscount, settings.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('tax')} ({(settings.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(cartTotals.taxAmount, settings.currency)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-800">{t('total')}</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {formatCurrency(cartTotals.total, settings.currency)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="w-full py-3 px-3 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Kosongkan
              </button>
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                disabled={cart.length === 0}
                className="w-full py-3 px-3 rounded-xl text-xs font-bold text-white bg-[#21938c] hover:bg-[#1b7c76] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-700/20 active:scale-[0.98]"
              >
                Bayar {formatCurrency(cartTotals.total, settings.currency)}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Product Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories Bar & View Mode Toggle */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#21938c] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid / List Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#21938c] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid View"
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#21938c] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List View"
                title="Tampilan List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Cards Grid with CLICKABLE PHOTOS & CARDS */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Tidak ada produk ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian atau kategori lain</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs hover:shadow-md hover:border-[#21938c]/40 transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.98] select-none"
                  title={`Klik untuk menambahkan ${product.name} ke pesanan`}
                >
                  {/* Clickable Image Container */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5 group-hover:ring-2 group-hover:ring-[#21938c]/40 transition-all cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-auto"
                    />

                    {/* Stock Warning Badge */}
                    {product.stock <= product.minStockAlert && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs pointer-events-none">
                        Stok {product.stock}
                      </span>
                    )}

                    {/* Hover Overlay Hint for photo clickability */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 bg-white/95 text-[#21938c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 pointer-events-none">
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Tambah
                      </span>
                    </div>
                  </div>

                  {/* Title & Price & Plus Button */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
                      <span className="text-xs sm:text-sm font-bold text-[#21938c]">
                        {formatCurrency(product.price, settings.currency)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-8 h-8 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white flex items-center justify-center transition-all shadow-xs active:scale-90"
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        title="Tambah ke pesanan"
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
            <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-xs">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-teal-50/40 transition-colors cursor-pointer group select-none"
                  title={`Klik untuk menambahkan ${product.name} ke pesanan`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 group-hover:ring-2 group-hover:ring-[#21938c]/40 transition-all cursor-pointer"
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#21938c] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {product.category} &bull; Stok: {product.stock} {product.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-[#21938c]">
                      {formatCurrency(product.price, settings.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 mb-1">Catatan Khusus Menu</h3>
            <p className="text-xs text-gray-500 mb-3">Contoh: Less sugar, ekstra es batu, tanpa saus, dll.</p>
            <input
              type="text"
              autoFocus
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Ketik catatan di sini..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#21938c] mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setEditingNoteForId(null)}
                className="py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="py-2.5 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold shadow-xs"
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
