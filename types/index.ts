export type SensorType = 'tiltmeter' | 'strain_gauge' | 'geophone';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SensorNode {
  id: string;
  name: string;
  type: SensorType;
  unit: string;
  location: string;
  depthMeters: number;
  currentValue: number;
  baselineValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  batteryPercent: number;
  signalDbm: number;
  zigbeeHops: number;
  lastUpdated: string;
}

export interface TelemetryPoint {
  timestamp: number;
  timeLabel: string;
  strainMicrostrain: number;
  tiltAngleDeg: number;
  geophoneVelocityMms: number;
  riskScore: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  nodeId?: string;
  coalfield: string;
  acknowledged: boolean;
  dgmsCode: string;
}

export interface Pillar {
  id: string;
  name: string;
  gridPos: [number, number];
  depthMeters: number;
  factorOfSafety: number;
  stressMpa: number;
  strainMicrostrain: number;
  status: 'stable' | 'stressed' | 'critical';
  displacementMm: number;
}

export interface CoalfieldZone {
  id: string;
  name: string;
  basin: string;
  state: string;
  lat: number;
  lng: number;
  strataType: string;
  activeNodes: number;
  currentRiskScore: number;
  insarDeformationRateMmYr: number;
}
