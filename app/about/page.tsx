'use client';

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Radio,
  Satellite,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-safety-50 dark:bg-safety-950/60 text-safety-600 dark:text-safety-400 border border-safety-200 dark:border-safety-800">
            SIH26025 Specification
          </span>
          <span className="text-xs text-gray-500">DGMS & CMPDI Framework</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tracking-tight">
          Underground Coal Mine Subsidence Monitoring System
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 max-w-3xl">
          An AI-driven continuous early-warning system developed for Smart India Hackathon (SIH26025), fusing underground IoT sensor arrays with surface satellite InSAR radar and geotechnical physics models to predict mine roof collapse and strata subsidence.
        </p>
      </div>

      {/* 4 Pillars of Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Sensor Array */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-safety-500/10 text-safety-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Underground IoT Sensor Suite</h3>
              <p className="text-xs text-gray-500">Sub-surface galleried instrumentation</p>
            </div>
          </div>
          <ul className="text-xs text-gray-600 dark:text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-safety-500 shrink-0 mt-0.5" />
              <span><strong>MEMS Tiltmeters:</strong> High-precision bi-axial roof inclination tracking (°), sensitive to differential strata tilt.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-safety-500 shrink-0 mt-0.5" />
              <span><strong>Strain Gauges:</strong> Vibrating wire embedded sensors monitoring internal pillar stress and microstrain (µε).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-safety-500 shrink-0 mt-0.5" />
              <span><strong>Tri-axial Geophones:</strong> Micro-seismic vibration velocity (mm/s PPV) to detect pre-cursor rock fracturing.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Hybrid Physics-ML */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Hybrid Physics-ML Predictive Core</h3>
              <p className="text-xs text-gray-500">Proactive forecasting vs reactive detection</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mb-3">
            Rather than simply triggering threshold alarms after roof deformation has commenced, our AI model incorporates rock mass rating (RMR), overburden depth, and Bieniawski pillar strength equations with real-time sensor time-series to estimate time-to-yield.
          </p>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 font-mono text-[11px] text-gray-700 dark:text-slate-300 border border-gray-200/60 dark:border-slate-800">
            Risk_Score = f(FoS_Bieniawski, ΔStrain_LSTM, Tilt_Velocity, InSAR_Displacement)
          </div>
        </div>

        {/* Card 3: Dual-Tier Networking */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Zigbee Mesh & LoRa Backhaul</h3>
              <p className="text-xs text-gray-500">Underground telemetry without cabling vulnerabilities</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
            Sensor clusters communicate through an underground self-healing <strong>Zigbee (802.15.4)</strong> mesh network across rooms and pillars. A flameproof drift gateway packages packets and transmits via long-range <strong>LoRa (865 MHz)</strong> through the shaft to the surface monitoring station.
          </p>
        </div>

        {/* Card 4: Satellite Layer */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Sentinel-1 SBAS-InSAR Layer</h3>
              <p className="text-xs text-gray-500">Spaceborne surface subsidence correlation</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
            Integrates C-band synthetic aperture radar (SAR) interferometry from ESA Copernicus Sentinel-1. Surface velocity maps (-14.2 mm/yr over Jharia Block IV) correlate surface depression troughs with active underground depillaring zones.
          </p>
        </div>
      </div>

      {/* Statutory Guidelines Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/5 via-safety-500/5 to-amber-500/5 border border-safety-500/20">
        <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 dark:text-white text-sm">
          <ShieldCheck className="w-4 h-4 text-safety-500" />
          <span>Statutory Compliance & Regulatory Bodies</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
          Complies with the statutory guidelines laid down by the <strong>Directorate General of Mines Safety (DGMS)</strong> under the Coal Mines Regulations (CMR-111, CMR-112) for strata control and monitoring. Geotechnical parameters referenced from <strong>Central Mine Planning and Design Institute (CMPDI)</strong> standards for room-and-pillar mining operations.
        </p>
      </div>
    </div>
  );
}
