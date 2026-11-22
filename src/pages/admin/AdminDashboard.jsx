import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  UserCheck,
  FileText,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
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
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  const totalClaims = stats?.totalClaims || 1;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-2">
            System Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Insurance System Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor system-wide metrics, manage customer and officer accounts, configure insurance policies, and supervise claim processing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/customers"
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            {t('nav.customers')}
          </Link>
          <Link
            to="/admin/claims"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-all flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            {t('nav.claims')}
          </Link>
        </div>
      </div>

      {/* Main KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalCustomers')}</span>
            <div className="text-2xl font-black text-navy-950">{stats?.totalCustomers || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalOfficers')}</span>
            <div className="text-2xl font-black text-navy-950">{stats?.totalOfficers || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalPolicies')}</span>
            <div className="text-2xl font-black text-navy-950">{stats?.totalPolicies || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalClaims')}</span>
            <div className="text-2xl font-black text-navy-950">{stats?.totalClaims || 0}</div>
          </div>
        </div>
      </div>

      {/* Claim Status Pipeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.submitted')}</span>
          <div className="text-xl font-black text-blue-600 mt-1">{stats?.submittedClaims || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.underReview')}</span>
          <div className="text-xl font-black text-amber-600 mt-1">{stats?.underReviewClaims || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.docsRequired')}</span>
          <div className="text-xl font-black text-orange-600 mt-1">{stats?.documentsRequiredClaims || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.approved')}</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{stats?.approvedClaims || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.rejected')}</span>
          <div className="text-xl font-black text-rose-600 mt-1">{stats?.rejectedClaims || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.settled')}</span>
          <div className="text-xl font-black text-teal-600 mt-1">{stats?.settledClaims || 0}</div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims By Category Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              {t('dashboard.claimsByCategory')}
            </h4>
            <span className="text-xs text-slate-400 font-medium">Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.claimsByCategory && Object.entries(stats.claimsByCategory).map(([catName, count]) => {
              const pct = Math.round((count / (totalClaims || 1)) * 100);
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{catName}</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-navy-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claims By Status Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {t('dashboard.claimsByStatus')}
            </h4>
            <span className="text-xs text-slate-400 font-medium">Pipeline Breakdown</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {stats?.claimsByStatus && Object.entries(stats.claimsByStatus).map(([statusKey, count]) => {
              const pct = Math.round((count / (totalClaims || 1)) * 100);
              return (
                <div key={statusKey} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{t(`status.${statusKey}`, statusKey)}</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-navy-950">{t('dashboard.recentClaims')}</h4>
            <p className="text-xs text-slate-500">Latest claims submitted across all categories</p>
          </div>
          <Link
            to="/admin/claims"
            className="text-xs font-bold text-navy-800 hover:text-sky-600 flex items-center gap-1"
          >
            {t('dashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('claim.claimReference')}</th>
                <th className="py-3 px-4">{t('claim.customer')}</th>
                <th className="py-3 px-4">{t('claim.category')}</th>
                <th className="py-3 px-4">{t('claim.requestedAmount')}</th>
                <th className="py-3 px-4">{t('claim.assignedOfficer')}</th>
                <th className="py-3 px-4">{t('claim.status')}</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentClaims?.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-xs text-navy-950">
                    {claim.claimReference}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-900">
                    {claim.customerName}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-slate-800">
                    Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {claim.assignedOfficerName || <span className="text-amber-600 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={claim.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/claims?ref=${claim.claimReference}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
