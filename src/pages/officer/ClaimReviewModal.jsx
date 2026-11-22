import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  X,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Send,
  User,
  Check,
  ChevronRight
} from 'lucide-react';

export default function ClaimReviewModal({ claim, isOpen, onClose, onUpdated }) {
  const { t, i18n } = useTranslation();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'docs' | 'history'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Officer Action Form States
  const [actionType, setActionType] = useState(''); // 'UNDER_REVIEW' | 'REQUEST_DOCS' | 'APPROVE' | 'REJECT' | 'SETTLEMENT_PENDING' | 'SETTLE' | 'CLOSE'
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(claim?.requestedAmount || '');
  const [docRequestNotes, setDocRequestNotes] = useState('');

  // Settlement Form State
  const [settlementAmount, setSettlementAmount] = useState(claim?.approvedAmount || claim?.requestedAmount || '');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [paymentReference, setPaymentReference] = useState('SL-EFT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000));
  const [settlementNotes, setSettlementNotes] = useState('');

  if (!isOpen || !claim) return null;

  const handleStatusChange = async (newStatus) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        status: newStatus,
        notes,
        rejectionReason: newStatus === 'REJECTED' ? rejectionReason : undefined,
        approvedAmount: newStatus === 'APPROVED' ? parseFloat(approvedAmount) : undefined
      };

      await axiosClient.patch(`/claims/${claim.id}/status`, payload);
      setSuccess(`Claim transitioned to ${newStatus}`);
      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update claim status');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDocs = async () => {
    if (!docRequestNotes.trim()) {
      setError('Please specify the documents required');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axiosClient.post(`/claims/${claim.id}/request-documents`, {
        documentRequestNotes: docRequestNotes
      });
      setSuccess('Document request sent to customer');
      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request documents');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSettlement = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axiosClient.post(`/claims/${claim.id}/settlement`, {
        settlementAmount: parseFloat(settlementAmount),
        paymentMethod,
        paymentReference,
        settlementNotes
      });
      setSuccess('Settlement recorded successfully');
      setTimeout(() => {
        if (onUpdated) onUpdated();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-mono font-black text-navy-950">
                {claim.claimReference}
              </span>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customer: <b>{claim.customerName}</b> ({claim.customerNic}) • Policy: <b>{claim.policyNumber}</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 mt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'review'
                ? 'border-navy-900 text-navy-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Claim Overview & Review
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'docs'
                ? 'border-navy-900 text-navy-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Documents ({claim.documents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-navy-900 text-navy-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Progression Timeline ({claim.statusHistories?.length || 0})
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6">
          {activeTab === 'review' && (
            <div className="space-y-6">
              {/* Claim Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-navy-950 text-xs uppercase tracking-wider mb-2">
                    Customer & Policy Details
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="font-bold text-slate-900">{claim.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIC Number:</span>
                    <span className="font-mono text-slate-800">{claim.customerNic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-800">{claim.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Policy:</span>
                    <span className="font-bold text-navy-900">{claim.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-800">
                      {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-navy-950 text-xs uppercase tracking-wider mb-2">
                    Incident & Financials
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Claim Type:</span>
                    <span className="font-bold text-slate-900">{claim.claimType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Incident Date:</span>
                    <span className="text-slate-800">{claim.incidentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-800">{claim.incidentLocation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Requested Amount:</span>
                    <span className="font-bold text-slate-900">
                      Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {claim.approvedAmount != null && (
                    <div className="flex justify-between text-emerald-700 bg-emerald-100/50 p-1 rounded font-bold">
                      <span>Approved Amount:</span>
                      <span>Rs. {claim.approvedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Incident Description:
                </span>
                <p className="text-slate-800 leading-relaxed">{claim.description}</p>
              </div>

              {/* Officer Decision & Workflow Actions */}
              <div className="p-5 bg-navy-50/50 rounded-2xl border border-navy-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                    Officer Actions & Status Transitions
                  </h4>
                  <span className="text-[11px] text-slate-500">Current: <b>{claim.status}</b></span>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap gap-2">
                  {claim.status === 'SUBMITTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('UNDER_REVIEW')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Move to Under Review
                    </button>
                  )}

                  {['SUBMITTED', 'UNDER_REVIEW', 'RESUBMITTED'].includes(claim.status) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActionType(actionType === 'REQUEST_DOCS' ? '' : 'REQUEST_DOCS')}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Request Documents
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionType(actionType === 'APPROVE' ? '' : 'APPROVE')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Approve Claim
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionType(actionType === 'REJECT' ? '' : 'REJECT')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Reject Claim
                      </button>
                    </>
                  )}

                  {claim.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('SETTLEMENT_PENDING')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Move to Settlement Pending
                    </button>
                  )}

                  {['APPROVED', 'SETTLEMENT_PENDING'].includes(claim.status) && (
                    <button
                      type="button"
                      onClick={() => setActionType(actionType === 'SETTLE' ? '' : 'SETTLE')}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Record Settlement
                    </button>
                  )}

                  {claim.status === 'SETTLED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('CLOSED')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Close Claim
                    </button>
                  )}
                </div>

                {/* Sub-form: Request Docs */}
                {actionType === 'REQUEST_DOCS' && (
                  <div className="p-4 bg-white rounded-xl border border-orange-200 space-y-3">
                    <h5 className="text-xs font-bold text-orange-900">
                      Specify Documents Required from Customer:
                    </h5>
                    <textarea
                      rows={3}
                      value={docRequestNotes}
                      onChange={(e) => setDocRequestNotes(e.target.value)}
                      placeholder="e.g. Please provide official police traffic book extract and third-party driver license..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActionType('')}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestDocs}
                        disabled={loading}
                        className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-form: Approve Claim */}
                {actionType === 'APPROVE' && (
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-900">
                      Approve Claim & Enter Approved Amount:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Approved Amount (LKR) *
                        </label>
                        <input
                          type="number"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Approval Notes
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Approved after assessor verification"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActionType('')}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('APPROVED')}
                        disabled={loading}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                      >
                        Confirm Approval
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-form: Reject Claim */}
                {actionType === 'REJECT' && (
                  <div className="p-4 bg-white rounded-xl border border-rose-200 space-y-3">
                    <h5 className="text-xs font-bold text-rose-900">
                      Reject Claim with Mandatory Reason:
                    </h5>
                    <textarea
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="State the clear reason for rejection (e.g. Policy exclusion clause 4.2: unlicensed driver)..."
                      required
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActionType('')}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('REJECTED')}
                        disabled={loading || !rejectionReason.trim()}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-form: Record Settlement */}
                {actionType === 'SETTLE' && (
                  <div className="p-4 bg-white rounded-xl border border-teal-200 space-y-3">
                    <h5 className="text-xs font-bold text-teal-900">
                      Record Settlement Disbursement Details:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Settlement Amount (LKR) *
                        </label>
                        <input
                          type="number"
                          value={settlementAmount}
                          onChange={(e) => setSettlementAmount(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="BANK_TRANSFER">Bank Transfer (EFT)</option>
                          <option value="CHEQUE">Cheque</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Payment Reference
                        </label>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="e.g. SL-EFT-20261122"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Settlement Notes
                      </label>
                      <input
                        type="text"
                        value={settlementNotes}
                        onChange={(e) => setSettlementNotes(e.target.value)}
                        placeholder="e.g. Transferred to Commercial Bank account"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActionType('')}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRecordSettlement}
                        disabled={loading}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg"
                      >
                        Complete Settlement
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              {(!claim.documents || claim.documents.length === 0) ? (
                <p className="text-xs text-slate-400 py-8 text-center">No documents uploaded.</p>
              ) : (
                claim.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-sky-600 flex-shrink-0" />
                      <div>
                        <h5 className="font-bold text-navy-950">{doc.documentName}</h5>
                        <p className="text-[11px] text-slate-500">
                          {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                          {doc.additionalRequest && ' • (Requested Document)'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/api/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white hover:bg-navy-900 hover:text-white text-navy-900 border border-slate-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {claim.statusHistories?.map((hist) => (
                <div key={hist.id} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-navy-900 ring-4 ring-white" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1">
                    <span className="font-bold text-navy-950">
                      {t(`status.${hist.newStatus}`, hist.newStatus)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(hist.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {hist.reasonOrNotes || 'Status changed'}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Updated by: <b>{hist.updatedByName}</b>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
