import React, { useState } from 'react';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Customer } from '../types';
import { formatCurrency, calculateChange } from '../utils/rules';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cartTotals,
    completeCheckout,
    customers,
    addCustomer,
    settings,
    printerConfig
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>(() => String(cartTotals.total));
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [qrisPaidSimulated, setQrisPaidSimulated] = useState<boolean>(false);
  const [showAddCustomer, setShowAddCustomer] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('');

  if (!isCheckoutModalOpen) return null;

  const total = cartTotals.total;
  const numericAmountPaid =
    paymentMethod === 'cash'
      ? parseFloat(amountPaidInput) || 0
      : total;

  const change = calculateChange(numericAmountPaid, total);
  const isCashUnderpaid = paymentMethod === 'cash' && numericAmountPaid < total;

  // Preset cash buttons based on currency
  const isUSD = settings.currency === 'USD';
  const quickCashOptions = isUSD
    ? [
        { label: 'Uang Pas', value: total },
        { label: '$20', value: 20 },
        { label: '$30', value: 30 },
        { label: '$50', value: 50 },
        { label: '$100', value: 100 },
      ]
    : [
        { label: 'Uang Pas', value: total },
        { label: 'Rp 20.000', value: 20000 },
        { label: 'Rp 50.000', value: 50000 },
        { label: 'Rp 100.000', value: 100000 },
        { label: 'Rp 200.000', value: 200000 },
      ];

  const handleQuickCash = (value: number) => {
    setAmountPaidInput(String(value));
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const created = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '-'
    });
    setSelectedCustomerId(created.id);
    setShowAddCustomer(false);
    setNewCustName('');
    setNewCustPhone('');
  };

  const handleFinalize = () => {
    if (isCashUnderpaid) return;

    const customer = customers.find((c) => c.id === selectedCustomerId);
    completeCheckout({
      method: paymentMethod,
      amountPaid: paymentMethod === 'cash' ? numericAmountPaid : total,
      customer,
      notes: orderNotes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pembayaran Kasir</h2>
            <p className="text-xs text-gray-500">Pilih metode pembayaran dan masukkan nominal</p>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Tutup Pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Banner */}
        <div className="my-4 p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">Total Tagihan</span>
            <div className="text-3xl font-extrabold text-[#21938c]">
              {formatCurrency(total, settings.currency)}
            </div>
          </div>
          <div className="text-right text-xs text-teal-700">
            <span>{cartTotals.itemCount} Item dalam keranjang</span>
          </div>
        </div>

        {/* Customer Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>Pelanggan</span>
            </label>
            <button
              onClick={() => setShowAddCustomer(!showAddCustomer)}
              className="text-xs font-semibold text-[#21938c] hover:underline"
            >
              {showAddCustomer ? 'Batal' : '+ Pelanggan Baru'}
            </button>
          </div>

          {showAddCustomer ? (
            <form onSubmit={handleCreateCustomer} className="p-3 bg-gray-50 rounded-2xl space-y-2 border border-gray-200">
              <input
                type="text"
                placeholder="Nama Pelanggan"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#21938c]"
                required
              />
              <input
                type="text"
                placeholder="No. Telepon / WhatsApp (opsional)"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#21938c]"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76]"
              >
                Simpan Pelanggan
              </button>
            </form>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-[#f8fafc] focus:outline-hidden focus:border-[#21938c]"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone !== '-' ? `(${c.phone})` : ''} - Poin: {c.loyaltyPoints}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Payment Methods Buttons */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-700 block mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('cash');
                setAmountPaidInput(String(total));
              }}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs">Tunai (Cash)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'qris'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs">QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('debit')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'debit'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Debit/Kredit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'transfer'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building className="w-5 h-5" />
              <span className="text-xs">Transfer Bank</span>
            </button>
          </div>
        </div>

        {/* Method Specific Content */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3 p-4 bg-[#f8fafc] rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nominal Uang Diterima</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(e.target.value)}
                  placeholder="0"
                  className="w-full text-lg font-bold p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#21938c] bg-white"
                />
              </div>
            </div>

            {/* Quick cash amounts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {quickCashOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickCash(opt.value)}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#21938c] hover:text-[#21938c] rounded-xl text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Change Display */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">Kembalian:</span>
              <span
                className={`text-lg font-extrabold ${
                  isCashUnderpaid ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {isCashUnderpaid
                  ? `Kurang ${formatCurrency(total - numericAmountPaid, settings.currency)}`
                  : formatCurrency(change, settings.currency)}
              </span>
            </div>
          </div>
        )}

        {paymentMethod === 'qris' && (
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs">
              {/* Dynamic QR Code simulation SVG */}
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                <rect x="0" y="0" width="30" height="30" className="text-gray-900" />
                <rect x="5" y="5" width="20" height="20" className="text-white" />
                <rect x="10" y="10" width="10" height="10" className="text-gray-900" />

                <rect x="70" y="0" width="30" height="30" className="text-gray-900" />
                <rect x="75" y="5" width="20" height="20" className="text-white" />
                <rect x="80" y="10" width="10" height="10" className="text-gray-900" />

                <rect x="0" y="70" width="30" height="30" className="text-gray-900" />
                <rect x="5" y="75" width="20" height="20" className="text-white" />
                <rect x="10" y="80" width="10" height="10" className="text-gray-900" />

                <rect x="35" y="10" width="10" height="10" className="text-gray-900" />
                <rect x="50" y="15" width="10" height="10" className="text-gray-900" />
                <rect x="40" y="35" width="20" height="20" className="text-gray-900" />
                <rect x="70" y="45" width="15" height="15" className="text-gray-900" />
                <rect x="25" y="50" width="10" height="15" className="text-gray-900" />
                <rect x="45" y="70" width="15" height="15" className="text-gray-900" />
                <rect x="75" y="75" width="15" height="15" className="text-gray-900" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">
              Pindai QRIS menggunakan BCA Mobile, GoPay, OVO, Dana, ShopeePay, atau Livin Mandiri
            </p>
            <button
              type="button"
              onClick={() => setQrisPaidSimulated(true)}
              className="px-4 py-2 rounded-xl bg-teal-100 text-[#21938c] text-xs font-bold hover:bg-teal-200 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulasikan Pembayaran Masuk</span>
            </button>
            {qrisPaidSimulated && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pembayaran QRIS Berhasil Diverifikasi!</span>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'debit' && (
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-100 space-y-3">
            <p className="text-xs text-gray-600">Gesek atau tap kartu EDC pelanggan:</p>
            <input
              type="text"
              placeholder="No. Referensi / Otorisasi EDC (Opsional)"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
            />
          </div>
        )}

        {paymentMethod === 'transfer' && (
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">Rekening Tujuan Toko:</p>
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 font-mono text-xs">
              <p>BCA: 8820-1234-99 (PosyMart Indonesia)</p>
              <p>Mandiri: 137-00-9876543-1</p>
            </div>
          </div>
        )}

        {/* Order Notes */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Catatan transaksi atau nomor meja (opsional)..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-[#f8fafc] focus:outline-hidden focus:border-[#21938c]"
          />
        </div>

        {/* Auto Print Notice */}
        {printerConfig.autoPrintOnCheckout && (
          <div className="flex items-center gap-2 mt-3 text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl">
            <Printer className="w-3.5 h-3.5" />
            <span>Struk akan dicetak otomatis ke {printerConfig.deviceName || 'Thermal Printer'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-1/3 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            disabled={isCashUnderpaid}
            className="w-2/3 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#21938c] hover:bg-[#1b7c76] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-700/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
