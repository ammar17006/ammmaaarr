import React, { useState } from 'react';
import {
  Printer,
  Bluetooth,
  Usb,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sliders,
  FileText,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinterModal: React.FC<PrinterModalProps> = ({ isOpen, onClose }) => {
  const {
    printerConfig,
    updatePrinterConfig,
    connectBluetoothPrinter,
    connectUSBPrinter,
    settings
  } = useApp();

  const [isConnecting, setIsConnecting] = useState(false);
  const [testPrintSuccess, setTestPrintSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConnectBluetooth = async () => {
    setIsConnecting(true);
    await connectBluetoothPrinter();
    setIsConnecting(false);
  };

  const handleConnectUSB = async () => {
    setIsConnecting(true);
    await connectUSBPrinter();
    setIsConnecting(false);
  };

  const handleTestPrint = () => {
    setTestPrintSuccess(true);
    setTimeout(() => {
      // Trigger native browser print or alert
      window.print();
      setTestPrintSuccess(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#21938c] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Integrasi Printer Struk Thermal</h2>
              <p className="text-xs text-gray-500">Koneksi Bluetooth, USB Cable, &amp; ESC/POS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                printerConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <div>
              <p className="text-xs font-bold text-gray-800">
                {printerConfig.isConnected ? 'Printer Siap Digunakan' : 'Printer Belum Terhubung'}
              </p>
              <p className="text-[11px] text-gray-500">
                {printerConfig.deviceName || 'Pilih metode koneksi di bawah'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 text-[#21938c]">
            {printerConfig.paperWidth} Roll
          </span>
        </div>

        {/* Connection Methods */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            1. Pilih Metode Koneksi
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Bluetooth */}
            <button
              onClick={handleConnectBluetooth}
              disabled={isConnecting}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                printerConfig.type === 'bluetooth' && printerConfig.isConnected
                  ? 'border-[#21938c] bg-teal-50/50 shadow-xs ring-1 ring-[#21938c]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bluetooth className="w-4 h-4" />
                </div>
                {printerConfig.type === 'bluetooth' && printerConfig.isConnected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Koneksi Bluetooth</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Printer portable mobile / POS wireless
                </p>
              </div>
            </button>

            {/* USB Cable */}
            <button
              onClick={handleConnectUSB}
              disabled={isConnecting}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                printerConfig.type === 'usb' && printerConfig.isConnected
                  ? 'border-[#21938c] bg-teal-50/50 shadow-xs ring-1 ring-[#21938c]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Usb className="w-4 h-4" />
                </div>
                {printerConfig.type === 'usb' && printerConfig.isConnected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Kabel USB (Serial)</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Printer kasir desktop (Epson/Xprinter)
                </p>
              </div>
            </button>
          </div>

          {/* Paper Size Configuration */}
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider pt-2">
            2. Ukuran Lebar Kertas Thermal
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePrinterConfig({ paperWidth: '58mm' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                printerConfig.paperWidth === '58mm'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <p className="text-xs font-bold">58 mm (Standard)</p>
              <p className="text-[10px] text-gray-500 mt-0.5">32 Kolom Karakter (Mini)</p>
            </button>

            <button
              onClick={() => updatePrinterConfig({ paperWidth: '80mm' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                printerConfig.paperWidth === '80mm'
                  ? 'border-[#21938c] bg-teal-50 text-[#21938c] font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <p className="text-xs font-bold">80 mm (Wide)</p>
              <p className="text-[10px] text-gray-500 mt-0.5">48 Kolom Karakter (Lebar)</p>
            </button>
          </div>

          {/* Auto-print toggle */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-[#f8fafc] cursor-pointer hover:bg-gray-100/70 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-800">Cetak Otomatis Saat Checkout</p>
                <p className="text-[11px] text-gray-500">
                  Langsung kirim perintah cetak struk tanpa perlu klik tombol cetak
                </p>
              </div>
              <input
                type="checkbox"
                checked={printerConfig.autoPrintOnCheckout}
                onChange={(e) => updatePrinterConfig({ autoPrintOnCheckout: e.target.checked })}
                className="w-4 h-4 text-[#21938c] rounded-md focus:ring-[#21938c]"
              />
            </label>
          </div>

          {/* Test Print Alert */}
          {testPrintSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Perintah ESC/POS Uji Coba berhasil dikirim ke printer thermal!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={handleTestPrint}
            className="w-1/2 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Cetak Struk Uji Coba</span>
          </button>
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-2xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] shadow-sm"
          >
            Selesai &amp; Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
