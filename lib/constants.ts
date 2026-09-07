import { SensorNode, Pillar, CoalfieldZone, Alert } from '../types';

export const SURFACE_THRESHOLDS = {
  linearPotDisplacement: {
    warning: 10.0,  // mm ground subsidence
    critical: 25.0, // mm ground subsidence
    unit: 'mm',
    maxStroke: 50.0,
  },
  linearPotCrack: {
    warning: 8.0,   // mm fissure opening
    critical: 20.0,
    unit: 'mm',
    maxStroke: 100.0,
  },
  surfaceTilt: {
    warning: 0.80,  // degrees
    critical: 1.80,
    unit: '°',
  },
  surfaceVibration: {
    warning: 2.50,  // mm/s Peak Particle Velocity
    critical: 6.00,
    unit: 'mm/s',
  },
};

export const UNDERGROUND_THRESHOLDS = {
  bf350Strain: {
    warning: 350.0, // microstrain (µε)
    critical: 600.0,
    unit: 'µε',
  },
  undergroundTilt: {
    warning: 1.50,  // degrees
    critical: 3.00,
    unit: '°',
  },
  undergroundVibration: {
    warning: 5.00,  // mm/s PPV
    critical: 12.00,
    unit: 'mm/s',
  },
  mq4Methane: {
    warning: 0.80,  // % LEL
    critical: 1.25, // % LEL (DGMS Statutory CMR-111 / Reg 169 Cap)
    unit: '% LEL',
  },
  convergence: {
    warning: 15.0,  // mm
    critical: 30.0,
    unit: 'mm',
  }
};

export const THRESHOLDS = {
  strain: {
    warning: 350,
    critical: 600,
    unit: 'µε',
  },
  tilt: {
    warning: 1.5,
    critical: 3.0,
    unit: '°',
  },
  geophone: {
    warning: 5.0,
    critical: 12.0,
    unit: 'mm/s',
  },
  risk: {
    caution: 35,
    critical: 70,
  }
};

export const COALFIELD_ZONES: CoalfieldZone[] = [
  {
    id: 'jharia-block-4',
    name: 'Jharia Colliery — Block IV',
    basin: 'Damodar Valley Basin',
    state: 'Jharkhand',
    lat: 23.7423,
    lng: 86.4189,
    strataType: 'Barakar Sandstone / Coal Seam XII',
    activeNodes: 12,
    currentRiskScore: 24,
    insarDeformationRateMmYr: -14.2, // mm/year subsidence velocity from Sentinel-1 SBAS
  },
  {
    id: 'raniganj-sector-2',
    name: 'Raniganj Colliery — Sector 2',
    basin: 'Raniganj Coal Basin',
    state: 'West Bengal',
    lat: 23.6186,
    lng: 86.9744,
    strataType: 'Dishergarh Seam / Shale Overburden',
    activeNodes: 10,
    currentRiskScore: 18,
    insarDeformationRateMmYr: -8.6,
  }
];

