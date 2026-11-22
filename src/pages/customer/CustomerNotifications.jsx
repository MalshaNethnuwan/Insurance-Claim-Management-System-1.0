import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import { Bell, Check, Clock } from 'lucide-react';

export default function CustomerNotifications() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSinhala = (i18n.language || 'en') === 'si';

  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axiosClient.post('/notifications/mark-all-read');
      fetchNotifications();
    } catch (e) {}
  };

  const markSingle = async (id) => {
    try {
      await axiosClient.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.notifications')}</h2>
          <p className="text-xs text-slate-500 mt-1">Updates regarding your submitted claims and documents</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
          >
            <Check className="w-3.5 h-3.5" />
            {t('actions.markAllRead')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-navy-950">No notifications yet</h4>
          <p className="text-xs text-slate-400 mt-1">You will receive notifications when your claim status updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markSingle(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-blue-50/80 border-navy-300 shadow-sm ring-1 ring-navy-400/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.read ? 'bg-slate-100 text-slate-500' : 'bg-navy-900 text-white'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">
                      {isSinhala ? n.titleSi : n.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {isSinhala ? n.messageSi : n.messageEn}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
