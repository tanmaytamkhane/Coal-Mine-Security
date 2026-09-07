import { useEffect, useRef } from 'react';
import { useDashboardStore } from './store';
import { Alert, TelemetryPoint, Pillar, SensorNode } from '../types';

let audioCtx: AudioContext | null = null;

function playAlertChime(isCritical: boolean) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (isCritical) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch {
    // Audio restricted until user interaction
  }
}

export function useSensorSimulator() {
  const tickCountRef = useRef(0);
  const alertedWarningRef = useRef(false);
  const alertedCriticalRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const state = useDashboardStore.getState();
      tickCountRef.current += 1;
      const t = tickCountRef.current;

      const isSim = state.isSubsidenceSimActive;
      let progress = state.simProgress;

      if (isSim && progress < 1) {
        progress = Math.min(1, progress + 0.07);
        useDashboardStore.setState({ simProgress: progress });
      }

      // Smooth physics baseline
      const driftSine = Math.sin(t * 0.15);
      const driftCos = Math.cos(t * 0.1);
      const noise = (Math.random() - 0.5);

      // ----------------------------------------------------
      // Above the Surface Telemetry Baseline (SF-01 / SF-02)
      // ----------------------------------------------------
      let surfDisp = 1.25 + driftSine * 0.08 + noise * 0.04;
      let surfCrack = 0.85 + driftCos * 0.05 + noise * 0.03;
      let surfTilt = 0.14 + driftCos * 0.02 + noise * 0.01;
      let surfVib = 0.08 + Math.abs(noise) * 0.03;

      // ----------------------------------------------------
      // Underground Strata Telemetry Baseline (UG-01 / UG-02)
      // ----------------------------------------------------
      let currentStrain = 142.5 + driftSine * 6 + noise * 3;
      let currentTilt = 0.36 + driftCos * 0.03 + noise * 0.01;
      let currentGeophone = 0.22 + Math.abs(noise) * 0.08;
      let currentMethane = 0.22 + Math.abs(driftSine) * 0.04 + Math.abs(noise) * 0.02;
      let currentConvergence = 3.2 + driftSine * 0.2 + noise * 0.1;

      let currentRisk = 22 + Math.round(driftSine * 4);
      let riskStatus: 'normal' | 'caution' | 'critical' = 'normal';

      let newAlert: Alert | undefined = undefined;

      if (isSim) {
        // Surface progression
        surfDisp = surfDisp + progress * 24.5;       // up to ~26 mm
        surfCrack = surfCrack + progress * 16.2;     // up to ~17 mm
        surfTilt = surfTilt + progress * 1.82;       // up to ~2.0°
        surfVib = surfVib + progress * 4.2;          // up to ~4.3 mm/s

        // Underground progression
        currentStrain = currentStrain + progress * 480.0; // up to ~625 µε
        currentTilt = currentTilt + progress * 3.25;      // up to ~3.6°
        currentGeophone = currentGeophone + progress * 13.8; // up to ~14.0 mm/s
        currentMethane = currentMethane + progress * 1.15;  // up to ~1.40% LEL
        currentConvergence = currentConvergence + progress * 28.0;

        currentRisk = Math.min(96, Math.round(24 + progress * 72));

        if (progress > 0.4 && progress < 0.75) {
          riskStatus = 'caution';
          if (!alertedWarningRef.current) {
            alertedWarningRef.current = true;
            if (!state.isAudioMuted) playAlertChime(false);
            newAlert = {
              id: `ALT-${Date.now().toString().slice(-4)}`,
              timestamp: 'Just now',
              title: 'CAUTION: Underground Strain Acceleration & Surface Crack Dilation',
              message: `Pillar P-06 strain reached ${Math.round(currentStrain)} µε (BF350/HX711). Surface Linear Potentiometer detected ${surfDisp.toFixed(1)} mm ground subsidence.`,
              severity: 'warning',
              nodeId: 'NODE-UG-BF350-01',
              coalfield: 'Jharia Colliery — Block IV',
              acknowledged: false,
              dgmsCode: 'DGMS/S&T/CMR-111B',
            };
          }
        } else if (progress >= 0.75) {
          riskStatus = 'critical';
          if (!alertedCriticalRef.current) {
            alertedCriticalRef.current = true;
            if (!state.isAudioMuted) playAlertChime(true);
            newAlert = {
              id: `ALT-${Date.now().toString().slice(-4)}`,
              timestamp: 'Just now',
              title: 'CRITICAL EMERGENCY: Multi-Level Strata Subsidence Breach',
              message: `Underground Pillar P-06 / P-11 yielded (FoS 0.91). Surface Potentiometer breached ${surfDisp.toFixed(1)} mm. Methane MQ-4 reached ${currentMethane.toFixed(2)}% LEL. Evacuate subterranean and surface danger perimeter.`,
              severity: 'critical',
              nodeId: 'NODE-SF-POT-01',
              coalfield: 'Jharia Colliery — Block IV',
              acknowledged: false,
              dgmsCode: 'DGMS/FORM-IV/EMERGENCY',
            };
          }
        }
      } else {
        alertedWarningRef.current = false;
        alertedCriticalRef.current = false;
      }

      // Query real Python XGBoost ML Backend if available
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 700);

        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strain_microstrain: currentStrain,
            tilt_deg: currentTilt,
            vib_rms_g: currentGeophone / 10.0,
            crack_width_mm: surfCrack,
            convergence_m: currentConvergence / 1000.0,
            depth_z: 248.0,
            safety_factor: isSim ? Math.max(0.85, 2.2 - progress * 1.3) : 2.2,
            is_simulation_active: isSim,
            sim_progress: progress,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const mlResult = await response.json();
          currentRisk = Math.round(mlResult.risk_score);
          riskStatus = mlResult.status;
          state.setMlStatus(true, mlResult.model_engine, mlResult.top_feature_contributions);
        } else {
          state.setMlStatus(false, 'XGBoost (Fallback)', {});
        }
      } catch {
        // Backend offline: gracefully continue with client-side calculation
        state.setMlStatus(false, 'XGBoost (In-Browser)', {});
      }

      // Update Individual Sensor Nodes for both Surface & Underground
      const updatedSensors: SensorNode[] = state.sensors.map((sensor) => {
        let val = sensor.currentValue;
        let sStatus: SensorNode['status'] = 'normal';
        let raw = sensor.rawSignal || '';

        if (sensor.domain === 'surface' || sensor.type === 'linear_pot') {
          if (sensor.id === 'NODE-SF-POT-01') {
            val = surfDisp;
            raw = `ADC 12-bit: ${Math.round((val / 50) * 4095)}/4095 (${((val / 50) * 3.3).toFixed(2)}V)`;
            if (val >= 25.0) sStatus = 'critical';
            else if (val >= 10.0) sStatus = 'warning';
          } else if (sensor.id === 'NODE-SF-POT-02') {
            val = surfCrack;
            raw = `Extensometer: ${val.toFixed(2)}mm (${Math.round((val / 100) * 4095)} counts)`;
            if (val >= 20.0) sStatus = 'critical';
            else if (val >= 8.0) sStatus = 'warning';
          } else if (sensor.type === 'mpu6050_tilt' || sensor.id === 'NODE-SF-MPU-01') {
            val = surfTilt;
            raw = `Pitch: +${val.toFixed(2)}° | Roll: -${(val * 0.4).toFixed(2)}°`;
            if (val >= 1.80) sStatus = 'critical';
            else if (val >= 0.80) sStatus = 'warning';
          } else if (sensor.type === 'mpu6050_vib' || sensor.id === 'NODE-SF-MPU-02') {
            val = surfVib;
            raw = `RMS Accel: ${(val * 0.1).toFixed(3)}g (PPV: ${val.toFixed(2)} mm/s)`;
            if (val >= 6.0) sStatus = 'critical';
            else if (val >= 2.5) sStatus = 'warning';
          }
        } else {
          // Underground Domain
          if (sensor.type === 'bf350_strain' || sensor.type === 'strain_gauge') {
            const isFailingNode = sensor.id === 'NODE-UG-BF350-01' || sensor.id === 'NODE-SG-01';
            val = isFailingNode ? currentStrain : 138 + noise * 4;
            raw = `HX711 24-bit: ${Math.round(val * 21.0 * 1000).toLocaleString()} counts`;
            if (val >= 600.0) sStatus = 'critical';
            else if (val >= 350.0) sStatus = 'warning';
          } else if (sensor.type === 'mpu6050_tilt' || sensor.type === 'tiltmeter') {
            const isFailingTilt = sensor.id === 'NODE-UG-MPU-01' || sensor.id === 'NODE-TM-01';
            val = isFailingTilt ? currentTilt : 0.32 + noise * 0.02;
            raw = `Roof Delamination Pitch: +${val.toFixed(2)}°`;
            if (val >= 3.0) sStatus = 'critical';
            else if (val >= 1.5) sStatus = 'warning';
          } else if (sensor.type === 'mpu6050_vib' || sensor.type === 'geophone') {
            val = currentGeophone;
            raw = `PPV Peak: ${val.toFixed(2)} mm/s @ 32Hz`;
            if (val >= 12.0) sStatus = 'critical';
            else if (val >= 5.0) sStatus = 'warning';
          } else if (sensor.type === 'mq4_gas') {
            val = currentMethane;
            raw = `Analog Rs/Ro: ${(15.0 - val * 6).toFixed(1)}kΩ (~${Math.round(val * 500)} ppm CH4)`;
            if (val >= 1.25) sStatus = 'critical';
            else if (val >= 0.80) sStatus = 'warning';
          }
        }

        return {
          ...sensor,
          currentValue: Math.round(val * 100) / 100,
          status: sStatus,
          rawSignal: raw,
          lastUpdated: 'Just now',
        };
      });

      // Update Pillar health status
      const updatedPillars: Pillar[] = state.pillars.map((pillar) => {
        if (!isSim) return pillar;
        const isImpacted = pillar.id === 'P-06' || pillar.id === 'P-10' || pillar.id === 'P-11';
        if (isImpacted) {
          const degradedFoS = Math.max(0.85, pillar.factorOfSafety - progress * 1.15);
          const elevatedStress = pillar.stressMpa + progress * 16.5;
          const elevatedStrain = pillar.strainMicrostrain + progress * 480;
          const pStatus: Pillar['status'] = degradedFoS < 1.3 ? 'critical' : degradedFoS < 1.8 ? 'stressed' : 'stable';
          return {
            ...pillar,
            factorOfSafety: Math.round(degradedFoS * 100) / 100,
            stressMpa: Math.round(elevatedStress * 10) / 10,
            strainMicrostrain: Math.round(elevatedStrain),
            displacementMm: Math.round((pillar.displacementMm + progress * 12.5) * 10) / 10,
            status: pStatus,
          };
        }
        return pillar;
      });

      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newTelemetry: TelemetryPoint = {
        timestamp: Date.now(),
        timeLabel,
        riskScore: currentRisk,

        // Above the Surface
        surfaceDisplacementMm: Math.round(surfDisp * 100) / 100,
        surfaceCrackWidthMm: Math.round(surfCrack * 100) / 100,
        surfaceTiltDeg: Math.round(surfTilt * 100) / 100,
        surfaceVibrationMms: Math.round(surfVib * 100) / 100,

        // Underground
        undergroundStrainMicrostrain: Math.round(currentStrain * 10) / 10,
        undergroundHx711Counts: Math.round(currentStrain * 21.0 * 1000),
        undergroundTiltDeg: Math.round(currentTilt * 100) / 100,
        undergroundVibrationMms: Math.round(currentGeophone * 100) / 100,
        methanePctLel: Math.round(currentMethane * 100) / 100,
        convergenceMm: Math.round(currentConvergence * 10) / 10,

        // Legacy / Rollup
        strainMicrostrain: Math.round(currentStrain * 10) / 10,
        tiltAngleDeg: Math.round(currentTilt * 100) / 100,
        geophoneVelocityMms: Math.round(currentGeophone * 100) / 100,
      };

      state.updateTick(
        newTelemetry,
        updatedSensors,
        updatedPillars,
        currentRisk,
        riskStatus,
        newAlert
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);
}
