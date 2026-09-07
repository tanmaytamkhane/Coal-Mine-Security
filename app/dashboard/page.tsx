'use client';

import React from 'react';
import { useSensorSimulator } from '../../lib/sensorSimulator';
import { useDashboardStore } from '../../lib/store';
import { COALFIELD_ZONES } from '../../lib/constants';
import { AlertBanner } from '../../components/AlertBanner';
import { SurfaceTelemetrySection } from '../../components/SurfaceTelemetrySection';
import { UndergroundTelemetrySection } from '../../components/UndergroundTelemetrySection';
import { RiskGaugeCard } from '../../components/RiskGaugeCard';
import { TelemetryChart } from '../../components/TelemetryChart';
import { PillarGrid } from '../../components/PillarGrid';
import { AlertsList } from '../../components/AlertsList';
import { ShieldCheck, Cpu, ArrowDown, Layers, Radio } from 'lucide-react';

export default function DashboardPage() {
  // Initialize in-browser realistic sensor simulation
  useSensorSimulator();

  const { selectedCoalfield } = useDashboardStore();
  const currentZone = COALFIELD_ZONES.find((z) => z.id === selectedCoalfield) || COALFIELD_ZONES[0];

  return (
    <div className="space-y-7 pb-12">
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
            Real-time multi-level telemetry: Above-the-Surface Ground Monitoring + Underground Seam XII Gallery Strata for {currentZone.name} ({currentZone.state})
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DGMS S&T / CMR-111</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#e64a19]" />
            <span>XGBoost 3.2 (39 Features)</span>
          </div>
        </div>
      </div>

      {/* Top SCADA Level & Master Risk Rollup */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 cols: Multi-Tier Stratum Overview Card */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111726] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e64a19]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Two-Tier Strata Control & Telemetry Topology
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Colliery Panel: Seam XII (RL -248.0m) vs Surface (RL 0.0m)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {/* Tier 1: Above the Surface */}
              <div className="p-3.5 rounded-lg bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    Tier 1: Above the Surface (Pithead / Ground)
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                    RL 0.0m
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Sensors:</strong> Linear Potentiometers (0-50mm Subsidence & Tension Cracks) + MPU-6050 (Surface Slope Inclinometer & Ambient PPV Vibration).
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-sky-700 dark:text-sky-300">
                  <a href="#surface-section" className="flex items-center gap-1 hover:underline font-semibold">
                    <ArrowDown className="w-3 h-3" /> View Surface Readings Below
                  </a>
                </div>
              </div>

              {/* Tier 2: Underground Strata */}
              <div className="p-3.5 rounded-lg bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#e64a19]" />
                    Tier 2: Underground Strata (Extraction Gallery)
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300">
                    RL -248.0m
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Sensors:</strong> BF350 Strain Gauge (HX711 24-bit ADC Amplifier) + MPU-6050 (Roof Delamination Tilt & PPV) + MQ-4 Catalytic Methane Gas (CH₄).
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-orange-700 dark:text-orange-300">
                  <a href="#underground-section" className="flex items-center gap-1 hover:underline font-semibold">
                    <ArrowDown className="w-3 h-3" /> Scroll to Underground Telemetry
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              100% Ex-ia Intrinsically Safe Telemetry Mesh active
            </span>
            <span className="font-mono">
              DGMS Technical Circular 04 Compliant
            </span>
          </div>
        </div>

        {/* Right 1 col: Master AI Risk Gauge Card */}
        <div className="lg:col-span-1">
          <RiskGaugeCard />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ABOVE THE SURFACE SENSORS SECTION (SHOWN FIRST ON DASHBOARD)           */}
      {/* ========================================================================= */}
      <div id="surface-section">
        <SurfaceTelemetrySection />
      </div>

      {/* ========================================================================= */}
      {/* 2. UNDERGROUND SENSORS SECTION (SHOWN WHEN USER SCROLLS DOWN)              */}
      {/* ========================================================================= */}
      <div id="underground-section">
        <UndergroundTelemetrySection />
      </div>

      {/* ========================================================================= */}
      {/* 3. MULTI-CHANNEL TELEMETRY CHART & ROOM-AND-PILLAR GRID                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4 border-t-2 border-dashed border-slate-300 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Strata Dynamic Correlations & Pillar Stability Grid
          </h2>
          <span className="text-xs font-mono text-slate-500">
            CMR-2017 Regulation 111 (SCAMP Analysis)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TelemetryChart />
          </div>
          <div className="lg:col-span-1">
            <PillarGrid />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DGMS FORM-IV STATUTORY ALERTS & DISPATCH CHECKLIST                     */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t-2 border-dashed border-slate-300 dark:border-slate-800">
        <AlertsList />
      </div>
    </div>
  );
}
