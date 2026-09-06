import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const metadata: Metadata = {
  title: 'TASQ Coal | Mine Subsidence Monitoring Dashboard (SIH26025)',
  description: 'AI-driven underground coal mine subsidence monitoring system using IoT sensor networks and DGMS safety protocols.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-mine-bg dark:bg-mine-bg-dark text-gray-900 dark:text-slate-100 flex antialiased selection:bg-safety-500 selection:text-white">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