export const INITIAL_SENSOR_NODES: SensorNode[] = [
  // ==========================================
  // ABOVE THE SURFACE FLEET (Station SF-01/SF-02)
  // ==========================================
  {
    id: 'NODE-SF-POT-01',
    name: 'Surface Subsidence Potentiometer POT-01',
    hardwareModel: 'Linear Potentiometer 50mm Travel (Slide Pot)',
    domain: 'surface',
    type: 'linear_pot',
    unit: 'mm',
    location: 'Pithead Subsidence Monument SF-01',
    depthMeters: 0,
    currentValue: 1.25,
    baselineValue: 1.20,
    warningThreshold: 10.0,
    criticalThreshold: 25.0,
    status: 'normal',
    batteryPercent: 97,
    signalDbm: -54,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'ADC 12-bit: 102/4095 (0.082V)',
  },
  {
    id: 'NODE-SF-MPU-01',
    name: 'Surface Slope Inclinometer MPU-01',
    hardwareModel: 'MPU-6050 6-Axis IMU (I2C 0x68)',
    domain: 'surface',
    type: 'mpu6050_tilt',
    unit: '°',
    location: 'Ground Monument Station SF-01',
    depthMeters: 0,
    currentValue: 0.14,
    baselineValue: 0.12,
    warningThreshold: 0.80,
    criticalThreshold: 1.80,
    status: 'normal',
    batteryPercent: 95,
    signalDbm: -56,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'Pitch: +0.14° | Roll: -0.06°',
  },
  {
    id: 'NODE-SF-MPU-02',
    name: 'Surface Ground Vibration MPU-02',
    hardwareModel: 'MPU-6050 6-Axis IMU (I2C 0x69)',
    domain: 'surface',
    type: 'mpu6050_vib',
    unit: 'mm/s',
    location: 'Perimeter Surface Array SF-02',
    depthMeters: 0,
    currentValue: 0.08,
    baselineValue: 0.05,
    warningThreshold: 2.50,
    criticalThreshold: 6.00,
    status: 'normal',
    batteryPercent: 91,
    signalDbm: -63,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'RMS Accel: 0.008g (PPV: 0.08 mm/s)',
  },

  // ==========================================
  // UNDERGROUND STRATA FLEET (Seam XII -248m RL)
  // ==========================================
  {
    id: 'NODE-UG-BF350-01',
    name: 'Pillar Core Strain Gauge BF350-01',
    hardwareModel: 'BF350 Strain Gauge + HX711 24-bit ADC Amplifier',
    domain: 'underground',
    type: 'bf350_strain',
    unit: 'µε',
    location: 'Pillar P-06 Core, Seam XII',
    depthMeters: 248,
    currentValue: 142.5,
    baselineValue: 135.0,
    warningThreshold: 350.0,
    criticalThreshold: 600.0,
    status: 'normal',
    batteryPercent: 92,
    signalDbm: -68,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'HX711 24-bit: 2,992,500 counts (21.0 c/µε)',
  },
  {
    id: 'NODE-UG-BF350-02',
    name: 'Depillaring Flank Strain BF350-02',
    hardwareModel: 'BF350 Strain Gauge + HX711 24-bit ADC Amplifier',
    domain: 'underground',
    type: 'bf350_strain',
    unit: 'µε',
    location: 'Pillar P-11 Rib, Extraction Face',
    depthMeters: 256,
    currentValue: 168.2,
    baselineValue: 155.0,
    warningThreshold: 350.0,
    criticalThreshold: 600.0,
    status: 'normal',
    batteryPercent: 88,
    signalDbm: -74,
    zigbeeHops: 2,
    lastUpdated: 'Just now',
    rawSignal: 'HX711 24-bit: 3,532,200 counts (21.0 c/µε)',
  },
  {
    id: 'NODE-UG-MPU-01',
    name: 'Roof Strata Inclinometer MPU-01',
    hardwareModel: 'MPU-6050 6-Axis IMU (Subterranean Ex-ia)',
    domain: 'underground',
    type: 'mpu6050_tilt',
    unit: '°',
    location: 'Gallery 4-East Roof Anchor, Seam XII',
    depthMeters: 245,
    currentValue: 0.36,
    baselineValue: 0.30,
    warningThreshold: 1.50,
    criticalThreshold: 3.00,
    status: 'normal',
    batteryPercent: 94,
    signalDbm: -66,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'Roof Delamination Pitch: +0.36°',
  },
  {
    id: 'NODE-UG-MPU-02',
    name: 'Strata Shock Vibration MPU-02',
    hardwareModel: 'MPU-6050 6-Axis IMU (Dynamic Geophone Proxy)',
    domain: 'underground',
    type: 'mpu6050_vib',
    unit: 'mm/s',
    location: 'Pillar P-10 Deep Winze Chamber',
    depthMeters: 260,
    currentValue: 0.22,
    baselineValue: 0.15,
    warningThreshold: 5.00,
    criticalThreshold: 12.00,
    status: 'normal',
    batteryPercent: 84,
    signalDbm: -78,
    zigbeeHops: 2,
    lastUpdated: 'Just now',
    rawSignal: 'PPV Peak: 0.22 mm/s @ 32Hz',
  },
  {
    id: 'NODE-UG-MQ4-01',
    name: 'Tailgate Methane Gas Sensor MQ4-01',
    hardwareModel: 'MQ-4 Catalytic Methane (CH4) Sensor',
    domain: 'underground',
    type: 'mq4_gas',
    unit: '% LEL',
    location: 'Tailgate Return Airway, Seam XII',
    depthMeters: 252,
    currentValue: 0.22,
    baselineValue: 0.15,
    warningThreshold: 0.80,
    criticalThreshold: 1.25,
    status: 'normal',
    batteryPercent: 90,
    signalDbm: -70,
    zigbeeHops: 2,
    lastUpdated: 'Just now',
    rawSignal: 'Analog Rs/Ro: 14.8kΩ (~110 ppm CH4)',
  },
  {
    id: 'NODE-UG-MQ4-02',
    name: 'Goaf Perimeter Methane MQ4-02',
    hardwareModel: 'MQ-4 Catalytic Methane (CH4) Sensor',
    domain: 'underground',
    type: 'mq4_gas',
    unit: '% LEL',
    location: 'Goaf Bleeder Channel North',
    depthMeters: 240,
    currentValue: 0.28,
    baselineValue: 0.20,
    warningThreshold: 0.80,
    criticalThreshold: 1.25,
    status: 'normal',
    batteryPercent: 96,
    signalDbm: -62,
    zigbeeHops: 1,
    lastUpdated: 'Just now',
    rawSignal: 'Analog Rs/Ro: 12.2kΩ (~140 ppm CH4)',
  },
];

