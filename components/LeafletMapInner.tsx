'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoalfieldZone } from '../types';
import { getSensorsForCoalfield } from '../lib/constants';
import { useDashboardStore } from '../lib/store';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface LeafletMapInnerProps {
  selectedZone: CoalfieldZone;
  showHeatmap?: boolean;
}

interface PlumePoint {
  lat: number;
  lng: number;
  radius: number;
  intensity: number;
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
  grad.addColorStop(0.14, 'rgba(79, 70, 229, 0)');         // zero-edge falloff
  grad.addColorStop(0.28, 'rgba(99, 102, 241, 0.42)');     // soft indigo / lavender-blue haze
  grad.addColorStop(0.42, 'rgba(129, 140, 248, 0.58)');    // periwinkle transition
  grad.addColorStop(0.58, 'rgba(239, 68, 68, 0.78)');      // saturated crimson / ruby red
  grad.addColorStop(0.74, 'rgba(249, 115, 22, 0.88)');     // radiant warm amber / orange
  grad.addColorStop(0.90, 'rgba(250, 204, 21, 0.95)');     // hot gold
  grad.addColorStop(1.00, 'rgba(254, 240, 138, 0.98)');    // incandescent yellow-white core

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1, 256);
  cachedPalette = ctx.getImageData(0, 0, 1, 256).data;
  return cachedPalette;
}

