'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useDashboardStore } from '../lib/store';
import { Rotate3d, Layers } from 'lucide-react';

export function Mine3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    pillars,
    selectedPillarId,
    selectPillar,
    isDarkMode
  } = useDashboardStore();

  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'side'>('iso');
  const [showOverburden, setShowOverburden] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  // References to keep animation loop decoupled from React state churn
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const selectPillarRef = useRef(selectPillar);
  selectPillarRef.current = selectPillar;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pillarMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const roofMeshRef = useRef<THREE.Mesh | null>(null);
  const surfaceGridRef = useRef<THREE.Group | null>(null);

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[5];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = isDarkMode ? 0x090d16 : 0xf4f5f8;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(16, 14, 18);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x334155 : 0xffffff, isDarkMode ? 1.2 : 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.5);
    sunLight.position.set(12, 25, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Mine lantern lights
    const lantern1 = new THREE.PointLight(0xf97316, 2.0, 15);
    lantern1.position.set(0, 2.8, 0);
    scene.add(lantern1);

    const lantern2 = new THREE.PointLight(0x38bdf8, 1.5, 20);
    lantern2.position.set(0, 8.0, 0);
    scene.add(lantern2);

    // 6. Mine Floor (Gallery Seam Floor)
    const floorGeo = new THREE.PlaneGeometry(28, 28, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x0f172a : 0xe2e8f0,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Haulage Railway Tracks
    const trackMat = new THREE.MeshBasicMaterial({ color: isDarkMode ? 0x475569 : 0x94a3b8 });
    for (const offset of [-0.4, 0.4]) {
      const railGeo = new THREE.BoxGeometry(0.08, 0.06, 24);
      const rail = new THREE.Mesh(railGeo, trackMat);
      rail.position.set(offset, 0.03, 0);
      scene.add(rail);
    }

    // Roadway Grid Floor Lines
    const gridHelper = new THREE.GridHelper(24, 12, 0xf97316, isDarkMode ? 0x1e293b : 0xcbd5e1);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 7. Mine Gallery Roof Mesh (Deformable when subsidence occurs)
    const roofGeo = new THREE.PlaneGeometry(24, 24, 24, 24);
    const roofMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e293b : 0xd1d5db,
      roughness: 0.9,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.y = 3.2;
    roof.receiveShadow = true;
    scene.add(roof);
    roofMeshRef.current = roof;

    // 8. Overburden & Surface InSAR Layer (Upper Strata Cutaway)
    const surfaceGroup = new THREE.Group();
    surfaceGroup.position.y = 9.5;

    const surfaceGrid = new THREE.GridHelper(26, 26, 0x10b981, isDarkMode ? 0x064e3b : 0xa7f3d0);
    surfaceGroup.add(surfaceGrid);

    // InSAR Satellite Radar Contour Ring
    const ringGeo = new THREE.RingGeometry(2.5, 5.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf95721,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const insarRing = new THREE.Mesh(ringGeo, ringMat);
    insarRing.rotation.x = Math.PI / 2;
    insarRing.position.y = 0.05;
    surfaceGroup.add(insarRing);

    // Translucent strata volume layer
    const strataGeo = new THREE.BoxGeometry(24, 6.0, 24);
    const strataMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e293b : 0x94a3b8,
      transparent: true,
      opacity: 0.08,
      roughness: 0.6,
    });
    const strataBox = new THREE.Mesh(strataGeo, strataMat);
    strataBox.position.set(0, -3.0, 0);
    surfaceGroup.add(strataBox);

    scene.add(surfaceGroup);
    surfaceGridRef.current = surfaceGroup;

    // 9. Generate 16 3D Coal Pillars (P-01 to P-16)
    const pillarMeshes = new Map<string, THREE.Mesh>();
    const pillarGeo = new THREE.BoxGeometry(2.0, 3.2, 2.0);

    const spacing = 4.6;
    const offset = (3 * spacing) / 2;

    const currentPillars = useDashboardStore.getState().pillars;
    currentPillars.forEach((p) => {
      const [row, col] = p.gridPos;
      const posX = col * spacing - offset;
      const posZ = row * spacing - offset;

      const pMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.2,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(pillarGeo, pMat);
      mesh.position.set(posX, 1.6, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { pillarId: p.id };

      // Footer trim
      const footerGeo = new THREE.BoxGeometry(2.2, 0.2, 2.2);
      const footerMat = new THREE.MeshStandardMaterial({ color: isDarkMode ? 0x0f172a : 0x94a3b8 });
      const footer = new THREE.Mesh(footerGeo, footerMat);
      footer.position.y = -1.5;
      mesh.add(footer);

      scene.add(mesh);
      pillarMeshes.set(p.id, mesh);
    });

    pillarMeshesRef.current = pillarMeshes;

    // 10. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(pillarMeshes.values()));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pId = hit.userData.pillarId;
        if (pId) {
          selectPillarRef.current(pId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 11. Resize Listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotateRef.current) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
      } else {
        controls.autoRotate = false;
      }
      controls.update();

      // Read live store state for dynamic pillar coloring & roof deformation
      const state = useDashboardStore.getState();
      const livePillars = state.pillars;
      const isSim = state.isSubsidenceSimActive;
      const progress = state.simProgress;

      // Update Pillars
      livePillars.forEach((pillar) => {
        const mesh = pillarMeshes.get(pillar.id);
        if (!mesh) return;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isSelected = pillar.id === state.selectedPillarId;

        // Determine colors based on Factor of Safety (FoS)
        if (pillar.status === 'critical' || pillar.factorOfSafety < 1.3) {
          const pulse = Math.sin(elapsedTime * 9) * 0.4 + 0.6;
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0xdc2626);
          mat.emissiveIntensity = pulse * 1.5;
        } else if (pillar.status === 'stressed' || pillar.factorOfSafety < 1.9) {
          const pulse = Math.sin(elapsedTime * 4) * 0.2 + 0.4;
          mat.color.setHex(0xf59e0b);
          mat.emissive.setHex(0xd97706);
          mat.emissiveIntensity = pulse * 0.8;
        } else {
          if (isSelected) {
            mat.color.setHex(0xf95721);
            mat.emissive.setHex(0xf95721);
            mat.emissiveIntensity = 0.5;
          } else {
            mat.color.setHex(isDarkMode ? 0x1e293b : 0x475569);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });

      // Deform Roof Mesh dynamically during Subsidence Event (Sagging Roof Trough)
      if (roof && isSim) {
        const posAttr = roof.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const dist = Math.sqrt((vx - 1.5) * (vx - 1.5) + (vy - 1.5) * (vy - 1.5));
          if (dist < 6.0) {
            const sag = Math.cos((dist / 6.0) * (Math.PI / 2)) * progress * 1.2;
            posAttr.setZ(i, -sag);
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode]);

  const setCameraPreset = (mode: 'iso' | 'top' | 'side') => {
    setCameraView(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'iso') {
      camera.position.set(16, 14, 18);
      controls.target.set(0, 1.5, 0);
    } else if (mode === 'top') {
      camera.position.set(0, 24, 0.001);
      controls.target.set(0, 0, 0);
    } else if (mode === 'side') {
      camera.position.set(22, 2.5, 0);
      controls.target.set(0, 1.5, 0);
    }
  };

  const toggleOverburden = () => {
    const next = !showOverburden;
    setShowOverburden(next);
    if (surfaceGridRef.current) {
      surfaceGridRef.current.visible = next;
    }
  };

  return (
    <div className="space-y-4">
      {/* 3D Scene Viewport */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-xl bg-gray-50 dark:bg-[#090d16]">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          {/* Left: View Presets */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-800 pointer-events-auto shadow-md">
            <button
              onClick={() => setCameraPreset('iso')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'iso'
                  ? 'bg-safety-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Isometric 3D
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'top'
                  ? 'bg-safety-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Top-Down Plan
            </button>
            <button
              onClick={() => setCameraPreset('side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'side'
                  ? 'bg-safety-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Cross-Section
            </button>
          </div>

          {/* Right: Layers & Toggles */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={toggleOverburden}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md ${
                showOverburden
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white/90 dark:bg-slate-900/90 text-gray-500 border-gray-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Surface Overburden ({showOverburden ? 'ON' : 'OFF'})</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md ${
                autoRotate
                  ? 'bg-safety-500 text-white border-safety-500'
                  : 'bg-white/90 dark:bg-slate-900/90 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-800'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>
          </div>
        </div>

        {/* Floating Hologram HUD: Selected Pillar Inspector */}
        <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-gray-200/80 dark:border-slate-800 shadow-2xl max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-safety-500 animate-pulse" />
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                {selectedPillar.name}
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              selectedPillar.status === 'critical'
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                : selectedPillar.status === 'stressed'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {selectedPillar.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs my-3">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <span className="text-[10px] text-gray-400 block">Factor of Safety</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                FoS {selectedPillar.factorOfSafety.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <span className="text-[10px] text-gray-400 block">Stress Load</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                {selectedPillar.stressMpa.toFixed(1)} <span className="text-[10px] font-normal">MPa</span>
              </span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <span className="text-[10px] text-gray-400 block">Displacement</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                {selectedPillar.displacementMm.toFixed(1)} <span className="text-[10px] font-normal">mm</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-slate-400">
            Click any 3D pillar to inspect. Drag to orbit 360°, scroll to zoom in/out.
          </p>
        </div>

        {/* Bottom Right: Color Legend */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-800 shadow-lg text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
            <span className="text-gray-700 dark:text-slate-300 font-medium">FoS &gt; 2.0 (Stable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-amber-500 shadow-sm" />
            <span className="text-gray-700 dark:text-slate-300 font-medium">FoS 1.5 - 2.0 (Stressed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-red-500 shadow-sm animate-pulse" />
            <span className="text-gray-700 dark:text-slate-300 font-medium">FoS &lt; 1.5 (Critical Yield)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
