import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Layers,
  FileText,
  FileCheck2,
  FilePlus2,
  Search,
  Bell,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const role = user?.role;

  let links = [];

  if (role === 'ADMIN') {
    links = [
      { to: '/admin', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
      { to: '/admin/customers', icon: Users, label: t('nav.customers') },
      { to: '/admin/officers', icon: UserCheck, label: t('nav.officers') },
      { to: '/admin/categories', icon: Layers, label: t('nav.categories') },
      { to: '/admin/policies', icon: FileText, label: t('nav.policies') },
      { to: '/admin/claims', icon: FileCheck2, label: t('nav.claims') },
    ];
  } else if (role === 'OFFICER') {
    links = [
      { to: '/officer', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
      { to: '/officer/claims', icon: FileCheck2, label: t('nav.claims') },
    ];
  } else if (role === 'CUSTOMER') {
    links = [
      { to: '/customer', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
      { to: '/customer/policies', icon: FileText, label: t('nav.myPolicies') },
      { to: '/customer/submit-claim', icon: FilePlus2, label: t('nav.submitClaim') },
      { to: '/customer/claims', icon: FileCheck2, label: t('nav.myClaims') },
      { to: '/customer/track', icon: Search, label: t('nav.trackClaim') },
      { to: '/customer/notifications', icon: Bell, label: t('nav.notifications') },
    ];
  }

  return (
    <aside className="w-64 bg-slate-50/80 border-r border-slate-200 hidden md:flex flex-col justify-between py-6 px-3 min-h-[calc(100vh-4rem)]">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Tag & Info */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {t('auth.userId')}:
        </div>
        <div className="font-mono text-xs font-bold text-navy-950">{user?.userId}</div>
        <div className="text-[11px] text-slate-500 truncate mt-0.5">{user?.fullName}</div>
      </div>
    </aside>
  );
}
