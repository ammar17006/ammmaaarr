import React from 'react';
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/rules';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCartDrawer: React.FC<MobileCartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotals,
    setIsCheckoutModalOpen,
    settings
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#21938c]" />
              <h2 className="text-base font-bold text-gray-900">Current Sale (Keranjang)</h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#21938c] text-xs font-bold">
                {cartTotals.itemCount} item
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 mt-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-medium">Keranjang masih kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(item.product.price, settings.currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[55px]">
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(item.product.price * item.quantity, settings.currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Checkout */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span className="font-bold text-gray-800">
              {formatCurrency(cartTotals.subtotal, settings.currency)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Pajak ({(settings.taxRate * 100).toFixed(0)}%)</span>
            <span className="font-bold text-gray-800">
              {formatCurrency(cartTotals.taxAmount, settings.currency)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
            <span>Total</span>
            <span className="text-xl font-extrabold text-[#21938c]">
              {formatCurrency(cartTotals.total, settings.currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 disabled:opacity-50"
            >
              Clear Cart
            </button>
            <button
              onClick={() => {
                onClose();
                setIsCheckoutModalOpen(true);
              }}
              disabled={cart.length === 0}
              className="py-3 rounded-xl bg-[#21938c] text-white text-xs font-bold hover:bg-[#1b7c76] disabled:opacity-50 shadow-md shadow-teal-700/20"
            >
              Bayar {formatCurrency(cartTotals.total, settings.currency)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
