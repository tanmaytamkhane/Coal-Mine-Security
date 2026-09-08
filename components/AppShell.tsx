'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { GovHeaderStrip } from './GovHeaderStrip';
import { Footer } from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <GovHeaderStrip />
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="console-shell min-h-screen flex flex-col bg-mine-bg dark:bg-mine-bg-dark text-slate-900 dark:text-slate-100">
      <GovHeaderStrip />
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
