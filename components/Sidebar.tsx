'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Activity,
  Box,
  MapPin,
  LineChart,
  BellRing,
  ShieldCheck,
  Building2,
  ChevronLeft,
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function Sidebar() {
  const pathname = usePathname();
  const { selectedCoalfield, setSelectedCoalfield, alerts, isSidebarOpen, toggleSidebar } = useDashboardStore();
  const unreadAlerts = alerts.filter(a => !a.acknowledged && a.severity !== 'info').length;

  const primaryNav = [
    { label: 'Portal Home', href: '/', icon: Home },
    { label: 'Control Console', href: '/dashboard', icon: Activity },
    { label: '3D Seam Model', href: '/model', icon: Box, tag: 'Bord & Pillar' },
    { label: 'Coalfield Satellite GIS', href: '/map', icon: MapPin },
  ];

  const complianceNav = [
    { label: 'Telemetry Trends', href: '/trends', icon: LineChart },
    { label: 'Form-IV Incident Log', href: '/alerts', icon: BellRing, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { label: 'DGMS Regulations & SCAMP', href: '/about', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-[#0c1017] min-h-screen select-none font-sans z-20 ${
        isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      <div className="w-64 min-w-[16rem] flex flex-col justify-between h-full">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f141f] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-[#1b2537] dark:bg-[#1a2333] border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-1.5">
                  DGMS • NMS-SEWS
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Ministry of Coal | SIH26025
                </p>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Close Navigation Bar"
              aria-label="Close Navigation Bar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        {/* Section 1: Statutory Monitoring */}
        <div className="px-3 pt-4">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Statutory Monitoring
          </p>
          <nav className="space-y-0.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e64a19] text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.tag && !isActive && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Analytics & Compliance */}
        <div className="px-3 pt-4">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Analytics & Regulatory
          </p>
          <nav className="space-y-0.5">
            {complianceNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e64a19] text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white text-[#e64a19]' : 'bg-red-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Monitored Basins */}
        <div className="px-3 pt-4">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            DGMS Monitoring Zones
          </p>
          <div className="space-y-1">
            {COALFIELD_ZONES.map((zone) => {
              const isSelected = selectedCoalfield === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedCoalfield(zone.id)}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors ${
                    isSelected
                      ? 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="truncate">{zone.name.split('—')[0]}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                    <span>{zone.state}</span>
                    <span>{zone.activeNodes} Nodes</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statutory Duty Officer Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f141f]">
        <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              Insp. R. K. Verma
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Dy. Dir. of Mines Safety (DGMS)
            </p>
          </div>
          <div className="flex items-center gap-1" title="Statutory Duty Shift Active">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  </aside>
  );
}
