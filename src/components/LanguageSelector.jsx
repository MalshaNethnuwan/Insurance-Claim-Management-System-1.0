import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ className = '' }) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'en';

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 ${className}`}>
      <Globe className="w-4 h-4 text-slate-500 ml-1" />
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          currentLang === 'en'
            ? 'bg-navy-900 text-white shadow-sm'
            : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('si')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          currentLang === 'si'
            ? 'bg-navy-900 text-white shadow-sm'
            : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200'
        }`}
      >
        සිංහල
      </button>
    </div>
  );
}
