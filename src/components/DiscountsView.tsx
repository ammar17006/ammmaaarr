import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Tag,
  Gift,
  CheckCircle2,
  Calendar,
  Sparkles,
  Scissors
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/rules';

export const DiscountsView: React.FC = () => {
  const { setOrderDiscount, setActiveView, settings } = useApp();
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);

  const promos = [
    {
      id: 'p1',
      code: 'HAPPYHOURS',
      title: 'Happy Hours Coffee Promo',
      discount: settings.currency === 'USD' ? 2.0 : 15000,
      description: 'Potongan langsung untuk pembelian kopi di jam siang',
      expiry: '31 Des 2026',
      minSpend: settings.currency === 'USD' ? 10.0 : 50000
    },
    {
      id: 'p2',
      code: 'NEWCUSTOMER',
      title: 'Voucher Pelanggan Baru',
      discount: settings.currency === 'USD' ? 1.5 : 10000,
      description: 'Diskon selamat datang untuk member baru PosyMart',
      expiry: '31 Des 2026',
      minSpend: settings.currency === 'USD' ? 8.0 : 35000
    },
    {
      id: 'p3',
      code: 'BAKERYDAY',
      title: 'Bakery & Dessert Special',
      discount: settings.currency === 'USD' ? 1.0 : 8000,
      description: 'Diskon bundling aneka kue, bagel, dan muffin',
      expiry: '31 Des 2026',
      minSpend: settings.currency === 'USD' ? 5.0 : 25000
    }
  ];

  const handleApplyPromo = (code: string, discountVal: number) => {
    setOrderDiscount(discountVal);
    setActiveCoupon(code);
    setActiveView('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#21938c]" />
            <span>Kupon Diskon &amp; Promo Kasir</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Terapkan potongan harga langsung ke keranjang kasir (Current Sale)
          </p>
        </div>
      </div>

      {/* Promos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map((p) => {
          const isApplied = activeCoupon === p.code;

          return (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isApplied
                  ? 'border-[#21938c] ring-2 ring-[#21938c]/15 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#21938c] font-mono text-xs font-bold flex items-center gap-1.5 border border-teal-100">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{p.code}</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#21938c]">
                    Hemat {formatCurrency(p.discount, settings.currency)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-800">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                <p className="text-[11px] text-gray-400 mt-2">
                  Min. Belanja: {formatCurrency(p.minSpend, settings.currency)} • Berlaku s/d {p.expiry}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleApplyPromo(p.code, p.discount)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#21938c] hover:bg-[#1b7c76] text-white'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'Promo Diterapkan' : 'Gunakan Diskon Ini'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
