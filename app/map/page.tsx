'use client';

import React from 'react';
import { CoalfieldMap } from '../../components/CoalfieldMap';
import { PillarGrid } from '../../components/PillarGrid';
import { Layers } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Coalfield Georeferenced & Underground Map
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400">
            Surface + Gallery
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          OpenStreetMap & Sentinel-1 InSAR surface subsidence overlay correlated with subterranean room-and-pillar galleries.
        </p>
      </div>

      {/* Surface Map */}
      <CoalfieldMap />

      {/* Underground Room & Pillar Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-safety-500" />
            <span>Sub-surface Room-and-Pillar Gallery (Seam XII)</span>
          </h2>
          <p className="text-xs text-gray-500">
            Underground spatial layout of coal pillars, goaf boundary barriers, and sensor telemetry locations.
          </p>
        </div>
        <div className="max-w-2xl">
          <PillarGrid />
        </div>
      </div>
    </div>
  );
}
