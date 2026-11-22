import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  FilePlus2,
  FileText,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  ArrowRight
} from 'lucide-react';

export default function CustomerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSinhala = (i18n.language || 'en') === 'si';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/dashboard/stats');
        setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-2 backdrop-blur-sm">
            {t('roles.customer')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            {t('dashboard.welcome')}, {user?.fullName}!
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Submit claims online, upload required documents and monitor your claim progress in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/customer/submit-claim"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-navy-950 font-bold text-sm shadow-md transition-all"
          >
            <FilePlus2 className="w-4 h-4" />
            {t('dashboard.submitNewClaim')}
          </Link>
          <Link
            to="/customer/track"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
          >
            <Search className="w-4 h-4" />
            {t('nav.trackClaim')}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('nav.myPolicies')}</span>
            <FileText className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-navy-950">{stats?.totalPolicies || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalClaims')}</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-navy-950">{stats?.totalClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.underReview')}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {(stats?.submittedClaims || 0) + (stats?.underReviewClaims || 0) + (stats?.resubmittedClaims || 0)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.docsRequired')}</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-orange-600">{stats?.documentsRequiredClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.approved')}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {(stats?.approvedClaims || 0) + (stats?.settlementPendingClaims || 0)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.settled')}</span>
            <DollarSign className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600">
            {(stats?.settledClaims || 0) + (stats?.closedClaims || 0)}
          </div>
        </div>
      </div>

      {/* Recent Claims Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-navy-950">{t('dashboard.recentClaims')}</h3>
            <p className="text-xs text-slate-500">Track and review your latest submissions</p>
          </div>
          <Link
            to="/customer/claims"
            className="text-xs font-bold text-navy-800 hover:text-sky-600 flex items-center gap-1"
          >
            {t('dashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!stats?.recentClaims || stats.recentClaims.length === 0) ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl">
            <p className="text-sm text-slate-500 mb-3">{t('common.noData')}</p>
            <Link
              to="/customer/submit-claim"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              {t('dashboard.submitNewClaim')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">{t('claim.claimReference')}</th>
                  <th className="pb-3">{t('claim.category')}</th>
                  <th className="pb-3">{t('claim.claimType')}</th>
                  <th className="pb-3">{t('claim.requestedAmount')}</th>
                  <th className="pb-3">{t('claim.status')}</th>
                  <th className="pb-3 text-right">{t('actions.view')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-xs text-navy-900">
                      {claim.claimReference}
                    </td>
                    <td className="py-3 text-xs font-medium text-slate-700">
                      {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                    </td>
                    <td className="py-3 text-xs text-slate-600">{claim.claimType}</td>
                    <td className="py-3 text-xs font-semibold text-slate-800">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/customer/track?ref=${claim.claimReference}`}
                        className="px-3 py-1.5 text-xs font-semibold text-navy-800 bg-slate-100 hover:bg-navy-900 hover:text-white rounded-lg transition-colors inline-block"
                      >
                        {t('actions.view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
