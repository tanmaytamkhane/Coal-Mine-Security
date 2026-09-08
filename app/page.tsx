'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BellRing,
  Box,
  Building2,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Gauge,
  Layers3,
  MapPin,
  Moon,
  Play,
  Radio,
  RotateCcw,
  Satellite,
  ShieldCheck,
  Sun,
  Timer,
  TriangleAlert,
  Waves,
} from 'lucide-react';
import { useDashboardStore } from '../lib/store';
import { Footer } from '../components/Footer';

type PanelId = 'jharia' | 'raniganj' | 'singrauli';

const quickStats = [
  { label: 'Coal basins online', value: '04', icon: Building2 },
  { label: 'IoT nodes streaming', value: '42', icon: Radio },
  { label: 'Inference latency', value: '<2 ms', icon: Timer },
  { label: 'Satellite track', value: 'S1', icon: Satellite },
];

const moduleCards = [
  {
    label: 'Live Console',
    title: 'Telemetry that judges can touch',
    body: 'Watch strain, tilt, vibration, methane, and convergence update in one operating view.',
    href: '/dashboard',
    cta: 'Open console',
    icon: Activity,
  },
  {
    label: '3D Twin',
    title: 'See the failing pillar cluster',
    body: 'A Three.js bord-and-pillar model shows roof sag, stress movement, and inspection targets.',
    href: '/model',
    cta: 'Inspect model',
    icon: Box,
  },
  {
    label: 'GIS Layer',
    title: 'Join underground risk to surface movement',
    body: 'Coalfield maps combine sensor nodes with InSAR deformation signals for field teams.',
    href: '/map',
    cta: 'View map',
    icon: MapPin,
  },
  {
    label: 'Alerting',
    title: 'Convert risk into action',
    body: 'CMR drill triggers generate evacuation state, siren workflow, and Form-IV incident records.',
    href: '/alerts',
    cta: 'View alerts',
    icon: BellRing,
  },
];

const proofPoints = [
  'Surface and underground telemetry are fused instead of reviewed in separate silos.',
  'XGBoost scores 39 geotechnical features fast enough for edge warning hardware.',
  'The emergency drill changes every run, so evaluators can test repeatability.',
  'The UI exposes compliance evidence without hiding the operational demo.',
];

const panelData = {
  jharia: {
    name: 'Jharia Colliery, Panel XII-A',
    district: 'Dhanbad, Jharkhand',
    formation: 'Barakar Formation',
    depth: '248.0 m',
    method: 'Bord and pillar with stowing',
    nodes: '16 / 16 online',
    fos: '2.24',
    state: 'Stable',
  },
  raniganj: {
    name: 'Raniganj Coalfield, Sripur Seam VII',
    district: 'Paschim Bardhaman, West Bengal',
    formation: 'Raniganj Series',
    depth: '184.5 m',
    method: 'Room and pillar extraction',
    nodes: '12 / 12 online',
    fos: '2.41',
    state: 'Stable',
  },
  singrauli: {
    name: 'Singrauli Basin, Jayant Panel C',
    district: 'Singrauli, Madhya Pradesh',
    formation: 'Moher sub-basin strata',
    depth: '132.0 m',
    method: 'Continuous miner with bolting',
    nodes: '14 / 14 online',
    fos: '2.65',
    state: 'Stable',
  },
};

const panelTabs: { id: PanelId; label: string }[] = [
  { id: 'jharia', label: 'Jharia' },
  { id: 'raniganj', label: 'Raniganj' },
  { id: 'singrauli', label: 'Singrauli' },
];

