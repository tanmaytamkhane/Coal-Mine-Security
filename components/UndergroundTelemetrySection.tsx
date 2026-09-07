'use client';

import React, { useState } from 'react';
import {
  Activity,
  Compass,
  Flame,
  TrendingUp,
  Zap,
  LineChart as ChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useDashboardStore } from '../lib/store';
import { UNDERGROUND_THRESHOLDS } from '../lib/constants';

export function UndergroundTelemetrySection() {
  const [ugChartMode, setUgChartMode] = useState<'strain' | 'tilt_vib' | 'methane'>('strain');
  const { telemetryHistory, sensors } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    undergroundStrainMicrostrain: 142.5,
    undergroundHx711Counts: 2992500,
    undergroundTiltDeg: 0.36,
    undergroundVibrationMms: 0.22,
    methanePctLel: 0.22,
    convergenceMm: 3.2,
  };

  const strain = latestPoint.undergroundStrainMicrostrain ?? 142.5;
  const hxCounts = latestPoint.undergroundHx711Counts ?? Math.round(strain * 21.0 * 1000);
  const ugTilt = latestPoint.undergroundTiltDeg ?? 0.36;
  const ugVib = latestPoint.undergroundVibrationMms ?? 0.22;
  const methane = latestPoint.methanePctLel ?? 0.22;

  // Derived coal pillar stress (E = 4.2 GPa = 4200 MPa)
  const stressMpa = (strain * 1e-6 * 4200).toFixed(1);

  // Threshold Checks
  const isStrainCrit = strain >= UNDERGROUND_THRESHOLDS.bf350Strain.critical;
  const isStrainWarn = strain >= UNDERGROUND_THRESHOLDS.bf350Strain.warning;

  const isTiltCrit = ugTilt >= UNDERGROUND_THRESHOLDS.undergroundTilt.critical;
  const isTiltWarn = ugTilt >= UNDERGROUND_THRESHOLDS.undergroundTilt.warning;

  const isVibCrit = ugVib >= UNDERGROUND_THRESHOLDS.undergroundVibration.critical;
  const isVibWarn = ugVib >= UNDERGROUND_THRESHOLDS.undergroundVibration.warning;

  const isGasCrit = methane >= UNDERGROUND_THRESHOLDS.mq4Methane.critical;
  const isGasWarn = methane >= UNDERGROUND_THRESHOLDS.mq4Methane.warning;

  // Filter underground nodes
  const undergroundNodes = sensors.filter(
    (s) => s.domain === 'underground' || !s.domain || s.id.includes('UG-') || s.type === 'bf350_strain' || s.type === 'mq4_gas'
  );

  return (
    <section className="space-y-4 pt-4 border-t-2 border-dashed border-slate-300 dark:border-slate-800">
      {/* Formal Government / SCADA Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-100/90 dark:bg-[#0c121e] border border-slate-300/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e64a19] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            UG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Underground Strata Telemetry
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                STATION UG-01 / UG-02 • SEAM XII (-248.0M RL)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pillar core microstrain, roof strata delamination, seismic shockwaves, and gallery atmospheric methane
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <Zap className="w-3.5 h-3.5 text-[#e64a19]" />
            <span>Ex-ia Intrinsically Safe Telemetry Mesh</span>
          </div>
        </div>
      </div>

      {/* Underground 4-Card Hardware Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: BF350 Strain Gauge + HX711 24-bit ADC Amplifier */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#e64a19]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  BF350 Pillar Microstrain
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isStrainCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                  : isStrainWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                {isStrainCrit ? 'YIELDING CRITICAL' : isStrainWarn ? 'LEVEL-1 ALERT' : 'NOMINAL'}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {strain.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">µε</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 block">
                  {stressMpa} MPa
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pillar Stress</span>
              </div>
            </div>

            {/* HX711 Raw 24-bit ADC Details */}
            <div className="mt-3 p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>HX711 24-bit ADC:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {hxCounts.toLocaleString()} cts
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] mt-0.5">
                <span>Calibration factor:</span>
                <span>21.0 counts / µε</span>
              </div>
            </div>

            {/* Yield Margin Bar */}
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>DGMS Cap: 350 µε</span>
                <span>Yield: 600 µε</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isStrainCrit ? 'bg-red-500' : isStrainWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                  }`}
                  style={{ width: `${Math.min(100, (strain / 600) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hardware & Sensor</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              BF350 + HX711 24-bit
            </span>
          </div>
        </div>

        {/* Card 2: MPU-6050 — Subterranean Roof Strata Tilt */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#e64a19]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  MPU-6050 Roof Tilt
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isTiltCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                  : isTiltWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                Max Safe: 1.50°
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {ugTilt.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">°</span>
              </div>

              {/* Radial Angle Dial */}
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center relative bg-slate-50 dark:bg-slate-900/50">
                <div
                  className={`w-4 h-0.5 transition-transform duration-300 origin-left ${
                    isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                  }`}
                  style={{ transform: `rotate(${ugTilt * 45}deg)` }}
                />
              </div>
            </div>

            <div className="mt-3 p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Roof Bed Delamination:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  +{(ugTilt - 0.30).toFixed(2)}° vs Seam
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] mt-0.5">
                <span>Protocol Limit:</span>
                <span>3.00° Failure Trigger</span>
              </div>
            </div>

            {/* Tilt bar */}
            <div className="mt-2.5">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                  }`}
                  style={{ width: `${Math.min(100, (ugTilt / 3.0) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hardware & Sensor</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              MPU-6050 (Pitch/Roll)
            </span>
          </div>
        </div>

        {/* Card 3: MPU-6050 — Strata Shock & Seismic Vibration (PPV) */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#e64a19]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  MPU-6050 Strata Vibration
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isVibCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                  : isVibWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                Blast Cap: 5.0 mm/s
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {ugVib.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">mm/s</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Peak Particle Velocity
              </span>
            </div>

            <div className="mt-3 p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Dynamic Acceleration:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {(ugVib / 10.0).toFixed(3)} g RMS
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] mt-0.5">
                <span>Spectral Band:</span>
                <span>10 Hz - 100 Hz</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-end gap-1.5 h-4">
              {[15, 30, 20, 40, Math.min(100, Math.round((ugVib / 12.0) * 100))].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${Math.max(20, h)}%` }}
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    idx === 4
                      ? isVibCrit
                        ? 'bg-red-500'
                        : isVibWarn
                        ? 'bg-amber-500'
                        : 'bg-[#e64a19]'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hardware & Sensor</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              MPU-6050 (Accel Dynamic)
            </span>
          </div>
        </div>

        {/* Card 4: MQ-4 Catalytic Methane Gas (CH4) Sensor */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  MQ-4 Methane Gas (CH₄)
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isGasCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                  : isGasWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                CMR-111 Cap: 1.25%
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {methane.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">% LEL</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 block">
                  ~{Math.round(methane * 500)} ppm
                </span>
                <span className="text-[10px] font-mono text-slate-400">Proxy Equivalent</span>
              </div>
            </div>

            <div className="mt-3 p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>CMR Reg 169 Trip:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  1.25% LEL Electric Trip
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] mt-0.5">
                <span>Atmospheric Status:</span>
                <span className={isGasCrit ? 'text-red-500 font-bold' : isGasWarn ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                  {isGasCrit ? 'EXPLOSIVE HAZARD' : isGasWarn ? 'ELEVATED' : 'SAFE'}
                </span>
              </div>
            </div>

            <div className="mt-2.5">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isGasCrit ? 'bg-red-500' : isGasWarn ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (methane / 1.25) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hardware & Sensor</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              MQ-4 Catalytic Semiconductor
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Underground Strata Real-Time Graph */}
      <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[#e64a19]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Subterranean Seam XII Strata Telemetry Graph
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Live 1.5s Stream
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous pillar microstrain, roof strata tilt, vibration, and atmospheric methane monitoring
            </p>
          </div>

          {/* Graph Toggle Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setUgChartMode('strain')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                ugChartMode === 'strain'
                  ? 'bg-[#e64a19] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              BF350 Strain & HX711 (µε)
            </button>
            <button
              onClick={() => setUgChartMode('tilt_vib')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                ugChartMode === 'tilt_vib'
                  ? 'bg-[#e64a19] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MPU-6050: Roof Tilt & Vib (°)
            </button>
            <button
              onClick={() => setUgChartMode('methane')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                ugChartMode === 'methane'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MQ-4 Methane (% LEL)
            </button>
          </div>
        </div>

        {/* Chart Legend Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-4">
            {ugChartMode === 'strain' ? (
              <div className="flex items-center gap-1.5 text-[#e64a19]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e64a19] inline-block" />
                <span>Pillar Strain (BF350): {strain.toFixed(1)} µε | Stress: {stressMpa} MPa</span>
              </div>
            ) : ugChartMode === 'tilt_vib' ? (
              <>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>Roof Delamination: {ugTilt.toFixed(2)}°</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span>Seismic PPV: {ugVib.toFixed(2)} mm/s</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Methane Gas (MQ-4): {methane.toFixed(2)}% LEL (~{Math.round(methane * 500)} ppm)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {ugChartMode === 'strain' ? (
              <>
                <span className="text-amber-500">Level-1 Trigger: 350 µε</span>
                <span className="text-red-500">Yield Cap: 600 µε</span>
              </>
            ) : ugChartMode === 'tilt_vib' ? (
              <>
                <span className="text-amber-500">Safe Tilt: 1.50°</span>
                <span className="text-red-500">Failure Trigger: 3.00°</span>
                <span className="text-red-400">Blast Cap: 5.0 mm/s</span>
              </>
            ) : (
              <>
                <span className="text-amber-500">Warning: 0.80% LEL</span>
                <span className="text-red-500">Reg 169 Trip: 1.25% LEL</span>
              </>
            )}
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-[240px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="ugStrainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e64a19" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e64a19" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ugTiltGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ugVibGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ugMethaneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey="timeLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                        <p className="text-slate-400 text-[10px] mb-1">{d.timeLabel}</p>
                        {ugChartMode === 'strain' ? (
                          <div className="text-[#e64a19] font-bold">
                            BF350 Strain: {d.undergroundStrainMicrostrain?.toFixed(1) ?? '0.0'} µε
                          </div>
                        ) : ugChartMode === 'tilt_vib' ? (
                          <>
                            <div className="text-amber-500 font-bold">
                              Roof Tilt: {d.undergroundTiltDeg?.toFixed(2) ?? '0.00'}°
                            </div>
                            <div className="text-red-500 font-bold">
                              Seismic PPV: {d.undergroundVibrationMms?.toFixed(2) ?? '0.00'} mm/s
                            </div>
                          </>
                        ) : (
                          <div className="text-emerald-500 font-bold">
                            Methane: {d.methanePctLel?.toFixed(2) ?? '0.00'}% LEL (~{Math.round((d.methanePctLel ?? 0) * 500)} ppm)
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {ugChartMode === 'strain' ? (
                <>
                  <ReferenceLine y={350.0} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={600.0} stroke="#ef4444" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="undergroundStrainMicrostrain"
                    stroke="#e64a19"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ugStrainGrad)"
                    isAnimationActive={false}
                  />
                </>
              ) : ugChartMode === 'tilt_vib' ? (
                <>
                  <ReferenceLine y={1.50} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={3.00} stroke="#ef4444" strokeDasharray="4 4" />
                  <ReferenceLine y={5.00} stroke="#dc2626" strokeDasharray="2 2" />
                  <Area
                    type="monotone"
                    dataKey="undergroundTiltDeg"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ugTiltGrad)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="undergroundVibrationMms"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#ugVibGrad)"
                    isAnimationActive={false}
                  />
                </>
              ) : (
                <>
                  <ReferenceLine y={0.80} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={1.25} stroke="#ef4444" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="methanePctLel"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ugMethaneGrad)"
                    isAnimationActive={false}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Underground Fleet Status Table */}
      <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Underground Seam XII Telemetry Live Fleet
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {undergroundNodes.length} Subterranean Nodes
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Certified Ex-ia • LoRa Base Station LOR-JH-01
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 pb-2">
                <th className="py-2">Node ID & Target</th>
                <th className="py-2">Hardware Device</th>
                <th className="py-2">Location & RL Depth</th>
                <th className="py-2">Raw Channel & Signal</th>
                <th className="py-2 text-right">Physical Reading</th>
                <th className="py-2 text-right">DGMS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {undergroundNodes.map((sensor) => {
                const isCrit = sensor.status === 'critical';
                const isWarn = sensor.status === 'warning';
                return (
                  <tr key={sensor.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {sensor.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{sensor.id}</span>
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">
                      {sensor.hardwareModel || 'BF350 / MPU-6050 / MQ-4'}
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">
                      <span>{sensor.location}</span>
                      <span className="block text-[10px] text-slate-400">RL -{sensor.depthMeters}m</span>
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">
                      {sensor.rawSignal || 'Intrinsically Safe Ex-ia'}
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                      {sensor.currentValue.toFixed(2)} {sensor.unit}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCrit
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                          : isWarn
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {sensor.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
