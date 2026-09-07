'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AlertBanner } from '../../components/AlertBanner';
import { useSensorSimulator } from '../../lib/sensorSimulator';
import { Box, Layers, ShieldCheck, Cpu, Flame, Info } from 'lucide-react';

const Mine3DScene = dynamic(
  () => import('../../components/Mine3DScene').then(mod => mod.Mine3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[620px] w-full rounded-3xl bg-white dark:bg-[#111726] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-xs text-gray-400">
        Loading 3D Coal Mine WebGL Environment...
      </div>
    )
  }
);

export default function ModelPage() {
  useSensorSimulator();

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      <AlertBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Box className="w-7 h-7 text-safety-500" />
              <span>3D Mine & Pillar Strength Visualizer</span>
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 border border-safety-500/20">
              Interactive WebGL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Real-time subterranean strata cross-section, room-and-pillar stress heatmaps, and dynamic subsidence depression modeling.
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-safety-500" />
            <span>Seam XII (248m Depth)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DGMS Pillar Factor of Safety</span>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Mine3DScene />

      {/* Technical Engineering Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-safety-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              32 IoT Telemetry Nodes (Dual-Fleet)
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
            16 Surface subsidence nodes and 16 Underground pillar-center nodes dynamically glow based on live telemetry: <strong>Green</strong> = Nominal, <strong>Red</strong> = Anomaly / Yield. Coal pillars maintain their authentic black rock strata.
          </p>
        </div>

        <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Real-Time Subsidence Sag Trough
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
            During the judge simulation drill, the overhead roof mesh dynamically deforms around yielding pillars P-06, P-10, and P-11, triggering warning red pulsing on overlying surface subsidence nodes.
          </p>
        </div>

        <div className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Interactive Drill & Navigation Controls
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
            Click &quot;Simulate Drill&quot; in the top bar to trigger a live emergency drill. Drag left mouse to orbit 360°, right mouse to pan, and click any 3D pillar or node to inspect live geotechnical telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
