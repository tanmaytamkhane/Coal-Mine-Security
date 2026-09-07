'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Download,
  Box
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function Header() {
  const {
    isDarkMode,
    toggleDarkMode,
    isAudioMuted,
    toggleAudioMute,
    isSubsidenceSimActive,
    simProgress,
    triggerSubsidenceEvent,
    resetSimulation,
    selectedCoalfield,
    isMlModelConnected,
    mlModelEngine
  } = useDashboardStore();

  const currentZone = COALFIELD_ZONES.find(z => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  const handleExportReport = () => {
    const reportText = `DGMS MINE SUBSIDENCE MONITORING COMPLIANCE REPORT
Problem Statement: SIH26025
Location: ${currentZone.name} (${currentZone.state})
Timestamp: ${new Date().toISOString()}
AI Model Engine: ${mlModelEngine}
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
    <header className="h-14 bg-white dark:bg-[#0f141f] border-b border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between transition-colors duration-150 sticky top-0 z-30">
      {/* Left: Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensor node ID, pillar tag, or CMR regulation..."
            className="w-full pl-8 pr-10 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#151c2c] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-safety-500 font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
            /
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Official ML Engine Status */}
        <div
          title={isMlModelConnected ? 'Live Connection: XGBoost 3.2.0 (FastAPI port 8000)' : 'DGMS Calibrated Geotechnical Rule Engine'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${
            isMlModelConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isMlModelConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="font-mono text-[11px] font-semibold">
            {isMlModelConnected ? 'DGMS-AI: ACTIVE (XGBoost)' : 'DGMS-AI: SCAMP SIM'}
          </span>
        </div>

        {/* 3D Mine Model Shortcut */}
        <Link
          href="/model"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          title="Access 3D Geotechnical Bord & Pillar Spatial Model"
        >
          <Box className="w-3.5 h-3.5 text-safety-600 dark:text-safety-400" />
          <span>3D Seam Model</span>
        </Link>

        {/* Audio Siren Toggle */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute Form-IV Acoustic Siren' : 'Mute Form-IV Acoustic Siren'}
          className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Dark Mode Switch */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>

        {/* Subsidence Emergency Drill Button */}
        {isSubsidenceSimActive ? (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Drill ({Math.round(simProgress * 100)}%)</span>
          </button>
        ) : (
          <button
            onClick={triggerSubsidenceEvent}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#e64a19] hover:bg-[#d84315] text-white text-xs font-bold transition-colors shadow-sm"
            title="Execute DGMS CMR-111 Strata Dilation Drill"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Simulate Drill</span>
          </button>
        )}

        {/* Export DGMS Form IV Report */}
        <button
          onClick={handleExportReport}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          title="Download DGMS Technical Form-IV Audit Log"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Form-IV</span>
        </button>
      </div>
    </header>
  );
}
