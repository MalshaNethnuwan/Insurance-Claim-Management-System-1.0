import React from 'react';
import { useTranslation } from 'react-i18next';

const statusConfig = {
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  UNDER_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  DOCUMENTS_REQUIRED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  RESUBMITTED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  SETTLEMENT_PENDING: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  SETTLED: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  CLOSED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  INACTIVE: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  EXPIRED: { bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-300' },
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const normalized = status ? status.toUpperCase() : 'SUBMITTED';
  const config = statusConfig[normalized] || statusConfig.SUBMITTED;
  const label = t(`status.${normalized}`, normalized);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.text.replace('text-', 'bg-')}`} />
      {label}
    </span>
  );
}
