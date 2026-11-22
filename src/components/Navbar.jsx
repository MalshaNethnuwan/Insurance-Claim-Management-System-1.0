import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import axiosClient from '../api/axiosClient';
import { Shield, Bell, User, LogOut, Key, Check } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        axiosClient.get('/notifications/unread-count'),
        axiosClient.get('/notifications')
      ]);
      setUnreadCount(countRes.data.unreadCount || 0);
      setNotifications(listRes.data || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAllRead = async () => {
    try {
      await axiosClient.post('/notifications/mark-all-read');
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {}
  };

  const markSingleRead = async (id) => {
    try {
      await axiosClient.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {}
  };

  const isSinhala = (i18n.language || 'en') === 'si';

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-navy-950 leading-tight">
              {t('app.title')}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 font-medium">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              title={t('nav.notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-navy-950">{t('nav.notifications')}</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-sky-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {t('actions.markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">{t('common.noData')}</p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markSingleRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-slate-50 hover:bg-slate-100' : 'bg-blue-50/70 border-l-4 border-navy-800'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 mb-0.5">
                          {isSinhala ? n.titleSi : n.titleEn}
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {isSinhala ? n.messageSi : n.messageEn}
                        </p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-navy-950 truncate max-w-[120px]">
                  {user?.fullName}
                </div>
                <div className="text-[10px] font-semibold text-sky-700 uppercase tracking-wider">
                  {t(`roles.${user?.role?.toLowerCase()}`, user?.role)}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-navy-950">{user?.fullName}</div>
                  <div className="text-[11px] text-slate-500">{user?.userId}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowPasswordModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <Key className="w-4 h-4 text-slate-500" />
                  {t('nav.changePassword')}
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg mt-1"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  {t('app.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        forced={false}
      />
    </>
  );
}
