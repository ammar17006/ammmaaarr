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
  Printer,
  Tag,
  Percent,
  Scissors,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Customer, DiscountCoupon } from '../types';
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
    printerConfig,
    discounts,
    appliedCoupon,
    applyDiscountCoupon,
    removeDiscountCoupon,
    orderDiscount,
    t
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>(() => String(cartTotals.total));
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [qrisPaidSimulated, setQrisPaidSimulated] = useState<boolean>(false);
  const [showAddCustomer, setShowAddCustomer] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('');

  // Discount UI State
  const [showDiscountAccordion, setShowDiscountAccordion] = useState<boolean>(false);
  const [customVoucherInput, setCustomVoucherInput] = useState<string>('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isCheckoutModalOpen) return null;

  const total = cartTotals.total;
  const numericAmountPaid =
    paymentMethod === 'cash'
      ? parseFloat(amountPaidInput) || 0
      : total;

  const change = calculateChange(numericAmountPaid, total);
  const isCashUnderpaid = paymentMethod === 'cash' && numericAmountPaid < total;

  // Preset cash buttons for Rupiah (IDR)
  const quickCashOptions = [
    { label: 'Uang Pas', value: total },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 150.000', value: 150000 },
    { label: 'Rp 200.000', value: 200000 },
  ];

  const handleQuickCash = (value: number) => {
    setAmountPaidInput(String(value));
  };

  const handleApplyCoupon = (coupon: DiscountCoupon) => {
    const result = applyDiscountCoupon(coupon);
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setAmountPaidInput(String(cartTotals.subtotal - result.message.length > 0 ? total : total));
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const handleApplyCustomVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVoucherInput.trim()) return;
    const result = applyDiscountCoupon(customVoucherInput.trim());
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCustomVoucherInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeDiscountCoupon();
    setCouponFeedback(null);
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
      notes: orderNotes.trim() || undefined,
      discountCode: appliedCoupon?.code
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('checkoutTitle')}</h2>
            <p className="text-xs text-gray-500">{t('checkoutSubtitle')}</p>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Tutup Pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Summary Banner with Discount Breakdown */}
        <div className="my-4 p-4 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">{t('totalBill')}</span>
              <div className="text-3xl font-black text-[#21938c]">
                {formatCurrency(total, settings.currency)}
              </div>
            </div>
            <div className="text-right text-xs text-teal-700">
              <span className="font-bold">{cartTotals.itemCount} {t('itemsCount')}</span>
              {orderDiscount > 0 && (
                <div className="text-[11px] text-emerald-700 font-extrabold bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1">
                  Diskon: -{formatCurrency(orderDiscount, settings.currency)}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-teal-200/60 flex justify-between text-xs text-teal-900/80">
            <span>Subtotal: {formatCurrency(cartTotals.subtotal, settings.currency)}</span>
            {orderDiscount > 0 && (
              <span className="text-emerald-700 font-bold">
                Kupon {appliedCoupon?.code}: -{formatCurrency(orderDiscount, settings.currency)}
              </span>
            )}
            <span>Pajak (10%): {formatCurrency(cartTotals.taxAmount, settings.currency)}</span>
          </div>
        </div>

        {/* SECTION: PILIHAN DISKON & VOUCHER KASIR */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#21938c]" />
              <span className="text-xs font-bold text-gray-800">Kupon &amp; Diskon Transaksi</span>
              {appliedCoupon && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold">
                  {appliedCoupon.code}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowDiscountAccordion(!showDiscountAccordion)}
              className="text-xs font-bold text-[#21938c] hover:underline flex items-center gap-1"
            >
              <span>{appliedCoupon ? 'Ubah Kupon' : 'Pilih / Masukkan Kupon'}</span>
              {showDiscountAccordion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Active Coupon Badge if applied */}
          {appliedCoupon && !showDiscountAccordion && (
            <div className="mt-2.5 flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">{appliedCoupon.title} ({appliedCoupon.code})</p>
                  <p className="text-[11px] text-emerald-700">
                    Hemat {formatCurrency(orderDiscount, settings.currency)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                Hapus
              </button>
            </div>
          )}

          {/* Expandable Coupon Selector */}
          {showDiscountAccordion && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 animate-in fade-in duration-150">
              {/* Quick voucher input form */}
              <form onSubmit={handleApplyCustomVoucher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik kode kupon (misal: HAPPYHOURS)"
                  value={customVoucherInput}
                  onChange={(e) => setCustomVoucherInput(e.target.value.toUpperCase())}
                  className="flex-1 p-2 rounded-xl border border-gray-300 text-xs font-mono font-bold uppercase focus:border-[#21938c] focus:outline-hidden bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#21938c] hover:bg-[#1b7c76] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Terapkan
                </button>
              </form>

              {/* Feedback Alert */}
              {couponFeedback && (
                <div
                  className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                    couponFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {couponFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{couponFeedback.message}</span>
                </div>
              )}

              {/* List of Available Active Coupons */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Pilih dari Kupon Promo Tersedia:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {discounts
                    .filter((d) => d.isActive)
                    .map((d) => {
                      const isEligible = cartTotals.subtotal >= d.minSpend;
                      const isSelected = appliedCoupon?.id === d.id;

                      return (
                        <div
                          key={d.id}
                          onClick={() => isEligible && handleApplyCoupon(d)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#21938c] bg-teal-50 ring-1 ring-[#21938c]'
                              : isEligible
                              ? 'border-gray-200 bg-white hover:border-teal-300'
                              : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#21938c]">
                              {d.code}
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-700">
                              {d.type === 'percentage'
                                ? `${d.discountValue}%`
                                : formatCurrency(d.discountValue, settings.currency)}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-gray-800 truncate mt-0.5">{d.title}</p>
                          <p className="text-[10px] text-gray-400">
                            Min. Belanja: {formatCurrency(d.minSpend, settings.currency)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {appliedCoupon && (
                <div className="pt-1 text-right">
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Batalkan / Lepas Diskon
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>{t('customerLabel')}</span>
            </label>
            <button
              onClick={() => setShowAddCustomer(!showAddCustomer)}
              className="text-xs font-semibold text-[#21938c] hover:underline"
            >
              {showAddCustomer ? t('cancel') : t('newCustomer')}
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
          <label className="text-xs font-bold text-gray-700 block mb-2">{t('paymentMethod')}</label>
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
              <span className="text-xs">{t('cash')}</span>
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
              <span className="text-xs">{t('qris')}</span>
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
              <span className="text-xs">{t('debit')}</span>
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
              <span className="text-xs">{t('transfer')}</span>
            </button>
          </div>
        </div>

        {/* Method Specific Content */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3 p-4 bg-[#f8fafc] rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">{t('cashReceived')}</label>
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
                  {opt.label === 'Uang Pas' ? t('exactAmount') : opt.label}
                </button>
              ))}
            </div>

            {/* Change Display */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">{t('changeLabel')}:</span>
              <span
                className={`text-lg font-extrabold ${
                  isCashUnderpaid ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {isCashUnderpaid
                  ? `${t('underpaid')} ${formatCurrency(total - numericAmountPaid, settings.currency)}`
                  : formatCurrency(change, settings.currency)}
              </span>
            </div>
          </div>
        )}

        {paymentMethod === 'qris' && (
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs">
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
              <p>BCA: 8820-1234-99 (ammar kafe)</p>
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
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            disabled={isCashUnderpaid}
            className="w-2/3 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#21938c] hover:bg-[#1b7c76] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-700/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('finalizePrint')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