// ---------------------------------------------------------------------------
// 2. Geological Deformation Plumes (Freeform Amorphous Hazard Lobes)
// ---------------------------------------------------------------------------
function getPlumePointsForZone(
  zoneId: string,
  isDrillActive: boolean,
  simProgress: number
): PlumePoint[] {
  switch (zoneId) {
    case 'raniganj-sector-2':
      // Raniganj Sector 2: Dishergarh Fault Ribbon + Sitarampur Lobe + Damodar Levee Buffer
      return [
        // Main Dishergarh Extraction Strike Corridor (Curvilinear WNW to ESE)
        { lat: 23.6235, lng: 86.9650, radius: 65, intensity: 0.65 },
        { lat: 23.6220, lng: 86.9678, radius: 72, intensity: 0.78 },
        { lat: 23.6205, lng: 86.9705, radius: 85, intensity: 0.92 }, // Peak Hotspot Core (Yellow)
        { lat: 23.6192, lng: 86.9725, radius: 90, intensity: 0.95 }, // Peak Hotspot Core (Yellow)
        { lat: 23.6182, lng: 86.9750, radius: 80, intensity: 0.84 },
        { lat: 23.6170, lng: 86.9775, radius: 70, intensity: 0.72 },
        { lat: 23.6155, lng: 86.9800, radius: 60, intensity: 0.60 },

        // Sitarampur Overburden Extraction Sag Lobe (North-West Bulge)
        { lat: 23.6255, lng: 86.9715, radius: 68, intensity: 0.80 },
        { lat: 23.6268, lng: 86.9738, radius: 60, intensity: 0.70 },
        { lat: 23.6242, lng: 86.9688, radius: 55, intensity: 0.62 },

        // Damodar River Alluvial Embankment Buffer (South-West Amorphous Kidney Lobe)
        { lat: 23.6135, lng: 86.9700, radius: 65, intensity: 0.68 },
        { lat: 23.6118, lng: 86.9730, radius: 72, intensity: 0.76 },
        { lat: 23.6102, lng: 86.9755, radius: 60, intensity: 0.62 },
        { lat: 23.6142, lng: 86.9760, radius: 55, intensity: 0.66 },
      ];

    case 'karanpura-block-1':
      // North Karanpura Karharbari Synclinal Basin (Irregular Elongated Ribbon)
      return [
        { lat: 23.8550, lng: 85.2810, radius: 60, intensity: 0.62 },
        { lat: 23.8532, lng: 85.2835, radius: 75, intensity: 0.85 },
        { lat: 23.8515, lng: 85.2858, radius: 82, intensity: 0.90 },
        { lat: 23.8495, lng: 85.2878, radius: 70, intensity: 0.78 },
        { lat: 23.8480, lng: 85.2895, radius: 58, intensity: 0.60 },
        { lat: 23.8525, lng: 85.2790, radius: 55, intensity: 0.58 },
        { lat: 23.8500, lng: 85.2830, radius: 65, intensity: 0.72 },
      ];

    case 'korba-secl':
      // Korba / Kusmunda Pit & Hasdeo River Fault Lineament (Amorphous Crescent)
      return [
        { lat: 22.3635, lng: 82.7460, radius: 65, intensity: 0.66 },
        { lat: 22.3615, lng: 82.7485, radius: 78, intensity: 0.86 },
        { lat: 22.3595, lng: 82.7510, radius: 85, intensity: 0.92 },
        { lat: 22.3575, lng: 82.7535, radius: 72, intensity: 0.78 },
        { lat: 22.3555, lng: 82.7550, radius: 60, intensity: 0.62 },
        { lat: 22.3645, lng: 82.7505, radius: 58, intensity: 0.60 },
        { lat: 22.3580, lng: 82.7475, radius: 62, intensity: 0.68 },
      ];

    case 'jharia-block-4':
    default: {
      // Jharia Block IV (Primary Focus): Seam XII Extraction Corridor + Sag Trough
      const sagRadiusBonus = isDrillActive ? simProgress * 55 : 0;
      const sagIntensityBonus = isDrillActive ? simProgress * 0.25 : 0;

      const basePlumes: PlumePoint[] = [
        // Seam XII Curvilinear Strike Belt (NW to SE)
        { lat: 23.7455, lng: 86.4145, radius: 60 + sagRadiusBonus * 0.4, intensity: Math.min(1, 0.62 + sagIntensityBonus * 0.5) },
        { lat: 23.7445, lng: 86.4160, radius: 75 + sagRadiusBonus * 0.7, intensity: Math.min(1, 0.80 + sagIntensityBonus * 0.7) },
        // P-06 / P-10 Critical Depillaring Sag Trough (Hotspot Core)
        { lat: 23.7438, lng: 86.4172, radius: 90 + sagRadiusBonus, intensity: Math.min(1, 0.94 + sagIntensityBonus) },
        { lat: 23.7432, lng: 86.4185, radius: 95 + sagRadiusBonus, intensity: Math.min(1, 0.98 + sagIntensityBonus) },
        { lat: 23.7425, lng: 86.4198, radius: 85 + sagRadiusBonus * 0.8, intensity: Math.min(1, 0.88 + sagIntensityBonus * 0.8) },
        { lat: 23.7415, lng: 86.4215, radius: 72 + sagRadiusBonus * 0.5, intensity: Math.min(1, 0.74 + sagIntensityBonus * 0.6) },
        { lat: 23.7405, lng: 86.4230, radius: 60 + sagRadiusBonus * 0.3, intensity: Math.min(1, 0.60 + sagIntensityBonus * 0.4) },

        // East Flank Abutment Shear Horizon
        { lat: 23.7418, lng: 86.4225, radius: 68, intensity: 0.70 },
        { lat: 23.7402, lng: 86.4245, radius: 55, intensity: 0.58 },

        // North Goaf Tension Lobe
        { lat: 23.7460, lng: 86.4168, radius: 62, intensity: 0.66 },
        { lat: 23.7450, lng: 86.4185, radius: 68, intensity: 0.72 },
      ];

      // Dynamic drill bloom: peripheral micro-yield lobes erupt outward
      if (isDrillActive && simProgress > 0.1) {
        basePlumes.push(
          { lat: 23.7446, lng: 86.4160, radius: 55 + simProgress * 40, intensity: 0.85 * simProgress },
          { lat: 23.7428, lng: 86.4158, radius: 60 + simProgress * 45, intensity: 0.90 * simProgress },
          { lat: 23.7442, lng: 86.4192, radius: 55 + simProgress * 40, intensity: 0.85 * simProgress },
          { lat: 23.7420, lng: 86.4170, radius: 65 + simProgress * 50, intensity: 0.95 * simProgress }
        );
      }

      return basePlumes;
    }
  }
}

// ---------------------------------------------------------------------------
// 3. HTML5 Canvas Organic Heatmap Layer Component (Underneath Markers)
// ---------------------------------------------------------------------------
function OrganicHeatmapOverlay({
  selectedZone,
  isDrillActive,
  simProgress,
}: {
  selectedZone: CoalfieldZone;
  isDrillActive: boolean;
  simProgress: number;
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
    canvas.style.filter = 'blur(1.5px)'; // Soft organic blurring
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

      // Geographic zoom scale factor (centered at standard zoom 14)
      const currentZoom = map.getZoom();
      const zoomScale = Math.max(0.4, Math.min(3.0, Math.pow(2, currentZoom - 14)));

      // Fetch plumes for current coalfield
      const plumes = getPlumePointsForZone(selectedZone.id, isDrillActive, simProgress);

      // Pass 1: Accumulate Gaussian-like alpha density on offscreen canvas
      for (let i = 0; i < plumes.length; i++) {
        const p = plumes[i];
        const pt = map.latLngToContainerPoint([p.lat, p.lng]);
        const r = p.radius * zoomScale;

        // Skip points outside visible viewport with padding
        if (pt.x < -r || pt.x > size.x + r || pt.y < -r || pt.y > size.y + r) {
          continue;
        }

        const radGrad = sctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
        radGrad.addColorStop(0, `rgba(0, 0, 0, ${p.intensity})`);
        radGrad.addColorStop(0.35, `rgba(0, 0, 0, ${p.intensity * 0.72})`);
        radGrad.addColorStop(0.70, `rgba(0, 0, 0, ${p.intensity * 0.28})`);
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
  }, [map, selectedZone, isDrillActive, simProgress]);

  return null;
}

