import { create } from 'zustand';
import { SensorNode, Pillar, TelemetryPoint, Alert } from '../types';
import { INITIAL_SENSOR_NODES, INITIAL_PILLARS, INITIAL_ALERTS, COALFIELD_ZONES } from './constants';

interface DashboardState {
  isDarkMode: boolean;
  selectedCoalfield: string;
  isSubsidenceSimActive: boolean;
  simProgress: number; // 0 to 1
  riskScore: number;
  riskStatus: 'normal' | 'caution' | 'critical';
  sensors: SensorNode[];
  pillars: Pillar[];
  telemetryHistory: TelemetryPoint[];
  alerts: Alert[];
  selectedPillarId: string | null;
  isAudioMuted: boolean;
  audioActive: boolean;

  // Live XGBoost ML Model State
  isMlModelConnected: boolean;
  mlModelEngine: string;
  mlFeatureContributions: Record<string, string>;

  // Actions
  toggleDarkMode: () => void;
  setSelectedCoalfield: (id: string) => void;
  triggerSubsidenceEvent: () => void;
  resetSimulation: () => void;
  acknowledgeAlert: (alertId: string) => void;
  selectPillar: (pillarId: string | null) => void;
  toggleAudioMute: () => void;
  setAudioActive: (active: boolean) => void;
  setMlStatus: (connected: boolean, engine: string, contributions: Record<string, string>) => void;
  updateTick: (newTelemetry: TelemetryPoint, updatedSensors: SensorNode[], updatedPillars: Pillar[], newRiskScore: number, newRiskStatus: 'normal' | 'caution' | 'critical', newAlert?: Alert) => void;
}

const generateInitialTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    const t = now - i * 3000;
    const date = new Date(t);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const wave = Math.sin(i * 0.3) * 6;
    const noise = (Math.random() - 0.5) * 4;
    points.push({
      timestamp: t,
      timeLabel,
      strainMicrostrain: Math.round((145 + wave + noise) * 10) / 10,
      tiltAngleDeg: Math.round((0.35 + Math.sin(i * 0.2) * 0.04 + (Math.random() - 0.5) * 0.02) * 100) / 100,
      geophoneVelocityMms: Math.round((0.18 + Math.abs(Math.sin(i * 0.5) * 0.1) + Math.random() * 0.08) * 100) / 100,
      riskScore: Math.round(22 + Math.sin(i * 0.15) * 4),
    });
  }
  return points;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  isDarkMode: false,
  selectedCoalfield: COALFIELD_ZONES[0].id,
  isSubsidenceSimActive: false,
  simProgress: 0,
  riskScore: 24,
  riskStatus: 'normal',
  sensors: INITIAL_SENSOR_NODES,
  pillars: INITIAL_PILLARS,
  telemetryHistory: generateInitialTelemetry(),
  alerts: INITIAL_ALERTS,
  selectedPillarId: 'P-06',
  isAudioMuted: false,
  audioActive: false,

  isMlModelConnected: false,
  mlModelEngine: 'XGBoost 3.2.0 (SIH26025)',
  mlFeatureContributions: {
    'Strata Depth (z)': '43.3%',
    'Convergence Std (6h)': '24.1%',
    'Crack Width Std (6h)': '16.4%',
    'Seismic Vibration RMS': '5.5%',
  },

  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { isDarkMode: next };
  }),

  setSelectedCoalfield: (id: string) => set({ selectedCoalfield: id }),

  triggerSubsidenceEvent: () => {
    const currentSim = get().isSubsidenceSimActive;
    if (currentSim) return;
    set({
      isSubsidenceSimActive: true,
      simProgress: 0.05,
    });
  },

  resetSimulation: () => {
    set({
      isSubsidenceSimActive: false,
      simProgress: 0,
      riskScore: 24,
      riskStatus: 'normal',
      sensors: INITIAL_SENSOR_NODES.map(s => ({ ...s, status: 'normal' })),
      pillars: INITIAL_PILLARS.map(p => ({
        ...p,
        status: p.factorOfSafety < 2.0 ? 'stressed' : 'stable',
        displacementMm: p.id === 'P-06' ? 2.8 : p.id === 'P-11' ? 3.5 : 1.5,
      })),
    });
  },

  acknowledgeAlert: (alertId: string) => set((state) => ({
    alerts: state.alerts.map((a) =>
      a.id === alertId ? { ...a, acknowledged: true } : a
    ),
  })),

  selectPillar: (pillarId: string | null) => set({ selectedPillarId: pillarId }),

  toggleAudioMute: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  
  setAudioActive: (active: boolean) => set({ audioActive: active }),

  setMlStatus: (connected, engine, contributions) => set({
    isMlModelConnected: connected,
    mlModelEngine: engine,
    mlFeatureContributions: contributions,
  }),

  updateTick: (newTelemetry, updatedSensors, updatedPillars, newRiskScore, newRiskStatus, newAlert) =>
    set((state) => {
      const updatedHistory = [...state.telemetryHistory.slice(1), newTelemetry];
      const updatedAlerts = newAlert ? [newAlert, ...state.alerts] : state.alerts;
      return {
        telemetryHistory: updatedHistory,
        sensors: updatedSensors,
        pillars: updatedPillars,
        riskScore: newRiskScore,
        riskStatus: newRiskStatus,
        alerts: updatedAlerts,
      };
    }),
}));
