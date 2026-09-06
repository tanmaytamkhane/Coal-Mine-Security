'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useDashboardStore } from '../lib/store';
import { Rotate3d, Layers, Camera, AlertOctagon } from 'lucide-react';

// Procedural texture generators for realistic coal, rock, and strata
function createProceduralCoalTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base dark coal gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#121418');
  grad.addColorStop(0.5, '#1e2229');
  grad.addColorStop(1, '#0e1013');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Horizontal coal bedding strata planes
  for (let y = 0; y < height; y += 4) {
    const opacity = Math.random() * 0.25;
    ctx.fillStyle = Math.random() > 0.6 ? `rgba(255, 255, 255, ${opacity * 0.4})` : `rgba(0, 0, 0, ${opacity * 0.8})`;
    ctx.fillRect(0, y, width, 2 + Math.random() * 4);
  }

  // Micro-fractures and cleavage facets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + (Math.random() - 0.5) * 40, startY + Math.random() * 25);
    ctx.stroke();
  }

  // Carbon sparkle flecks
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const brightness = Math.floor(Math.random() * 80 + 30);
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 10}, ${Math.random() * 0.3})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createProceduralBumpMap(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // High-frequency noise for rough faceted rock facets
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 90;
    const v = Math.min(255, Math.max(0, 128 + noise));
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
  }
  ctx.putImageData(imgData, 0, 0);

  // Deep fracture grooves
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function Mine3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    pillars,
    selectedPillarId,
    selectPillar,
    isDarkMode,
    isSubsidenceSimActive
  } = useDashboardStore();

  const [cameraView, setCameraView] = useState<'iso' | 'walk' | 'top' | 'side'>('iso');
  const [showOverburden, setShowOverburden] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const selectPillarRef = useRef(selectPillar);
  selectPillarRef.current = selectPillar;

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const surfaceGroupRef = useRef<THREE.Group | null>(null);

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[5];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const bgColor = isDarkMode ? 0x080c14 : 0xebedf2;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.018);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(16, 12, 17);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // 5. Procedural Textures
    const coalTexture = createProceduralCoalTexture();
    coalTexture.repeat.set(1.5, 2.5);
    const coalBump = createProceduralBumpMap();
    coalBump.repeat.set(1.5, 2.5);

    const floorTexture = createProceduralCoalTexture(256, 256);
    floorTexture.repeat.set(6, 6);
    const floorBump = createProceduralBumpMap(256, 256);
    floorBump.repeat.set(6, 6);

    // 6. Realistic Lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x1e293b : 0xf8fafc, isDarkMode ? 0.9 : 1.2);
    scene.add(ambientLight);

    // Main surface sunlight penetrating overburden shaft
    const shaftSun = new THREE.DirectionalLight(0xfff7ed, 1.6);
    shaftSun.position.set(14, 28, 14);
    shaftSun.castShadow = true;
    shaftSun.shadow.mapSize.width = 2048;
    shaftSun.shadow.mapSize.height = 2048;
    shaftSun.shadow.camera.near = 0.5;
    shaftSun.shadow.camera.far = 80;
    shaftSun.shadow.camera.left = -16;
    shaftSun.shadow.camera.right = 16;
    shaftSun.shadow.camera.top = 16;
    shaftSun.shadow.camera.bottom = -16;
    shaftSun.shadow.bias = -0.0005;
    scene.add(shaftSun);

    // Underground cap-lamp spotlights & amber tungsten lanterns
    const lanternColors = [0xf97316, 0xf59e0b, 0x38bdf8];
    const lanternPositions = [
      new THREE.Vector3(-4.5, 2.7, 0),
      new THREE.Vector3(0, 2.7, 0),
      new THREE.Vector3(4.5, 2.7, 0),
      new THREE.Vector3(0, 2.7, -4.5),
      new THREE.Vector3(0, 2.7, 4.5),
    ];

    lanternPositions.forEach((pos, idx) => {
      const pl = new THREE.PointLight(lanternColors[idx % lanternColors.length], 2.4, 14, 1.8);
      pl.position.copy(pos);
      pl.castShadow = true;
      pl.shadow.bias = -0.001;
      scene.add(pl);

      // 3D Lamp fixture housing
      const lampGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.25, 8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      const lampMesh = new THREE.Mesh(lampGeo, lampMat);
      lampMesh.position.copy(pos);
      scene.add(lampMesh);

      // Subtle glow wireframe halo
      const haloGeo = new THREE.SphereGeometry(0.22, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true, transparent: true, opacity: 0.4 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      scene.add(halo);
    });

    // 7. Mine Floor (Gallery Seam Floor)
    const floorGeo = new THREE.PlaneGeometry(32, 32, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x111622 : 0xcfd4dc,
      map: floorTexture,
      bumpMap: floorBump,
      bumpScale: 0.12,
      roughness: 0.88,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // 8. Haulage Tracks, Wooden Sleepers, & Coal Tub
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x33261d, roughness: 0.9 });

    // Steel rails
    for (const offset of [-0.45, 0.45]) {
      const railGeo = new THREE.BoxGeometry(0.08, 0.09, 28);
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(offset, 0.05, 0);
      rail.castShadow = true;
      scene.add(rail);
    }

    // Wooden cross sleepers
    for (let z = -13; z <= 13; z += 1.0) {
      const sleeperGeo = new THREE.BoxGeometry(1.4, 0.07, 0.22);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(0, 0.035, z);
      sleeper.receiveShadow = true;
      scene.add(sleeper);
    }

    // 3D Coal Tub / Mine Cart sitting on rails
    const cartGroup = new THREE.Group();
    cartGroup.position.set(0, 0.45, -1.8);

    // Tub body
    const tubGeo = new THREE.BoxGeometry(1.1, 0.65, 1.8);
    const tubMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 });
    const tub = new THREE.Mesh(tubGeo, tubMat);
    tub.castShadow = true;
    cartGroup.add(tub);

    // Tub Coal Mounds inside cart
    const moundGeo = new THREE.DodecahedronGeometry(0.4, 1);
    const moundMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const mound = new THREE.Mesh(moundGeo, moundMat);
      mound.position.set((Math.random() - 0.5) * 0.3, 0.35, (i - 1) * 0.5);
      mound.scale.set(1.2, 0.8, 1.2);
      cartGroup.add(mound);
    }

    // Cart wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    for (const wx of [-0.55, 0.55]) {
      for (const wz of [-0.6, 0.6]) {
        const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, -0.22, wz);
        cartGroup.add(wheel);
      }
    }
    scene.add(cartGroup);

    // 9. Steel Mine Arches (Colliery TH-Arches) along the central roadway
    const archMat = new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.7, roughness: 0.35 });
    for (let z = -9; z <= 9; z += 4.5) {
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, z);

      // Left leg
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), archMat);
      legL.position.set(-1.4, 1.4, 0);
      archGroup.add(legL);

      // Right leg
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), archMat);
      legR.position.set(1.4, 1.4, 0);
      archGroup.add(legR);

      // Curved top header beam
      const topBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.9, 8), archMat);
      topBeam.rotation.z = Math.PI / 2;
      topBeam.position.set(0, 2.85, 0);
      archGroup.add(topBeam);

      scene.add(archGroup);
    }

    // 10. Flexible Mine Ventilation Duct along ceiling
    const ductCurve = new THREE.LineCurve3(
      new THREE.Vector3(1.3, 2.75, -12),
      new THREE.Vector3(1.3, 2.75, 12)
    );
    const ductGeo = new THREE.TubeGeometry(ductCurve, 32, 0.22, 12, false);
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.5,
      metalness: 0.1,
    });
    const duct = new THREE.Mesh(ductGeo, ductMat);
    duct.castShadow = true;
    scene.add(duct);

    // 11. Mine Gallery Roof Mesh (Deformable under subsidence)
    const roofGeo = new THREE.PlaneGeometry(28, 28, 36, 36);
    const roofMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1a2130 : 0xd1d5db,
      map: coalTexture,
      bumpMap: coalBump,
      bumpScale: 0.14,
      roughness: 0.92,
      side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.y = 3.2;
    roof.receiveShadow = true;
    scene.add(roof);

    // 12. Geological Strata Overburden Cutaway Layers
    const surfaceGroup = new THREE.Group();
    surfaceGroup.position.y = 9.8;

    // Stratified Geological Layer 1: Topsoil & Vegetation (0m)
    const topsoilGeo = new THREE.BoxGeometry(26, 0.5, 26);
    const topsoilMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e3a1e : 0x4d7c0f,
      roughness: 0.9,
    });
    const topsoil = new THREE.Mesh(topsoilGeo, topsoilMat);
    topsoil.position.y = 0;
    surfaceGroup.add(topsoil);

    // Surface InSAR Satellite Radar Deformation Contour Rings
    const insarRingGeo = new THREE.RingGeometry(3.0, 6.5, 48);
    const insarRingMat = new THREE.MeshBasicMaterial({
      color: 0xf95721,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const insarRing = new THREE.Mesh(insarRingGeo, insarRingMat);
    insarRing.rotation.x = Math.PI / 2;
    insarRing.position.y = 0.28;
    surfaceGroup.add(insarRing);

    // Stratified Layer 2: Barakar Sandstone Strata (~80m depth)
    const sandstoneGeo = new THREE.BoxGeometry(25.6, 2.5, 25.6);
    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x334155 : 0xb45309,
      transparent: true,
      opacity: 0.22,
      roughness: 0.8,
    });
    const sandstone = new THREE.Mesh(sandstoneGeo, sandstoneMat);
    sandstone.position.y = -1.5;
    surfaceGroup.add(sandstone);

    // Stratified Layer 3: Hard Carbonaceous Shale Overburden (~160m depth)
    const shaleGeo = new THREE.BoxGeometry(25.2, 3.2, 25.2);
    const shaleMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e293b : 0x64748b,
      transparent: true,
      opacity: 0.25,
      roughness: 0.85,
    });
    const shale = new THREE.Mesh(shaleGeo, shaleMat);
    shale.position.y = -4.3;
    surfaceGroup.add(shale);

    // Depth Ruler Pillar Guidepost
    const shaftPipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 10, 16);
    const shaftPipeMat = new THREE.MeshBasicMaterial({ color: 0xf95721 });
    const shaftPipe = new THREE.Mesh(shaftPipeGeo, shaftPipeMat);
    shaftPipe.position.set(-11, -5.0, -11);
    surfaceGroup.add(shaftPipe);

    scene.add(surfaceGroup);
    surfaceGroupRef.current = surfaceGroup;

    // 13. Atmospheric Mine Dust Particles (Floating motes in lantern beams)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = Math.random() * 3.0 + 0.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 14. 16 Procedural 3D Coal Pillars (P-01 to P-16)
    const pillarMeshes = new Map<string, THREE.Mesh>();
    const pillarGeo = new THREE.BoxGeometry(2.1, 3.2, 2.1, 4, 4, 4);

    const spacing = 4.6;
    const offset = (3 * spacing) / 2;
    const currentPillars = useDashboardStore.getState().pillars;

    currentPillars.forEach((p) => {
      const [row, col] = p.gridPos;
      const posX = col * spacing - offset;
      const posZ = row * spacing - offset;

      const pMat = new THREE.MeshStandardMaterial({
        color: 0x1e2430,
        map: coalTexture,
        bumpMap: coalBump,
        bumpScale: 0.16,
        roughness: 0.72,
        metalness: 0.25,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });

      const mesh = new THREE.Mesh(pillarGeo, pMat);
      mesh.position.set(posX, 1.6, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { pillarId: p.id };

      // Base reinforced footing pad
      const footingGeo = new THREE.BoxGeometry(2.35, 0.22, 2.35);
      const footingMat = new THREE.MeshStandardMaterial({ color: isDarkMode ? 0x0f172a : 0x94a3b8, roughness: 0.9 });
      const footing = new THREE.Mesh(footingGeo, footingMat);
      footing.position.y = -1.5;
      mesh.add(footing);

      // Roof contact cap plate
      const capGeo = new THREE.BoxGeometry(2.3, 0.12, 2.3);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.55;
      mesh.add(cap);

      scene.add(mesh);
      pillarMeshes.set(p.id, mesh);
    });

    // 15. Raycasting for Mouse Interaction
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

    // 16. Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 17. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Controls update
      if (autoRotateRef.current) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
      } else {
        controls.autoRotate = false;
      }
      controls.update();

      // Subtle float for atmospheric dust particles
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime * 2 + i) * 0.003;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // InSAR Ring pulse
      insarRing.scale.setScalar(1 + Math.sin(elapsedTime * 2.5) * 0.04);

      // Read Live Store State
      const state = useDashboardStore.getState();
      const livePillars = state.pillars;
      const isSim = state.isSubsidenceSimActive;
      const progress = state.simProgress;

      // Dynamic Pillar Stress Updates
      livePillars.forEach((pillar) => {
        const mesh = pillarMeshes.get(pillar.id);
        if (!mesh) return;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isSelected = pillar.id === state.selectedPillarId;

        if (pillar.status === 'critical' || pillar.factorOfSafety < 1.3) {
          const pulse = Math.sin(elapsedTime * 9) * 0.4 + 0.6;
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0xdc2626);
          mat.emissiveIntensity = pulse * 2.0;
        } else if (pillar.status === 'stressed' || pillar.factorOfSafety < 1.9) {
          const pulse = Math.sin(elapsedTime * 4) * 0.2 + 0.4;
          mat.color.setHex(0xf59e0b);
          mat.emissive.setHex(0xd97706);
          mat.emissiveIntensity = pulse * 1.0;
        } else {
          if (isSelected) {
            mat.color.setHex(0xf95721);
            mat.emissive.setHex(0xf95721);
            mat.emissiveIntensity = 0.6;
          } else {
            mat.color.setHex(isDarkMode ? 0x222a38 : 0x5a6578);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });

      // Realistic Dynamic Roof Sag Trough (Roof deflects downward above yielding pillars)
      if (roof && isSim) {
        const posAttr = roof.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const dist = Math.sqrt((vx - 1.8) * (vx - 1.8) + (vy - 1.8) * (vy - 1.8));
          if (dist < 7.5) {
            const sag = Math.cos((dist / 7.5) * (Math.PI / 2)) * progress * 1.4;
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

  // Camera Presets
  const setCameraPreset = (mode: 'iso' | 'walk' | 'top' | 'side') => {
    setCameraView(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'iso') {
      camera.position.set(16, 12, 17);
      controls.target.set(0, 1.5, 0);
    } else if (mode === 'walk') {
      // First-person eye-level standing in the haulage drive between pillars!
      camera.position.set(0, 1.6, 7.5);
      controls.target.set(0, 1.6, -6.0);
    } else if (mode === 'top') {
      camera.position.set(0, 24, 0.001);
      controls.target.set(0, 0, 0);
    } else if (mode === 'side') {
      camera.position.set(22, 2.8, 0);
      controls.target.set(0, 1.5, 0);
    }
  };

  const toggleOverburden = () => {
    const next = !showOverburden;
    setShowOverburden(next);
    if (surfaceGroupRef.current) {
      surfaceGroupRef.current.visible = next;
    }
  };

  return (
    <div className="space-y-4">
      {/* 3D Scene Viewport */}
      <div className="relative w-full h-[640px] rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-2xl bg-gray-900">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-800 pointer-events-auto shadow-lg">
            <button
              onClick={() => setCameraPreset('iso')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'iso' ? 'bg-safety-500 text-white shadow-sm' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Isometric 3D
            </button>
            <button
              onClick={() => setCameraPreset('walk')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                cameraView === 'walk' ? 'bg-safety-500 text-white shadow-sm' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Inspector Viewpoint</span>
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'top' ? 'bg-safety-500 text-white shadow-sm' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Top-Down Plan
            </button>
            <button
              onClick={() => setCameraPreset('side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'side' ? 'bg-safety-500 text-white shadow-sm' : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Strata Cross-Section
            </button>
          </div>

          {/* Layer & Auto-Rotate Toggles */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={toggleOverburden}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg ${
                showOverburden
                  ? 'bg-emerald-500/90 text-white border-emerald-400'
                  : 'bg-white/90 dark:bg-slate-900/90 text-gray-500 border-gray-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overburden & InSAR ({showOverburden ? 'ON' : 'OFF'})</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg ${
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

        {/* Selected Pillar Inspector Hologram HUD */}
        <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800 shadow-2xl max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-safety-500 animate-pulse" />
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                {selectedPillar.name}
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              selectedPillar.status === 'critical'
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
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
            Click any 3D coal pillar to inspect. Switch to <strong>Inspector Viewpoint</strong> to walk down the haulage gallery between steel arches!
          </p>
        </div>

        {/* Bottom Right: Color Legend & Subsidence Indicator */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-800 shadow-lg text-xs space-y-1.5 pointer-events-auto">
          {isSubsidenceSimActive && (
            <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-gray-200 dark:border-slate-700 text-red-500 font-bold text-[11px] animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Strata Sagging Trough Active</span>
            </div>
          )}
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
