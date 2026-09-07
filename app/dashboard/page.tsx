'use client';

import React, { useState } from 'react';
import { useSensorSimulator } from '../../lib/sensorSimulator';
import { useDashboardStore } from '../../lib/store';
import { COALFIELD_ZONES } from '../../lib/constants';
import { AlertBanner } from '../../components/AlertBanner';
import {
  SurfaceMetricCards,
  SurfaceGraphCard,
  SurfaceFleetTable,
} from '../../components/SurfaceTelemetrySection';
import {
  UndergroundMetricCards,
  UndergroundGraphCard,
  UndergroundFleetTable,
} from '../../components/UndergroundTelemetrySection';
import { RiskGaugeCard } from '../../components/RiskGaugeCard';
import { TelemetryChart } from '../../components/TelemetryChart';
import { PillarGrid } from '../../components/PillarGrid';
import { AlertsList } from '../../components/AlertsList';

export default function DashboardPage() {
  // Run background physical sensor simulation & telemetry feed
  useSensorSimulator();

  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'surface' | 'underground' | 'all'>('surface');
  const { selectedCoalfield } = useDashboardStore();
  const currentZone = COALFIELD_ZONES.find((z) => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  return (
    <div className="space-y-4 pb-12">
      {/* Active Emergency Alert Banner (Shown only when threshold is breached) */}
      <AlertBanner />

      {/* Top Header & Stratum Switch Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Strata Control Console
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            {currentZone.name} Colliery • Seam XII Panel • RL -248m / RL 0.0m
          </p>
        </div>

        {/* Stratum Switcher Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTelemetryTab('surface')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTelemetryTab === 'surface'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Above Surface</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              activeTelemetryTab === 'surface' ? 'bg-sky-700/80 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              3
            </span>
          </button>

          <button
            onClick={() => setActiveTelemetryTab('underground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTelemetryTab === 'underground'
                ? 'bg-[#e64a19] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Underground</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              activeTelemetryTab === 'underground' ? 'bg-orange-900/80 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              4
            </span>
          </button>

          <button
            onClick={() => setActiveTelemetryTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTelemetryTab === 'all'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Combined</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SENSOR READINGS DIRECTLY AT THE TOP (NO FILLER / NO TOPOLOGY BLOCK)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Active Sensor Metrics (3 Columns on Desktop) */}
        <div className="lg:col-span-3">
          {activeTelemetryTab === 'surface' && <SurfaceMetricCards />}
          {activeTelemetryTab === 'underground' && <UndergroundMetricCards />}
          {activeTelemetryTab === 'all' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Above the Surface (RL 0.0m)
                  </span>
                </div>
                <SurfaceMetricCards />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#e64a19]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Underground Strata (RL -248.0m)
                  </span>
                </div>
                <UndergroundMetricCards />
              </div>
            </div>
          )}
        </div>

        {/* AI Subsidence Risk Index Gauge (1 Column on Desktop) */}
        <div className="lg:col-span-1">
          <RiskGaugeCard />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED LIVE TELEMETRY GRAPHS & FLEET TABLES                          */}
      {/* ========================================================================= */}
      {activeTelemetryTab === 'surface' && (
        <div className="space-y-4">
          <SurfaceGraphCard />
          <SurfaceFleetTable />
        </div>
      )}

      {activeTelemetryTab === 'underground' && (
        <div className="space-y-4">
          <UndergroundGraphCard />
          <UndergroundFleetTable />
        </div>
      )}

      {activeTelemetryTab === 'all' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TelemetryChart />
            </div>
            <div className="lg:col-span-1">
              <PillarGrid />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SurfaceFleetTable />
            <UndergroundFleetTable />
          </div>
          <AlertsList />
        </div>
      )}
    </div>
  );
}
