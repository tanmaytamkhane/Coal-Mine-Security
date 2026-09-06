import { useEffect, useRef } from 'react';
import { useDashboardStore } from './store';
import { THRESHOLDS } from './constants';
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
    const interval = setInterval(() => {
      const state = useDashboardStore.getState();
      tickCountRef.current += 1;
      const t = tickCountRef.current;

      const isSim = state.isSubsidenceSimActive;
      let progress = state.simProgress;

      if (isSim && progress < 1) {
        progress = Math.min(1, progress + 0.07);
        useDashboardStore.setState({ simProgress: progress });
      }

      // Smooth physics baseline: Slow drift + subtle noise
      const driftSine = Math.sin(t * 0.15);
      const driftCos = Math.cos(t * 0.1);
      const noise = (Math.random() - 0.5);

      // Baseline values
      let currentStrain = 145 + driftSine * 6 + noise * 3;
      let currentTilt = 0.36 + driftCos * 0.03 + noise * 0.01;
      let currentGeophone = 0.18 + Math.abs(noise) * 0.12;
      let currentRisk = 22 + Math.round(driftSine * 4);
      let riskStatus: 'normal' | 'caution' | 'critical' = 'normal';

      let newAlert: Alert | undefined = undefined;

      if (isSim) {
        // Ramp sensor physics towards critical thresholds
        const strainMultiplier = 1 + progress * 3.8;
        const tiltMultiplier = 1 + progress * 8.5;
        const geoMultiplier = 1 + progress * 65.0;

        currentStrain = currentStrain * strainMultiplier;
        currentTilt = currentTilt * tiltMultiplier;
        currentGeophone = currentGeophone * geoMultiplier;
        currentRisk = Math.min(96, Math.round(24 + progress * 72));

        if (progress > 0.4 && progress < 0.75) {
          riskStatus = 'caution';
          if (!alertedWarningRef.current) {
            alertedWarningRef.current = true;
            if (!state.isAudioMuted) playAlertChime(false);
            newAlert = {
              id: `ALT-${Date.now().toString().slice(-4)}`,
              timestamp: 'Just now',
              title: 'CAUTION: Accelerated Roof Strata Dilation',
              message: `Pillar P-06 strain reached ${Math.round(currentStrain)} µε. Exceeds DGMS Level-1 trigger limit.`,
              severity: 'warning',
              nodeId: 'NODE-SG-01',
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
              title: 'CRITICAL EMERGENCY: Strata Subsidence Imminent',
              message: `Pillar P-06 / P-11 yielded. Factor of Safety dropped to 0.92. Triggering automated mine evacuation protocol.`,
              severity: 'critical',
              nodeId: 'NODE-TM-01',
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

      // Update Individual Sensor Nodes
      const updatedSensors: SensorNode[] = state.sensors.map((sensor) => {
        let val = sensor.currentValue;
        let sStatus: SensorNode['status'] = 'normal';

        if (sensor.type === 'strain_gauge') {
          const isFailingNode = sensor.id === 'NODE-SG-01' || sensor.id === 'NODE-SG-02';
          val = isFailingNode ? currentStrain : 135 + noise * 4;
          if (val >= THRESHOLDS.strain.critical) sStatus = 'critical';
          else if (val >= THRESHOLDS.strain.warning) sStatus = 'warning';
        } else if (sensor.type === 'tiltmeter') {
          const isFailingTilt = sensor.id === 'NODE-TM-01' || sensor.id === 'NODE-TM-02';
          val = isFailingTilt ? currentTilt : 0.32 + noise * 0.02;
          if (val >= THRESHOLDS.tilt.critical) sStatus = 'critical';
          else if (val >= THRESHOLDS.tilt.warning) sStatus = 'warning';
        } else if (sensor.type === 'geophone') {
          val = currentGeophone;
          if (val >= THRESHOLDS.geophone.critical) sStatus = 'critical';
          else if (val >= THRESHOLDS.geophone.warning) sStatus = 'warning';
        }

        return {
          ...sensor,
          currentValue: Math.round(val * 100) / 100,
          status: sStatus,
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
        strainMicrostrain: Math.round(currentStrain * 10) / 10,
        tiltAngleDeg: Math.round(currentTilt * 100) / 100,
        geophoneVelocityMms: Math.round(currentGeophone * 100) / 100,
        riskScore: currentRisk,
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
