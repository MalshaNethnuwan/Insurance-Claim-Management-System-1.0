import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(userId.trim(), password);
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else if (userData.role === 'OFFICER') {
        navigate('/officer');
      } else if (userData.role === 'CUSTOMER') {
        navigate('/customer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (id, pass) => {
    setUserId(id);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar Language Selector */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full pt-2">
        <div className="flex items-center gap-2 text-white/90">
          <Shield className="w-6 h-6 text-sky-400" />
          <span className="font-bold text-sm tracking-wide">INSURECLAIM</span>
        </div>
        <LanguageSelector className="bg-white/10 border-white/20 text-white" />
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 text-sky-400 mx-auto flex items-center justify-center shadow-lg mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              {t('auth.userId')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t('auth.enterUserId')}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterPassword')}
                required
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 mt-2"
          >
            {loading ? t('auth.signingIn') : t('auth.signInButton')}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick Fill Demo Accounts (Password: Password123!)
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => fillQuickAccount('ADM001', 'Password123!')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-navy-100 text-navy-900 rounded-lg transition-colors border border-slate-200"
            >
              Admin (ADM001)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('OFF001', 'Password123!')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-navy-100 text-navy-900 rounded-lg transition-colors border border-slate-200"
            >
              Vehicle Officer (OFF001)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('OFF003', 'Password123!')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-navy-100 text-navy-900 rounded-lg transition-colors border border-slate-200"
            >
              Life Officer (OFF003)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('CUS001', 'Password123!')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-navy-100 text-navy-900 rounded-lg transition-colors border border-slate-200"
            >
              Customer (CUS001)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 pb-2">
        {t('app.copyright')}
      </footer>
    </div>
  );
}
