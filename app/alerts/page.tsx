'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { useDashboardStore } from '../../lib/store';

export default function AlertsPage() {
  const {
    alerts,
    acknowledgeAlert,
    isAudioMuted,
    toggleAudioMute,
    isSubsidenceSimActive,
    triggerSubsidenceEvent,
    resetSimulation
  } = useDashboardStore();

  const [filter, setFilter] = useState<'all' | 'unack' | 'critical'>('all');
  const [checklist, setChecklist] = useState({
    sirens: false,
    deenergize: false,
    rescue: false,
    rfid: false,
  });

  const filtered = alerts.filter(a => {
    if (filter === 'unack') return !a.acknowledged;
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Emergency Alerts & Dispatch
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
              DGMS Protocol Command
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Real-time emergency incident monitoring, audible alarms, and DGMS statutory evacuation checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudioMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            <span>{isAudioMuted ? 'Alarms Muted' : 'Siren Armed'}</span>
          </button>

          {isSubsidenceSimActive ? (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Subsidence Demo</span>
            </button>
          ) : (
            <button
              onClick={triggerSubsidenceEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-safety-500 hover:bg-safety-600 text-white text-xs font-bold shadow-md shadow-safety-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Trigger Subsidence Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Alerts List & Evacuation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Alerts Log */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Incident Broadcast Stream
            </h3>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-safety-500 text-white' : 'text-gray-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unack')}
                className={`px-3 py-1 rounded-lg ${filter === 'unack' ? 'bg-safety-500 text-white' : 'text-gray-500'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 rounded-lg ${filter === 'critical' ? 'bg-safety-500 text-white' : 'text-gray-500'}`}
              >
                Critical
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(alert => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCrit
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                      : isWarn
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                      : 'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        isCrit ? 'bg-red-500 text-white' : isWarn ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {isCrit ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {alert.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border">
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

                    <div>
                      {alert.acknowledged ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Acknowledged</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 rounded-lg bg-safety-500 hover:bg-safety-600 text-white text-xs font-bold shadow"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: DGMS Evacuation SOP Checklist */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-safety-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                DGMS Evacuation SOP
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Statutory emergency checklist under Coal Mines Regulations (CMR-111)
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklist.sirens}
                  onChange={e => setChecklist({ ...checklist, sirens: e.target.checked })}
                  className="mt-0.5 rounded text-safety-500 focus:ring-safety-500"
                />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">Sound Acoustic Sirens</span>
                  <span className="text-[11px] text-gray-500">Continuous 110dB warble in return air courses & shafts</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklist.deenergize}
                  onChange={e => setChecklist({ ...checklist, deenergize: e.target.checked })}
                  className="mt-0.5 rounded text-safety-500 focus:ring-safety-500"
                />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">De-energize District HV Lines</span>
                  <span className="text-[11px] text-gray-500">Trip 3.3kV gate-end boxes to prevent methane spark risk</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklist.rfid}
                  onChange={e => setChecklist({ ...checklist, rfid: e.target.checked })}
                  className="mt-0.5 rounded text-safety-500 focus:ring-safety-500"
                />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">Cap-Lamp RFID Muster Verification</span>
                  <span className="text-[11px] text-gray-500">Verify all 42 miners cleared from Panel-4 to intake shaft</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklist.rescue}
                  onChange={e => setChecklist({ ...checklist, rescue: e.target.checked })}
                  className="mt-0.5 rounded text-safety-500 focus:ring-safety-500"
                />
                <div>
                  <span className="font-bold text-gray-800 dark:text-slate-200 block">Alert Mines Rescue Station</span>
                  <span className="text-[11px] text-gray-500">Dispatch Dhanbad / Asansol Rescue Station teams</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-500">
            Inspector in Charge: <strong>Insp. R. K. Verma (DGMS)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
