'use client';

import React from 'react';
import { TelemetryChart } from '../../components/TelemetryChart';
import { useDashboardStore } from '../../lib/store';
import { Download, Activity, Gauge, Radio } from 'lucide-react';

export default function TrendsPage() {
  const { telemetryHistory } = useDashboardStore();

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'TimeLabel', 'Microstrain_ue', 'TiltAngle_deg', 'Geophone_mms', 'RiskScore_100'];
    const rows = telemetryHistory.map(p => [
      p.timestamp,
      p.timeLabel,
      p.strainMicrostrain,
      p.tiltAngleDeg,
      p.geophoneVelocityMms,
      p.riskScore,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mine_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Telemetry Analytics & Trends
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400">
              DGMS Time-Series
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Historical geotechnical sensor readings, cumulative deformation drift, and physics-model validation.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-safety-500 hover:bg-safety-600 text-white text-xs font-bold shadow-md shadow-safety-500/20 transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Sensor CSV</span>
        </button>
      </div>

      {/* Main Analytics Chart */}
      <TelemetryChart />

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0b111b] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-safety-500" />
            <span>Peak Microstrain in 24h</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            245.8 <span className="text-sm font-semibold text-gray-400">µε</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Baseline: 135.0 µε (Within DGMS 350 µε safe limit)
          </p>
        </div>

        <div className="bg-white dark:bg-[#0b111b] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>Max Differential Roof Tilt</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            0.48 <span className="text-sm font-semibold text-gray-400">°</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Permissible DGMS ceiling: 1.50°
          </p>
        </div>

        <div className="bg-white dark:bg-[#0b111b] p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
            <Radio className="w-4 h-4 text-purple-500" />
            <span>Seismic Energy Release RMS</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            0.22 <span className="text-sm font-semibold text-gray-400">mm/s</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            No micro-fracture swarms detected in winze zone
          </p>
        </div>
      </div>
    </div>
  );
}
