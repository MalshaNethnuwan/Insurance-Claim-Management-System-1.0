import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Power,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminPolicies() {
  const { t, i18n } = useTranslation();
  const isSinhala = (i18n.language || 'en') === 'si';

  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    policyNameEn: '',
    policyNameSi: '',
    customerId: '',
    categoryId: '',
    coverageAmount: '',
    premiumAmount: '',
    startDate: '',
    expiryDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [polRes, custRes, catRes] = await Promise.all([
        axiosClient.get('/policies', { params: { search: search || undefined } }),
        axiosClient.get('/customers'),
        axiosClient.get('/categories')
      ]);
      setPolicies(polRes.data || []);
      setCustomers(custRes.data || []);
      setCategories(catRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const openAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setFormData({
      policyNameEn: '',
      policyNameSi: '',
      customerId: customers[0]?.id || '',
      categoryId: categories[0]?.id || '',
      coverageAmount: '5000000',
      premiumAmount: '50000',
      startDate: today,
      expiryDate: nextYear
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const openEdit = (pol) => {
    setSelectedPolicy(pol);
    setFormData({
      policyNameEn: pol.policyNameEn,
      policyNameSi: pol.policyNameSi || '',
      customerId: pol.customerId,
      categoryId: pol.categoryId,
      coverageAmount: pol.coverageAmount,
      premiumAmount: pol.premiumAmount || '',
      startDate: pol.startDate,
      expiryDate: pol.expiryDate
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axiosClient.post('/policies', {
        ...formData,
        coverageAmount: parseFloat(formData.coverageAmount),
        premiumAmount: formData.premiumAmount ? parseFloat(formData.premiumAmount) : null
      });
      setIsAddOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create policy');
    }
  };

  const handleUpdatePolicy = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axiosClient.put(`/policies/${selectedPolicy.id}`, {
        ...formData,
        coverageAmount: parseFloat(formData.coverageAmount),
        premiumAmount: formData.premiumAmount ? parseFloat(formData.premiumAmount) : null
      });
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update policy');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/policies/${id}/status`);
      fetchData();
    } catch (e) {
      alert('Failed to update policy status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.policies')}</h2>
          <p className="text-xs text-slate-500 mt-1">Manage and assign insurance policies to registered customers</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('actions.addPolicy')}
        </button>
      </div>

      {/* Search Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by policy number, name, customer..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </form>
        <span className="text-xs font-semibold text-slate-400">Total: {policies.length}</span>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : policies.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">{t('common.noData')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Policy Number</th>
                  <th className="py-3.5 px-4">Policy Name</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Max Coverage</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-navy-950">
                      {p.policyNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-900">
                      {isSinhala ? p.policyNameSi : p.policyNameEn}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                      {p.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {isSinhala ? p.categoryNameSi : p.categoryNameEn}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-emerald-700">
                      Rs. {p.coverageAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {p.startDate} to {p.expiryDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                        title="Edit Policy"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.status === 'ACTIVE'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={p.status === 'ACTIVE' ? 'Cancel Policy' : 'Activate Policy'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Policy Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 mb-1">
              Assign New Insurance Policy
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select customer, category, coverage terms and coverage dates.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePolicy} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer *</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none bg-white font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.fullName} ({c.nicNumber})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none bg-white font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Name (English) *</label>
                <input
                  type="text"
                  value={formData.policyNameEn}
                  onChange={(e) => setFormData({ ...formData, policyNameEn: e.target.value })}
                  required
                  placeholder="e.g. DriveSafe Motor Plan"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Name (Sinhala)</label>
                <input
                  type="text"
                  value={formData.policyNameSi}
                  onChange={(e) => setFormData({ ...formData, policyNameSi: e.target.value })}
                  placeholder="e.g. ඩ්‍රයිව්සේෆ් මෝටර් රථ සැලසුම"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coverage Amount (LKR) *</label>
                  <input
                    type="number"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Premium (LKR)</label>
                  <input
                    type="number"
                    value={formData.premiumAmount}
                    onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-navy-900 hover:bg-navy-950 text-white font-bold rounded-xl shadow-sm"
                >
                  Issue Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-200">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 mb-1">
              Edit Policy Parameters
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Updating terms for <b>{selectedPolicy?.policyNumber}</b>
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePolicy} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Name (English) *</label>
                <input
                  type="text"
                  value={formData.policyNameEn}
                  onChange={(e) => setFormData({ ...formData, policyNameEn: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coverage Amount (LKR) *</label>
                <input
                  type="number"
                  value={formData.coverageAmount}
                  onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-navy-900 hover:bg-navy-950 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
