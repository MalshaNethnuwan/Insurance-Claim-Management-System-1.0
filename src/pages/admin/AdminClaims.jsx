import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import ClaimReviewModal from '../officer/ClaimReviewModal';
import {
  Search,
  Filter,
  UserCheck,
  Eye,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AdminClaims() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [claims, setClaims] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('ref') || '');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [claimToAssign, setClaimToAssign] = useState(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [assignError, setAssignError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [claimsRes, offRes] = await Promise.all([
        axiosClient.get('/claims', {
          params: { search: search || undefined, status: statusFilter || undefined }
        }),
        axiosClient.get('/officers')
      ]);
      setClaims(claimsRes.data || []);
      setOfficers(offRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
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

  const openAssignModal = (claim) => {
    setClaimToAssign(claim);
    setSelectedOfficerId(claim.assignedOfficerId || officers[0]?.id || '');
    setAssignError('');
    setIsAssignOpen(true);
  };

  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    if (!selectedOfficerId) return;

    setAssignError('');
    try {
      await axiosClient.patch(`/claims/${claimToAssign.id}/assign`, {
        officerId: selectedOfficerId
      });
      setIsAssignOpen(false);
      fetchData();
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign officer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">System Claims Management</h2>
        <p className="text-xs text-slate-500 mt-1">Supervise all submitted claims, assign officers and audit decisions</p>
      </div>

      {/* Filter and Search Bar */}
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

      {/* Claims Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : claims.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">{t('common.noData')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Claim Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Requested</th>
                  <th className="py-3.5 px-4">Assigned Officer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-navy-950">
                      {claim.claimReference}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-900">
                      {claim.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{claim.claimType}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-800">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {claim.assignedOfficerName ? (
                        <span className="font-semibold text-navy-900">{claim.assignedOfficerName}</span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openAssignModal(claim)}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200"
                        title="Assign Officer"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => openReview(claim.id)}
                        className="px-3 py-1 bg-navy-900 hover:bg-navy-950 text-white rounded-lg text-xs font-bold shadow-sm"
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

      {/* Assign Officer Modal */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-slate-200">
            <button
              onClick={() => setIsAssignOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 mb-1">
              Assign Claim to Officer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Claim <b>{claimToAssign?.claimReference}</b> ({claimToAssign?.categoryNameEn})
            </p>

            {assignError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{assignError}</span>
              </div>
            )}

            <form onSubmit={handleAssignOfficer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Insurance Officer *</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Choose Officer --</option>
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.fullName} ({off.employeeId}) • [{off.categoryNames?.join(', ')}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy-900 hover:bg-navy-950 text-white font-bold rounded-xl shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ClaimReviewModal
        claim={selectedClaim}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onUpdated={() => {
          setIsReviewOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
