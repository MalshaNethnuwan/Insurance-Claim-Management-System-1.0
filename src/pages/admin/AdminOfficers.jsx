import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  UserCheck,
  UserPlus,
  Search,
  Edit2,
  Power,
  X,
  CheckCircle2,
  AlertCircle,
  Layers
} from 'lucide-react';

export default function AdminOfficers() {
  const { t } = useTranslation();
  const [officers, setOfficers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [formError, setFormError] = useState('');
  const [createdInfo, setCreatedInfo] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    categoryIds: [],
    initialPassword: 'Password123!'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offRes, catRes] = await Promise.all([
        axiosClient.get('/officers', { params: { search: search || undefined } }),
        axiosClient.get('/categories')
      ]);
      setOfficers(offRes.data || []);
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
    setFormData({
      fullName: '',
      employeeId: '',
      email: '',
      phoneNumber: '',
      categoryIds: [],
      initialPassword: 'Password123!'
    });
    setFormError('');
    setCreatedInfo(null);
    setIsAddOpen(true);
  };

  const openEdit = (off) => {
    setSelectedOfficer(off);
    setFormData({
      fullName: off.fullName,
      employeeId: off.employeeId,
      email: off.email,
      phoneNumber: off.phoneNumber,
      categoryIds: off.categoryIds || [],
      initialPassword: ''
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const toggleCategorySelection = (catId) => {
    setFormData((prev) => {
      const exists = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((id) => id !== catId)
          : [...prev.categoryIds, catId]
      };
    });
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await axiosClient.post('/officers', formData);
      setCreatedInfo(res.data);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create officer');
    }
  };

  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axiosClient.put(`/officers/${selectedOfficer.id}`, formData);
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update officer');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/officers/${id}/status`);
      fetchData();
    } catch (e) {
      alert('Failed to update officer status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.officers')}</h2>
          <p className="text-xs text-slate-500 mt-1">Manage claim review officers and authorized category assignments</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          {t('actions.addOfficer')}
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
            placeholder="Search by name, employee ID, email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </form>
        <span className="text-xs font-semibold text-slate-400">Total: {officers.length}</span>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : officers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">{t('common.noData')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Officer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Assigned Categories</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-navy-950">
                      {off.userId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {off.employeeId}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-900">
                      {off.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{off.email}</div>
                      <div className="text-[11px] text-slate-400">{off.phoneNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {off.categoryNames?.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={off.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(off)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                        title="Edit Officer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(off.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          off.status === 'ACTIVE'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={off.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
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

      {/* Add Officer Modal */}
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
              Add New Insurance Officer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter officer information and select authorized insurance categories.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            {createdInfo ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Officer Account Created!</h4>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono space-y-1">
                  <div>User ID: <b>{createdInfo.userId}</b></div>
                  <div>Temporary Password: <b>{createdInfo.initialPassword}</b></div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-full py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateOfficer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="e.g. Bandara Jayasinghe"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="officer@insurance.lk"
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Authorized Insurance Categories *
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {categories.map((cat) => {
                      const isChecked = formData.categoryIds.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategorySelection(cat.id)}
                            className="rounded text-navy-900 focus:ring-navy-800"
                          />
                          <span>{cat.nameEn}</span>
                        </label>
                      );
                    })}
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
                    Create Officer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Officer Modal */}
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
              Edit Officer Profile & Categories
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Editing profile for <b>{selectedOfficer?.fullName}</b> ({selectedOfficer?.userId})
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateOfficer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Assigned Categories
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {categories.map((cat) => {
                    const isChecked = formData.categoryIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategorySelection(cat.id)}
                          className="rounded text-navy-900 focus:ring-navy-800"
                        />
                        <span>{cat.nameEn}</span>
                      </label>
                    );
                  })}
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
