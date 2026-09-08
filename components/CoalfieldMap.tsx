'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '../lib/store';
import { COALFIELD_ZONES } from '../lib/constants';
import { MapPin, Satellite, Play, RotateCcw, Layers, ShieldAlert } from 'lucide-react';

const LeafletMap = dynamic(
  () => import('./LeafletMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[540px] lg:h-[600px] xl:h-[640px] w-full rounded-2xl bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-xs text-gray-400">
        Loading Coalfield Satellite Map...
      </div>
    )
  }
);

export function CoalfieldMap() {
  const selectedCoalfield = useDashboardStore((s) => s.selectedCoalfield);
  const setSelectedCoalfield = useDashboardStore((s) => s.setSelectedCoalfield);
  const isSubsidenceSimActive = useDashboardStore((s) => s.isSubsidenceSimActive);
  const simProgress = useDashboardStore((s) => s.simProgress);
  const triggerSubsidenceEvent = useDashboardStore((s) => s.triggerSubsidenceEvent);
  const resetSimulation = useDashboardStore((s) => s.resetSimulation);

  const [localCoalfieldId, setLocalCoalfieldId] = useState<string>(selectedCoalfield);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [nodeVariantFilter, setNodeVariantFilter] = useState<'all' | 'surface' | 'underground'>('all');

  // Keep local state synchronized with store if changed from Sidebar or external drill trigger
  React.useEffect(() => {
    if (selectedCoalfield && selectedCoalfield !== localCoalfieldId) {
      setLocalCoalfieldId(selectedCoalfield);
    }
  }, [selectedCoalfield, localCoalfieldId]);

  const handleSelectCoalfield = (id: string) => {
    setLocalCoalfieldId(id);
    setSelectedCoalfield(id);
  };

  const activeId = localCoalfieldId || selectedCoalfield;
  const currentZone = COALFIELD_ZONES.find(z => z.id === activeId) || COALFIELD_ZONES[0];
  const isJhariaSelected = currentZone.id === 'jharia-block-4';
  const isDrillOnCurrent = isSubsidenceSimActive && isJhariaSelected;

  const liveRate = isDrillOnCurrent
    ? (currentZone.insarDeformationRateMmYr - simProgress * 24.3).toFixed(1)
    : currentZone.insarDeformationRateMmYr.toFixed(1);

  const liveRiskScore = isDrillOnCurrent
    ? Math.min(98, Math.round(currentZone.currentRiskScore + simProgress * 72))
    : currentZone.currentRiskScore;

  return (
    <div className="space-y-4">
      {/* Coalfield Switcher & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-[#0b111b] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft">
        {/* Mine Location Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#e64a19]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                {currentZone.name}
              </h3>
              {currentZone.isPrimaryFocus && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#e64a19] text-white shadow-sm animate-pulse">
                  ★ PRIMARY SURVEILLANCE FOCUS
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              {currentZone.basin} • {currentZone.state} • Strata: {currentZone.strataType}
            </p>
          </div>
        </div>

        {/* Controls: Coalfield Selector & Simulation Drill Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stratum Variant Filter (Surface vs. Underground Distinction) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-xs">
            <button
              onClick={() => setNodeVariantFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                nodeVariantFilter === 'all'
                  ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Show All Nodes (Surface + Underground)"
            >
              All Variants
            </button>
            <button
              onClick={() => setNodeVariantFilter('surface')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                nodeVariantFilter === 'surface'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-sky-700 dark:text-sky-400 hover:bg-sky-500/10'
              }`}
              title="Show Only Above-Ground Surface Nodes (RL 0.0m)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white" />
              <span>Surface</span>
            </button>
            <button
              onClick={() => setNodeVariantFilter('underground')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                nodeVariantFilter === 'underground'
                  ? 'bg-[#e64a19] text-white shadow-xs'
                  : 'text-orange-700 dark:text-orange-400 hover:bg-orange-500/10'
              }`}
              title="Show Only Subterranean Strata Nodes (RL -248m)"
            >
              <span className="w-2.5 h-2.5 rotate-45 rounded-xs bg-amber-400 border border-white" />
              <span>Underground</span>
            </button>
          </div>

          {/* Mine Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800">
            {COALFIELD_ZONES.map(z => {
              const isSelected = activeId === z.id;
              const isJharia = z.id === 'jharia-block-4';

              return (
                <button
                  key={z.id}
                  onClick={() => handleSelectCoalfield(z.id)}
                  title={`${z.name} (${z.state})`}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? isJharia
                        ? 'bg-[#e64a19] text-white shadow-sm ring-2 ring-[#e64a19]/40'
                        : 'bg-safety-500 text-white shadow-sm'
                      : isJharia
                      ? 'text-[#e64a19] dark:text-[#ff7a45] hover:bg-orange-500/10 font-extrabold'
                      : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {isJharia && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />}
                  <span>{z.name.split('—')[0].trim()}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    ({z.state === 'Jharkhand' ? 'JH' : z.state === 'Chhattisgarh' ? 'CG' : 'WB'})
                  </span>
                </button>
              );
            })}
          </div>

          {/* InSAR Heatmap Layer Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
              showHeatmap
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'
            }`}
            title="Toggle InSAR Subsidence Heatmap Layer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap ({showHeatmap ? 'ON' : 'OFF'})</span>
          </button>

          {/* Simulate Drill Button (Binds to Jharia Coal Mine) */}
          {isSubsidenceSimActive ? (
            <button
              onClick={resetSimulation}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-1.5 shadow-lg border border-red-500 animate-pulse"
              title="Reset DGMS Strata Subsidence Drill"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Drill ({Math.round(simProgress * 100)}%)</span>
            </button>
          ) : (
            <button
              onClick={triggerSubsidenceEvent}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#e64a19] hover:bg-[#d84315] text-white transition-all flex items-center gap-1.5 shadow-lg border border-orange-500"
              title="Execute DGMS Subsidence Drill on Jharia Colliery (Block IV)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Drill (Jharia)</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[540px] lg:h-[600px] xl:h-[640px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-soft relative bg-slate-950">
        <LeafletMap
          key={currentZone.id}
          selectedZone={currentZone}
          showHeatmap={showHeatmap}
          nodeVariantFilter={nodeVariantFilter}
          setNodeVariantFilter={setNodeVariantFilter}
        />
      </div>

      {/* Satellite InSAR & Geotechnical Status Banner */}
      <div className="bg-white dark:bg-[#0b111b] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-soft grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Satellite className="w-4 h-4 text-safety-500 shrink-0" />
          <div>
            <span className="text-gray-400 block text-[10px]">Sentinel-1 SBAS-InSAR Velocity</span>
            <span className={`font-bold ${isDrillOnCurrent ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
              {liveRate} mm/year subsidence rate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-gray-400 block text-[10px]">DGMS Geotechnical Risk Level</span>
            <span className={`font-bold ${liveRiskScore > 70 ? 'text-red-500' : liveRiskScore > 35 ? 'text-amber-500' : 'text-emerald-500'}`}>
              Risk Index {liveRiskScore}/100 ({liveRiskScore > 70 ? 'CRITICAL EVACUATION' : liveRiskScore > 35 ? 'CAUTIONARY DILATION' : 'NOMINAL STABLE'})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-gray-500 dark:text-slate-400 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 font-bold text-gray-700 dark:text-gray-300">
            {currentZone.activeNodes} Active IoT Nodes
          </span>
        </div>
      </div>
    </div>
  );
}
