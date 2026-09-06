'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Box } from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { Pillar } from '../types';

export function PillarGrid() {
  const { pillars, selectedPillarId, selectPillar } = useDashboardStore();
  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[5];

  const getStatusBadge = (pillar: Pillar) => {
    if (pillar.status === 'critical' || pillar.factorOfSafety < 1.3) {
      return {
        cellBg: 'bg-red-500/20 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800',
      };
    }
    if (pillar.status === 'stressed' || pillar.factorOfSafety < 1.9) {
      return {
        cellBg: 'bg-amber-500/15 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      };
    }
    return {
      cellBg: 'bg-safety-50 dark:bg-safety-950/30 text-gray-800 dark:text-slate-200 border-gray-200/80 dark:border-slate-800',
    };
  };

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-safety-500" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Room-and-Pillar Grid
          </h3>
        </div>
        <Link
          href="/model"
          className="text-xs font-bold text-safety-500 hover:text-safety-600 flex items-center gap-1 transition-colors"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View →</span>
        </Link>
      </div>

      <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
        Interactive underground pillar strength matrix. Click any pillar to inspect geotechnical stress and safety factor (FoS).
      </p>

      {/* 4x4 Underground Pillar Matrix */}
      <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl bg-gray-50/70 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80">
        {pillars.map((pillar) => {
          const isSelected = pillar.id === selectedPillar.id;
          const styling = getStatusBadge(pillar);

          return (
            <button
              key={pillar.id}
              onClick={() => selectPillar(pillar.id)}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative ${
                styling.cellBg
              } ${
                isSelected
                  ? 'ring-2 ring-safety-500 shadow-md scale-[1.03]'
                  : 'hover:border-safety-400 hover:shadow-sm'
              }`}
            >
              <span className="text-xs font-black tracking-tight">{pillar.id}</span>
              <span className="text-[10px] font-mono mt-0.5 font-bold">
                FoS {pillar.factorOfSafety.toFixed(2)}
              </span>
              <span className="text-[9px] text-gray-500 dark:text-slate-400">
                {pillar.stressMpa.toFixed(1)} MPa
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Inspection Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/90 text-xs">
        <div className="flex items-center justify-between font-semibold text-gray-800 dark:text-slate-200 mb-2">
          <span>{selectedPillar.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            selectedPillar.status === 'critical'
              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              : selectedPillar.status === 'stressed'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          }`}>
            {selectedPillar.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60">
            <span className="text-[10px] text-gray-400 block">Factor of Safety</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              {selectedPillar.factorOfSafety.toFixed(2)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60">
            <span className="text-[10px] text-gray-400 block">Stress Load</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              {selectedPillar.stressMpa.toFixed(1)} <span className="text-[10px] font-normal">MPa</span>
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60">
            <span className="text-[10px] text-gray-400 block">Displacement</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              {selectedPillar.displacementMm.toFixed(1)} <span className="text-[10px] font-normal">mm</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
