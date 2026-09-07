'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoalfieldZone, SensorNode } from '../types';
import { getSensorsForCoalfield } from '../lib/constants';
import { useDashboardStore } from '../lib/store';
import { AlertTriangle, RotateCcw, Flame, CheckCircle } from 'lucide-react';

interface LeafletMapInnerProps {
  selectedZone: CoalfieldZone;
  showHeatmap?: boolean;
}

export interface ComputedSensorState {
  sensor: SensorNode;
  position: [number, number];
  isAnomaly: boolean;
  anomalyIntensity: number; // 0 (nominal/blue) to 1.0 (critical/red)
  liveReading: number;
}

// ---------------------------------------------------------------------------
// 1. Color Palette Generator (Matches Sentinel-1 InSAR Disaster Heatmap)
// ---------------------------------------------------------------------------
let cachedPalette: Uint8ClampedArray | null = null;

function getHeatmapPalette(): Uint8ClampedArray {
  if (cachedPalette) return cachedPalette;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Uint8ClampedArray(1024);

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  // Exact 4-tier multi-chromatic color ramp matching reference image media_1788784428405.png
  grad.addColorStop(0.00, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.12, 'rgba(79, 70, 229, 0)');         // zero-edge falloff
  grad.addColorStop(0.26, 'rgba(99, 102, 241, 0.42)');     // soft indigo / lavender-blue haze
  grad.addColorStop(0.40, 'rgba(129, 140, 248, 0.58)');    // periwinkle transition
  grad.addColorStop(0.56, 'rgba(239, 68, 68, 0.78)');      // saturated crimson / ruby red
  grad.addColorStop(0.72, 'rgba(249, 115, 22, 0.88)');     // radiant warm amber / orange
  grad.addColorStop(0.88, 'rgba(250, 204, 21, 0.95)');     // hot gold
  grad.addColorStop(1.00, 'rgba(254, 240, 138, 0.98)');    // incandescent yellow-white core

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1, 256);
  cachedPalette = ctx.getImageData(0, 0, 1, 256).data;
  return cachedPalette;
}