// ---------------------------------------------------------------------------
// 4. Map View Centering Helper
// ---------------------------------------------------------------------------
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

// ---------------------------------------------------------------------------
// 5. Main Leaflet Component Export
// ---------------------------------------------------------------------------
export default function LeafletMapInner({ selectedZone, showHeatmap = true }: LeafletMapInnerProps) {
  const position: [number, number] = [selectedZone.lat, selectedZone.lng];
  const { isSubsidenceSimActive, simProgress, resetSimulation } = useDashboardStore();

  const isJharia = selectedZone.id === 'jharia-block-4';
  const isDrillActive = isSubsidenceSimActive && isJharia;

  // Retrieve dedicated sensor fleet for the selected coalfield
  const sensors = getSensorsForCoalfield(selectedZone.id);

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

  // Sensor node pin: standard blue vs. pulsing red on emergency anomaly
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

  // Hotspot coords for Jharia sag epicenter
  const jhariaSagEpicenter: [number, number] = [selectedZone.lat + 0.0015, selectedZone.lng - 0.0018];

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

      {/* Floating InSAR Subsidence Heatmap Legend HUD */}
      {showHeatmap && (
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-xs font-mono pointer-events-auto max-w-xs select-none">
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-[10px] text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Organic InSAR Heatmap
            </span>
            <span className="text-[9px] text-slate-400 font-sans">Sentinel-1 SBAS</span>
          </div>

          {/* Continuous Multi-Chromatic Gradient Bar */}
          <div className="mb-2">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-indigo-500 via-red-500 via-amber-500 to-yellow-300 shadow-inner" />
            <div className="flex justify-between text-[8px] text-slate-400 font-sans mt-0.5">
              <span>5 mm/yr</span>
              <span>18 mm/yr</span>
              <span>28 mm/yr</span>
              <span>&gt;38 mm/yr</span>
            </div>
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

        {/* ORGANIC DENSITY HEATMAP LAYER (Underneath Markers) */}
        {showHeatmap && (
          <OrganicHeatmapOverlay
            selectedZone={selectedZone}
            isDrillActive={isDrillActive}
            simProgress={simProgress}
          />
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
                <span className="text-safety-600 font-bold">{sensors.length} Active IoT Nodes</span>
                <span className={`font-bold ${isDrillActive ? 'text-red-600' : 'text-gray-700'}`}>
                  InSAR: {liveInSarRate} mm/yr
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* DEDICATED SENSOR NODES FOR SELECTED COALFIELD */}
        {sensors.map((sensor, idx) => {
          let sensorPos: [number, number];

          if (sensor.lat !== undefined && sensor.lng !== undefined) {
            sensorPos = [sensor.lat, sensor.lng];
          } else {
            const offsetLat = (idx % 3 === 0 ? 0.003 : idx % 3 === 1 ? -0.002 : 0.001) * ((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 0.4);
            const offsetLng = (idx % 2 === 0 ? 0.0025 : -0.003) * ((idx + 1) * 0.35);
            sensorPos = [selectedZone.lat + offsetLat, selectedZone.lng + offsetLng];
          }

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
                <div className="p-1.5 text-xs font-sans max-w-[230px]">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <strong className="text-gray-900 block text-xs truncate" title={sensor.name}>
                      {sensor.name}
                    </strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                      isAnomalyNode ? 'bg-red-100 text-red-700 font-mono' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isAnomalyNode ? 'ANOMALY' : 'NOMINAL'}
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
                    <span className={`font-bold text-xs font-mono ${isAnomalyNode ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                      {isAnomalyNode ? (sensor.currentValue * 3.5).toFixed(2) : sensor.currentValue} {sensor.unit}
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
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
