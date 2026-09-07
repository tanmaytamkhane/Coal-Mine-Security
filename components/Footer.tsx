'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Activity,
  Box,
  MapPin,
  LineChart,
  BellRing,
  ShieldCheck,
  Radio,
  Phone,
} from 'lucide-react';
import { COALFIELD_ZONES } from '../lib/constants';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#0c1322] text-slate-400 transition-colors">
      {/* Sleek Top Banner: Brand + Rescue Cell Contact */}
      <div className="border-b border-slate-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand & Mission Statement */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#e64a19] text-white flex items-center justify-center shadow-md shadow-[#e64a19]/20 font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                NMS-SEWS
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold">
                v2.4.1
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              National Mine Strata Early Warning System — Real-time IoT geotechnical telemetry,
              InSAR satellite interferometry, and predictive subsidence modeling under DGMS statutory directives.
            </p>
          </div>

          {/* Rescue Cell Emergency Contact */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href="tel:18003456463"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>Rescue Cell: 1800-345-MINE</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean 4-Column Navigation Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Platform Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#e64a19]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  <span>Telemetry Console</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/model"
                  className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-2"
                >
                  <Box className="w-3.5 h-3.5 text-slate-500" />
                  <span>3D Strata Digital Twin</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Coalfield GIS &amp; InSAR</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/trends"
                  className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-2"
                >
                  <LineChart className="w-3.5 h-3.5 text-slate-500" />
                  <span>Subsidence Trends</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-2"
                >
                  <BellRing className="w-3.5 h-3.5 text-slate-500" />
                  <span>DGMS Form-IV Dispatch</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Surveillance Coalfields */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Coalfields
            </h4>
            <ul className="space-y-2.5 text-xs">
              {COALFIELD_ZONES.map((zone) => (
                <li key={zone.id}>
                  <Link
                    href="/map"
                    className="hover:text-amber-400 text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{zone.name.split('—')[0]}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-[#e64a19]/20 group-hover:text-amber-400 transition-colors shrink-0 border border-slate-700/60">
                      {zone.state}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Statutory & Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-400 text-slate-300 transition-colors">
                  CMR-2017 Regulation 111 (SCAMP)
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-amber-400 text-slate-300 transition-colors">
                  DGMS Technical Circular 02/2020
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 text-slate-300 transition-colors">
                  Mines Act, 1952 (Section 22A)
                </Link>
              </li>
              <li>
                <span className="text-slate-400">
                  IS/IEC 60079 Zone-1 Intrinsically Safe
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Section 65B Indian Evidence Act Logs
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Authority & Research */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-blue-500" />
              Organization
            </h4>
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-200">
                Directorate General of Mines Safety
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ministry of Coal, Government of India<br />
                Headquarters: Dhanbad, Jharkhand — 826001
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>NIC Cloud Node: MeghRaj #04</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Sentinel-1 InSAR 12-Day C-Band</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-mono text-[11px]">
            © 2026 DGMS, Ministry of Coal, Govt. of India. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-[#e64a19] font-bold">SIH26025</span>
            <span className="text-slate-700">•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Documentation
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

