'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Box,
  MapPin,
  LineChart,
  BellRing,
  ShieldCheck,
  HardHat
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function Sidebar() {
  const pathname = usePathname();
  const { selectedCoalfield, setSelectedCoalfield, alerts } = useDashboardStore();
  const unreadAlerts = alerts.filter(a => !a.acknowledged && a.severity !== 'info').length;

  const navItems = [
    { label: 'Landing Page', href: '/', icon: Home },
    { label: 'Live Console', href: '/dashboard', icon: LayoutDashboard },
    { label: '3D Mine Model', href: '/model', icon: Box, highlight: true },
    { label: 'Coalfield Map', href: '/map', icon: MapPin },
    { label: 'Telemetry Trends', href: '/trends', icon: LineChart },
    { label: 'Emergency Alerts', href: '/alerts', icon: BellRing, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { label: 'About & DGMS', href: '/about', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#111726] border-r border-gray-200 dark:border-slate-800/80 flex flex-col justify-between shrink-0 transition-colors duration-200 min-h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800/60 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safety-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-safety-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
                TASQ Coal
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-safety-50 dark:bg-safety-950/60 text-safety-600 dark:text-safety-400 border border-safety-200 dark:border-safety-800">
                  SIH26025
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">DGMS Safety Portal</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-4">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-safety-500 text-white shadow-sm shadow-safety-500/30'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-safety-500' : 'text-gray-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined ? (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-safety-600' : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  ) : item.highlight && !isActive ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-safety-50 dark:bg-safety-950 text-safety-600 dark:text-safety-400 border border-safety-200 dark:border-safety-800">
                      3D
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Coalfield Selector */}
        <div className="px-3 py-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Monitored Coalfields
          </p>
          <div className="space-y-1.5 px-1">
            {COALFIELD_ZONES.map((zone) => {
              const isSelected = selectedCoalfield === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedCoalfield(zone.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-safety-500/50 bg-safety-50/60 dark:bg-safety-950/30 text-safety-700 dark:text-safety-300'
                      : 'border-gray-200/80 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/40 text-gray-600 dark:text-slate-400 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span className="truncate">{zone.name.split('—')[0]}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>{zone.state}</span>
                    <span>{zone.activeNodes} Nodes</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Officer Profile Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-safety-500 text-white font-bold flex items-center justify-center text-xs shadow-inner">
              RV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">
                Insp. R. K. Verma
              </p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                DGMS Mine Safety
              </p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500" title="On Shift Duty" />
        </div>
      </div>
    </aside>
  );
}
