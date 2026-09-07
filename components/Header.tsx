'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Home,
  Activity,
  Box,
  MapPin,
  LineChart,
  BellRing,
  ShieldCheck,
  Moon,
  Sun,
  Play,
  RotateCcw,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    isDarkMode,
    toggleDarkMode,
    isSubsidenceSimActive,
    simProgress,
    triggerSubsidenceEvent,
    resetSimulation,
    selectedCoalfield,
    alerts,
  } = useDashboardStore();

  const currentZone = COALFIELD_ZONES.find((z) => z.id === selectedCoalfield) || COALFIELD_ZONES[0];
  const unreadAlerts = alerts.filter((a) => !a.acknowledged && a.severity !== 'info').length;

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Console', href: '/dashboard', icon: Activity },
    { label: '3D Model', href: '/model', icon: Box },
    { label: 'GIS Map', href: '/map', icon: MapPin },
    { label: 'Trends', href: '/trends', icon: LineChart },
    { label: 'Alerts', href: '/alerts', icon: BellRing, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { label: 'Regulations', href: '/about', icon: ShieldCheck },
  ];

  const handleExportReport = () => {
    const reportText = `DGMS MINE SUBSIDENCE MONITORING COMPLIANCE REPORT
Problem Statement: SIH26025
Location: ${currentZone.name} (${currentZone.state})
Timestamp: ${new Date().toISOString()}
Telemetry Status: 100% Mesh Operational (Zigbee/LoRa)
Sentinel-1 InSAR Deformation Rate: ${currentZone.insarDeformationRateMmYr} mm/yr
Compliance Form: DGMS (Technical) Form IV
Verified by: Insp. R. K. Verma, Safety Officer`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DGMS-SIH26025-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#182338] border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-xs group-hover:border-amber-400/50 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="font-black text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>DGMS • NMS-SEWS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Ministry of Coal | SIH26025
              </p>
            </div>
          </Link>

          {/* Horizontal Navigation Links (Desktop: >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-[#e64a19] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-[#e64a19]' : 'bg-red-600 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Subsidence Emergency Drill Button */}
            {isSubsidenceSimActive ? (
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md animate-pulse border border-red-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Drill</span>
                <span>({Math.round(simProgress * 100)}%)</span>
              </button>
            ) : (
              <button
                onClick={triggerSubsidenceEvent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e64a19] hover:bg-[#d84315] text-white text-xs font-bold transition-all shadow-md border border-orange-500"
                title="Execute DGMS CMR-111 Strata Dilation Drill"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Simulate Drill</span>
              </button>
            )}

            {/* Dark Mode Switch */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-xs"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Export DGMS Form IV Report */}
            <button
              onClick={handleExportReport}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shadow-xs"
              title="Download DGMS Technical Form-IV Audit Log"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Form-IV</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-700/80 text-slate-300 hover:bg-slate-800 transition-colors shadow-xs"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#e64a19]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0c1322] px-4 py-3 space-y-1 shadow-xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#e64a19] text-white shadow-sm'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#e64a19]' : 'bg-red-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Insp. R. K. Verma (DGMS Safety Officer)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      )}
    </header>
  );
}