export default function LandingPage() {
  const {
    isDarkMode,
    toggleDarkMode,
    isSubsidenceSimActive,
    triggerSubsidenceEvent,
    resetSimulation,
    simProgress,
  } = useDashboardStore();

  const [selectedPanelTab, setSelectedPanelTab] = useState<PanelId>('jharia');

  const currentPanel = useMemo(() => {
    if (!isSubsidenceSimActive || selectedPanelTab !== 'jharia') {
      return panelData[selectedPanelTab];
    }

    return {
      ...panelData.jharia,
      fos: '0.88',
      state: 'Evacuation drill active',
      nodes: '16 / 16 online',
    };
  }, [isSubsidenceSimActive, selectedPanelTab]);

  return (
    <div className="landing-page min-h-screen bg-background text-foreground selection:bg-amber-400 selection:text-slate-950">
      <section className="relative isolate min-h-[100dvh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/strata-hero-clean.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,.96)_0%,rgba(5,7,11,.72)_42%,rgba(5,7,11,.36)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(245,158,11,.22),transparent_28%),linear-gradient(180deg,rgba(5,7,11,.28),#05070b_95%)]" />
        <div className="strata-scanline absolute inset-0 opacity-50" />

        <nav className="relative z-10 px-4 py-5 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-300 backdrop-blur">
                <Building2 className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-black tracking-tight">TASQ COAL</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">NMS-SEWS</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-200 backdrop-blur transition hover:bg-white/15 active:translate-y-px"
                title="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_18px_60px_rgba(245,158,11,.28)] transition hover:bg-amber-300 active:translate-y-px sm:inline-flex"
              >
                <Activity className="h-4 w-4" />
                Enter console
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-84px)] max-w-[1500px] items-center gap-8 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              SIH26025 mine safety prototype
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Strata collapse warnings before the mine goes silent.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              TASQ COAL fuses underground IoT, InSAR movement, and edge AI into one early warning console for India&apos;s coalfields.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-amber-300 active:translate-y-px"
              >
                Run live demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={isSubsidenceSimActive ? resetSimulation : triggerSubsidenceEvent}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black transition active:translate-y-px ${
                  isSubsidenceSimActive
                    ? 'border border-red-400/40 bg-red-500/20 text-red-100 hover:bg-red-500/30'
                    : 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {isSubsidenceSimActive ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                {isSubsidenceSimActive ? 'Reset drill' : 'Trigger safety drill'}
              </button>
            </div>
          </div>

          <aside className="rounded-lg border border-white/12 bg-[#07101a]/72 p-4 shadow-[0_30px_110px_rgba(0,0,0,.42)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Live risk state</p>
                <h2 className="mt-1 text-lg font-black text-white">Jharia Block IV</h2>
              </div>
              <span
                className={`rounded-2xl px-3 py-1.5 text-xs font-black ${
                  isSubsidenceSimActive ? 'bg-red-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                }`}
              >
                {isSubsidenceSimActive ? 'Drill active' : 'Nominal'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <Gauge className="mb-3 h-5 w-5 text-amber-300" />
                <p className="text-3xl font-black">{isSubsidenceSimActive ? '86' : '24'}</p>
                <p className="mt-1 text-xs text-slate-400">risk index</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <Waves className="mb-3 h-5 w-5 text-amber-300" />
                <p className="text-3xl font-black">{isSubsidenceSimActive ? '31.8' : '3.2'}</p>
                <p className="mt-1 text-xs text-slate-400">mm convergence</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>CMR-111 drill progress</span>
                <span>{isSubsidenceSimActive ? `${Math.round(simProgress * 100)}%` : 'standby'}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSubsidenceSimActive ? 'bg-red-400' : 'bg-amber-400'
                  }`}
                  style={{ width: isSubsidenceSimActive ? `${Math.max(12, simProgress * 100)}%` : '28%' }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="flex items-start gap-3">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-sm leading-6 text-amber-50">
                  Judges can trigger a randomized subsidence event and watch the dashboard, model, map, and alert log respond together.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <main className="landing-content bg-background">
        <section className="border-y border-mine-border dark:border-mine-border-dark bg-mine-surface dark:bg-[#080d14] px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-3 md:grid-cols-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-mine-border dark:border-mine-border-dark bg-white/[.04] p-4">
                <stat.icon className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">Demo pathways</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Four routes through the same emergency story.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                The homepage now sends hackathon evaluators straight into the strongest parts of the project.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {moduleCards.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-lg border border-mine-border dark:border-mine-border-dark bg-mine-card dark:bg-mine-card-dark p-5 transition hover:-translate-y-1 hover:border-amber-300/45 hover:bg-slate-100 dark:hover:bg-[#0f1724]"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-2xl bg-white/[.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">
                      {module.label}
                    </span>
                    <module.icon className="h-5 w-5 text-amber-700 dark:text-amber-300 transition group-hover:scale-110" />
                  </div>
                  <h3 className="mt-8 text-xl font-black leading-6 text-slate-900 dark:text-white">{module.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-400">{module.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-300">
                    {module.cta}
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <div className="rounded-lg border border-mine-border dark:border-mine-border-dark bg-mine-card dark:bg-mine-card-dark p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-mine-border dark:border-mine-border-dark pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">Colliery register</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Operational state by panel</h2>
                </div>
                <div className="grid grid-cols-3 rounded-2xl border border-mine-border dark:border-mine-border-dark bg-white/[.04] p-1">
                  {panelTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedPanelTab(tab.id)}
                      className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                        selectedPanelTab === tab.id ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-white/[.06]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 pt-6 md:grid-cols-[1fr_220px]">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentPanel.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{currentPanel.district}</p>

                  <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                    {[
                      ['Formation', currentPanel.formation],
                      ['Depth RL', currentPanel.depth],
                      ['Mining method', currentPanel.method],
                      ['Sensor fleet', currentPanel.nodes],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-mine-border dark:border-mine-border-dark bg-white/[.04] p-4">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</dt>
                        <dd className="mt-2 text-sm font-bold text-slate-100">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-lg border border-mine-border dark:border-mine-border-dark bg-mine-bg dark:bg-[#060a10] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Factor of safety</p>
                  <p className={`mt-4 text-5xl font-black ${isSubsidenceSimActive && selectedPanelTab === 'jharia' ? 'text-red-300' : 'text-emerald-300'}`}>
                    {currentPanel.fos}
                  </p>
                  <p className="mt-3 text-sm font-black text-slate-900 dark:text-white">{currentPanel.state}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-400">Target factor of safety is above 1.80 for final extraction panels.</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-mine-border dark:border-mine-border-dark bg-mine-card dark:bg-mine-card-dark p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">Why this wins</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Built for a working prototype demo.</h2>
              <div className="mt-6 space-y-4">
                {proofPoints.map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl border border-mine-border dark:border-mine-border-dark bg-white/[.04] p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
                    <p className="text-sm leading-6 text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-mine-border dark:border-mine-border-dark bg-amber-400 p-6 text-slate-950 lg:col-span-2">
              <Layers3 className="h-7 w-7" />
              <h2 className="mt-8 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                Show the story in three minutes: sense, predict, alert, evacuate.
              </h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-800">
                Start at the live console, trigger the drill, then jump to the 3D twin and alert register to prove the system reacts as one.
              </p>
            </div>

            <div className="rounded-lg border border-mine-border dark:border-mine-border-dark bg-mine-card dark:bg-mine-card-dark p-6">
              <Cpu className="h-7 w-7 text-amber-700 dark:text-amber-300" />
              <h3 className="mt-8 text-2xl font-black text-slate-900 dark:text-white">AI engine</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                400 boosted trees process convergence, crack width, seismic RMS, methane drift, and strata depth into a live risk index.
              </p>
              <Link href="/trends" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-300">
                Review trends
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
