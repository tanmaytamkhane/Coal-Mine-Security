'use client';

import React, { useState } from 'react';
import {
  Activity,
  Compass,
  Flame,
  TrendingUp,
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

/**
 * High-density minimal metric cards for Underground Strata (BF350+HX711, MPU-6050, MQ-4)
 */
export function UndergroundMetricCards() {
  const { telemetryHistory } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    undergroundStrainMicrostrain: 142.5,
    undergroundHx711Counts: 2992500,
    undergroundTiltDeg: 0.36,
    undergroundVibrationMms: 0.22,
    methanePctLel: 0.22,
  };

  const strain = latestPoint.undergroundStrainMicrostrain ?? 142.5;
  const ugTilt = latestPoint.undergroundTiltDeg ?? 0.36;
  const ugVib = latestPoint.undergroundVibrationMms ?? 0.22;
  const methane = latestPoint.methanePctLel ?? 0.22;

  // Derived coal pillar stress (E = 4.2 GPa)
  const stressMpa = (strain * 1e-6 * 4200).toFixed(1);

  const isStrainCrit = strain >= UNDERGROUND_THRESHOLDS.bf350Strain.critical;
  const isStrainWarn = strain >= UNDERGROUND_THRESHOLDS.bf350Strain.warning;

  const isTiltCrit = ugTilt >= UNDERGROUND_THRESHOLDS.undergroundTilt.critical;
  const isTiltWarn = ugTilt >= UNDERGROUND_THRESHOLDS.undergroundTilt.warning;

  const isVibCrit = ugVib >= UNDERGROUND_THRESHOLDS.undergroundVibration.critical;
  const isVibWarn = ugVib >= UNDERGROUND_THRESHOLDS.undergroundVibration.warning;

  const isGasCrit = methane >= UNDERGROUND_THRESHOLDS.mq4Methane.critical;
  const isGasWarn = methane >= UNDERGROUND_THRESHOLDS.mq4Methane.warning;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
      {/* 1. BF350 Strain Gauge + HX711 24-bit ADC — Pillar Microstrain */}
      <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#e64a19]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pillar Microstrain
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isStrainCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 animate-pulse'
                : isStrainWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isStrainCrit ? 'CRITICAL' : isStrainWarn ? 'ALERT' : 'NOMINAL'}
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {strain.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">µε</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 block">
                {stressMpa} MPa
              </span>
              <span className="text-[10px] font-mono text-slate-400">Stress</span>
            </div>
          </div>

          <div className="mt-2.5">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isStrainCrit ? 'bg-red-500' : isStrainWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, (strain / 500) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">BF350 + HX711</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">UG-01</span>
        </div>
      </div>

      {/* 2. MPU-6050 — Roof Strata Tilt */}
      <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Roof Strata Tilt
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isTiltCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                : isTiltWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isTiltCrit ? 'CRITICAL' : isTiltWarn ? 'ALERT' : 'STABLE'}
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {ugTilt.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">°</span>
            </div>

            {/* Inclinometer Angle Indicator */}
            <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 relative">
              <div
                className={`w-3 h-0.5 transition-transform duration-300 origin-left ${
                  isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                }`}
                style={{ transform: `rotate(${ugTilt * 40}deg)` }}
              />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-[#e64a19]'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, (ugTilt / 2.5) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">MPU-6050 IMU</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">UG-01 Roof</span>
        </div>
      </div>

      {/* 3. MPU-6050 — Strata Shock & Vibration (PPV) */}
      <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Strata Vibration
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isVibCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                : isVibWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isVibCrit ? 'CRITICAL' : isVibWarn ? 'HIGH' : 'NORMAL'}
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {ugVib.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">mm/s</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Blast: 5.0</span>
          </div>

          {/* Dynamic 5-bar live equalizer */}
          <div className="mt-2.5 flex items-end gap-1.5 h-4">
            {[20, 35, 25, 55, Math.min(100, Math.max(15, Math.round((ugVib / 5.0) * 100)))].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-xs transition-all duration-300 ${
                  idx === 4
                    ? isVibCrit
                      ? 'bg-red-500'
                      : isVibWarn
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">MPU-6050 PPV</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">UG-02</span>
        </div>
      </div>

      {/* 4. MQ-4 Catalytic Methane Gas (CH4) */}
      <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Methane Gas (CH₄)
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isGasCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                : isGasWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isGasCrit ? 'EXPLOSIVE' : isGasWarn ? 'ELEVATED' : 'SAFE'}
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {methane.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">% LEL</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 block">
                ~{Math.round(methane * 500)} ppm
              </span>
              <span className="text-[10px] font-mono text-slate-400">Proxy</span>
            </div>
          </div>

          <div className="mt-2.5">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isGasCrit ? 'bg-red-500' : isGasWarn ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, (methane / 1.25) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">MQ-4 Gas</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">UG-02 Face</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated clean dynamic graph for Underground Telemetry
 */
export function UndergroundGraphCard() {
  const [ugChartMode, setUgChartMode] = useState<'strain' | 'tilt_vib' | 'methane'>('strain');
  const { telemetryHistory } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    undergroundStrainMicrostrain: 142.5,
    undergroundTiltDeg: 0.36,
    undergroundVibrationMms: 0.22,
    methanePctLel: 0.22,
  };

  const strain = latestPoint.undergroundStrainMicrostrain ?? 142.5;
  const ugTilt = latestPoint.undergroundTiltDeg ?? 0.36;
  const ugVib = latestPoint.undergroundVibrationMms ?? 0.22;
  const methane = latestPoint.methanePctLel ?? 0.22;

  return (
    <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-[#e64a19]" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Underground Telemetry Live Stream
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            1.5s
          </span>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setUgChartMode('strain')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              ugChartMode === 'strain'
                ? 'bg-[#e64a19] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            BF350 (µε)
          </button>
          <button
            onClick={() => setUgChartMode('tilt_vib')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              ugChartMode === 'tilt_vib'
                ? 'bg-[#e64a19] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            MPU-6050 (°)
          </button>
          <button
            onClick={() => setUgChartMode('methane')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              ugChartMode === 'methane'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            MQ-4 (% LEL)
          </button>
        </div>
      </div>

      {/* Legend values */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-4">
          {ugChartMode === 'strain' ? (
            <span className="text-[#e64a19] font-bold">
              Strain: {strain.toFixed(1)} µε • Stress: {(strain * 1e-6 * 4200).toFixed(1)} MPa
            </span>
          ) : ugChartMode === 'tilt_vib' ? (
            <>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Tilt: {ugTilt.toFixed(2)}°
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                Vibration: {ugVib.toFixed(2)} mm/s
              </span>
            </>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Methane: {methane.toFixed(2)}% LEL (~{Math.round(methane * 500)} ppm)
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          {ugChartMode === 'strain' ? 'Cap: 350 µε' : ugChartMode === 'tilt_vib' ? 'Cap: 1.50° • 5.0 mm/s' : 'Trip: 1.25% LEL'}
        </div>
      </div>

      {/* Graph Area */}
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryHistory} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
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
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                      <p className="text-slate-400 text-[10px] mb-1">{d.timeLabel}</p>
                      {ugChartMode === 'strain' ? (
                        <div className="text-[#e64a19] font-bold">
                          Strain: {d.undergroundStrainMicrostrain?.toFixed(1) ?? '0.0'} µε
                        </div>
                      ) : ugChartMode === 'tilt_vib' ? (
                        <>
                          <div className="text-amber-500 font-bold">
                            Roof Tilt: {d.undergroundTiltDeg?.toFixed(2) ?? '0.00'}°
                          </div>
                          <div className="text-red-500 font-bold">
                            Vibration: {d.undergroundVibrationMms?.toFixed(2) ?? '0.00'} mm/s
                          </div>
                        </>
                      ) : (
                        <div className="text-emerald-500 font-bold">
                          Methane: {d.methanePctLel?.toFixed(2) ?? '0.00'}% LEL
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
                <ReferenceLine y={500.0} stroke="#ef4444" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="undergroundStrainMicrostrain"
                  stroke="#e64a19"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ugStrainGrad)"
                  isAnimationActive={false}
                />
              </>
            ) : ugChartMode === 'tilt_vib' ? (
              <>
                <ReferenceLine y={1.50} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={2.50} stroke="#ef4444" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="undergroundTiltDeg"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ugTiltGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="undergroundVibrationMms"
                  stroke="#ef4444"
                  strokeWidth={1.8}
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
                  strokeWidth={2}
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
  );
}

/**
 * Clean live table for Underground Nodes
 */
export function UndergroundFleetTable() {
  const { sensors } = useDashboardStore();
  const undergroundNodes = sensors.filter(
    (s) => s.domain === 'underground' || !s.domain || s.id.includes('UG-') || s.type === 'bf350_strain' || s.type === 'mq4_gas'
  );

  return (
    <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Underground Seam XII Nodes ({undergroundNodes.length})
        </span>
        <span className="text-[10px] font-mono text-slate-400">RL -248.0m • Ex-ia Certified</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 pb-1 text-[11px]">
              <th className="py-1.5">Sensor</th>
              <th className="py-1.5">Hardware</th>
              <th className="py-1.5">Location</th>
              <th className="py-1.5 text-right">Reading</th>
              <th className="py-1.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {undergroundNodes.map((sensor) => {
              const isCrit = sensor.status === 'critical';
              const isWarn = sensor.status === 'warning';
              return (
                <tr key={sensor.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                  <td className="py-2">
                    <span className="font-bold text-slate-900 dark:text-white block">{sensor.name}</span>
                    <span className="text-[10px] text-slate-400">{sensor.id}</span>
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">
                    {sensor.hardwareModel || 'BF350 / MPU-6050 / MQ-4'}
                  </td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {sensor.location}
                  </td>
                  <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                    {sensor.currentValue.toFixed(2)} {sensor.unit}
                  </td>
                  <td className="py-2 text-right">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
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
  );
}

/**
 * Default composite export if needed
 */
export function UndergroundTelemetrySection() {
  return (
    <section className="space-y-4">
      <UndergroundMetricCards />
      <UndergroundGraphCard />
      <UndergroundFleetTable />
    </section>
  );
}
