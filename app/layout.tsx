import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'TASQ Coal | AI Mine Subsidence Early Warning System (SIH26025)',
  description: 'AI-driven underground coal mine subsidence monitoring system using IoT sensor networks, XGBoost early warning, and DGMS safety protocols.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-mine-bg dark:bg-mine-bg-dark text-gray-900 dark:text-slate-100 antialiased selection:bg-safety-500 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
