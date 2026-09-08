'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AlertBanner } from '../../components/AlertBanner';
import { useSensorSimulator } from '../../lib/sensorSimulator';
import { Box } from 'lucide-react';

const Mine3DScene = dynamic(
  () => import('../../components/Mine3DScene').then(mod => mod.Mine3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[640px] lg:h-[700px] xl:h-[760px] w-full rounded-3xl bg-white dark:bg-[#0b111b] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-xs text-gray-400">
        Loading 3D Coal Mine WebGL Environment...
      </div>
    )
  }
);

export default function ModelPage() {
  useSensorSimulator();

  return (
    <div className="space-y-4">
      {/* Emergency Alert Banner */}
      <AlertBanner />

      {/* Minimalist Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Box className="w-6 h-6 text-[#e64a19]" />
            <span>3D Strata & Pillar Visualizer</span>
          </h1>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            INTERACTIVE WEBGL
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Real-time subterranean strata cross-section, room-and-pillar stress heatmaps, and dynamic subsidence depression modeling.
        </p>
      </div>

      {/* 3D Scene */}
      <Mine3DScene />
    </div>
  );
}
