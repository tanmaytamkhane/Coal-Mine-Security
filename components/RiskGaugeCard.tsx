'use client';

import React, { useState } from 'react';
import { Satellite, Info, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';

export function RiskGaugeCard() {
  const {
    riskScore,
    riskStatus,
    selectedCoalfield,
    isMlModelConnected,
    mlModelEngine,
    mlFeatureContributions
  } = useDashboardStore();

  const [showExplainability, setShowExplainability] = useState(false);
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
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
              Subsidence Risk Index
            </span>
            <span
              title="Trained XGBoost model with 39 geotechnical features fused with empirical rock mass ratings"
              className="cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
            >
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
        <div className="relative flex flex-col items-center justify-center my-2">
          <svg width="180" height="95" viewBox="0 0 180 95" className="overflow-visible">
            {/* Background Arc */}
            <path
              d="M 20 85 A 70 70 0 0 1 160 85"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className="text-gray-100 dark:text-slate-800"
            />
            {/* Active Arc */}
            <path
              d="M 20 85 A 70 70 0 0 1 160 85"
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
          <div className="absolute top-10 flex flex-col items-center">
            <span className={`text-3xl font-extrabold tracking-tight ${statusColor}`}>
              {riskScore}
              <span className="text-sm font-medium text-gray-400 dark:text-slate-500">/100</span>
            </span>
            <span className="text-[10.5px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">
              {isCritical ? 'Subsidence Imminent' : isCaution ? 'Elevated Dilation' : 'Strata Stable'}
            </span>
          </div>
        </div>

        {/* Live ML Engine Badge */}
        <div className="my-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/80 text-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-safety-500" />
              <span className="font-bold text-gray-800 dark:text-slate-200 truncate flex items-center gap-1">
                {isMlModelConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                {mlModelEngine}
              </span>
            </div>
            <button
              onClick={() => setShowExplainability(!showExplainability)}
              className="text-safety-500 hover:text-safety-600 font-bold flex items-center gap-0.5 text-[10px]"
            >
              <span>{showExplainability ? 'Hide AI' : 'Explain'}</span>
              {showExplainability ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Feature Contribution Breakdown (SHAP-style) */}
          {showExplainability && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[9.5px] font-semibold text-gray-400 block uppercase">
                Top XGBoost Feature Weights
              </span>
              {Object.entries(mlFeatureContributions).slice(0, 4).map(([feat, pct]) => (
                <div key={feat} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-600 dark:text-slate-400">{feat}</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{pct}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Satellite InSAR Sentinel-1 Footnote */}
      <div className="pt-2.5 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-safety-500" />
          <span>Sentinel-1 InSAR</span>
        </div>
        <span className="font-semibold text-gray-700 dark:text-slate-300">
          {currentZone.insarDeformationRateMmYr} mm/yr
        </span>
      </div>
    </div>
  );
}
