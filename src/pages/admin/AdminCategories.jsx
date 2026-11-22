import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import {
  Layers,
  Plus,
  Edit2,
  Power,
  X,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function AdminCategories() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSinhala = (i18n.language || 'en') === 'si';

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    nameEn: '',
    nameSi: '',
    descriptionEn: '',
    descriptionSi: '',
    requiredDocuments: '',
    claimTypes: '',
    active: true
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setFormData({
      code: '',
      nameEn: '',
      nameSi: '',
      descriptionEn: '',
      descriptionSi: '',
      requiredDocuments: 'Police Report,Accident Photos,Repair Estimate',
      claimTypes: 'Accident Damage,Theft,Third Party Liability',
      active: true
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setFormData({
      code: cat.code,
      nameEn: cat.nameEn,
      nameSi: cat.nameSi,
      descriptionEn: cat.descriptionEn || '',
      descriptionSi: cat.descriptionSi || '',
      requiredDocuments: cat.requiredDocuments || '',
      claimTypes: cat.claimTypes || '',
      active: cat.active
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axiosClient.post('/categories', formData);
      setIsAddOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axiosClient.put(`/categories/${selectedCat.id}`, formData);
      setIsEditOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/categories/${id}/status`);
      fetchCategories();
    } catch (e) {
      alert('Failed to update category status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">{t('nav.categories')}</h2>
          <p className="text-xs text-slate-500 mt-1">Configure insurance categories, document requirements and claim types</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('actions.addCategory')}
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 uppercase">
                    {cat.code}
                  </span>
                  <StatusBadge status={cat.active ? 'ACTIVE' : 'INACTIVE'} />
                </div>

                <h3 className="text-base font-bold text-navy-950">
                  {cat.nameEn}
                </h3>
                <h4 className="text-xs font-semibold text-slate-600 mb-2">
                  {cat.nameSi}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isSinhala ? cat.descriptionSi : cat.descriptionEn}
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Permitted Claim Types:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {cat.claimTypes || 'None configured'}
                    </p>
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-slate-700 block mb-1">Required Documents:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {cat.requiredDocuments || 'None configured'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(cat.id)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    cat.active
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {cat.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
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
              Create New Insurance Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new category with configurable document criteria and claim types.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. MARINE"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none uppercase font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                    placeholder="Marine Insurance"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Name (Sinhala) *</label>
                <input
                  type="text"
                  value={formData.nameSi}
                  onChange={(e) => setFormData({ ...formData, nameSi: e.target.value })}
                  required
                  placeholder="නාවික රක්ෂණය"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permitted Claim Types (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.claimTypes}
                  onChange={(e) => setFormData({ ...formData, claimTypes: e.target.value })}
                  placeholder="Cargo Damage,Vessel Loss,Collision"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Documents (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.requiredDocuments}
                  onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
                  placeholder="Bill of Lading,Port Survey Report,Invoice"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
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
              Edit Category Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update criteria and titles for <b>{selectedCat?.nameEn}</b> ({selectedCat?.code})
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name (English) *</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Name (Sinhala) *</label>
                <input
                  type="text"
                  value={formData.nameSi}
                  onChange={(e) => setFormData({ ...formData, nameSi: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permitted Claim Types (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.claimTypes}
                  onChange={(e) => setFormData({ ...formData, claimTypes: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Documents (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.requiredDocuments}
                  onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
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
