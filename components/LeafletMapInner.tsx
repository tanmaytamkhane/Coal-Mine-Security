'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoalfieldZone } from '../types';
import { INITIAL_SENSOR_NODES } from '../lib/constants';
import { useDashboardStore } from '../lib/store';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface LeafletMapInnerProps {
  selectedZone: CoalfieldZone;
  showHeatmap?: boolean;
}

function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

export default function LeafletMapInner({ selectedZone, showHeatmap = true }: LeafletMapInnerProps) {
  const position: [number, number] = [selectedZone.lat, selectedZone.lng];
  const { isSubsidenceSimActive, simProgress, resetSimulation } = useDashboardStore();

  const isJharia = selectedZone.id === 'jharia-block-4';
  const isDrillActive = isSubsidenceSimActive && isJharia;

  // Primary Focus mine center pin (Jharia gets golden safety-orange pulse)
  const centerIcon = L.divIcon({
    className: 'custom-mine-pin',
    html: isJharia
      ? `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
           <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(249,87,33,0.35);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
           <div style="background:#e64a19;width:26px;height:26px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 0 18px rgba(230,74,25,0.9);display:flex;align-items:center;justify-content:center;z-index:2;">
             <div style="width:8px;height:8px;background:#ffffff;border-radius:50%;"></div>
           </div>
         </div>`
      : `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
           <div style="background:#2563eb;width:24px;height:24px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 0 12px rgba(37,99,235,0.7);display:flex;align-items:center;justify-content:center;">
             <div style="width:6px;height:6px;background:#ffffff;border-radius:50%;"></div>
           </div>
         </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

  // Sensor node pin: switches to pulsating red if in critical anomaly drill zone
  const normalSensorIcon = L.divIcon({
    className: 'custom-sensor-pin',
    html: '<div style="background:#0ea5e9;width:14px;height:14px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const anomalySensorIcon = L.divIcon({
    className: 'custom-sensor-pin-anomaly',
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
             <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(239,68,68,0.5);animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></div>
             <div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 10px rgba(239,68,68,0.9);z-index:2;"></div>
           </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  // Hotspot coords for Jharia (Extraction Depillaring Sag Trough & East Abutment)
  const jhariaSagEpicenter: [number, number] = [selectedZone.lat + 0.0016, selectedZone.lng - 0.002];
  const jhariaAbutmentEpicenter: [number, number] = [selectedZone.lat - 0.0018, selectedZone.lng + 0.0022];

  // Dynamic deformation rates
  const liveInSarRate = isDrillActive
    ? (selectedZone.insarDeformationRateMmYr - simProgress * 24.3).toFixed(1)
    : selectedZone.insarDeformationRateMmYr.toFixed(1);

  return (
    <div className="relative w-full h-full">
      {/* Live Emergency Drill Floating Alert on Map */}
      {isDrillActive && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-2xl bg-red-600/95 text-white backdrop-blur-md shadow-2xl border border-red-400 flex items-center gap-3 text-xs font-bold pointer-events-auto">
          <AlertTriangle className="w-4 h-4 animate-bounce text-amber-300" />
          <span className="tracking-wide">
            DGMS CMR-111 DRILL EXECUTING ON JHARIA ({Math.round(simProgress * 100)}%)
          </span>
          <button
            onClick={resetSimulation}
            className="ml-1 px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1 shadow-sm"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Floating InSAR Subsidence Heatmap Legend */}
      {showHeatmap && (
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-xs font-mono pointer-events-auto max-w-xs select-none">
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              InSAR Subsidence Heatmap
            </span>
            <span className="text-[9px] text-slate-400 font-sans">Sentinel-1 SBAS</span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/60 ring-2 ring-red-500/30" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Critical Sag / Yield</span>
              </div>
              <span className="text-red-500 font-bold">&gt; 30 mm/yr</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Abutment Dilation</span>
              </div>
              <span className="text-amber-500 font-bold">15 - 30 mm/yr</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Competent Barrier</span>
              </div>
              <span className="text-emerald-500 font-bold">&lt; 15 mm/yr</span>
            </div>
          </div>

          <div className="pt-1.5 mt-1.5 border-t border-slate-200 dark:border-slate-800 text-[9px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{selectedZone.name.split('—')[0].trim()}</span>
            <span className={`font-bold ${isDrillActive ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
              {liveInSarRate} mm/yr
            </span>
          </div>
        </div>
      )}

      {/* Leaflet Interactive Map */}
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView coords={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =========================================================================
            GIS INSAR SUBSIDENCE RISK HEATMAP (MULTI-TIER CONCENTRIC GRADIENTS)
            ========================================================================= */}
        {showHeatmap && (
          <>
            {/* 1. Outer Buffer Influence Ring (Low Risk / Barrier Strata - Emerald) */}
            <Circle
              center={position}
              radius={isDrillActive ? 1200 : 900}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '6, 6',
              }}
            />

            {/* 2. Middle Abutment Stress & Dilation Horizon (Moderate Risk - Amber) */}
            <Circle
              center={position}
              radius={isDrillActive ? 750 : 550}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#f59e0b',
                fillOpacity: 0.22,
                weight: 2,
              }}
            />

            {/* 3. Core High-Risk Subsidence Sag Depression (Critical - Red) */}
            <Circle
              center={position}
              radius={isDrillActive ? 480 + simProgress * 160 : 340}
              pathOptions={{
                color: isDrillActive ? '#dc2626' : (selectedZone.currentRiskScore > 20 ? '#ef4444' : '#f59e0b'),
                fillColor: isDrillActive ? '#ef4444' : (selectedZone.currentRiskScore > 20 ? '#ef4444' : '#f59e0b'),
                fillOpacity: isDrillActive ? 0.45 : 0.28,
                weight: isDrillActive ? 3 : 2,
              }}
            />

            {/* JHARIA-SPECIFIC EXTRACTION HOTSPOTS (PRIMARY FOCUS) */}
            {isJharia && (
              <>
                {/* Hotspot A: Seam XII Depillaring Panel (P-06 / P-10 Extraction Sag Trough) */}
                <Circle
                  center={jhariaSagEpicenter}
                  radius={isDrillActive ? 360 + simProgress * 90 : 220}
                  pathOptions={{
                    color: '#b91c1c',
                    fillColor: '#dc2626',
                    fillOpacity: isDrillActive ? 0.55 : 0.35,
                    weight: 2.5,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="text-sm text-red-600 block flex items-center gap-1">
                        <span>⚠️ Jharia Extraction Sag Epicenter</span>
                      </strong>
                      <p className="text-gray-600 mt-1">
                        Overlying yielding pillars P-06, P-10 & P-11 in Seam XII (-248m RL).
                      </p>
                      <p className="text-red-600 font-bold mt-1">
                        InSAR Deformation: {liveInSarRate} mm/yr {isDrillActive ? '(EMERGENCY DRILL SURGE)' : ''}
                      </p>
                    </div>
                  </Popup>
                </Circle>

                {/* Hotspot B: East Flank Abutment Shear Horizon */}
                <Circle
                  center={jhariaAbutmentEpicenter}
                  radius={200}
                  pathOptions={{
                    color: '#ea580c',
                    fillColor: '#f97316',
                    fillOpacity: 0.24,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="text-sm text-amber-600 block">
                        East Flank Abutment Shear Zone
                      </strong>
                      <p className="text-gray-600 mt-0.5">
                        Tension shear fracture perimeter dampening periodic main falls.
                      </p>
                    </div>
                  </Popup>
                </Circle>
              </>
            )}
          </>
        )}

        {/* Mine Center Marker */}
        <Marker position={position} icon={centerIcon}>
          <Popup>
            <div className="p-1.5 text-xs">
              <div className="flex items-center gap-1.5 mb-1">
                {isJharia && (
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-[#e64a19] text-white rounded">
                    PRIMARY FOCUS
                  </span>
                )}
                <span className="text-gray-500 font-mono text-[10px]">{selectedZone.state}</span>
              </div>
              <strong className="text-sm text-gray-900 block">{selectedZone.name}</strong>
              <p className="text-gray-600 mt-1">Basin: {selectedZone.basin}</p>
              <p className="text-gray-600">Strata: {selectedZone.strataType}</p>
              <p className="text-slate-700 font-medium">Depth: {selectedZone.depthMeters || 240}m RL</p>
              <div className="mt-2 pt-1.5 border-t border-gray-200 flex items-center justify-between">
                <span className="text-safety-600 font-bold">{selectedZone.activeNodes} Active IoT Nodes</span>
                <span className={`font-bold ${isDrillActive ? 'text-red-600' : 'text-gray-700'}`}>
                  InSAR: {liveInSarRate} mm/yr
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 16 Telemetry Sensor Nodes scattered around colliery */}
        {INITIAL_SENSOR_NODES.map((sensor, idx) => {
          const offsetLat = (idx % 3 === 0 ? 0.003 : idx % 3 === 1 ? -0.002 : 0.001) * ((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 0.4);
          const offsetLng = (idx % 2 === 0 ? 0.0025 : -0.003) * ((idx + 1) * 0.35);
          const sensorPos: [number, number] = [selectedZone.lat + offsetLat, selectedZone.lng + offsetLng];

          // If drill is executing on Jharia, sensors near the sag center detect anomaly
          const distToSag = isJharia
            ? Math.hypot(sensorPos[0] - jhariaSagEpicenter[0], sensorPos[1] - jhariaSagEpicenter[1])
            : 1.0;
          const isAnomalyNode = isDrillActive && distToSag < 0.0035;

          return (
            <Marker
              key={sensor.id}
              position={sensorPos}
              icon={isAnomalyNode ? anomalySensorIcon : normalSensorIcon}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-gray-900 block">{sensor.name}</strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isAnomalyNode ? 'bg-red-100 text-red-700 font-mono' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isAnomalyNode ? 'ANOMALY ALERT' : 'NOMINAL'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">ID: {sensor.id} ({sensor.domain})</span>
                  <p className="text-gray-600 mt-1">Depth: {sensor.depthMeters}m ({sensor.location})</p>
                  <p className={`font-semibold mt-0.5 ${isAnomalyNode ? 'text-red-600' : 'text-blue-600'}`}>
                    Live Value: {isAnomalyNode ? (sensor.currentValue * 3.5).toFixed(2) : sensor.currentValue} {sensor.unit}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
