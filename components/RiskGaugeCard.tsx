'use client';

import React from 'react';
import { Satellite, Info } from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function RiskGaugeCard() {
  const { riskScore, riskStatus, selectedCoalfield } = useDashboardStore();
  const currentZone = COALFIELD_ZONES.find(z => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  const radius = 70;
  const circumference = Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, riskScore));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const isCaution = riskStatus === 'caution';
  const isCritical = riskStatus === 'critical';

  const statusColor = isCritical
    ? 'text-red-600 dark:text-red-400'
    : isCaution
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-safety-500 dark:text-safety-400';

  const strokeColor = isCritical
    ? '#ef4444'
    : isCaution
    ? '#f59e0b'
    : '#f95721';

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
            Subsidence Risk Index
          </span>
          <span title="Hybrid Physics-ML model fusing geotechnical parameters with sensor time-series" className="cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <Info className="w-3.5 h-3.5" />
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          isCritical
            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse'
            : isCaution
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
        }`}>
          {riskStatus}
        </span>
      </div>

      {/* Semi-circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
          {/* Background Arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-gray-100 dark:text-slate-800"
          />
          {/* Active Arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute top-12 flex flex-col items-center">
          <span className={`text-3xl font-extrabold tracking-tight ${statusColor}`}>
            {riskScore}
            <span className="text-sm font-medium text-gray-400 dark:text-slate-500">/100</span>
          </span>
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">
            {isCritical ? 'High Subsidence Danger' : isCaution ? 'Elevated Roof Dilation' : 'Strata Stable'}
          </span>
        </div>
      </div>

      {/* Footnotes & InSAR Satellite Context */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-safety-500" />
          <span>Sentinel-1 SBAS</span>
        </div>
        <span className="font-semibold text-gray-700 dark:text-slate-300">
          {currentZone.insarDeformationRateMmYr} mm/yr
        </span>
      </div>
    </div>
  );
}
