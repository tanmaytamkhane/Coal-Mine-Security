'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { useDashboardStore } from '../lib/store';

export function AlertBanner() {
  const {
    riskStatus,
    isAudioMuted,
    toggleAudioMute,
    isSubsidenceSimActive,
    resetSimulation
  } = useDashboardStore();

  if (riskStatus === 'normal' && !isSubsidenceSimActive) return null;

  const isCritical = riskStatus === 'critical';

  return (
    <div className={`w-full rounded-2xl p-4 mb-5 border transition-all duration-300 shadow-lg ${
      isCritical
        ? 'bg-red-500/10 dark:bg-red-950/40 border-red-400 dark:border-red-600 text-red-900 dark:text-red-200'
        : 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white shrink-0 ${
            isCritical ? 'bg-red-600 animate-bounce' : 'bg-amber-500 animate-pulse'
          }`}>
            {isCritical ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                {isCritical
                  ? 'CRITICAL SUBSIDENCE ALERT — IMMEDIATE MINE EVACUATION ORDERED'
                  : 'WARNING: ACCELERATING ROOF STRATA DILATION DETECTED'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/60 dark:bg-black/30 border font-bold">
                {isCritical ? 'DGMS CODE IV' : 'DGMS ALERT 111'}
              </span>
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {isCritical
                ? 'Pillar stress load exceeded yield envelope. Automated acoustic siren active across Seam XII galleries. Initiate evacuation protocol.'
                : 'Pillar P-06 microstrain has exceeded 350 µε baseline threshold. Dispatching geotechnical inspection crew.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={toggleAudioMute}
            className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white border text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isAudioMuted ? 'Muted' : 'Siren'}</span>
          </button>
          {isSubsidenceSimActive && (
            <button
              onClick={resetSimulation}
              className="px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 text-xs font-bold transition-all"
            >
              Acknowledge & Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
