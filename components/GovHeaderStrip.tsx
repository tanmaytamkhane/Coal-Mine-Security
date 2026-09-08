'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

function formatPortalTime() {
  const now = new Date();
  return (
    now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    ' | ' +
    now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) +
    ' IST'
  );
}

export function GovHeaderStrip() {
  const [timeString, setTimeString] = useState<string>(() => formatPortalTime());

  useEffect(() => {
    const updateTime = () => setTimeString(formatPortalTime());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#05070b] text-slate-200 text-[11px] border-b border-slate-800/80 select-none">
      {/* Tricolor Ribbon Bar (Saffron, White, Green) */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Indian Ministry Attribution */}
        <div className="flex items-center gap-3 flex-wrap font-medium">
          <span className="font-semibold text-white tracking-wide">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">कोयला मंत्रालय | Ministry of Coal</span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-amber-400 font-semibold hidden md:inline">खान सुरक्षा महानिदेशालय (DGMS)</span>
        </div>

        {/* Right: Operational Status & Portal Clock */}
        <div className="flex items-center gap-4 text-[10px] text-slate-300">
          <div className="hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>CMR-2017 Reg. 111 / SCAMP Compliant</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-mono text-slate-200" suppressHydrationWarning>
              {timeString}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold text-white">NIC-DGMS NODE #04</span>
          </div>
        </div>
      </div>
    </div>
  );
}
