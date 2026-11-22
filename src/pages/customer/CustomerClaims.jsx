import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import { Search, Filter, FilePlus2, Eye } from 'lucide-react';

export default function CustomerClaims() {
  const { t, i18n } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const isSinhala = (i18n.language || 'en') === 'si';

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/claims', {
        params: { search: search || undefined, status: statusFilter || undefined }
      });
      setClaims(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClaims();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.myClaims')}</h2>
          <p className="text-xs text-slate-500 mt-1">Review the history and current progress of your claims</p>
        </div>
        <Link
          to="/customer/submit-claim"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          {t('dashboard.submitNewClaim')}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('actions.search')}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white font-semibold text-slate-700"
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

      {/* Claims Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : claims.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {t('common.noData')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">{t('claim.claimReference')}</th>
                  <th className="py-3.5 px-6">{t('claim.category')}</th>
                  <th className="py-3.5 px-6">{t('claim.claimType')}</th>
                  <th className="py-3.5 px-6">{t('claim.incidentDate')}</th>
                  <th className="py-3.5 px-6">{t('claim.requestedAmount')}</th>
                  <th className="py-3.5 px-6">{t('claim.status')}</th>
                  <th className="py-3.5 px-6 text-right">{t('actions.view')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-xs text-navy-950">
                      {claim.claimReference}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-700">
                      {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">{claim.claimType}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">{claim.incidentDate}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/customer/track?ref=${claim.claimReference}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-navy-900 bg-slate-100 hover:bg-navy-900 hover:text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
