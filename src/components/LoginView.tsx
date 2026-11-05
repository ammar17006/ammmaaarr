import React, { useState } from 'react';
import {
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

export const LoginView: React.FC = () => {
  const { users, loginWithPasswordOrPin, settings } = useApp();

  const [selectedUser, setSelectedUser] = useState<User>(users[0] || null);
  const [identifier, setIdentifier] = useState(users[0]?.name || '');
  const [secret, setSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectUser = (u: User) => {
    setSelectedUser(u);
    setIdentifier(u.name);
    setSecret('');
    setErrorMessage(null);
  };

  const handleQuickFill = (u: User, usePin: boolean = false) => {
    setSelectedUser(u);
    setIdentifier(u.name);
    setSecret(usePin ? u.pin : u.password);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = loginWithPasswordOrPin(identifier, secret);
    if (!result.success) {
      setErrorMessage(result.message || 'Kata sandi atau PIN tidak valid');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e4e4a] via-[#1a6e68] to-[#21938c] flex items-center justify-center p-4 sm:p-6 text-gray-800">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-[#1b7c76] text-white px-6 py-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-teal-400/15 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs text-white shadow-lg mb-3">
            <ShoppingBag className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight capitalize">
            {settings.storeName || 'ammar kafe'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium mt-1">
            Sistem Kasir POS &bull; {settings.address} (Telp: {settings.phone})
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* User Avatar Quick Selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
              Pilih Pengguna yang Akan Bertugas:
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {users.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-[#21938c] bg-teal-50/70 ring-2 ring-[#21938c]/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className={`w-12 h-12 rounded-full object-cover ring-2 ${
                          isSelected ? 'ring-[#21938c]' : 'ring-gray-200'
                        }`}
                      />
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#21938c] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 w-full">
                      <h4 className="text-xs font-bold text-gray-900 truncate capitalize">{u.name}</h4>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-md ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-teal-100 text-teal-900'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Account */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Akun / Nama Pengguna
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: ammar, jamil, saeja"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#21938c] focus:ring-2 focus:ring-[#21938c]/20 transition-all font-medium"
              />
            </div>

            {/* Password or PIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Kata Sandi atau PIN
                </label>
                <span className="text-[11px] text-teal-700 font-semibold">
                  Mendukung Sandi Akun &amp; 4-Digit PIN
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={secret}
                  onChange={(e) => {
                    setSecret(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan kata sandi atau PIN kasir..."
                  className="w-full p-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#21938c] focus:ring-2 focus:ring-[#21938c]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#21938c] hover:bg-[#1b7c76] active:bg-[#156762] text-white text-sm font-bold shadow-md shadow-teal-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Masuk ke Sistem POS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Guide */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Daftar Sandi &amp; PIN Pengguna (Siap Digunakan):</span>
            </div>

            <div className="space-y-2 text-xs">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 capitalize">{u.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {u.role}
                    </span>
                    <span className="text-gray-400 text-[11px]">&bull;</span>
                    <span className="text-gray-600 font-mono text-[11px]">
                      Sandi: <strong className="text-teal-800 font-bold">{u.password}</strong>
                    </span>
                    <span className="text-gray-400 text-[11px]">&bull;</span>
                    <span className="text-gray-600 font-mono text-[11px]">
                      PIN: <strong className="text-teal-800 font-bold">{u.pin}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(u, false)}
                      className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-colors"
                      title={`Gunakan Sandi ${u.name}`}
                    >
                      Pakai Sandi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(u, true)}
                      className="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold transition-colors"
                      title={`Gunakan PIN ${u.name}`}
                    >
                      Pakai PIN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