export const INITIAL_PILLARS: Pillar[] = [
  { id: 'P-01', name: 'Pillar 01 (Shaft Pillar)', gridPos: [0, 0], depthMeters: 240, factorOfSafety: 2.35, stressMpa: 13.8, strainMicrostrain: 128, status: 'stable', displacementMm: 1.2 },
  { id: 'P-02', name: 'Pillar 02 (Main Intake)', gridPos: [0, 1], depthMeters: 242, factorOfSafety: 2.28, stressMpa: 14.5, strainMicrostrain: 135, status: 'stable', displacementMm: 1.4 },
  { id: 'P-03', name: 'Pillar 03 (Haulage Way)', gridPos: [0, 2], depthMeters: 244, factorOfSafety: 2.15, stressMpa: 15.2, strainMicrostrain: 148, status: 'stable', displacementMm: 1.7 },
  { id: 'P-04', name: 'Pillar 04 (Return Airway)', gridPos: [0, 3], depthMeters: 245, factorOfSafety: 2.20, stressMpa: 14.9, strainMicrostrain: 142, status: 'stable', displacementMm: 1.5 },
  
  { id: 'P-05', name: 'Pillar 05 (Junction 2)', gridPos: [1, 0], depthMeters: 246, factorOfSafety: 2.10, stressMpa: 15.8, strainMicrostrain: 162, status: 'stable', displacementMm: 1.9 },
  { id: 'P-06', name: 'Pillar 06 (Critical Rib)', gridPos: [1, 1], depthMeters: 248, factorOfSafety: 1.88, stressMpa: 18.2, strainMicrostrain: 210, status: 'stressed', displacementMm: 2.8 },
  { id: 'P-07', name: 'Pillar 07 (Central Panel)', gridPos: [1, 2], depthMeters: 250, factorOfSafety: 1.92, stressMpa: 17.6, strainMicrostrain: 198, status: 'stable', displacementMm: 2.4 },
  { id: 'P-08', name: 'Pillar 08 (East Flank)', gridPos: [1, 3], depthMeters: 251, factorOfSafety: 2.22, stressMpa: 14.8, strainMicrostrain: 140, status: 'stable', displacementMm: 1.6 },
  
  { id: 'P-09', name: 'Pillar 09 (Goaf Barrier)', gridPos: [2, 0], depthMeters: 252, factorOfSafety: 2.05, stressMpa: 16.4, strainMicrostrain: 174, status: 'stable', displacementMm: 2.1 },
  { id: 'P-10', name: 'Pillar 10 (Deep Winze)', gridPos: [2, 1], depthMeters: 255, factorOfSafety: 1.85, stressMpa: 18.9, strainMicrostrain: 228, status: 'stressed', displacementMm: 3.1 },
  { id: 'P-11', name: 'Pillar 11 (Depillaring Zone)', gridPos: [2, 2], depthMeters: 256, factorOfSafety: 1.76, stressMpa: 19.8, strainMicrostrain: 245, status: 'stressed', displacementMm: 3.5 },
  { id: 'P-12', name: 'Pillar 12 (Substation)', gridPos: [2, 3], depthMeters: 254, factorOfSafety: 2.30, stressMpa: 14.0, strainMicrostrain: 130, status: 'stable', displacementMm: 1.3 },
  
  { id: 'P-13', name: 'Pillar 13 (South Barrier)', gridPos: [3, 0], depthMeters: 258, factorOfSafety: 2.40, stressMpa: 13.2, strainMicrostrain: 120, status: 'stable', displacementMm: 1.1 },
  { id: 'P-14', name: 'Pillar 14 (Tailgate Dip)', gridPos: [3, 1], depthMeters: 260, factorOfSafety: 2.18, stressMpa: 15.3, strainMicrostrain: 150, status: 'stable', displacementMm: 1.8 },
  { id: 'P-15', name: 'Pillar 15 (Sump Chamber)', gridPos: [3, 2], depthMeters: 262, factorOfSafety: 2.25, stressMpa: 14.6, strainMicrostrain: 138, status: 'stable', displacementMm: 1.5 },
  { id: 'P-16', name: 'Pillar 16 (Boundary Wall)', gridPos: [3, 3], depthMeters: 260, factorOfSafety: 2.38, stressMpa: 13.5, strainMicrostrain: 125, status: 'stable', displacementMm: 1.2 },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-1049',
    timestamp: '10 mins ago',
    title: 'Baseline Mesh Sync Completed',
    message: '12 Zigbee nodes verified via LoRa Gateway LOR-JH-01. Hop latency < 140ms.',
    severity: 'info',
    coalfield: 'Jharia Colliery — Block IV',
    acknowledged: true,
    dgmsCode: 'DGMS/TECH/CIRC-04',
  },
  {
    id: 'ALT-1048',
    timestamp: '32 mins ago',
    title: 'Micro-seismic Tremor Registered',
    message: 'Geophone GP-02 recorded transient vibration peak of 0.85 mm/s. Well below 5.0 mm/s limit.',
    severity: 'info',
    nodeId: 'NODE-GP-02',
    coalfield: 'Jharia Colliery — Block IV',
    acknowledged: true,
    dgmsCode: 'DGMS/S&T/CMR-111',
  },
  {
    id: 'ALT-1047',
    timestamp: '2 hours ago',
    title: 'Minor Microstrain Drift on Pillar P-11',
    message: 'Strain increased by +18 µε during blasting in adjacent seam. Normal stress redistribution.',
    severity: 'info',
    nodeId: 'NODE-SG-02',
    coalfield: 'Jharia Colliery — Block IV',
    acknowledged: true,
    dgmsCode: 'DGMS/SAFE/REC-19',
  }
];
