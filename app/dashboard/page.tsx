'use client';

import React from 'react';
import { useSensorSimulator } from '../../lib/sensorSimulator';
import { useDashboardStore } from '../../lib/store';
import { COALFIELD_ZONES } from '../../lib/constants';
import { AlertBanner } from '../../components/AlertBanner';
import { TelemetryMetricsRow } from '../../components/TelemetryMetricsRow';
import { RiskGaugeCard } from '../../components/RiskGaugeCard';
import { TelemetryChart } from '../../components/TelemetryChart';
import { PillarGrid } from '../../components/PillarGrid';
import { AlertsList } from '../../components/AlertsList';
import { SensorNodesList } from '../../components/SensorNodesList';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function DashboardPage() {
  // Initialize in-browser realistic sensor simulation
  useSensorSimulator();

  const { selectedCoalfield } = useDashboardStore();
  const currentZone = COALFIELD_ZONES.find((z) => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  return (
    <div className="space-y-6">
      {/* Active Emergency Alert Banner */}
      <AlertBanner />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              DGMS Central Strata Control Console
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              CMR-111 SCAMP TELEMETRY ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time subsurface telemetry, continuous convergence monitoring, and subsidence prediction for {currentZone.name} ({currentZone.state})
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DGMS S&T/CMR-111</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#e64a19]" />
            <span>XGBoost 3.2 (39 Features)</span>
          </div>
        </div>
      </div>

      {/* Row 1: Key Metrics and Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <TelemetryMetricsRow />
        </div>
        <div className="lg:col-span-1">
          <RiskGaugeCard />
        </div>
      </div>

      {/* Row 2: Analytics Chart & Room-and-Pillar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TelemetryChart />
        </div>
        <div className="lg:col-span-1">
          <PillarGrid />
        </div>
      </div>

      {/* Row 3: Emergency Alerts & Sensor Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertsList />
        <SensorNodesList />
      </div>
    </div>
  );
}