// ---------------------------------------------------------------------------
// 2. Dynamic Node-Driven HTML5 Canvas Heatmap Layer (Underneath Markers)
//    CAUSE: Nodes Turn Red / Stressed
//    EFFECT: Heatmap directly originates and shapes around those specific nodes
// ---------------------------------------------------------------------------
function DynamicNodeHeatmapOverlay({
  computedSensors,
}: {
  computedSensors: ComputedSensorState[];
}) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shadowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const overlayPane = map.getPanes().overlayPane;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '400'; // Underneath markerPane (600) and popupPane (700)
    canvas.style.filter = 'blur(1.5px)'; // Soft organic continuous blur
    overlayPane.appendChild(canvas);
    canvasRef.current = canvas;

    const shadowCanvas = document.createElement('canvas');
    shadowCanvasRef.current = shadowCanvas;

    const palette = getHeatmapPalette();

    const render = () => {
      if (!canvas || !map) return;
      const size = map.getSize();
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      if (canvas.width !== size.x || canvas.height !== size.y) {
        canvas.width = size.x;
        canvas.height = size.y;
        shadowCanvas.width = size.x;
        shadowCanvas.height = size.y;
      }

      const ctx = canvas.getContext('2d');
      const sctx = shadowCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || !sctx) return;

      sctx.clearRect(0, 0, size.x, size.y);
      ctx.clearRect(0, 0, size.x, size.y);

      // Filter ONLY nodes that have turned RED or are stressed (anomaly > 0.08)
      const heatSourceNodes = computedSensors.filter(
        (s) => s.isAnomaly && s.anomalyIntensity > 0.08
      );

      // If zero nodes are red, the heatmap is completely clear / nominal
      if (heatSourceNodes.length === 0) {
        return;
      }

      // Geographic zoom scale factor (centered at zoom 14)
      const currentZoom = map.getZoom();
      const zoomScale = Math.max(0.35, Math.min(2.5, Math.pow(2, currentZoom - 14)));

      // Pass 1: Accumulate Gaussian-like alpha density directly at each RED node's coordinates
      for (let i = 0; i < heatSourceNodes.length; i++) {
        const s = heatSourceNodes[i];
        const pt = map.latLngToContainerPoint(s.position);
        // Radius scales with node anomaly severity and map zoom
        const r = (42 + s.anomalyIntensity * 48) * zoomScale;

        // Skip points outside visible viewport with padding
        if (pt.x < -r || pt.x > size.x + r || pt.y < -r || pt.y > size.y + r) {
          continue;
        }

        const intensity = 0.42 + s.anomalyIntensity * 0.58;
        const radGrad = sctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
        radGrad.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
        radGrad.addColorStop(0.35, `rgba(0, 0, 0, ${intensity * 0.72})`);
        radGrad.addColorStop(0.70, `rgba(0, 0, 0, ${intensity * 0.28})`);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        sctx.fillStyle = radGrad;
        sctx.beginPath();
        sctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        sctx.fill();
      }

      // Pass 2: Color LUT Remapping (Alpha -> Multi-chromatic Disaster Gradient)
      const imgData = sctx.getImageData(0, 0, size.x, size.y);
      const data = imgData.data;
      const len = data.length;

      for (let i = 3; i < len; i += 4) {
        const alpha = data[i];
        if (alpha > 0) {
          const offset = alpha * 4;
          data[i - 3] = palette[offset];     // R
          data[i - 2] = palette[offset + 1]; // G
          data[i - 1] = palette[offset + 2]; // B
          data[i] = palette[offset + 3];     // A
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    const scheduleRender = () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    map.on('move', scheduleRender);
    map.on('zoom', scheduleRender);
    map.on('viewreset', scheduleRender);
    map.on('resize', scheduleRender);

    scheduleRender();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      map.off('move', scheduleRender);
      map.off('zoom', scheduleRender);
      map.off('viewreset', scheduleRender);
      map.off('resize', scheduleRender);
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, [map, computedSensors]);

  return null;
}

// ---------------------------------------------------------------------------
// 3. Map View Centering Helper
// ---------------------------------------------------------------------------
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

