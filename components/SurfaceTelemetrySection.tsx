'use client';

import React from 'react';
import {
  Compass,
  Activity,
  Ruler,
  TrendingUp,
  Radio,
  BatteryCharging,
  Signal
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { SURFACE_THRESHOLDS } from '../lib/constants';

export function SurfaceTelemetrySection() {
  const { telemetryHistory, sensors } = useDashboardStore();

  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    surfaceDisplacementMm: 1.25,
    surfaceCrackWidthMm: 0.85,
    surfaceTiltDeg: 0.14,
    surfaceVibrationMms: 0.08,
  };

  const surfDisp = latestPoint.surfaceDisplacementMm ?? 1.25;
  const surfCrack = latestPoint.surfaceCrackWidthMm ?? 0.85;
  const surfTilt = latestPoint.surfaceTiltDeg ?? 0.14;
  const surfVib = latestPoint.surfaceVibrationMms ?? 0.08;

  // Threshold Checks
  const isDispCrit = surfDisp >= SURFACE_THRESHOLDS.linearPotDisplacement.critical;
  const isDispWarn = surfDisp >= SURFACE_THRESHOLDS.linearPotDisplacement.warning;

  const isCrackCrit = surfCrack >= SURFACE_THRESHOLDS.linearPotCrack.critical;
  const isCrackWarn = surfCrack >= SURFACE_THRESHOLDS.linearPotCrack.warning;

  const isTiltCrit = surfTilt >= SURFACE_THRESHOLDS.surfaceTilt.critical;
  const isTiltWarn = surfTilt >= SURFACE_THRESHOLDS.surfaceTilt.warning;

  const isVibCrit = surfVib >= SURFACE_THRESHOLDS.surfaceVibration.critical;
  const isVibWarn = surfVib >= SURFACE_THRESHOLDS.surfaceVibration.warning;

  // Filter surface nodes
  const surfaceNodes = sensors.filter(
    (s) => s.domain === 'surface' || s.type === 'linear_pot' || s.id.includes('SF-')
  );

  return (
    <section className="space-y-4 pt-2">
      {/* Formal Government / SCADA Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-100/90 dark:bg-[#0c121e] border border-slate-300/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Above the Surface Telemetry
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                STATION SF-01 / SF-02 • DATUM RL 0.0M
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pithead ground subsidence, surface tension fissures, slope tilt, and surface vibration telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <Radio className="w-3.5 h-3.5 text-sky-500" />
            <span>Linear Potentiometer & MPU-6050 Array</span>
          </div>
        </div>
      </div>

      {/* Surface Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Linear Potentiometer — Ground Subsidence Displacement */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ground Subsidence
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isDispCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 animate-pulse'
                  : isDispWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                {isDispCrit ? 'CRITICAL BREACH' : isDispWarn ? 'SURFACE ALERT' : 'NOMINAL'}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {surfDisp.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">mm</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                0-50mm Travel
              </span>
            </div>

            {/* Visual Slide Pot Stroke */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>0 mm</span>
                <span>Limit: 25 mm</span>
                <span>50 mm</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isDispCrit ? 'bg-red-500' : isDispWarn ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(3, (surfDisp / 50) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Sensor Hardware</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              Linear Slide Pot 50mm
            </span>
          </div>
        </div>

        {/* Card 2: Linear Potentiometer — Surface Tension Fissure / Crack Width */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tension Fissure / Crack
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isCrackCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300'
                  : isCrackWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                {isCrackCrit ? 'FISSURE ACTIVE' : isCrackWarn ? 'OPENING' : 'STABLE'}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {surfCrack.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">mm</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Permissible: 8 mm
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>0 mm</span>
                <span>DGMS Cap: 20 mm</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isCrackCrit ? 'bg-red-500' : isCrackWarn ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(3, (surfCrack / 20) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Sensor Hardware</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              Linear Extensometer 100mm
            </span>
          </div>
        </div>

        {/* Card 3: MPU-6050 — Surface Inclinometer (Tilt) */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Surface Slope Tilt
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isTiltCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300'
                  : isTiltWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                Safe Limit: 0.80°
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {surfTilt.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">°</span>
              </div>

              {/* Inclinometer Bubble Gauge Representation */}
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center relative bg-slate-50 dark:bg-slate-900/50">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                    isTiltCrit ? 'bg-red-500' : isTiltWarn ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{
                    transform: `translate(${Math.sin(surfTilt * 10) * 10}px, ${-Math.cos(surfTilt * 10) * 6}px)`
                  }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>Pitch: +{surfTilt.toFixed(2)}°</span>
              <span>Roll: -{(surfTilt * 0.4).toFixed(2)}°</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Sensor Hardware</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              MPU-6050 6-DOF IMU
            </span>
          </div>
        </div>

        {/* Card 4: MPU-6050 — Surface Ground Vibration (PPV) */}
        <div className="bg-white dark:bg-[#111726] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Surface Vibration
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isVibCrit
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300'
                  : isVibWarn
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
              }`}>
                Threshold: 2.5 mm/s
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {surfVib.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">mm/s</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                PPV Amplitude
              </span>
            </div>

            {/* Vibration Bar Indicator */}
            <div className="mt-3 flex items-end gap-1.5 h-6">
              {[20, 35, 25, 45, Math.min(100, Math.round((surfVib / 6.0) * 100))].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${Math.max(15, h)}%` }}
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    idx === 4
                      ? isVibCrit
                        ? 'bg-red-500'
                        : isVibWarn
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Sensor Hardware</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              MPU-6050 Accel RMS
            </span>
          </div>
        </div>
      </div>

      {/* Surface Nodes Live Fleet Status Table */}
      <div className="bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Surface Sensor Telemetry Live Frame
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {surfaceNodes.length} Surface Endpoints
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Cadence: 1.5s • Zigbee / LoRaWAN
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 pb-2">
                <th className="py-2">Node ID & Sensor</th>
                <th className="py-2">Hardware Model</th>
                <th className="py-2">Raw Signal / ADC</th>
                <th className="py-2">RF Signal & Battery</th>
                <th className="py-2 text-right">Physical Reading</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {surfaceNodes.map((sensor) => {
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
                      {sensor.hardwareModel || 'Linear Potentiometer / MPU-6050'}
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">
                      {sensor.rawSignal || '12-bit ADC 0-3.3V'}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Signal className="w-3 h-3 text-emerald-500" />
                          {sensor.signalDbm} dBm
                        </span>
                        <span className="flex items-center gap-1">
                          <BatteryCharging className="w-3 h-3 text-emerald-500" />
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
    </section>
  );
}
