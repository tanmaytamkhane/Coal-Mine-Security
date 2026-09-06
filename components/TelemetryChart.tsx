'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useDashboardStore } from '../lib/store';
import { THRESHOLDS } from '../lib/constants';
import { TelemetryPoint } from '../types';

type MetricKey = 'strain' | 'tilt' | 'geophone';

export function TelemetryChart() {
  const [mounted, setMounted] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricKey>('strain');
  const { telemetryHistory } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-[380px] flex items-center justify-center">
        <div className="text-xs text-gray-400">Loading real-time telemetry stream...</div>
      </div>
    );
  }

  const metricConfig: Record<MetricKey, {
    label: string;
    dataKey: keyof TelemetryPoint;
    unit: string;
    warningVal: number;
    criticalVal: number;
    strokeColor: string;
    fillId: string;
  }> = {
    strain: {
      label: 'Microstrain (µε)',
      dataKey: 'strainMicrostrain',
      unit: 'µε',
      warningVal: THRESHOLDS.strain.warning,
      criticalVal: THRESHOLDS.strain.critical,
      strokeColor: '#f95721',
      fillId: 'strainGradient',
    },
    tilt: {
      label: 'MEMS Tilt Angle (°)',
      dataKey: 'tiltAngleDeg',
      unit: '°',
      warningVal: THRESHOLDS.tilt.warning,
      criticalVal: THRESHOLDS.tilt.critical,
      strokeColor: '#f59e0b',
      fillId: 'tiltGradient',
    },
    geophone: {
      label: 'Geophone PPV (mm/s)',
      dataKey: 'geophoneVelocityMms',
      unit: 'mm/s',
      warningVal: THRESHOLDS.geophone.warning,
      criticalVal: THRESHOLDS.geophone.critical,
      strokeColor: '#ef4444',
      fillId: 'geoGradient',
    },
  };

  const currentCfg = metricConfig[activeMetric];
  const lastPoint = telemetryHistory.length > 0 ? telemetryHistory[telemetryHistory.length - 1] : null;
  const latestVal = lastPoint ? Number(lastPoint[currentCfg.dataKey]) : 0;

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors flex flex-col justify-between">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Underground Telemetry Analytics
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-safety-50 dark:bg-safety-950/60 text-safety-600 dark:text-safety-400 border border-safety-200/60 dark:border-safety-800/60">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Real-time strata deformation readings fused with DGMS safety benchmarks
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-slate-900/80 rounded-xl border border-gray-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveMetric('strain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'strain'
                ? 'bg-safety-500 text-white shadow-sm shadow-safety-500/30'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Strain (µε)
          </button>
          <button
            onClick={() => setActiveMetric('tilt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'tilt'
                ? 'bg-safety-500 text-white shadow-sm shadow-safety-500/30'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Tilt (°)
          </button>
          <button
            onClick={() => setActiveMetric('geophone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'geophone'
                ? 'bg-safety-500 text-white shadow-sm shadow-safety-500/30'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Geophone (mm/s)
          </button>
        </div>
      </div>

      {/* Metric Quick Values */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 dark:border-slate-800/60 text-xs">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {latestVal}
            <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 ml-1">
              {currentCfg.unit}
            </span>
          </span>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            (DGMS Level-1 Threshold: {currentCfg.warningVal} {currentCfg.unit})
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
            <span className="w-2 h-0.5 bg-amber-500 inline-block" />
            <span className="text-[11px]">Warning: {currentCfg.warningVal}</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
            <span className="w-2 h-0.5 bg-red-500 inline-block" />
            <span className="text-[11px]">Critical: {currentCfg.criticalVal}</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[250px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="strainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f95721" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f95721" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="tiltGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="geoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>

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
                  const data = payload[0].payload as TelemetryPoint;
                  const val = Number(data[currentCfg.dataKey]);
                  const isWarn = val >= currentCfg.warningVal;
                  const isCrit = val >= currentCfg.criticalVal;

                  return (
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 text-xs">
                      <p className="text-gray-400 dark:text-slate-500 font-mono text-[10px]">
                        {data.timeLabel}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-800 dark:text-white text-sm">
                          {val} {currentCfg.unit}
                        </span>
                        {isCrit ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600">
                            Critical
                          </span>
                        ) : isWarn ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-600">
                            Warning
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                            Safe
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Risk Score: {data.riskScore}/100
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Guidelines */}
            <ReferenceLine
              y={currentCfg.warningVal}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceLine
              y={currentCfg.criticalVal}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            <Area
              type="monotone"
              dataKey={currentCfg.dataKey}
              stroke={currentCfg.strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${currentCfg.fillId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
