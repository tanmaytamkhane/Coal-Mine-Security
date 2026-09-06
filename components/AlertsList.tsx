'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, AlertOctagon } from 'lucide-react';
import { useDashboardStore } from '../lib/store';

export function AlertsList() {
  const { alerts, acknowledgeAlert } = useDashboardStore();
  const [filter, setFilter] = useState<'all' | 'unack' | 'critical'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unack') return !a.acknowledged;
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Emergency & Incident Feed
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-safety-50 dark:bg-safety-950/60 text-safety-600 dark:text-safety-400">
              {alerts.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Automated telemetry dispatch & DGMS statutory compliance notifications
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-900/60 p-1 rounded-xl border border-gray-200/80 dark:border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === 'all'
                ? 'bg-safety-500 text-white'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unack')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === 'unack'
                ? 'bg-safety-500 text-white'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === 'critical'
                ? 'bg-safety-500 text-white'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No incidents matching this filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isWarn = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCrit
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/60'
                    : isWarn
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                    : 'bg-gray-50/70 dark:bg-slate-900/40 border-gray-200/70 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    isCrit
                      ? 'bg-red-500 text-white animate-pulse'
                      : isWarn
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}>
                    {isCrit ? (
                      <AlertOctagon className="w-4 h-4" />
                    ) : isWarn ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-800 border text-gray-600 dark:text-slate-400">
                        {alert.dgmsCode}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {alert.acknowledged ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1 rounded-lg bg-safety-500 hover:bg-safety-600 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
