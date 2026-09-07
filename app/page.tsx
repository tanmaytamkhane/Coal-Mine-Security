'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Activity,
  Box,
  MapPin,
  LineChart,
  BellRing,
  ExternalLink,
  ChevronRight,
  Play,
  RotateCcw,
  Cpu,
  Radio,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode, isSubsidenceSimActive, triggerSubsidenceEvent, resetSimulation } = useDashboardStore();

  const [selectedPanelTab, setSelectedPanelTab] = useState<'jharia' | 'raniganj' | 'singrauli'>('jharia');

  const panelData = [
    {
      id: 'jharia',
      name: 'Jharia Colliery — Panel XII-A',
      district: 'Dhanbad, Jharkhand',
      formation: 'Barakar Formation (Gondwana Basin)',
      depthRl: '248.0 m (RL -142.5m)',
      method: 'Bord & Pillar (Depillaring with Stowing)',
      sensorsActive: '16 Nodes / 100% Online',
      strataCondition: isSubsidenceSimActive ? 'CRITICAL STRAIN ACCELERATION' : 'NOMINAL STRATA EQUILIBRIUM',
      fos: isSubsidenceSimActive ? '0.88 (Yielding)' : '2.24 (Stable)',
      fosColor: isSubsidenceSimActive ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900' : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      statutoryCode: 'CMR-111 / SCAMP-JH-12A',
      status: isSubsidenceSimActive ? 'ACTION REQUIRED: FORM-IV EVACUATION' : 'NORMAL OPERATIONS',
      statusColor: isSubsidenceSimActive ? 'text-red-700 bg-red-100 border-red-300 dark:bg-red-900/60 dark:text-red-200' : 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200'
    },
    {
      id: 'raniganj',
      name: 'Raniganj Coalfield — Sripur Seam VII',
      district: 'Paschim Bardhaman, West Bengal',
      formation: 'Raniganj Series (Upper Permian)',
      depthRl: '184.5 m (RL -98.2m)',
      method: 'Room & Pillar Mechanical Extraction',
      sensorsActive: '12 Nodes / 100% Online',
      strataCondition: 'NOMINAL STABILITY',
      fos: '2.41 (Stable)',
      fosColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      statutoryCode: 'CMR-111 / SCAMP-RJ-07',
      status: 'NORMAL OPERATIONS',
      statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200'
    },
    {
      id: 'singrauli',
      name: 'Singrauli Basin — Jayant Panel C',
      district: 'Singrauli, Madhya Pradesh',
      formation: 'Moher Sub-basin Strata',
      depthRl: '132.0 m (RL -45.0m)',
      method: 'Continuous Miner Panel with Bolting',
      sensorsActive: '14 Nodes / 100% Online',
      strataCondition: 'NOMINAL STABILITY',
      fos: '2.65 (Stable)',
      fosColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      statutoryCode: 'CMR-111 / SCAMP-SN-03',
      status: 'NORMAL OPERATIONS',
      statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200'
    }
  ];

  const currentPanel = panelData.find(p => p.id === selectedPanelTab) || panelData[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150 selection:bg-[#e64a19] selection:text-white">
      
      {/* ─── OFFICIAL MINISTERIAL HERO & PORTAL MASTHEAD ──────────────────────── */}
      <header className="bg-white dark:bg-[#0f141f] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* National Crest & Portal Titles */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded bg-[#1b2537] dark:bg-[#162030] border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e64a19] dark:text-orange-400 font-mono">
                    DGMS Dhanbad • Central Command Portal
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    SIH26025
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  National Mine Strata Telemetry & Subsidence Early Warning System (NMS-SEWS)
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Statutory geotechnical telemetry, real-time strata control (SCAMP), and automated emergency evacuation protocol under Coal Mines Regulations (CMR) 2017, Regulations 111 & 112.
                </p>
              </div>
            </div>

            {/* Quick Access Controls */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#e64a19] hover:bg-[#d84315] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Activity className="w-4 h-4" />
                <span>Enter Control Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ─── STATUTORY DIRECTIVE / NOTICE BANNER ─────────────────────────────── */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono uppercase px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 text-[10px]">
              STATUTORY CIRCULAR
            </span>
            <span className="font-medium">
              DGMS (Tech) Circular No. 04 of 2026: Mandatory installation of continuous IoT convergence and subsidence telemetry in bord-and-pillar workings.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Compliance: 100% Verified</span>
            <Link href="/about" className="text-[#e64a19] dark:text-orange-400 font-bold hover:underline">
              View Gazette Norms →
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ─── NATIONAL KEY STATUTORY METRICS STRIP ───────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          
          <div className="p-4 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
              <span>Monitored Basins</span>
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">03</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Jharia • Raniganj • Singrauli</p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
              <span>Instrumented Seam</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">248.0 m</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Seam XII (RL -142.5m)</p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
              <span>Underground Crew</span>
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">42 Miners</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">RFID Telemetry Mesh Active</p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
              <span>Inference Core</span>
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">XGBoost 3.2</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">39 Geotechnical Features</p>
          </div>

          <div className="col-span-2 md:col-span-1 p-4 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
              <span>SCAMP Status</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">COMPLIANT</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">DGMS Standard Form-IV</p>
          </div>

        </section>

        {/* ─── STATUTORY OPERATIONAL MODULES (4 MAIN TIERS) ───────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Operational Monitoring & Emergency Control Modules
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Directorate modules for real-time telemetry, spatial analysis, and statutory alerts
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              REF: CMR-111(3)(b)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Module 1: Live Control Console */}
            <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    MODULE 01 • SCADA
                  </span>
                  <Activity className="w-4 h-4 text-[#e64a19]" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  Subterranean Telemetry Console
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Continuous live feeds of pillar micro-strain (µε), MEMS borehole tilt angle (deg), and high-frequency geophone vibration (mm/s).
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Sample Interval:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">1500 ms</span></div>
                  <div className="flex justify-between"><span>Telemetry Node:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">Zigbee Ex d I Mb</span></div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>Launch Telemetry Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Module 2: 3D Bord & Pillar Seam Model */}
            <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    MODULE 02 • 3D CAD
                  </span>
                  <Box className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  3D Bord & Pillar Seam Model
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Interactive Three.js spatial digital twin of 16 coal pillars in Seam XII, featuring dynamic roof sag deformation and raycast FoS inspection.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Seam Thickness:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">4.5 m (Seam XII)</span></div>
                  <div className="flex justify-between"><span>Strata Overburden:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">Barakar Sandstone</span></div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/model"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>Open 3D Seam Model</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Module 3: Coalfield Satellite InSAR GIS */}
            <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    MODULE 03 • SATELLITE
                  </span>
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  National Coalfield GIS Network
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Sentinel-1 C-band synthetic aperture radar interferometry tracking surface subsidence velocity contours, faults, and GPS stations.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Max Velocity:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">-48.2 mm/yr</span></div>
                  <div className="flex justify-between"><span>Radar Pass:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">Descending Track 12</span></div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/map"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>Open Coalfield GIS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Module 4: Form-IV Emergency Alerts */}
            <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    MODULE 04 • DGMS FORM-IV
                  </span>
                  <BellRing className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  Statutory Incident Register
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Automated statutory evacuation triggers under CMR Form-IV, siren relays, acoustic warning dispatch, and safety officer SMS logs.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Siren Interlock:</span><span className="text-emerald-600 font-semibold">ARMED & READY</span></div>
                  <div className="flex justify-between"><span>Dispatch Target:</span><span className="text-slate-900 dark:text-slate-200 font-semibold">Mining Sardar Radio</span></div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/alerts"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>View Incident Register</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ─── LIVE COLLIERY STATUS REGISTER (DATA TABLE) ─────────────────────── */}
        <section className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>Colliery Operational Status Register</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  CMR-2017 REGULATION 111 COMPLIANCE
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time geotechnical sensor telemetry and strata stability indicators across monitored extraction panels
              </p>
            </div>

            {/* Drill Simulation Trigger for Evaluators */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Statutory Drill:</span>
              {isSubsidenceSimActive ? (
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET DRILL (ACTIVE)</span>
                </button>
              ) : (
                <button
                  onClick={triggerSubsidenceEvent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e64a19] hover:bg-[#d84315] text-white text-xs font-bold font-mono transition-colors shadow-xs"
                  title="Simulates sudden strata convergence and pillar yielding for jury audit"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>TRIGGER CMR-111 DRILL</span>
                </button>
              )}
            </div>
          </div>

          {/* Panel Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedPanelTab('jharia')}
              className={`px-3 py-1.5 rounded transition-colors ${
                selectedPanelTab === 'jharia'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Jharia Colliery (Block IV)
            </button>
            <button
              onClick={() => setSelectedPanelTab('raniganj')}
              className={`px-3 py-1.5 rounded transition-colors ${
                selectedPanelTab === 'raniganj'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Raniganj (Sripur Seam VII)
            </button>
            <button
              onClick={() => setSelectedPanelTab('singrauli')}
              className={`px-3 py-1.5 rounded transition-colors ${
                selectedPanelTab === 'singrauli'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Singrauli Basin (Jayant)
            </button>
          </div>

          {/* Selected Panel Detail Card */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#131a29] border border-slate-200/80 dark:border-slate-800 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Colliery & Extraction Panel</p>
                <p className="font-bold text-slate-900 dark:text-slate-100 font-sans text-sm mt-0.5">{currentPanel.name}</p>
                <p className="text-[11px] text-slate-500">{currentPanel.district}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Geological Formation & Depth</p>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{currentPanel.depthRl}</p>
                <p className="text-[11px] text-slate-500 font-sans">{currentPanel.formation}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Factor of Safety (FoS Rating)</p>
                <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded border mt-0.5 ${currentPanel.fosColor}`}>
                  {currentPanel.fos}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-sans">Target FoS &gt; 1.80 under CMR-111</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Mining Method:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold font-sans">{currentPanel.method}</span>
              </div>
              <div>
                <span className="text-slate-400 block">IoT Sensor Fleet:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentPanel.sensorsActive}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Strata State:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{currentPanel.strataCondition}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Statutory Action:</span>
                <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded border ${currentPanel.statusColor}`}>
                  {currentPanel.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-500">
            <span>Statutory Reference: {currentPanel.statutoryCode}</span>
            <div className="flex items-center gap-3">
              <Link href="/trends" className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 font-sans">
                <LineChart className="w-3.5 h-3.5" />
                <span>View Historical Telemetry Log</span>
              </Link>
              <Link href="/dashboard" className="text-[#e64a19] dark:text-orange-400 font-bold hover:underline flex items-center gap-1 font-sans">
                <span>Open Live Dashboard →</span>
              </Link>
            </div>
          </div>

        </section>

        {/* ─── TECHNICAL & STATUTORY FRAMEWORK SECTION ──────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Coal Mines Regulations (CMR) 2017 Compliance
              </h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">Reg. 111:</span>
                <span>Strata Control and Monitoring Plan (SCAMP) mandates automated continuous measuring of roof convergence, bed separation, and rib pillar load in depillaring districts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">Reg. 112:</span>
                <span>Systematic support rules requiring minimum factor of safety (FoS &gt; 1.5 for development, FoS &gt; 1.8 for final extraction panels).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">IS/IEC 60079:</span>
                <span>All subterranean wireless transceivers and strain loggers certified intrinsically safe (Ex ia I Mb) for gassy coal mines.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-lg bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#e64a19]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Certified AI Early Warning Engine (XGBoost 3.2.0)
              </h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">Multi-Softprob:</span>
                <span>400 gradient boosted decision trees evaluating 39 multivariate input features in 2 milliseconds on edge hardware.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">Primary Drivers:</span>
                <span>Strata depth z (43.3%), 6-hour rolling convergence standard deviation (24.1%), crack width expansion (16.4%), and seismic RMS velocity (5.5%).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold font-mono text-slate-900 dark:text-slate-200 shrink-0">Fault Tolerance:</span>
                <span>Statutory edge fail-safe fallback triggers local acoustic siren even upon communication telemetry disruption.</span>
              </li>
            </ul>
          </div>

        </section>

      </main>

      {/* ─── OFFICIAL GOVERNMENT PORTAL FOOTER ───────────────────────────────── */}
      <footer className="mt-12 bg-white dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>DGMS • NMS-SEWS</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Directorate General of Mines Safety<br />
                Headquarters: Dhanbad, Jharkhand — 826001<br />
                Ministry of Coal, Government of India
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200 mb-2 uppercase text-[11px] font-mono">Operational Portals</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/dashboard" className="hover:text-[#e64a19] transition-colors">Subterranean Telemetry Console</Link></li>
                <li><Link href="/model" className="hover:text-[#e64a19] transition-colors">3D Bord & Pillar Seam Model</Link></li>
                <li><Link href="/map" className="hover:text-[#e64a19] transition-colors">National Coalfield Satellite GIS</Link></li>
                <li><Link href="/trends" className="hover:text-[#e64a19] transition-colors">Strata Telemetry Trends & Analytics</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200 mb-2 uppercase text-[11px] font-mono">Statutory Acts & Norms</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/about" className="hover:text-[#e64a19] transition-colors">Coal Mines Regulations (CMR) 2017</Link></li>
                <li><Link href="/alerts" className="hover:text-[#e64a19] transition-colors">DGMS Technical Form-IV Protocol</Link></li>
                <li><span className="text-slate-400">Mines Act, 1952 (Section 22A)</span></li>
                <li><span className="text-slate-400">CMPDI Strata Telemetry Guidelines</span></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200 mb-2 uppercase text-[11px] font-mono">System Audit Information</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                Portal Release: v2.4.1 (SIH26025)<br />
                Edge Gateway: 127.0.0.1:8000<br />
                Model Engine: XGBoost 3.2.0<br />
                National Server: NIC-DGMS-04<br />
                Status: OPERATIONAL (CMR-111)
              </p>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <p>© 2026 Directorate General of Mines Safety (DGMS), Ministry of Coal, Govt. of India. All rights reserved.</p>
            <p>Smart India Hackathon 2026 • Problem Statement SIH26025</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
