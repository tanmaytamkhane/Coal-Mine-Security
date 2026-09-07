export type SensorType =
  | 'linear_pot'
  | 'mpu6050_tilt'
  | 'mpu6050_vib'
  | 'bf350_strain'
  | 'mq4_gas'
  | 'tiltmeter'
  | 'strain_gauge'
  | 'geophone';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SensorNode {
  id: string;
  name: string;
  hardwareModel: string; // e.g. 'Linear Potentiometer 50mm', 'MPU-6050 6-DOF IMU', 'BF350 + HX711 24-bit ADC', 'MQ-4 Catalytic Methane'
  domain: 'surface' | 'underground';
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
  rawSignal?: string;
}

export interface TelemetryPoint {
  timestamp: number;
  timeLabel: string;
  riskScore: number;

  // Above the Surface Telemetry (SF-01 / SF-02)
  surfaceDisplacementMm: number;        // Linear Potentiometer Subsidence (mm)
  surfaceCrackWidthMm: number;          // Linear Potentiometer Tension Fissure (mm)
  surfaceTiltDeg: number;               // MPU-6050 Surface Inclinometer (°)
  surfaceVibrationMms: number;          // MPU-6050 Surface Ground Motion PPV (mm/s)

  // Underground Telemetry (UG-01 / UG-02)
  undergroundStrainMicrostrain: number; // BF350 Strain Gauge + HX711 (µε)
  undergroundHx711Counts: number;       // HX711 24-bit ADC raw output counts
  undergroundTiltDeg: number;           // MPU-6050 Subterranean Roof Tilt (°)
  undergroundVibrationMms: number;      // MPU-6050 Strata Shock Vibration (mm/s)
  methanePctLel: number;                // MQ-4 Catalytic Methane Gas (% LEL)
  convergenceMm: number;                // Ultrasonic Roof-to-Floor Closure (mm)

  // Legacy fields for backward compatibility with existing charts
  strainMicrostrain: number;
  tiltAngleDeg: number;
  geophoneVelocityMms: number;
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
  isPrimaryFocus?: boolean;
  productionCapacityMtpa?: number;
  depthMeters?: number;
}
