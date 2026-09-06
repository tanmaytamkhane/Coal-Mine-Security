'use client';

import React from 'react';
import { useSensorSimulator } from '../lib/sensorSimulator';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';
import { AlertBanner } from '../components/AlertBanner';
import { TelemetryMetricsRow } from '../components/TelemetryMetricsRow';
import { RiskGaugeCard } from '../components/RiskGaugeCard';
import { TelemetryChart } from '../components/TelemetryChart';
import { PillarGrid } from '../components/PillarGrid';
import { AlertsList } from '../components/AlertsList';
import { SensorNodesList } from '../components/SensorNodesList';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Mine Safety Dashboard
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 border border-safety-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-safety-500 animate-pulse" />
              Live simulated feed • Demo mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Real-time IoT strata telemetry & hybrid physics-ML subsidence prediction for {currentZone.name}
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DGMS S&T/CMR-111</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-safety-500" />
            <span>Physics-ML Hybrid</span>
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
