import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  Edit2,
  Trash2,
  DollarSign,
  Boxes,
  CheckCircle,
  X,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { formatCurrency, exportInventoryToExcel } from '../utils/rules';

export const InventoryView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    settings,
    currentUser
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coffee' as ProductCategory,
    price: '',
    costPrice: '',
    stock: '',
    minStockAlert: '10',
    sku: '',
    barcode: '',
    image: '',
    unit: 'pcs',
    description: ''
  });

  // Calculate inventory metrics
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalAssetValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesLowStock = !filterLowStockOnly || p.stock <= p.minStockAlert;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Coffee',
      price: '',
      costPrice: '',
      stock: '20',
      minStockAlert: '10',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      barcode: `899${Math.floor(100000 + Math.random() * 900000)}`,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',
      unit: 'cup',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: String(p.price),
      costPrice: String(p.costPrice),
      stock: String(p.stock),
      minStockAlert: String(p.minStockAlert),
      sku: p.sku,
      barcode: p.barcode,
      image: p.image,
      unit: p.unit,
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      minStockAlert: parseInt(formData.minStockAlert) || 5,
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',
      unit: formData.unit.trim() || 'pcs',
      description: formData.description.trim()
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const blob = exportInventoryToExcel(products);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Inventaris-PosyMart-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Produk</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalProducts} SKU</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{totalStockUnits} Total unit fisik</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#21938c] flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Nilai Aset Modal (HPP)</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(totalAssetValue, settings.currency)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Total valuasi stok gudang</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Stok Menipis (Alert)</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount} Item</p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Perlu segera restock</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Stok Habis</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{outOfStockCount} Item</p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Tidak dapat dijual</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Category Filter, Export, Add */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama produk, SKU, barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 text-xs rounded-xl border border-gray-200 bg-[#f8fafc] text-gray-700 focus:outline-hidden focus:border-[#21938c]"
          >
            <option value="All">Semua Kategori</option>
            <option value="Coffee">Coffee</option>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterLowStockOnly
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stok Rendah</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            title="Download Spreadsheet Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">SKU / Barcode</th>
                <th className="py-3 px-3">Harga Modal</th>
                <th className="py-3 px-3">Harga Jual</th>
                <th className="py-3 px-3">Margin</th>
                <th className="py-3 px-4 text-center">Stok</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const margin = p.price > 0 ? (((p.price - p.costPrice) / p.price) * 100).toFixed(0) : '0';
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= p.minStockAlert;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-800 text-xs">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.unit}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {p.category}
                      </span>
                    </td>

                    {/* SKU / Barcode */}
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-gray-400">{p.barcode}</div>
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-3 text-gray-500 font-medium">
                      {formatCurrency(p.costPrice, settings.currency)}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-bold text-gray-900">
                      {formatCurrency(p.price, settings.currency)}
                    </td>

                    {/* Margin */}
                    <td className="py-3 px-3 font-semibold text-emerald-600">
                      +{margin}%
                    </td>

                    {/* Stock with quick +/- adjust */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg p-0.5">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-gray-600"
                          title="Kurangi stok"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold text-gray-800 text-xs">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => adjustStock(p.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-gray-600"
                          title="Tambah stok"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Habis
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          Menipis (≤{p.minStockAlert})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Tersedia
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-teal-700 hover:bg-teal-50"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus produk "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Cappuccino Hazelnut"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Food">Food</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Satuan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pcs, cup, porsi, slice"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Harga Modal (HPP)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="Contoh: 12000 atau 1.50"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Harga Jual</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Contoh: 28000 atau 3.50"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Batas Alert Stok Rendah</label>
                  <input
                    type="number"
                    required
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#21938c] text-white font-bold hover:bg-[#1b7c76] shadow-sm"
                >
                  {editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
