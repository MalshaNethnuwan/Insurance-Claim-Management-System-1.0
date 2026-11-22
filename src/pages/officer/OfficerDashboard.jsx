import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import ClaimReviewModal from './ClaimReviewModal';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Search,
  Filter,
  Eye,
  Shield
} from 'lucide-react';

export default function OfficerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, claimsRes] = await Promise.all([
        axiosClient.get('/dashboard/stats'),
        axiosClient.get('/claims')
      ]);
      setStats(statsRes.data);
      setClaims(claimsRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openReview = async (claimId) => {
    try {
      const res = await axiosClient.get(`/claims/${claimId}`);
      setSelectedClaim(res.data);
      setIsReviewOpen(true);
    } catch (e) {
      alert('Failed to load claim details');
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.claimReference.toLowerCase().includes(q) ||
        c.customerName?.toLowerCase().includes(q) ||
        c.policyNumber?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Officer Welcome Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-2">
            {t('roles.officer')} Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            {t('dashboard.welcome')}, {user?.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Evaluate submitted claims, review customer verification documents, and process claim settlements.
          </p>
        </div>

        {/* Authorized Categories Pills */}
        {stats?.claimsByCategory && (
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
              Assigned Categories:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stats.claimsByCategory).map(([catName, count]) => (
                <span
                  key={catName}
                  className="px-2.5 py-1 bg-white/15 rounded-lg text-white font-semibold text-[11px]"
                >
                  {catName} ({count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.totalClaims')}</span>
          <div className="text-2xl font-black text-navy-950 mt-1">{stats?.totalClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.submitted')}</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats?.submittedClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.underReview')}</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {(stats?.underReviewClaims || 0) + (stats?.resubmittedClaims || 0)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.docsRequired')}</span>
          <div className="text-2xl font-black text-orange-600 mt-1">{stats?.documentsRequiredClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.approved')}</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats?.approvedClaims || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.settled')}</span>
          <div className="text-2xl font-black text-teal-600 mt-1">{stats?.settledClaims || 0}</div>
        </div>
      </div>

      {/* Claims Management Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-navy-950">Claim Queue & Evaluation</h3>
            <p className="text-xs text-slate-500">Claims within your authorized categories</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute inset-y-0 left-3 my-auto text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('actions.search')}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 w-44"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white font-semibold text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="DOCUMENTS_REQUIRED">DOCUMENTS_REQUIRED</option>
              <option value="RESUBMITTED">RESUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="SETTLEMENT_PENDING">SETTLEMENT_PENDING</option>
              <option value="SETTLED">SETTLED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {t('common.noData')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t('claim.claimReference')}</th>
                  <th className="py-3 px-4">{t('claim.customer')}</th>
                  <th className="py-3 px-4">{t('claim.category')}</th>
                  <th className="py-3 px-4">{t('claim.claimType')}</th>
                  <th className="py-3 px-4">{t('claim.requestedAmount')}</th>
                  <th className="py-3 px-4">{t('claim.status')}</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((claim) => (
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
                    <td className="py-3 px-4 text-xs text-slate-600">{claim.claimType}</td>
                    <td className="py-3 px-4 text-xs font-bold text-slate-800">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openReview(claim.id)}
                        className="px-3 py-1.5 bg-navy-900 hover:bg-navy-950 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ClaimReviewModal
        claim={selectedClaim}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onUpdated={() => {
          setIsReviewOpen(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