// ---------------------------------------------------------------------------
// 4. Main Leaflet Component Export
// ---------------------------------------------------------------------------
export default function LeafletMapInner({ selectedZone, showHeatmap = true }: LeafletMapInnerProps) {
  const position: [number, number] = [selectedZone.lat, selectedZone.lng];
  const { isSubsidenceSimActive, simProgress, resetSimulation } = useDashboardStore();

  const isJharia = selectedZone.id === 'jharia-block-4';
  const isDrillActive = isSubsidenceSimActive && isJharia;

  // Retrieve raw sensors for the selected coalfield
  const rawSensors = getSensorsForCoalfield(selectedZone.id);

  // User interactive manual node anomaly toggles
  const [manualAnomalies, setManualAnomalies] = useState<Record<string, boolean>>({});

  // Reset manual anomalies when simulation resets or zone changes
  useEffect(() => {
    if (!isSubsidenceSimActive) {
      setManualAnomalies({});
    }
  }, [isSubsidenceSimActive, selectedZone.id]);

  const toggleNodeAnomaly = (nodeId: string) => {
    setManualAnomalies((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // -------------------------------------------------------------------------
  // CAUSE COMPUTATION: Evaluate each node's exact anomaly state
  // -------------------------------------------------------------------------
  const computedSensors: ComputedSensorState[] = useMemo(() => {
    // Depillaring sag epicenter on Jharia Seam XII (-248m RL)
    const jhariaSagEpicenter: [number, number] = [selectedZone.lat + 0.0015, selectedZone.lng - 0.0018];

    // Rupture propagation front expands outward from sag epicenter with simProgress
    const ruptureRadius = 0.0012 + simProgress * 0.0032;

    return rawSensors.map((sensor, idx) => {
      // 1. Calculate GPS position
      let sensorPos: [number, number];
      if (sensor.lat !== undefined && sensor.lng !== undefined) {
        sensorPos = [sensor.lat, sensor.lng];
      } else {
        const offsetLat = (idx % 3 === 0 ? 0.003 : idx % 3 === 1 ? -0.002 : 0.001) * ((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 0.4);
        const offsetLng = (idx % 2 === 0 ? 0.0025 : -0.003) * ((idx + 1) * 0.35);
        sensorPos = [selectedZone.lat + offsetLat, selectedZone.lng + offsetLng];
      }

      let isAnomaly = false;
      let anomalyIntensity = 0;
      let liveReading = sensor.currentValue;

      // 2. Check interactive manual toggle
      if (manualAnomalies[sensor.id]) {
        isAnomaly = true;
        anomalyIntensity = 0.95;
        liveReading = sensor.criticalThreshold * 1.35;
      }
      // 3. Check Jharia emergency drill simulation progression
      else if (isDrillActive) {
        const distToSag = Math.hypot(sensorPos[0] - jhariaSagEpicenter[0], sensorPos[1] - jhariaSagEpicenter[1]);

        if (distToSag <= ruptureRadius) {
          isAnomaly = true;
          // Proximity factor: closest nodes get peak intensity (Yellow core)
          const proximity = Math.max(0, 1 - distToSag / ruptureRadius);
          anomalyIntensity = Math.min(1.0, 0.45 + proximity * 0.55 * Math.min(1.0, 0.3 + simProgress * 0.9));
          liveReading = sensor.currentValue * (1 + anomalyIntensity * 3.8);
        }
      }
      // 4. Default telemetry threshold check
      else if (sensor.status === 'critical' || sensor.currentValue > sensor.criticalThreshold) {
        isAnomaly = true;
        anomalyIntensity = 0.90;
      } else if (sensor.status === 'warning' || sensor.currentValue > sensor.warningThreshold) {
        isAnomaly = true;
        anomalyIntensity = 0.55;
      }

      return {
        sensor,
        position: sensorPos,
        isAnomaly,
        anomalyIntensity,
        liveReading,
      };
    });
  }, [rawSensors, isDrillActive, simProgress, selectedZone.lat, selectedZone.lng, manualAnomalies]);

  // Statistics for the legend HUD
  const redNodeCount = computedSensors.filter((s) => s.isAnomaly).length;
  const totalNodeCount = computedSensors.length;

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

  // Sensor node pin: standard blue vs. pulsating red on emergency anomaly
  const normalSensorIcon = L.divIcon({
    className: 'custom-sensor-pin',
    html: '<div style="background:#0ea5e9;width:14px;height:14px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const anomalySensorIcon = L.divIcon({
    className: 'custom-sensor-pin-anomaly',
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
             <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(239,68,68,0.6);animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></div>
             <div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 12px rgba(239,68,68,0.95);z-index:2;"></div>
           </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

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
            DGMS CMR-111 DRILL: {redNodeCount}/{totalNodeCount} NODES YIELDING ({Math.round(simProgress * 100)}%)
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

      {/* Floating InSAR Subsidence Heatmap Legend HUD */}
      {showHeatmap && (
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-xs font-mono pointer-events-auto max-w-xs select-none">
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${redNodeCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              Node-Driven Heatmap
            </span>
            <span className="text-[9px] text-slate-400 font-sans">KDE Spatial Field</span>
          </div>

          {/* Continuous Multi-Chromatic Gradient Bar */}
          <div className="mb-2">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-indigo-500 via-red-500 via-amber-500 to-yellow-300 shadow-inner" />
            <div className="flex justify-between text-[8px] text-slate-400 font-sans mt-0.5">
              <span>Boundary</span>
              <span>Fringe</span>
              <span>Sag</span>
              <span>Peak Core</span>
            </div>
          </div>

          {/* Active Heat Cause & Effect Status */}
          <div className="mb-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[9px] text-slate-500 dark:text-slate-400">Active Heat Sources:</span>
            <span className={`text-[10px] font-bold ${redNodeCount > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
              {redNodeCount > 0 ? `${redNodeCount} Red Nodes` : '0 (Nominal / Clear)'}
            </span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 ring-2 ring-yellow-400/50 shadow-sm" />
                <span className="text-slate-800 dark:text-slate-200 font-bold">Peak Hotspot Core</span>
              </div>
              <span className="text-yellow-500 dark:text-yellow-400 font-bold">&gt; 35 mm/yr</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Active Sag / Dilation</span>
              </div>
              <span className="text-orange-500 font-bold">25 - 35 mm/yr</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Moderate Shear Fringe</span>
              </div>
              <span className="text-red-500 font-bold">15 - 25 mm/yr</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Diffusion Boundary</span>
              </div>
              <span className="text-indigo-500 font-bold">5 - 15 mm/yr</span>
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

        {/* PURELY DYNAMIC NODE-DRIVEN HEATMAP LAYER (Underneath Markers) */}
        {showHeatmap && (
          <DynamicNodeHeatmapOverlay computedSensors={computedSensors} />
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
                <span className="text-safety-600 font-bold">{computedSensors.length} Active IoT Nodes</span>
                <span className={`font-bold ${isDrillActive ? 'text-red-600' : 'text-gray-700'}`}>
                  InSAR: {liveInSarRate} mm/yr
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* DYNAMIC SENSOR NODES (THE CAUSE) */}
        {computedSensors.map((item) => {
          const { sensor, position: sensorPos, isAnomaly, liveReading } = item;

          return (
            <Marker
              key={sensor.id}
              position={sensorPos}
              icon={isAnomaly ? anomalySensorIcon : normalSensorIcon}
            >
              <Popup>
                <div className="p-1.5 text-xs font-sans max-w-[230px]">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <strong className="text-gray-900 block text-xs truncate" title={sensor.name}>
                      {sensor.name}
                    </strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                      isAnomaly ? 'bg-red-100 text-red-700 font-mono' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isAnomaly ? 'ANOMALY (HEAT EMITTER)' : 'NOMINAL (CLEAR)'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between">
                    <span>{sensor.id}</span>
                    <span className="capitalize font-semibold">{sensor.domain}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 font-medium leading-tight">
                    {sensor.hardwareModel}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Depth: {sensor.depthMeters === 0 ? 'Surface (0m)' : `${sensor.depthMeters}m RL`} • {sensor.location}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Live Reading:</span>
                    <span className={`font-bold text-xs font-mono ${isAnomaly ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                      {liveReading.toFixed(2)} {sensor.unit}
                    </span>
                  </div>
                  {sensor.rawSignal && (
                    <div className="mt-1 text-[9px] font-mono text-gray-400 truncate" title={sensor.rawSignal}>
                      Raw: {sensor.rawSignal}
                    </div>
                  )}
                  <div className="mt-1 pt-1 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400 font-mono">
                    <span>Batt: {sensor.batteryPercent}%</span>
                    <span>Sig: {sensor.signalDbm}dBm</span>
                    <span>Hops: {sensor.zigbeeHops}</span>
                  </div>

                  {/* Interactive Cause & Effect Node Trigger */}
                  <div className="mt-2 pt-1.5 border-t border-gray-200">
                    <button
                      onClick={() => toggleNodeAnomaly(sensor.id)}
                      className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm ${
                        isAnomaly
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isAnomaly ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Resolve Anomaly (Clear Heat)</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-3 h-3" />
                          <span>Trigger Anomaly (Emit Heat)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
