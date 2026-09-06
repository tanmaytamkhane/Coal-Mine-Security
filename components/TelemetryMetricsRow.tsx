'use client';

import React from 'react';
import { TrendingUp, Gauge, Activity } from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { THRESHOLDS } from '../lib/constants';

export function TelemetryMetricsRow() {
  const { telemetryHistory } = useDashboardStore();
  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    strainMicrostrain: 145.0,
    tiltAngleDeg: 0.35,
    geophoneVelocityMms: 0.18,
  };

  const strainVal = latestPoint.strainMicrostrain;
  const tiltVal = latestPoint.tiltAngleDeg;
  const geoVal = latestPoint.geophoneVelocityMms;

  const isStrainWarn = strainVal >= THRESHOLDS.strain.warning;
  const isStrainCrit = strainVal >= THRESHOLDS.strain.critical;

  const isTiltWarn = tiltVal >= THRESHOLDS.tilt.warning;
  const isTiltCrit = tiltVal >= THRESHOLDS.tilt.critical;

  const isGeoWarn = geoVal >= THRESHOLDS.geophone.warning;
  const isGeoCrit = geoVal >= THRESHOLDS.geophone.critical;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Metric 1: Microstrain Peak */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Pillar Microstrain
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isStrainCrit
              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
              : isStrainWarn
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              : 'bg-safety-50 text-safety-600 dark:bg-safety-950/50 dark:text-safety-400'
          }`}>
            DGMS Cap: 350 µε
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {strainVal.toFixed(1)}
              <span className="text-sm font-semibold text-gray-400 dark:text-slate-500 ml-1">µε</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-safety-500" />
              <span>Vibrating Wire Core Gauge SG-01</span>
            </p>
          </div>

          {/* Mini Bar Indicator */}
          <div className="flex items-end gap-1 h-10">
            {[40, 55, 45, 60, Math.min(100, Math.round((strainVal / 600) * 100))].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${Math.max(15, h)}%` }}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  idx === 4
                    ? isStrainCrit
                      ? 'bg-red-500'
                      : isStrainWarn
                      ? 'bg-amber-500'
                      : 'bg-safety-500'
                    : 'bg-safety-200 dark:bg-safety-900/60'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-gray-500 dark:text-slate-400">Yield Margin</span>
          <span className={`font-semibold ${isStrainCrit ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {Math.max(0, 600 - strainVal).toFixed(0)} µε buffer
          </span>
        </div>
      </div>

      {/* Metric 2: MEMS Tiltmeter Drift */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Roof Tilt Drift
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isTiltCrit
              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
              : isTiltWarn
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            Max Safe: 1.50°
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {tiltVal.toFixed(2)}
              <span className="text-sm font-semibold text-gray-400 dark:text-slate-500 ml-1">°</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-safety-500" />
              <span>Bi-axial MEMS Node TM-01</span>
            </p>
          </div>

          <div className="w-10 h-10 rounded-full border-4 border-gray-100 dark:border-slate-800 flex items-center justify-center relative">
            <div
              className={`w-7 h-7 rounded-full border-4 border-t-transparent ${
                isTiltCrit ? 'border-red-500' : isTiltWarn ? 'border-amber-500' : 'border-safety-500'
              }`}
              style={{ transform: `rotate(${tiltVal * 50}deg)` }}
            />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-gray-500 dark:text-slate-400">Differential Angle</span>
          <span className="font-semibold text-gray-700 dark:text-slate-300">
            +{(tiltVal - 0.30).toFixed(2)}° vs Seam
          </span>
        </div>
      </div>

      {/* Metric 3: Geophone Seismic Vibration */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Seismic Vibration PPV
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isGeoCrit
              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
              : isGeoWarn
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
          }`}>
            Limit: 5.0 mm/s
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {geoVal.toFixed(2)}
              <span className="text-sm font-semibold text-gray-400 dark:text-slate-500 ml-1">mm/s</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-safety-500" />
              <span>Tri-axial Geophone GP-01</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isGeoCrit ? 'bg-red-500 animate-ping' : isGeoWarn ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`} />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-gray-500 dark:text-slate-400">DGMS Classification</span>
          <span className="font-semibold text-gray-700 dark:text-slate-300">
            {geoVal > 5.0 ? 'Exceeds Blast Standard' : 'Safe Micro-tremor'}
          </span>
        </div>
      </div>
    </div>
  );
}
