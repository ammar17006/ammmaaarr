import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateThermalESCCommands } from '../utils/rules';

export const ReceiptModal: React.FC = () => {
  const {
    activeReceiptOrder,
    setActiveReceiptOrder,
    settings,
    printerConfig
  } = useApp();

  const receiptRef = useRef<HTMLDivElement>(null);

  if (!activeReceiptOrder) return null;

  const order = activeReceiptOrder;

  const handlePrint = () => {
    // 1. Trigger thermal ESC/POS command simulation
    generateThermalESCCommands(order, settings);

    // 2. Browser print with thermal paper styling
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*STRUK PEMBAYARAN ${settings.storeName.toUpperCase()}*\n` +
      `No. Invoice: ${order.invoiceNumber}\n` +
      `Tanggal: ${new Date(order.createdAt).toLocaleString('id-ID')}\n` +
      `Kasir: ${order.cashierName}\n` +
      `--------------------------------\n` +
      order.items.map((i) => `${i.product.name} x${i.quantity} = ${formatCurrency(i.product.price * i.quantity, settings.currency)}`).join('\n') +
      `\n--------------------------------\n` +
      `Total: ${formatCurrency(order.total, settings.currency)}\n` +
      `Metode: ${order.paymentMethod.toUpperCase()}\n` +
      `Bayar: ${formatCurrency(order.amountPaid, settings.currency)}\n` +
      `Kembali: ${formatCurrency(order.change, settings.currency)}\n\n` +
      `${settings.receiptFooter || 'Terima kasih atas kunjungan Anda!'}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Transaksi Berhasil</h3>
              <p className="text-[11px] text-gray-500">Struk siap dicetak ke thermal printer</p>
            </div>
          </div>
          <button
            onClick={() => setActiveReceiptOrder(null)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Tutup Struk"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt Simulation */}
        <div
          ref={receiptRef}
          id="thermal-print-area"
          className="my-4 p-5 bg-[#fafafa] border border-dashed border-gray-300 rounded-xl font-mono text-xs text-gray-800 shadow-inner"
        >
          {/* Store Info */}
          <div className="text-center pb-3 border-b border-dashed border-gray-300 space-y-0.5">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-gray-900">
              {settings.storeName}
            </h2>
            {settings.tagline && <p className="text-[11px] text-gray-600">{settings.tagline}</p>}
            <p className="text-[10px] text-gray-500">{settings.address}</p>
            <p className="text-[10px] text-gray-500">Telp: {settings.phone}</p>
          </div>

          {/* Meta Details */}
          <div className="py-2.5 border-b border-dashed border-gray-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Invoice</span>
              <span className="font-bold">{order.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu</span>
              <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir</span>
              <span>{order.cashierName}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span>{order.customerName}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-gray-300 space-y-2">
            {order.items.map((item, idx) => {
              const lineTotal = item.product.price * item.quantity;
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-gray-900">{item.product.name}</div>
                  <div className="flex justify-between text-gray-600 text-[11px]">
                    <span>
                      {item.quantity} x {formatCurrency(item.product.price, settings.currency)}
                    </span>
                    <span>{formatCurrency(lineTotal, settings.currency)}</span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-gray-400 italic">*{item.notes}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="py-2.5 border-b border-dashed border-gray-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, settings.currency)}</span>
            </div>
            {order.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Pajak ({(order.taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(order.taxAmount, settings.currency)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Diskon</span>
                <span>-{formatCurrency(order.discountAmount, settings.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-dashed border-gray-300">
              <span>TOTAL</span>
              <span>{formatCurrency(order.total, settings.currency)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Bayar ({order.paymentMethod.toUpperCase()})</span>
              <span>{formatCurrency(order.amountPaid, settings.currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Kembalian</span>
              <span>{formatCurrency(order.change, settings.currency)}</span>
            </div>
          </div>

          {/* Footer & Barcode */}
          <div className="pt-3 text-center space-y-2">
            <p className="text-[11px] font-medium text-gray-600">
              {settings.receiptFooter || 'Terima kasih atas kunjungan Anda!'}
            </p>
            {/* Barcode representation */}
            <div className="flex justify-center py-1">
              <div className="space-y-0.5 text-center">
                <div className="h-8 flex items-center justify-center gap-0.5">
                  {Array.from({ length: 38 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-gray-900 ${
                        i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-gray-400 tracking-widest">{order.invoiceNumber}</span>
              </div>
            </div>
            <p className="text-[9px] text-gray-400">Powered by PosyMart Cloud POS</p>
          </div>
        </div>

        {/* Printer Details Indicator */}
        <div className="text-[11px] text-gray-500 flex items-center justify-between px-1 mb-3 print:hidden">
          <span>Format: Kertas {settings.printer.paperWidth} Thermal</span>
          <span className="text-[#21938c] font-semibold">
            {printerConfig.deviceName || 'Thermal Printer Ready'}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk Thermal</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim WhatsApp</span>
            </button>
          </div>

          <button
            onClick={() => setActiveReceiptOrder(null)}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
};
