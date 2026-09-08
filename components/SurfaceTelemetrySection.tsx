'use client';

import React, { useState } from 'react';
import {
  Compass,
  Activity,
  Ruler,
  BatteryCharging,
  Signal,
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
import { SURFACE_THRESHOLDS } from '../lib/constants';

/**
 * High-density minimal metric cards for Surface Sensors (Linear Pot + MPU-6050)
 * Perfectly balanced 3-card layout aligning seamlessly with RiskGaugeCard on desktop.
 */
export function SurfaceMetricCards() {
  const { telemetryHistory } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    surfaceDisplacementMm: 1.25,
    surfaceTiltDeg: 0.14,
    surfaceVibrationMms: 0.08,
  };

  const surfDisp = latestPoint.surfaceDisplacementMm ?? 1.25;
  const surfTilt = latestPoint.surfaceTiltDeg ?? 0.14;
  const surfVib = latestPoint.surfaceVibrationMms ?? 0.08;

  const isDispCrit = surfDisp >= SURFACE_THRESHOLDS.linearPotDisplacement.critical;
  const isDispWarn = surfDisp >= SURFACE_THRESHOLDS.linearPotDisplacement.warning;

  const isTiltCrit = surfTilt >= SURFACE_THRESHOLDS.surfaceTilt.critical;
  const isTiltWarn = surfTilt >= SURFACE_THRESHOLDS.surfaceTilt.warning;

  const isVibCrit = surfVib >= SURFACE_THRESHOLDS.surfaceVibration.critical;
  const isVibWarn = surfVib >= SURFACE_THRESHOLDS.surfaceVibration.warning;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* 1. Linear Potentiometer — Ground Subsidence */}
      <div className="bg-white dark:bg-[#0b111b] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all hover:border-sky-300 dark:hover:border-sky-800/80">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
                <Ruler className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Ground Subsidence
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isDispCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 animate-pulse'
                : isDispWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isDispCrit ? 'CRITICAL' : isDispWarn ? 'ALERT' : 'NOMINAL'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {surfDisp.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">mm</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Limit: 25mm</span>
          </div>

          {/* Stroke Progress Bar with warning marker */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>0mm</span>
              <span className="text-amber-500">Warn 10mm</span>
              <span>25mm</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isDispCrit ? 'bg-red-500' : isDispWarn ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, (surfDisp / 25) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400">Linear Pot 50mm</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">SF-01</span>
        </div>
      </div>

      {/* 2. MPU-6050 — Surface Slope Tilt */}
      <div className="bg-white dark:bg-[#0b111b] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all hover:border-violet-300 dark:hover:border-violet-800/80">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Surface Slope Tilt
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

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {surfTilt.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">°</span>
            </div>

            {/* Inclinometer Precision Bubble */}
            <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 shadow-inner">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-transform duration-300 ${
                  isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-violet-500'
                }`}
                style={{
                  transform: `translate(${Math.sin(surfTilt * 10) * 7}px, ${-Math.cos(surfTilt * 10) * 5}px)`
                }}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>0.0°</span>
              <span className="text-amber-500">Safe 0.80°</span>
              <span>1.50°</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-violet-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, (surfTilt / 1.5) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400">MPU-6050 6-DOF IMU</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">SF-01</span>
        </div>
      </div>

      {/* 3. MPU-6050 — Surface Vibration (PPV) */}
      <div className="bg-white dark:bg-[#0b111b] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all hover:border-rose-300 dark:hover:border-rose-800/80">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Surface Vibration
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              isVibCrit
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                : isVibWarn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isVibCrit ? 'CRITICAL' : isVibWarn ? 'HIGH PPV' : 'NORMAL'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {surfVib.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">mm/s</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Limit: 2.5 mm/s</span>
          </div>

          {/* Dynamic 5-bar live equalizer */}
          <div className="mt-3 flex items-end gap-1.5 h-6">
            {[20, 35, 25, 55, Math.min(100, Math.max(15, Math.round((surfVib / 4.0) * 100)))].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-xs transition-all duration-300 ${
                  idx === 4
                    ? isVibCrit
                      ? 'bg-red-500'
                      : isVibWarn
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400">MPU-6050 PPV Accel</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">SF-02</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated clean dynamic graph for Surface Telemetry
 */
export function SurfaceGraphCard() {
  const [chartMode, setChartMode] = useState<'subsidence' | 'slope'>('subsidence');
  const { telemetryHistory } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    surfaceDisplacementMm: 1.25,
    surfaceTiltDeg: 0.14,
    surfaceVibrationMms: 0.08,
  };

  const surfDisp = latestPoint.surfaceDisplacementMm ?? 1.25;
  const surfTilt = latestPoint.surfaceTiltDeg ?? 0.14;
  const surfVib = latestPoint.surfaceVibrationMms ?? 0.08;

  return (
    <div className="bg-white dark:bg-[#0b111b] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Surface Telemetry Live Stream
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            1.5s
          </span>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartMode('subsidence')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              chartMode === 'subsidence'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Linear Pot (mm)
          </button>
          <button
            onClick={() => setChartMode('slope')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              chartMode === 'slope'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            MPU-6050 (°)
          </button>
        </div>
      </div>

      {/* Legend values */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-4">
          {chartMode === 'subsidence' ? (
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              Ground Subsidence (POT-01): {surfDisp.toFixed(2)} mm
            </span>
          ) : (
            <>
              <span className="text-violet-600 dark:text-violet-400 font-bold">
                Slope Tilt (MPU-01): {surfTilt.toFixed(2)}°
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                Vibration (MPU-02): {surfVib.toFixed(2)} mm/s
              </span>
            </>
          )}
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          {chartMode === 'subsidence' ? 'Warning: 10.0 mm • Cap: 25.0 mm' : 'Safe: 0.80° • PPV Cap: 2.5 mm/s'}
        </div>
      </div>

      {/* Graph Area */}
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryHistory} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="surfDispGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="surfTiltGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="surfVibGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
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
                      {chartMode === 'subsidence' ? (
                        <div className="text-sky-600 font-bold">
                          Subsidence: {d.surfaceDisplacementMm?.toFixed(2) ?? '0.00'} mm
                        </div>
                      ) : (
                        <>
                          <div className="text-violet-500 font-bold">
                            Slope Tilt: {d.surfaceTiltDeg?.toFixed(2) ?? '0.00'}°
                          </div>
                          <div className="text-rose-500 font-bold">
                            Vibration: {d.surfaceVibrationMms?.toFixed(2) ?? '0.00'} mm/s
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {chartMode === 'subsidence' ? (
              <>
                <ReferenceLine y={10.0} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={25.0} stroke="#ef4444" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="surfaceDisplacementMm"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#surfDispGrad)"
                  isAnimationActive={false}
                />
              </>
            ) : (
              <>
                <ReferenceLine y={0.80} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="surfaceTiltDeg"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#surfTiltGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="surfaceVibrationMms"
                  stroke="#f43f5e"
                  strokeWidth={1.8}
                  fillOpacity={1}
                  fill="url(#surfVibGrad)"
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
 * Clean live table for Surface Nodes (POT-01, MPU-01, MPU-02)
 */
export function SurfaceFleetTable() {
  const { sensors } = useDashboardStore();
  const surfaceNodes = sensors.filter(
    (s) => s.domain === 'surface' || s.type === 'linear_pot' || s.id.includes('SF-')
  );

  return (
    <div className="bg-white dark:bg-[#0b111b] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Surface Telemetry Fleet ({surfaceNodes.length} Sensors)
        </span>
        <span className="text-[10px] font-mono text-slate-400">Datum RL 0.0m • RF Link Active</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 pb-1 text-[11px] border-b border-slate-200 dark:border-slate-800">
              <th className="py-2">Sensor Node</th>
              <th className="py-2">Hardware Model</th>
              <th className="py-2">Deployment Location</th>
              <th className="py-2">Telemetry Health</th>
              <th className="py-2 text-right">Live Reading</th>
              <th className="py-2 text-right">DGMS Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {surfaceNodes.map((sensor) => {
              const isCrit = sensor.status === 'critical';
              const isWarn = sensor.status === 'warning';
              return (
                <tr key={sensor.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5">
                    <span className="font-bold text-slate-900 dark:text-white block">{sensor.name}</span>
                    <span className="text-[10px] text-slate-400">{sensor.id}</span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    {sensor.hardwareModel || 'Linear Pot / MPU-6050'}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    <span className="block">{sensor.location}</span>
                    <span className="text-[10px] text-slate-400">Datum RL 0.0m</span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Signal className="w-3.5 h-3.5 text-emerald-500" />
                        {sensor.signalDbm} dBm
                      </span>
                      <span className="flex items-center gap-1">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                        {sensor.batteryPercent}%
                      </span>
                    </div>
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
  );
}

/**
 * Composite export
 */
export function SurfaceTelemetrySection() {
  return (
    <section className="space-y-4">
      <SurfaceMetricCards />
      <SurfaceGraphCard />
      <SurfaceFleetTable />
    </section>
  );
}
