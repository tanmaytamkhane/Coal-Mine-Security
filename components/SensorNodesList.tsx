'use client';

import React from 'react';
import { BatteryCharging, Signal, Activity, Gauge, Radio } from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { SensorNode } from '../types';

export function SensorNodesList() {
  const { sensors } = useDashboardStore();

  const getTypeIcon = (type: SensorNode['type']) => {
    switch (type) {
      case 'tiltmeter':
        return <Gauge className="w-3.5 h-3.5 text-safety-500" />;
      case 'strain_gauge':
        return <Activity className="w-3.5 h-3.5 text-blue-500" />;
      case 'geophone':
        return <Radio className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Underground Sensor Fleet
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              {sensors.length} Active
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Zigbee mesh endpoints reporting via underground LoRa gateway
          </p>
        </div>

        <span className="text-xs font-semibold text-safety-500 hover:text-safety-600 cursor-pointer flex items-center gap-0.5">
          See All Telemetry →
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800/70 text-gray-400 dark:text-slate-500 pb-2">
              <th className="font-semibold pb-2.5">Node ID / Name</th>
              <th className="font-semibold pb-2.5">Location & Depth</th>
              <th className="font-semibold pb-2.5">Signal & Battery</th>
              <th className="font-semibold pb-2.5 text-right">Current Value</th>
              <th className="font-semibold pb-2.5 text-right">DGMS Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/40">
            {sensors.slice(0, 5).map((sensor) => {
              const isCrit = sensor.status === 'critical';
              const isWarn = sensor.status === 'warning';

              return (
                <tr key={sensor.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getTypeIcon(sensor.type)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-slate-200 block">
                          {sensor.name}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {sensor.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-gray-600 dark:text-slate-400">
                    <span className="block font-medium">{sensor.location}</span>
                    <span className="text-[10px] text-gray-400">{sensor.depthMeters}m depth</span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1 font-mono">
                        <Signal className="w-3 h-3 text-emerald-500" />
                        {sensor.signalDbm} dBm
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <BatteryCharging className="w-3 h-3 text-emerald-500" />
                        {sensor.batteryPercent}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    <span className="font-bold text-gray-900 dark:text-white text-xs">
                      {sensor.currentValue} {sensor.unit}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      Base: {sensor.baselineValue}
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isCrit
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : isWarn
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}>
                      {sensor.status === 'normal' ? 'Nominal' : sensor.status.toUpperCase()}
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
