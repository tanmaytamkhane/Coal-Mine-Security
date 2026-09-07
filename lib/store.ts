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

  // Dynamic Drill Anomaly Randomization State
  simAnomalousPillarIds: string[];
  simAnomalousSurfaceNodeIds: string[];
  simAnomalousMapSensorIds: string[];
  simSagCenter: { x: number; z: number };

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

    const strain = Math.round((145 + wave + noise) * 10) / 10;
    const ugTilt = Math.round((0.35 + Math.sin(i * 0.2) * 0.04 + (Math.random() - 0.5) * 0.02) * 100) / 100;
    const ugVib = Math.round((0.18 + Math.abs(Math.sin(i * 0.5) * 0.1) + Math.random() * 0.08) * 100) / 100;

    points.push({
      timestamp: t,
      timeLabel,
      riskScore: Math.round(22 + Math.sin(i * 0.15) * 4),

      // Above the Surface
      surfaceDisplacementMm: Math.round((1.25 + Math.sin(i * 0.25) * 0.15 + (Math.random() - 0.5) * 0.05) * 100) / 100,
      surfaceCrackWidthMm: Math.round((0.85 + Math.cos(i * 0.2) * 0.1 + (Math.random() - 0.5) * 0.03) * 100) / 100,
      surfaceTiltDeg: Math.round((0.14 + Math.sin(i * 0.18) * 0.02 + (Math.random() - 0.5) * 0.01) * 100) / 100,
      surfaceVibrationMms: Math.round((0.08 + Math.abs(Math.sin(i * 0.4) * 0.04) + Math.random() * 0.02) * 100) / 100,

      // Underground
      undergroundStrainMicrostrain: strain,
      undergroundHx711Counts: Math.round(strain * 21.0 * 1000),
      undergroundTiltDeg: ugTilt,
      undergroundVibrationMms: ugVib,
      methanePctLel: Math.round((0.22 + Math.sin(i * 0.3) * 0.03 + Math.random() * 0.02) * 100) / 100,
      convergenceMm: Math.round((3.2 + Math.sin(i * 0.15) * 0.3) * 10) / 10,

      // Legacy / Rollup
      strainMicrostrain: strain,
      tiltAngleDeg: ugTilt,
      geophoneVelocityMms: ugVib,
    });
  }
  return points;
};

export function generateRandomDrillAnomalies() {
  // 1. Pick a random anchor pillar in the 4x4 grid (row 0-3, col 0-3)
  const anchorRow = Math.floor(Math.random() * 4);
  const anchorCol = Math.floor(Math.random() * 4);
  const targetCount = 3 + Math.floor(Math.random() * 3); // Randomly 3, 4, or 5 pillars

  const spacing = 6.4;
  const offset = 9.6;

  // Calculate distance from anchor for each of the 16 pillars with subtle jitter
  const pillarDistances = INITIAL_PILLARS.map((p) => {
    const [r, c] = p.gridPos;
    const dist = Math.hypot(r - anchorRow, c - anchorCol) + (Math.random() - 0.5) * 0.5;
    const x = c * spacing - offset;
    const z = r * spacing - offset;
    return { id: p.id, r, c, x, z, dist };
  });

  pillarDistances.sort((a, b) => a.dist - b.dist);
  const selectedPillars = pillarDistances.slice(0, targetCount);
  const simAnomalousPillarIds = selectedPillars.map((p) => p.id);

  // Centroid of failing underground pillars in 3D world coordinates
  const meanX = selectedPillars.reduce((acc, p) => acc + p.x, 0) / selectedPillars.length;
  const meanZ = selectedPillars.reduce((acc, p) => acc + p.z, 0) / selectedPillars.length;
  const simSagCenter = {
    x: Math.round(meanX * 100) / 100,
    z: Math.round(meanZ * 100) / 100,
  };

  // 2. Select 4 to 6 surface nodes closest to this ground subsidence centroid
  const surfGrid = [-10.5, -3.5, 3.5, 10.5];
  const surfaceNodes: { id: string; x: number; z: number; dist: number }[] = [];
  let sIdx = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const sx = surfGrid[c];
      const sz = surfGrid[r];
      const id = `SN-SF-${sIdx.toString().padStart(2, '0')}`;
      sIdx++;
      const dist = Math.hypot(sx - meanX, sz - meanZ) + (Math.random() - 0.5) * 1.5;
      surfaceNodes.push({ id, x: sx, z: sz, dist });
    }
  }
  surfaceNodes.sort((a, b) => a.dist - b.dist);
  const surfaceTargetCount = 4 + Math.floor(Math.random() * 3); // 4 to 6 surface nodes
  const simAnomalousSurfaceNodeIds = surfaceNodes.slice(0, surfaceTargetCount).map((s) => s.id);

  // 3. Select 3 to 6 random map sensors for the 2D coalfield map
  const candidateMapSensors = INITIAL_SENSOR_NODES.map((s) => s.id);
  const shuffledSensors = [...candidateMapSensors].sort(() => Math.random() - 0.5);
  const simAnomalousMapSensorIds = shuffledSensors.slice(0, 3 + Math.floor(Math.random() * 3));

  return {
    simAnomalousPillarIds,
    simAnomalousSurfaceNodeIds,
    simAnomalousMapSensorIds,
    simSagCenter,
  };
}

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

  // Dynamic Drill Anomaly Randomization State (Default baseline)
  simAnomalousPillarIds: ['P-06', 'P-10', 'P-11'],
  simAnomalousSurfaceNodeIds: ['SN-SF-05', 'SN-SF-06', 'SN-SF-09', 'SN-SF-10'],
  simAnomalousMapSensorIds: ['NODE-SF-POT-01', 'NODE-SF-POT-02', 'NODE-UG-BF350-01'],
  simSagCenter: { x: -3.2, z: 0.0 },

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

    // Every click on Simulate Drill generates a brand new random set of failing pillars and surface nodes!
    const randomized = generateRandomDrillAnomalies();

    set({
      isSubsidenceSimActive: true,
      simProgress: 0.05,
      selectedCoalfield: 'jharia-block-4', // Main focus: drill executes for Jharia
      simAnomalousPillarIds: randomized.simAnomalousPillarIds,
      simAnomalousSurfaceNodeIds: randomized.simAnomalousSurfaceNodeIds,
      simAnomalousMapSensorIds: randomized.simAnomalousMapSensorIds,
      simSagCenter: randomized.simSagCenter,
    });
  },

  resetSimulation: () => {
    set({
      isSubsidenceSimActive: false,
      simProgress: 0,
      riskScore: 24,
      riskStatus: 'normal',
      simAnomalousPillarIds: [],
      simAnomalousSurfaceNodeIds: [],
      simAnomalousMapSensorIds: [],
      sensors: INITIAL_SENSOR_NODES.map((s) => ({ ...s, status: 'normal' })),
      pillars: INITIAL_PILLARS.map((p) => ({
        ...p,
        status: 'stable',
        displacementMm: 1.4,
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
