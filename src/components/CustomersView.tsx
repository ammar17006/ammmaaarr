import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Award,
  DollarSign,
  ShoppingBag,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/rules';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, settings } = useApp();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addCustomer({
      name: formData.name.trim(),
      phone: formData.phone.trim() || '-',
      email: formData.email.trim() || undefined
    });
    setIsAddModalOpen(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan berdasarkan nama, no. telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] flex items-center gap-1.5 self-end sm:self-auto shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-teal-50 text-[#21938c] font-bold text-base flex items-center justify-center shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-gray-900 truncate">{c.name}</h4>
                <p className="text-[11px] text-gray-400">Member sejak {c.joinedDate}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                {c.loyaltyPoints} Poin
              </span>
            </div>

            <div className="py-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{c.phone}</span>
              </div>
              {c.email && c.email !== '-' && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{c.email}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 text-center text-xs">
              <div className="border-r border-gray-100">
                <span className="text-[10px] text-gray-400 font-medium">Total Pesanan</span>
                <p className="font-bold text-gray-800">{c.totalOrders} Kali</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-medium">Total Belanja</span>
                <p className="font-bold text-[#21938c]">
                  {formatCurrency(c.totalSpent, settings.currency)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Tambah Pelanggan Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-3 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Pelanggan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="0812xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="pelanggan@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#21938c]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#21938c] text-white font-bold hover:bg-[#1b7c76]"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
