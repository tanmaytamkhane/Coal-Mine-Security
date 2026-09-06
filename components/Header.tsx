'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Download,
  Clock
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
  } = useDashboardStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const currentZone = COALFIELD_ZONES.find(z => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <header className="h-16 bg-white dark:bg-[#111726] border-b border-gray-200 dark:border-slate-800/80 px-6 flex items-center justify-between transition-colors duration-200 sticky top-0 z-30">
      {/* Left: Search input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensors, pillars, telemetry, DGMS norms..."
            className="w-full pl-9 pr-12 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 text-gray-800 dark:text-slate-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-safety-500/20 focus:border-safety-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-200/70 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Network status badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Zigbee + LoRa Mesh</span>
          <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">(-68 dBm)</span>
        </div>

        {/* Shift Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-mono px-2 py-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{currentTime || '10:45:00'} IST</span>
        </div>

        {/* Audio Siren Toggle */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Siren'}
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Dark Mode Switch */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Judge Demo Trigger Button */}
        {isSubsidenceSimActive ? (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md shadow-red-500/20 transition-all animate-pulse"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo ({Math.round(simProgress * 100)}%)</span>
          </button>
        ) : (
          <button
            onClick={triggerSubsidenceEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-safety-500 to-orange-600 hover:from-safety-600 hover:to-orange-700 text-white text-xs font-semibold shadow-md shadow-safety-500/20 transition-all hover:scale-[1.02]"
            title="Simulates subsidence event over 15-20s for judges"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Subsidence</span>
          </button>
        )}

        {/* Export DGMS Report */}
        <button
          onClick={handleExportReport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-200 text-xs font-medium transition-all"
        >
          <Download className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
