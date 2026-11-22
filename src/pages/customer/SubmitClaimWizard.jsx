import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Shield,
  Trash2
} from 'lucide-react';

export default function SubmitClaimWizard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [step, setStep] = useState(1);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  // Form State
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [claimType, setClaimType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // [{ documentType, file, name, size }]

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedClaim, setSubmittedClaim] = useState(null);

  useEffect(() => {
    const fetchActivePolicies = async () => {
      try {
        const res = await axiosClient.get('/policies/my-policies/active');
        setPolicies(res.data || []);
      } catch (e) {
        setError('Failed to load active insurance policies');
      } finally {
        setLoadingPolicies(false);
      }
    };
    fetchActivePolicies();
  }, []);

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setClaimType('');
  };

  const availableClaimTypes = selectedPolicy?.categoryCode ? (
    selectedPolicy.categoryCode === 'VEHICLE'
      ? ['Accident Damage', 'Theft', 'Third Party Liability', 'Windscreen Damage', 'Fire Damage']
      : selectedPolicy.categoryCode === 'LIFE'
      ? ['Death Benefit', 'Critical Illness', 'Permanent Disability', 'Maturity Benefit']
      : selectedPolicy.categoryCode === 'HEALTH'
      ? ['Hospitalization Reimbursement', 'Surgical Expenses', 'Outpatient Consultation', 'Maternity Care']
      : selectedPolicy.categoryCode === 'PROPERTY'
      ? ['Fire and Lightning', 'Natural Disaster Flood/Storm', 'Burglary and Theft', 'Pipe Burst Water Damage']
      : ['Overseas Medical Emergency', 'Baggage Loss/Delay', 'Trip Cancellation', 'Flight Delay', 'Loss of Passport']
  ) : [];

  const requiredDocumentsList = selectedPolicy?.categoryCode ? (
    selectedPolicy.categoryCode === 'VEHICLE'
      ? ['Police Report', 'Driving License', 'Accident Photos', 'Repair Estimate']
      : selectedPolicy.categoryCode === 'LIFE'
      ? ['Death Certificate / Medical Records', 'Identity Card Copy', 'Policy Document', 'Claimant Bank Passbook']
      : selectedPolicy.categoryCode === 'HEALTH'
      ? ['Hospital Bill', 'Diagnosis Card', 'Doctor Prescription', 'Discharge Summary']
      : selectedPolicy.categoryCode === 'PROPERTY'
      ? ['Damage Photos', 'Police/Grama Niladhari Report', 'Valuation/Repair Estimate']
      : ['Passport with Visa Stamp', 'Boarding Pass', 'Medical Report / Baggage PIR Report']
  ) : [];

  const handleFileUpload = (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Only PDF, JPG, JPEG, and PNG files are accepted');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }

    setUploadedFiles((prev) => {
      const filtered = prev.filter((item) => item.documentType !== docType);
      return [...filtered, { documentType: docType, file, name: file.name, size: file.size }];
    });
  };

  const removeFile = (docType) => {
    setUploadedFiles((prev) => prev.filter((item) => item.documentType !== docType));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      // 1. Submit claim metadata
      const claimPayload = {
        policyId: selectedPolicy.id,
        claimType,
        incidentDate,
        incidentLocation,
        description,
        requestedAmount: parseFloat(requestedAmount)
      };

      const claimRes = await axiosClient.post('/claims', claimPayload);
      const newClaim = claimRes.data;

      // 2. Upload each attached document
      for (const item of uploadedFiles) {
        const formData = new FormData();
        formData.append('claimId', newClaim.id);
        formData.append('documentType', item.documentType);
        formData.append('isAdditional', 'false');
        formData.append('file', item.file);

        await axiosClient.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setSubmittedClaim(newClaim);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { num: 1, title: t('claim.selectPolicy') },
            { num: 2, title: t('claim.claimDetails') },
            { num: 3, title: t('claim.uploadDocuments') },
            { num: 4, title: t('claim.reviewSubmit') }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`hidden sm:block text-xs font-semibold ${
                    step >= s.num ? 'text-navy-950' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all ${
                    step > s.num ? 'bg-navy-900' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Insurance Policy */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-navy-950">{t('claim.selectPolicy')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Choose the active policy under which you wish to file a claim.
            </p>
          </div>

          {loadingPolicies ? (
            <div className="py-12 text-center text-slate-400">Loading policies...</div>
          ) : policies.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl">
              <Shield className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No active policies found</p>
              <p className="text-xs text-slate-400 mt-1">You must have an active insurance policy to file a claim.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((pol) => {
                const isSelected = selectedPolicy?.id === pol.id;
                return (
                  <div
                    key={pol.id}
                    onClick={() => handlePolicySelect(pol)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-navy-900 bg-navy-50/40 shadow-md ring-2 ring-navy-900/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          {isSinhala ? pol.categoryNameSi : pol.categoryNameEn}
                        </span>
                        <h4 className="text-sm font-bold text-navy-950 mt-1.5">
                          {isSinhala ? pol.policyNameSi : pol.policyNameEn}
                        </h4>
                      </div>
                      <StatusBadge status={pol.status} />
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Policy Number:</span>
                        <span className="font-mono font-bold text-slate-900">{pol.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Coverage:</span>
                        <span className="font-semibold text-slate-900">
                          Rs. {pol.coverageAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expiry Date:</span>
                        <span className="font-medium text-slate-700">{pol.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="button"
              disabled={!selectedPolicy}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-40 transition-all"
            >
              {t('actions.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Enter Claim Details */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-navy-950">{t('claim.claimDetails')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide accurate details about the incident.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Selected Policy:</span>
              <div className="text-xs font-mono font-bold text-navy-900">{selectedPolicy?.policyNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('claim.claimType')} *
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
              >
                <option value="">Select Claim Type</option>
                {availableClaimTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('claim.requestedAmount')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                  LKR
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  placeholder="e.g. 75000"
                  required
                  className="w-full pl-12 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('claim.incidentDate')} *
              </label>
              <input
                type="date"
                value={incidentDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('claim.incidentLocation')}
              </label>
              <input
                type="text"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g. Galle Road, Colombo"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('claim.description')} *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clear description of what happened..."
              required
              className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> {t('actions.back')}
            </button>
            <button
              type="button"
              disabled={!claimType || !incidentDate || !requestedAmount || !description}
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-40 transition-all"
            >
              {t('actions.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload Documents */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-navy-950">{t('claim.uploadDocuments')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload clear photos or PDF documents required for {selectedPolicy?.categoryNameEn}. (Max 10MB per file: PDF, JPG, PNG).
            </p>
          </div>

          <div className="space-y-3">
            {requiredDocumentsList.map((docType) => {
              const uploaded = uploadedFiles.find((f) => f.documentType === docType);
              return (
                <div
                  key={docType}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">{docType}</h5>
                    <p className="text-[11px] text-slate-500">
                      {uploaded ? `Attached: ${uploaded.name} (${(uploaded.size / 1024).toFixed(0)} KB)` : 'Required document'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {uploaded ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(docType)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-navy-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        Upload
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docType, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> {t('actions.back')}
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              {t('actions.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-navy-950">{t('claim.reviewSubmit')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please double-check all details before final submission.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.policy')}:</span>
                <div className="font-bold text-navy-950 mt-0.5">{selectedPolicy?.policyNameEn} ({selectedPolicy?.policyNumber})</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.category')}:</span>
                <div className="font-bold text-navy-950 mt-0.5">{selectedPolicy?.categoryNameEn}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.claimType')}:</span>
                <div className="font-bold text-navy-950 mt-0.5">{claimType}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.requestedAmount')}:</span>
                <div className="font-bold text-emerald-600 text-sm mt-0.5">
                  Rs. {parseFloat(requestedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.incidentDate')}:</span>
                <div className="font-bold text-navy-950 mt-0.5">{incidentDate}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{t('claim.incidentLocation')}:</span>
                <div className="font-bold text-navy-950 mt-0.5">{incidentLocation || 'N/A'}</div>
              </div>
            </div>

            <div className="text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-400 font-semibold">{t('claim.description')}:</span>
              <p className="text-slate-700 mt-1 leading-relaxed">{description}</p>
            </div>

            <div className="text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-400 font-semibold">{t('claim.documents')} ({uploadedFiles.length}):</span>
              <ul className="mt-1.5 space-y-1">
                {uploadedFiles.map((f) => (
                  <li key={f.documentType} className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{f.documentType}: <b>{f.name}</b></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> {t('actions.back')}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : t('actions.submit')}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success Confirmation */}
      {step === 5 && submittedClaim && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-navy-950">{t('claim.submitSuccess')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your claim has been registered in the system and assigned for review.
            </p>
          </div>

          <div className="bg-navy-50/70 border-2 border-dashed border-navy-200 rounded-2xl p-6 max-w-md mx-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('claim.referenceGenerated')}
            </span>
            <div className="text-2xl font-mono font-black text-navy-950 mt-1">
              {submittedClaim.claimReference}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {t('claim.keepReferenceSafe')}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/customer/track?ref=${submittedClaim.claimReference}`)}
              className="px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              {t('nav.trackClaim')}
            </button>
            <button
              onClick={() => navigate('/customer/claims')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              {t('nav.myClaims')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
