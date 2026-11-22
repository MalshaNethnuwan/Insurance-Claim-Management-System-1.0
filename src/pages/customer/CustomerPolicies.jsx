import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import { FileText, Shield, FilePlus2 } from 'lucide-react';

export default function CustomerPolicies() {
  const { t, i18n } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSinhala = (i18n.language || 'en') === 'si';

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axiosClient.get('/policies/my-policies');
        setPolicies(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.myPolicies')}</h2>
          <p className="text-xs text-slate-500 mt-1">Review your active insurance covers and policy benefits</p>
        </div>
        <Link
          to="/customer/submit-claim"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          {t('dashboard.submitNewClaim')}
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : policies.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-navy-950">No policies assigned</h4>
          <p className="text-xs text-slate-500 mt-1">Please contact customer support or administration.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 rounded-full border border-sky-200">
                    {isSinhala ? pol.categoryNameSi : pol.categoryNameEn}
                  </span>
                  <StatusBadge status={pol.status} />
                </div>

                <h3 className="text-base font-bold text-navy-950 mb-1">
                  {isSinhala ? pol.policyNameSi : pol.policyNameEn}
                </h3>
                <div className="font-mono text-xs font-bold text-slate-400 mb-4">
                  {pol.policyNumber}
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage Amount:</span>
                    <span className="font-bold text-emerald-700">
                      Rs. {pol.coverageAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {pol.premiumAmount && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Premium:</span>
                      <span className="font-medium text-slate-700">
                        Rs. {pol.premiumAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="font-medium text-slate-700">{pol.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-medium text-slate-700">{pol.expiryDate}</span>
                  </div>
                </div>
              </div>

              {pol.status === 'ACTIVE' && (
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/customer/submit-claim`}
                    className="w-full py-2 bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    File Claim Under This Policy
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
