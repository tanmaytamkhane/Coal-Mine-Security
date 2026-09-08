'use client';

import React from 'react';
import { CoalfieldMap } from '../../components/CoalfieldMap';
import { PillarGrid } from '../../components/PillarGrid';
import { Layers } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Coalfield Georeferenced & InSAR Heatmap
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          OpenStreetMap GIS with multi-tier Sentinel-1 SBAS-InSAR subsidence risk heatmap. Primary surveillance focused on Jharia Colliery (Block IV), with live simulation drill targeting and cross-coalfield monitoring across Jharkhand and Chhattisgarh.
        </p>
      </div>

      {/* Surface Map */}
      <CoalfieldMap />

      {/* Underground Room & Pillar Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#e64a19]" />
            <span>Sub-surface Room-and-Pillar Gallery (Seam XII)</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Underground spatial layout of coal pillars, goaf boundary barriers, and real-time geotechnical telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <PillarGrid />
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-[#0b111b] rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <span className="font-bold text-sm text-gray-900 dark:text-white">Panel XII-A Geotechnical Specs</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                CMR-111 COMPLIANT
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Working Seam RL</span>
                <span className="font-bold text-gray-900 dark:text-white">-248.0 m Depth</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Rock Mass Rating (RMR)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">68 (Good Sandstone)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Pillar Dimensions</span>
                <span className="font-bold text-gray-900 dark:text-white">25.0m × 25.0m</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Gallery Span Width</span>
                <span className="font-bold text-gray-900 dark:text-white">4.2 m Roadway</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Average Factor of Safety</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">FoS 2.24 (Min 1.80)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-slate-800/60 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Roof Convergence Limit</span>
                <span className="font-bold text-amber-500">5.0 mm DGMS Ceil</span>
              </div>
              <div className="flex justify-between items-center py-1 font-mono">
                <span className="text-gray-500 dark:text-slate-400">Depillaring Stowing</span>
                <span className="font-bold text-gray-900 dark:text-white">Hydraulic Sand Fill</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 text-[11px] text-orange-800 dark:text-orange-300">
              Pillars marked in red exceed the Bieniawski empirical yield envelope during subsidence dilation drills.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
