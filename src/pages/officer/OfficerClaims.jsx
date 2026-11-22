import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import ClaimReviewModal from './ClaimReviewModal';
import { Search, Filter, Eye } from 'lucide-react';

export default function OfficerClaims() {
  const { t, i18n } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
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

  const openReview = async (id) => {
    try {
      const res = await axiosClient.get(`/claims/${id}`);
      setSelectedClaim(res.data);
      setIsReviewOpen(true);
    } catch (e) {
      alert('Failed to load claim');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">Manage Assigned Claims</h2>
        <p className="text-xs text-slate-500 mt-1">Review, approve, reject or request additional documentation</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, customer, or policy..."
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
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">{t('claim.claimReference')}</th>
                  <th className="py-3.5 px-5">{t('claim.customer')}</th>
                  <th className="py-3.5 px-5">{t('claim.category')}</th>
                  <th className="py-3.5 px-5">{t('claim.claimType')}</th>
                  <th className="py-3.5 px-5">{t('claim.requestedAmount')}</th>
                  <th className="py-3.5 px-5">{t('claim.status')}</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-xs text-navy-950">
                      {claim.claimReference}
                    </td>
                    <td className="py-3.5 px-5 text-xs font-semibold text-slate-900">
                      {claim.customerName}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600">
                      {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600">{claim.claimType}</td>
                    <td className="py-3.5 px-5 text-xs font-bold text-slate-800">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => openReview(claim.id)}
                        className="px-3 py-1.5 bg-navy-900 hover:bg-navy-950 text-white rounded-lg text-xs font-bold shadow-sm"
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
          fetchClaims();
        }}
      />
    </div>
  );
}
