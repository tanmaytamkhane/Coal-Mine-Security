'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';
import { MapPin, Satellite } from 'lucide-react';

const LeafletMap = dynamic(
  () => import('./LeafletMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full rounded-2xl bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-xs text-gray-400">
        Loading Coalfield Satellite Map...
      </div>
    )
  }
);

export function CoalfieldMap() {
  const { selectedCoalfield, setSelectedCoalfield } = useDashboardStore();
  const currentZone = COALFIELD_ZONES.find(z => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  return (
    <div className="space-y-4">
      {/* Coalfield Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111726] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-safety-500" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Coalfield Georeferenced Location
            </h3>
            <p className="text-[11px] text-gray-500">
              {currentZone.name} • {currentZone.basin} ({currentZone.state})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {COALFIELD_ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedCoalfield(z.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCoalfield === z.id
                  ? 'bg-safety-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
              }`}
            >
              {z.name.split('—')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-soft relative">
        <LeafletMap selectedZone={currentZone} />
      </div>

      {/* Satellite InSAR Data Banner */}
      <div className="bg-white dark:bg-[#111726] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Satellite className="w-4 h-4 text-safety-500" />
          <span className="text-gray-600 dark:text-slate-300">
            <strong>Sentinel-1 SBAS-InSAR Surface Velocity:</strong> {currentZone.insarDeformationRateMmYr} mm/yr average subsidence rate
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Coords: {currentZone.lat.toFixed(4)}°N, {currentZone.lng.toFixed(4)}°E
        </span>
      </div>
    </div>
  );
}
