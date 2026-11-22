import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Upload,
  Calendar,
  DollarSign,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const workflowSteps = [
  { key: 'SUBMITTED', labelEn: 'Submitted', labelSi: 'ඉදිරිපත් කළා' },
  { key: 'UNDER_REVIEW', labelEn: 'Under Review', labelSi: 'සමාලෝචනය' },
  { key: 'DOC_OR_RESUBMIT', labelEn: 'Docs / Resubmit', labelSi: 'ලියකියවිලි' },
  { key: 'APPROVED_OR_REJECTED', labelEn: 'Decision', labelSi: 'තීරණය' },
  { key: 'SETTLEMENT_PENDING', labelEn: 'Settlement Pending', labelSi: 'ගෙවීම් පොරොත්තු' },
  { key: 'SETTLED', labelEn: 'Settled', labelSi: 'ගෙවීම් කළා' },
  { key: 'CLOSED', labelEn: 'Closed', labelSi: 'වසා ඇත' }
];

export default function TrackClaim() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [refInput, setRefInput] = useState(searchParams.get('ref') || '');
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Additional Document Upload state
  const [addDocFile, setAddDocFile] = useState(null);
  const [addDocType, setAddDocType] = useState('Requested Document');
  const [uploadingAddDoc, setUploadingAddDoc] = useState(false);
  const [addDocSuccess, setAddDocSuccess] = useState('');

  const fetchClaim = async (ref) => {
    if (!ref || !ref.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await axiosClient.get(`/claims/track/${ref.trim()}`);
      setClaim(res.data);
    } catch (err) {
      setClaim(null);
      setError(err.response?.data?.message || 'Claim not found. Please verify the reference number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      setRefInput(urlRef);
      fetchClaim(urlRef);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (refInput.trim()) {
      setSearchParams({ ref: refInput.trim() });
      fetchClaim(refInput.trim());
    }
  };

  const handleUploadAdditionalDoc = async (e) => {
    e.preventDefault();
    if (!addDocFile || !claim) return;

    setUploadingAddDoc(true);
    setAddDocSuccess('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('claimId', claim.id);
      formData.append('documentType', addDocType);
      formData.append('isAdditional', 'true');
      formData.append('file', addDocFile);

      await axiosClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Call resubmit endpoint to transition status to RESUBMITTED
      await axiosClient.post(`/claims/${claim.id}/resubmit`);

      setAddDocSuccess('Additional document uploaded and claim resubmitted successfully!');
      setAddDocFile(null);
      fetchClaim(claim.claimReference);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload additional document.');
    } finally {
      setUploadingAddDoc(false);
    }
  };

  // Helper to determine step index in progress bar
  const getStepIndex = (status) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'DOCUMENTS_REQUIRED':
      case 'RESUBMITTED': return 2;
      case 'APPROVED':
      case 'REJECTED': return 3;
      case 'SETTLEMENT_PENDING': return 4;
      case 'SETTLED': return 5;
      case 'CLOSED': return 6;
      default: return 0;
    }
  };

  const currentStepIdx = claim ? getStepIndex(claim.status) : -1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">
            {t('nav.trackClaim')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your claim reference number to track its current evaluation status and history.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute inset-y-0 left-3.5 my-auto text-slate-400" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. CLM-2026-0001"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 font-mono font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('actions.search')}
          </button>
        </form>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Claim Tracking Result */}
      {claim && (
        <div className="space-y-6">
          {/* Visual Workflow Stepper */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('claim.claimReference')}
                </span>
                <div className="text-xl font-mono font-black text-navy-950">
                  {claim.claimReference}
                </div>
              </div>
              <div>
                <StatusBadge status={claim.status} />
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="overflow-x-auto py-2">
              <div className="flex items-center min-w-[600px] justify-between">
                {workflowSteps.map((s, idx) => {
                  const isDone = currentStepIdx > idx;
                  const isCurrent = currentStepIdx === idx;
                  const isRejected = isCurrent && claim.status === 'REJECTED';

                  return (
                    <div key={s.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isRejected
                              ? 'bg-rose-500 text-white shadow-md ring-4 ring-rose-100'
                              : isCurrent
                              ? 'bg-navy-900 text-white shadow-md ring-4 ring-navy-100'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-semibold mt-2 text-center whitespace-nowrap ${
                            isCurrent ? 'text-navy-950 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                          }`}
                        >
                          {isSinhala ? s.labelSi : s.labelEn}
                        </span>
                      </div>
                      {idx < workflowSteps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 -mt-5 transition-all ${
                            currentStepIdx > idx ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Alert for DOCUMENTS_REQUIRED */}
            {claim.status === 'DOCUMENTS_REQUIRED' && (
              <div className="p-5 bg-orange-50 border-2 border-orange-200 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-950">
                      {t('claim.documentRequest')}
                    </h4>
                    <p className="text-xs text-orange-800 mt-1">
                      {claim.documentRequestNotes || 'The reviewing officer has requested additional documents.'}
                    </p>
                  </div>
                </div>

                {addDocSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{addDocSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUploadAdditionalDoc} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="text"
                    value={addDocType}
                    onChange={(e) => setAddDocType(e.target.value)}
                    placeholder="Document Name / Type"
                    required
                    className="px-3 py-2 text-xs border border-orange-300 rounded-xl focus:outline-none bg-white font-medium"
                  />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setAddDocFile(e.target.files[0])}
                    required
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={uploadingAddDoc || !addDocFile}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadingAddDoc ? 'Uploading...' : t('claim.uploadAdditionalDocs')}
                  </button>
                </form>
              </div>
            )}

            {/* Rejection Alert */}
            {claim.status === 'REJECTED' && claim.rejectionReason && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-rose-950">{t('claim.rejectionReason')}</h5>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                    {claim.rejectionReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Incident & Policy Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100">
                Claim & Policy Information
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.policy')}:</span>
                  <span className="font-bold text-navy-950">{claim.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.category')}:</span>
                  <span className="font-semibold text-slate-800">
                    {isSinhala ? claim.categoryNameSi : claim.categoryNameEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.claimType')}:</span>
                  <span className="font-semibold text-slate-800">{claim.claimType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.incidentDate')}:</span>
                  <span className="font-medium text-slate-700">{claim.incidentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.incidentLocation')}:</span>
                  <span className="font-medium text-slate-700">{claim.incidentLocation || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('claim.requestedAmount')}:</span>
                  <span className="font-bold text-slate-900">
                    Rs. {claim.requestedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {claim.approvedAmount != null && (
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg font-bold">
                    <span>{t('claim.approvedAmount')}:</span>
                    <span>Rs. {claim.approvedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">{t('claim.description')}:</span>
                <p className="text-slate-700 mt-1 leading-relaxed">{claim.description}</p>
              </div>
            </div>

            {/* Attached Documents */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100">
                {t('claim.documents')} ({claim.documents?.length || 0})
              </h4>

              {(!claim.documents || claim.documents.length === 0) ? (
                <p className="text-xs text-slate-400 py-4 text-center">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {claim.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-navy-950 truncate">{doc.documentName}</div>
                          <div className="text-[10px] text-slate-400">
                            {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                            {doc.additionalRequest && ' • (Requested Doc)'}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-navy-800 hover:bg-slate-200 rounded-lg flex-shrink-0"
                        title={t('actions.download')}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Settlement Info if Settled */}
              {claim.settlement && (
                <div className="pt-3 border-t border-slate-100 bg-teal-50/50 p-3.5 rounded-xl border border-teal-200/60 text-xs space-y-1">
                  <h5 className="font-bold text-teal-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    {t('claim.settlementDetails')}
                  </h5>
                  <div className="flex justify-between text-teal-900">
                    <span>Settled Amount:</span>
                    <span className="font-bold">Rs. {claim.settlement.settlementAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-900">
                    <span>Payment Method:</span>
                    <span className="font-semibold">{claim.settlement.paymentMethod}</span>
                  </div>
                  {claim.settlement.paymentReference && (
                    <div className="flex justify-between text-teal-900">
                      <span>Reference:</span>
                      <span className="font-mono">{claim.settlement.paymentReference}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status Progression History Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100">
              {t('claim.statusHistory')}
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {claim.statusHistories?.map((hist, idx) => (
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
                    {hist.reasonOrNotes || 'Status updated'}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Updated by: <b>{hist.updatedByName}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
