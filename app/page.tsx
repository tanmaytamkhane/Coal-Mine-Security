'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HardHat,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Activity,
  Box,
  Layers,
  Radio,
  Compass,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode } = useDashboardStore();
  
  // Interactive UI Layering state for hero showcase
  const [activeLayer, setActiveLayer] = useState<number>(2); // 0: Surface, 1: Overburden, 2: Seam XII, 3: AI Engine
  const [demoState, setDemoState] = useState<'nominal' | 'critical'>('nominal');

  const layersData = [
    {
      id: 0,
      title: 'Layer 01 • Surface & Sentinel-1 InSAR',
      depth: '0m Elevation',
      badge: 'Satellite Radar Interferometry',
      stat: demoState === 'nominal' ? '-2.4 mm/yr' : '-48.2 mm/yr',
      statLabel: 'Subsidence Trough Velocity',
      desc: 'Orbital ESA Sentinel-1 C-band synthetic aperture radar tracking surface contour deformation and sinkhole development over longwall panels.',
      chips: ['Sentinel-1 SAR', '12-Day Revisit', 'Phase Dilation', 'GPS Benchmark']
    },
    {
      id: 1,
      title: 'Layer 02 • Overburden Strata Formation',
      depth: '120m Sub-surface',
      badge: 'Barakar Sandstone & Carbonaceous Shale',
      stat: demoState === 'nominal' ? '18.4 Hz' : '182.6 Hz',
      statLabel: 'Micro-Seismic Acoustic Emission',
      desc: 'Geotechnical strata mass monitoring bedding plane separation, shear stress fracturing, and groundwater pore-pressure dynamics.',
      chips: ['Rock Mass Rating 68', 'Shear Acoustic Sensors', 'Extensometers', 'Pore Pressure']
    },
    {
      id: 2,
      title: 'Layer 03 • Seam XII Room-and-Pillar Grid',
      depth: '248m Extraction Seam',
      badge: 'Bord & Pillar Working Panel',
      stat: demoState === 'nominal' ? 'FoS 2.24 (Stable)' : 'FoS 0.88 (Yielding)',
      statLabel: 'Pillar Factor of Safety',
      desc: '16 instrumented coal pillars with fiber-optic strain gauges and MEMS tiltmeters transmitting over intrinsically safe flameproof Zigbee mesh.',
      chips: ['16 Coal Pillars', 'MEMS Tiltmeters', 'Strain Gauges (µε)', '42 Miners Active']
    },
    {
      id: 3,
      title: 'Layer 04 • Edge XGBoost AI & DGMS Engine',
      depth: 'Edge IoT Gateway',
      badge: '39-Feature Subsidence Inference',
      stat: demoState === 'nominal' ? '18% Risk (Nominal)' : '92% Risk (Critical Alert)',
      statLabel: 'Calibrated Collapse Probability',
      desc: 'Sub-millisecond inference engine analyzing strata drift, convergence standard deviations, and acoustic tremor signatures with automated DGMS sirens.',
      chips: ['XGBoost 3.2.0', '2ms Latency', 'DGMS Form-IV Siren', 'Auto Evacuation']
    }
  ];

  return (
    <div className="min-h-screen bg-mine-bg dark:bg-mine-bg-dark text-gray-900 dark:text-slate-100 transition-colors duration-200 selection:bg-safety-500 selection:text-white">
      
      {/* ─── FLOATING LAYERED NAVBAR ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-[#0b0f19]/80 border-b border-gray-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safety-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-safety-500/30 group-hover:scale-105 transition-transform">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-gray-900 dark:text-white text-base tracking-tight">
                  TASQ Coal
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-safety-500/10 text-safety-600 dark:text-safety-400 border border-safety-500/20">
                    SIH26025
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Underground Strata AI Twin</p>
              </div>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-slate-300">
            <a href="#layering" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors">
              UI Layering
            </a>
            <a href="#architecture" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors">
              4-Tier Architecture
            </a>
            <a href="#features" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors">
              Features
            </a>
            <Link href="/model" className="px-3 py-1.5 rounded-lg text-safety-600 dark:text-safety-400 font-bold hover:bg-safety-500/10 transition-colors flex items-center gap-1">
              <Box className="w-3.5 h-3.5" />
              3D Mine Model
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Live Model Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>XGBoost 3.2.0 Active</span>
            </div>

            {/* Dark Mode Switch */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/60 text-gray-600 dark:text-slate-300 hover:text-safety-500 dark:hover:text-safety-400 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Launch Console CTA */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-safety-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-safety-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Live Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION WITH DEEP UI LAYERING ────────────────────────────── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Orange & Amber Glow Layers */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-safety-500/15 via-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-10 w-96 h-96 bg-safety-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-500/10 dark:bg-safety-500/15 border border-safety-500/30 text-safety-600 dark:text-safety-400 text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • SIH26025 • DGMS CMR-111 Standard</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.15]">
              Real-Time AI Strata Twin & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-safety-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Underground Mine Subsidence
              </span> Early Warning
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Protecting underground colliery personnel with millisecond-grade IoT telemetry, 
              a 39-feature trained XGBoost inference engine, and a 3D procedural room-and-pillar digital twin.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-safety-500 to-orange-600 text-white font-bold text-sm shadow-xl shadow-safety-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Launch Safety Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/model"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-300 dark:border-slate-800 text-gray-800 dark:text-white font-bold text-sm shadow-sm hover:border-safety-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                <Box className="w-4 h-4 text-safety-500" />
                <span>Explore 3D Mine Model</span>
              </Link>
            </div>
          </div>

          {/* ─── CORE UI LAYERING SHOWCASE WIDGET ──────────────────────────── */}
          <div id="layering" className="mt-14 max-w-5xl mx-auto">
            
            {/* Widget Container with Multi-Level Glassmorphism */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-[#111726]/80 backdrop-blur-2xl border border-gray-200/90 dark:border-slate-800/90 shadow-2xl shadow-orange-500/5 transition-all">
              
              {/* Header inside widget */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-safety-500 animate-ping" />
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight">
                      Spatial UI Layering • Geological & Digital Twin Stack
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Click any layer below to inspect subterranean strata mechanics and sensor telemetry
                  </p>
                </div>

                {/* Live Failure Simulation Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Simulation:</span>
                  <button
                    onClick={() => setDemoState(demoState === 'nominal' ? 'critical' : 'nominal')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      demoState === 'critical'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-safety-500/10 hover:text-safety-600'
                    }`}
                  >
                    {demoState === 'critical' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Strata Failure Triggered</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-safety-500" />
                        <span>Test Strata Failure</span>
                      </>
                    )}
                  </button>
                  {demoState === 'critical' && (
                    <button
                      onClick={() => setDemoState('nominal')}
                      className="p-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      title="Reset Demo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3D Stack of UI Layers */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left: Layer Selector Stack (Visual Layering with Z-Index & Elevation) */}
                <div className="lg:col-span-5 space-y-3">
                  {layersData.map((layer) => {
                    const isSelected = activeLayer === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 select-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-safety-500/10 via-orange-500/5 to-transparent border-safety-500 shadow-md shadow-safety-500/15 scale-[1.02] translate-x-1'
                            : 'bg-gray-50/70 dark:bg-slate-900/50 border-gray-200/80 dark:border-slate-800/80 hover:border-gray-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {/* Layer Indicator Dot */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-safety-500 ring-4 ring-safety-500/20' : 'bg-gray-400 dark:bg-slate-600'
                            }`} />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {layer.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                            {layer.depth}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-slate-400 font-medium">
                            {layer.badge}
                          </span>
                          <span className={`font-bold ${
                            demoState === 'critical' ? 'text-red-500' : 'text-safety-600 dark:text-safety-400'
                          }`}>
                            {layer.stat}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Focused Layer Hologram & Real-Time Card Overlay */}
                <div className="lg:col-span-7">
                  <div className="relative rounded-2xl p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-[#0d1322] dark:to-[#111726] border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[340px] flex flex-col justify-between">
                    
                    {/* Top Ambient Glow based on demo state */}
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-0 transition-colors duration-500 ${
                      demoState === 'critical' ? 'bg-red-500/20' : 'bg-safety-500/15'
                    }`} />

                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-safety-600 dark:text-safety-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Inspecting {layersData[activeLayer].depth}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          demoState === 'critical'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}>
                          {demoState === 'critical' ? 'DGMS ALERT TRIGGERED' : 'STATUS NOMINAL'}
                        </span>
                      </div>

                      {/* Layer Title & Main Metric */}
                      <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3">
                        {layersData[activeLayer].title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {layersData[activeLayer].desc}
                      </p>

                      {/* Layer Metric Card */}
                      <div className="mt-5 p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-gray-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">
                            {layersData[activeLayer].statLabel}
                          </p>
                          <p className={`text-xl font-black mt-0.5 ${
                            demoState === 'critical' ? 'text-red-500' : 'text-safety-600 dark:text-safety-400'
                          }`}>
                            {layersData[activeLayer].stat}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">Sampling Interval</p>
                          <p className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-0.5">1.5s Zigbee Pulse</p>
                        </div>
                      </div>

                      {/* Sensor Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {layersData[activeLayer].chips.map((chip, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60 text-gray-700 dark:text-slate-300"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Launch Links */}
                    <div className="mt-6 pt-4 border-t border-gray-200/70 dark:border-slate-800/70 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 dark:text-slate-400">
                        DGMS CMR-111 Compliant
                      </span>
                      <Link
                        href="/dashboard"
                        className="text-xs font-bold text-safety-600 dark:text-safety-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Live Console Stream</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── STATS TICKER STRIP ────────────────────────────────────────────── */}
      <section className="border-y border-gray-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#0e1424]/50 backdrop-blur-sm py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-safety-500 tracking-tight">248m</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Seam XII Depth Monitored
            </p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">39</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              XGBoost ML Input Features
            </p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-emerald-500 tracking-tight">~2ms</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Real-Time Inference Latency
            </p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">100%</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              DGMS CMR-111 Compliant
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4-TIER TECHNICAL ARCHITECTURE ─────────────────────────────────── */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-safety-600 dark:text-safety-400">
            System Mechanics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            The 4 Pillars of the TASQ Coal Twin
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
            Engineered to overcome delayed subsidence hazard detection through synchronous underground sensing, 
            machine learning prediction, and spatial digital modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 shadow-sm hover:border-safety-500/50 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-safety-500/10 text-safety-500 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Subterranean IoT Mesh</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              Precision MEMS tiltmeters, vibrating wire extensometers, and seismic geophones measuring micro-strain and dilation rate across rib pillars.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] font-semibold text-safety-600 dark:text-safety-400 flex items-center gap-1">
              <span>Wireless Zigbee & LoRaWAN</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 shadow-sm hover:border-safety-500/50 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Sentinel-1 InSAR Satellite</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              C-band synthetic aperture radar interferometry calculating macro-surface deformation velocity contours and trough angle of draw.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>Millimeter-level Surface Shift</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 shadow-sm hover:border-safety-500/50 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">XGBoost Early Warning</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              Trained 39-feature multi:softprob classifier evaluating convergence rolling deviations, shear stress, and strata depth to forecast roof yields.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>2ms FastAPI Inference Engine</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#111726] border border-gray-200/80 dark:border-slate-800 shadow-sm hover:border-safety-500/50 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">DGMS Siren & 3D Spatial Twin</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              Sub-second evacuation alarm activation conforming to DGMS Form-IV, with real-time 3D roof sag deformation and raycast pillar inspection.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>Automated Siren Protocol</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── BENTO GRID FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-safety-600 dark:text-safety-400">
            Engineered for SIH26025
          </span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Comprehensive Mine Safety Suite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Item 1: 3D Visualizer */}
          <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-[#111726] dark:to-[#0d1322] border border-gray-200/90 dark:border-slate-800/90 shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 border border-safety-500/20">
                  Three.js WebGL Digital Twin
                </span>
                <Box className="w-5 h-5 text-safety-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-4">
                Interactive 3D Coal Mine & Pillar Gallery
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed max-w-xl">
                16 procedurally textured anthracite coal pillars, haulage rail tracks, wooden sleepers, TH-yield steel arches, ventilation ducts, and a dynamic roof mesh that deforms in real time during subsidence events.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200/80 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Raycast click to inspect FoS & stress load</span>
              <Link
                href="/model"
                className="flex items-center gap-1 text-xs font-bold text-safety-600 dark:text-safety-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Launch 3D Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 2: Explainable AI */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#111726] border border-gray-200/90 dark:border-slate-800/90 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  XAI Transparency
                </span>
                <Cpu className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-4">
                Explainable AI (XAI)
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                Breakdown of top XGBoost decision factors: Strata Depth (43.3%), Convergence Std (24.1%), Crack Width Expansion (16.4%), and Seismic Vibration (5.5%).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Link
                href="/dashboard"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <span>Inspect on Risk Card →</span>
              </Link>
            </div>
          </div>

          {/* Bento Item 3: Hardware Ingestion Ready */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#111726] border border-gray-200/90 dark:border-slate-800/90 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Edge Ready
                </span>
                <Radio className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-4">
                Live Hardware Bridge
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                Plug-and-play HTTP POST ingestion for ESP32/WiFi or PySerial USB COM bridge for Arduino. Real physical sensor taps instantly update the 3D twin.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">ESP32 • Arduino • LoRa</span>
            </div>
          </div>

          {/* Bento Item 4: Coalfield GIS Map */}
          <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-[#111726] dark:to-[#0d1322] border border-gray-200/90 dark:border-slate-800/90 shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Geospatial GIS
                </span>
                <Compass className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-4">
                Interactive Coalfield GIS & InSAR Overburden Map
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed max-w-xl">
                Real-time Leaflet satellite mapping tracking Jharia Colliery (Block IV), Raniganj Coalfield, and Singrauli with tectonic fault lines and active sensor nodes.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200/80 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Jharia, Raniganj, Singrauli Basins</span>
              <Link
                href="/map"
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
              >
                <span>View Coalfield Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-safety-500 via-orange-600 to-amber-600 text-white shadow-2xl shadow-safety-500/30 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for Hackathon Jury Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Experience the Future of Subsurface Mine Safety
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Zero-latency strata simulation, direct XGBoost ML inference, and 3D room-and-pillar deformation modeling in one unified portal.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-2xl bg-white text-safety-600 font-black text-sm shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Open Safety Dashboard
            </Link>
            <Link
              href="/model"
              className="px-6 py-3 rounded-2xl bg-black/30 border border-white/30 text-white font-bold text-sm hover:bg-black/40 transition-all"
            >
              Inspect 3D Mine Scene
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-safety-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-gray-900 dark:text-white">TASQ Coal • SIH26025</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">DGMS Mine Safety & Subsidence Early Warning Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:text-safety-500 transition-colors">Safety Console</Link>
            <Link href="/model" className="hover:text-safety-500 transition-colors">3D Model</Link>
            <Link href="/map" className="hover:text-safety-500 transition-colors">Coalfield Map</Link>
            <Link href="/about" className="hover:text-safety-500 transition-colors">DGMS Protocol</Link>
          </div>

          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            Smart India Hackathon 2026 • Ministry of Coal
          </p>
        </div>
      </footer>

    </div>
  );
}
