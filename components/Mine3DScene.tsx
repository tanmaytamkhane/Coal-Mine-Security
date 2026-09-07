'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useDashboardStore } from '../lib/store';
import { Rotate3d, Layers, Camera, AlertOctagon, Info, X } from 'lucide-react';

export interface StrataLayerMetadata {
  id: string;
  name: string;
  depthRL: string;
  subTitle: string;
  category: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  engineeringProperties: {
    label: string;
    value: string;
  }[];
}

const STRATA_LAYERS: Record<string, StrataLayerMetadata> = {
  topsoil: {
    id: 'topsoil',
    name: 'Surface Pithead & Topsoil Strata',
    depthRL: 'RL 0.0 m (Ground Datum)',
    subTitle: 'Quaternary Alluvium & Surface Telemetry',
    category: 'Overburden Strata',
    colorHex: '#38bdf8',
    badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    badgeText: 'SURFACE DATUM',
    description: 'Alluvial soil and weathered stratum hosting Station SF-01 pithead telemetry mast, InSAR satellite radar ground-truth markers, and precision differential GPS.',
    engineeringProperties: [
      { label: 'Lithology', value: 'Weathered Sand & Clay' },
      { label: 'Thickness', value: '18 - 25 m' },
      { label: 'Monitoring', value: 'InSAR Radar + SF-01' },
      { label: 'Subsidence Threshold', value: '15.0 mm Alert' },
    ],
  },
  sandstone: {
    id: 'sandstone',
    name: 'Barakar Sandstone Strata',
    depthRL: 'RL -80.0 m Depth',
    subTitle: 'Massive Coarse Sandstone Formation',
    category: 'Overburden Strata',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    badgeText: 'MAIN OVERBURDEN',
    description: 'Thick competent sedimentary sandstone forming the primary overburden bridging beam. Resists caving until critical cantilever span is reached.',
    engineeringProperties: [
      { label: 'Compressive Strength', value: '45 - 65 MPa' },
      { label: 'Young Modulus (E)', value: '12.4 GPa' },
      { label: 'Strata Role', value: 'Structural Cantilever' },
      { label: 'Caving Risk', value: 'Periodic Main Fall' },
    ],
  },
  shale: {
    id: 'shale',
    name: 'Carbonaceous Shale & Mudstone',
    depthRL: 'RL -160.0 m Depth',
    subTitle: 'Impermeable Argillaceous Aquitard',
    category: 'Impermeable Aquitard',
    colorHex: '#a855f7',
    badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    badgeText: 'AQUITARD BARRIER',
    description: 'Low-permeability fissile carbonaceous shale barrier protecting workings from upper water-bearing Barakar aquifers and dampening seismic shocks.',
    engineeringProperties: [
      { label: 'Permeability', value: '< 10⁻⁸ m/s (Sealed)' },
      { label: 'Tensile Strength', value: '2.8 MPa' },
      { label: 'Water Sealing', value: 'Hydrostatic Aquitard' },
      { label: 'Shear Modulus', value: '4.2 GPa' },
    ],
  },
  roof: {
    id: 'roof',
    name: 'Immediate Mine Roof Strata',
    depthRL: 'RL -244.6 m Depth',
    subTitle: 'Extraction Gallery Ceiling & Sag Zone',
    category: 'Roof Transition',
    colorHex: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    badgeText: 'ACTIVE ROOF HORIZON',
    description: 'Deformable immediate roof horizon directly overlying Seam XII. Reinforced with resin cable bolts; continuously tracked for bed separation and sag troughing.',
    engineeringProperties: [
      { label: 'Deformation Model', value: 'Elastic Sag Trough' },
      { label: 'Support System', value: 'Resin Cable Bolting 2.4m' },
      { label: 'Allowable Sag', value: '5.0 mm Max DGMS' },
      { label: 'FEA Mesh', value: 'Dynamic Convergence' },
    ],
  },
  floor: {
    id: 'floor',
    name: 'Seam XII Extraction Horizon',
    depthRL: 'RL -248.0 m Working Seam',
    subTitle: 'Working Seam Floor & Haulage Gallery',
    category: 'Extraction Seam',
    colorHex: '#ef4444',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    badgeText: 'MINING HORIZON',
    description: 'Sub-bituminous coal seam extraction horizon featuring 16 room-and-pillar blocks, 4.2m haulage galleries, steel TH-yield arches, and rail transport lines.',
    engineeringProperties: [
      { label: 'Roadway Spacing', value: '6.4 m Grid (4.2m Clear)' },
      { label: 'Pillar Dimension', value: '2.2m × 3.4m × 2.2m' },
      { label: 'Floor Heave', value: 'Monitored (Stable)' },
      { label: 'DGMS Standard', value: 'Reg 111 Coal Mines' },
    ],
  },
  shaft: {
    id: 'shaft',
    name: 'Telemetry Shaft & Borehole Conduit',
    depthRL: 'RL 0.0 to -248.0 m',
    subTitle: 'Borehole Telemetry & Power Riser',
    category: 'Infrastructure',
    colorHex: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    badgeText: 'DATA CONDUIT',
    description: 'Cased vertical bore connecting pithead communication hub to gallery junction boxes. Houses RS-485 Modbus telemetry and optical strain fibers.',
    engineeringProperties: [
      { label: 'Casing Diameter', value: '1.6 m Steel-Cased' },
      { label: 'Signal Transit', value: 'Fiber-Optic RS-485' },
      { label: 'Depth Span', value: '248.0 m Column' },
      { label: 'Health Status', value: 'Signal 99.8% Nominal' },
    ],
  },
};

// Procedural texture generators for realistic coal, rock, and strata
function createProceduralCoalTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base dark coal gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#101317');
  grad.addColorStop(0.5, '#1a1f26');
  grad.addColorStop(1, '#0c0e12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Horizontal coal bedding strata planes
  for (let y = 0; y < height; y += 4) {
    const opacity = Math.random() * 0.25;
    ctx.fillStyle = Math.random() > 0.6 ? `rgba(255, 255, 255, ${opacity * 0.35})` : `rgba(0, 0, 0, ${opacity * 0.75})`;
    ctx.fillRect(0, y, width, 2 + Math.random() * 4);
  }

  // Micro-fractures and cleavage facets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + (Math.random() - 0.5) * 45, startY + Math.random() * 30);
    ctx.stroke();
  }

  // Carbon sparkle flecks
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const brightness = Math.floor(Math.random() * 80 + 30);
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 10}, ${Math.random() * 0.28})`;
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
  for (let i = 0; i < 45; i++) {
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

// Procedural texture for Sandstone rock layers
function createSandstoneTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#785b3e';
  ctx.fillRect(0, 0, width, height);

  // Sedimentary stratification
  for (let y = 0; y < height; y += 8) {
    const shade = Math.floor(Math.random() * 40 - 20);
    ctx.fillStyle = `rgba(${120 + shade}, ${90 + shade}, ${60 + shade}, 0.6)`;
    ctx.fillRect(0, y, width, 5 + Math.random() * 6);
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

  // Active strata layer inspection state (hover preview or pinned click)
  const [activeLayer, setActiveLayer] = useState<{ layer: StrataLayerMetadata; pinned: boolean } | null>(null);
  const isLayerPinnedRef = useRef(false);
  isLayerPinnedRef.current = activeLayer?.pinned ?? false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const bgColor = isDarkMode ? 0x070a10 : 0xe8ecf2;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.009); // Spacious, soft atmospheric fog

    // 2. Camera: Framed to comfortably capture both Surface (y=17.5) and Seam XII (y=0..3.4)
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(24, 18, 26);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.target.set(0, 5.0, 0); // Framed around strata mid-elevation
    controlsRef.current = controls;

    // 5. Procedural Textures
    const coalTexture = createProceduralCoalTexture();
    coalTexture.repeat.set(1.5, 2.5);
    const coalBump = createProceduralBumpMap();
    coalBump.repeat.set(1.5, 2.5);

    const floorTexture = createProceduralCoalTexture(256, 256);
    floorTexture.repeat.set(8, 8);
    const floorBump = createProceduralBumpMap(256, 256);
    floorBump.repeat.set(8, 8);

    const sandstoneTexture = createSandstoneTexture();
    sandstoneTexture.repeat.set(3, 1);

    // 6. Realistic Lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x1e293b : 0xf1f5f9, isDarkMode ? 0.95 : 1.3);
    scene.add(ambientLight);

    // Main surface sunlight penetrating the overburden shaft
    const shaftSun = new THREE.DirectionalLight(0xfff5eb, 1.8);
    shaftSun.position.set(18, 38, 18);
    shaftSun.castShadow = true;
    shaftSun.shadow.mapSize.width = 2048;
    shaftSun.shadow.mapSize.height = 2048;
    shaftSun.shadow.camera.near = 0.5;
    shaftSun.shadow.camera.far = 100;
    shaftSun.shadow.camera.left = -22;
    shaftSun.shadow.camera.right = 22;
    shaftSun.shadow.camera.top = 22;
    shaftSun.shadow.camera.bottom = -22;
    shaftSun.shadow.bias = -0.0004;
    scene.add(shaftSun);

    // Gallery lanterns placed at spacious roadway intersections (spacing = 6.4)
    const lanternPositions = [
      new THREE.Vector3(-6.4, 2.85, 0),
      new THREE.Vector3(0, 2.85, 0),
      new THREE.Vector3(6.4, 2.85, 0),
      new THREE.Vector3(0, 2.85, -6.4),
      new THREE.Vector3(0, 2.85, 6.4),
      new THREE.Vector3(-6.4, 2.85, -6.4),
      new THREE.Vector3(6.4, 2.85, 6.4),
    ];

    lanternPositions.forEach((pos) => {
      const pl = new THREE.PointLight(0xf59e0b, 2.6, 16, 1.8);
      pl.position.copy(pos);
      pl.castShadow = true;
      pl.shadow.bias = -0.001;
      scene.add(pl);

      // 3D Lamp fixture housing
      const lampGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.28, 8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      const lampMesh = new THREE.Mesh(lampGeo, lampMat);
      lampMesh.position.copy(pos);
      scene.add(lampMesh);

      // Subtle glow wireframe halo
      const haloGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      scene.add(halo);
    });

    // 7. Mine Floor (Gallery Seam Floor - Spacious 40x40 plane)
    const floorGeo = new THREE.PlaneGeometry(42, 42, 40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x111622 : 0xcfd4dc,
      map: floorTexture,
      bumpMap: floorBump,
      bumpScale: 0.14,
      roughness: 0.88,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.userData = { layerId: 'floor' };
    scene.add(floor);

    // Subtle survey grid on floor
    const gridHelper = new THREE.GridHelper(40, 20, 0xf95721, isDarkMode ? 0x1e293b : 0x94a3b8);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 8. Haulage Tracks & Wooden Sleepers in the Central Roadway
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 });
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x382c22, roughness: 0.9 });

    // Steel rails (spaced 1.1m apart)
    for (const offset of [-0.55, 0.55]) {
      const railGeo = new THREE.BoxGeometry(0.08, 0.1, 36);
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(offset, 0.05, 0);
      rail.castShadow = true;
      scene.add(rail);
    }

    // Wooden cross sleepers
    for (let z = -17; z <= 17; z += 1.2) {
      const sleeperGeo = new THREE.BoxGeometry(1.8, 0.07, 0.24);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(0, 0.035, z);
      sleeper.receiveShadow = true;
      scene.add(sleeper);
    }

    // 3D Coal Tub / Mine Cart sitting comfortably on rails
    const cartGroup = new THREE.Group();
    cartGroup.position.set(0, 0.5, -2.4);

    // Tub body
    const tubGeo = new THREE.BoxGeometry(1.3, 0.75, 2.2);
    const tubMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 });
    const tub = new THREE.Mesh(tubGeo, tubMat);
    tub.castShadow = true;
    cartGroup.add(tub);

    // Tub Coal Mounds inside cart
    const moundGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const moundMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const mound = new THREE.Mesh(moundGeo, moundMat);
      mound.position.set((Math.random() - 0.5) * 0.35, 0.42, (i - 1) * 0.6);
      mound.scale.set(1.3, 0.8, 1.3);
      cartGroup.add(mound);
    }

    // Cart wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    for (const wx of [-0.68, 0.68]) {
      for (const wz of [-0.75, 0.75]) {
        const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, -0.24, wz);
        cartGroup.add(wheel);
      }
    }
    scene.add(cartGroup);

    // 9. Steel Mine Arches (Colliery TH-Yield Arches) along the central roadway
    // Width = 3.2m, fitting comfortably in the 4.2m wide gallery roadway
    const archMat = new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.7, roughness: 0.35 });
    for (let z = -14; z <= 14; z += 5.5) {
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, z);

      // Left leg
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 3.0, 8), archMat);
      legL.position.set(-1.6, 1.5, 0);
      archGroup.add(legL);

      // Right leg
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 3.0, 8), archMat);
      legR.position.set(1.6, 1.5, 0);
      archGroup.add(legR);

      // Curved top header beam
      const topBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 3.3, 8), archMat);
      topBeam.rotation.z = Math.PI / 2;
      topBeam.position.set(0, 3.05, 0);
      archGroup.add(topBeam);

      scene.add(archGroup);
    }

    // 10. Flexible Mine Ventilation Duct along ceiling
    const ductCurve = new THREE.LineCurve3(
      new THREE.Vector3(1.65, 2.9, -17),
      new THREE.Vector3(1.65, 2.9, 17)
    );
    const ductGeo = new THREE.TubeGeometry(ductCurve, 40, 0.24, 12, false);
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.5,
      metalness: 0.1,
    });
    const duct = new THREE.Mesh(ductGeo, ductMat);
    duct.castShadow = true;
    scene.add(duct);

    // 11. Mine Gallery Roof Mesh (Deformable under subsidence)
    const roofGeo = new THREE.PlaneGeometry(38, 38, 40, 40);
    const roofMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x18202e : 0xd1d5db,
      map: coalTexture,
      bumpMap: coalBump,
      bumpScale: 0.14,
      roughness: 0.92,
      side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.y = 3.4;
    roof.receiveShadow = true;
    roof.userData = { layerId: 'roof' };
    scene.add(roof);

    // =========================================================================
    // 12. ELEVATED GEOLOGICAL STRATA OVERBURDEN CUTAWAY (GENEROUS VERTICAL GAP)
    // Surface ground is lifted up to y = 17.5, creating a grand, un-congested
    // 14-unit vertical separation representing the 248-meter strata column!
    // =========================================================================
    const surfaceGroup = new THREE.Group();
    surfaceGroup.position.y = 17.5;

    // Topsoil & Vegetation (RL 0.0m Ground Surface)
    const topsoilGeo = new THREE.BoxGeometry(32, 0.6, 32);
    const topsoilMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1b381b : 0x3f6212,
      roughness: 0.9,
    });
    const topsoil = new THREE.Mesh(topsoilGeo, topsoilMat);
    topsoil.position.y = 0;
    topsoil.userData = { layerId: 'topsoil' };
    surfaceGroup.add(topsoil);

    // Surface InSAR Satellite Radar Deformation Contour Rings
    const insarRingGeo = new THREE.RingGeometry(3.5, 8.0, 48);
    const insarRingMat = new THREE.MeshBasicMaterial({
      color: 0xf95721,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const insarRing = new THREE.Mesh(insarRingGeo, insarRingMat);
    insarRing.rotation.x = Math.PI / 2;
    insarRing.position.y = 0.32;
    surfaceGroup.add(insarRing);

    // Pithead Surface Telemetry Mast (Station SF-01)
    const mastGroup = new THREE.Group();
    mastGroup.position.set(-6.0, 0.3, -6.0);

    const mastPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    mastPole.position.y = 1.3;
    mastGroup.add(mastPole);

    const solarPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.04, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.8 })
    );
    solarPanel.rotation.x = 0.35;
    solarPanel.position.set(0, 2.4, 0);
    mastGroup.add(solarPanel);

    const mastBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    mastBeacon.position.set(0, 2.7, 0);
    mastGroup.add(mastBeacon);

    surfaceGroup.add(mastGroup);

    // Surface Extensometer Ground Pin (SF-02)
    const pinGroup = new THREE.Group();
    pinGroup.position.set(6.0, 0.3, 6.0);
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    pin.position.y = 0.7;
    pinGroup.add(pin);
    surfaceGroup.add(pinGroup);

    // Stratified Geological Layer 1: Barakar Sandstone Strata (RL -80m)
    const sandstoneGeo = new THREE.BoxGeometry(31.6, 2.4, 31.6);
    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x2e3a4e : 0xb45309,
      map: sandstoneTexture,
      transparent: true,
      opacity: 0.28,
      roughness: 0.8,
    });
    const sandstone = new THREE.Mesh(sandstoneGeo, sandstoneMat);
    sandstone.position.y = -3.2;
    sandstone.userData = { layerId: 'sandstone' };
    surfaceGroup.add(sandstone);

    // Stratified Geological Layer 2: Carbonaceous Shale & Mudstone (RL -160m)
    const shaleGeo = new THREE.BoxGeometry(31.2, 2.8, 31.2);
    const shaleMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1c2434 : 0x475569,
      transparent: true,
      opacity: 0.32,
      roughness: 0.85,
    });
    const shale = new THREE.Mesh(shaleGeo, shaleMat);
    shale.position.y = -7.2;
    shale.userData = { layerId: 'shale' };
    surfaceGroup.add(shale);

    // Vertical Shaft Casing connecting Surface to Seam XII
    const shaftGeo = new THREE.CylinderGeometry(0.8, 0.8, 14.1, 16, 1, true);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x334155 : 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const shaftCasing = new THREE.Mesh(shaftGeo, shaftMat);
    shaftCasing.position.set(-12.0, -7.05, -12.0);
    shaftCasing.userData = { layerId: 'shaft' };
    surfaceGroup.add(shaftCasing);

    // Glowing telemetry fiber-optic conduit inside shaft
    const fiberGeo = new THREE.CylinderGeometry(0.04, 0.04, 14.1, 8);
    const fiberMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const fiberLine = new THREE.Mesh(fiberGeo, fiberMat);
    fiberLine.position.set(-12.0, -7.05, -12.0);
    surfaceGroup.add(fiberLine);

    // Engineering Depth Ruler Guidepost with Statutory Depth Markers
    const depthRulerGroup = new THREE.Group();
    depthRulerGroup.position.set(13.0, 0, -13.0);

    const rulerPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 14.5, 12),
      new THREE.MeshBasicMaterial({ color: 0xf95721 })
    );
    rulerPole.position.y = -7.25;
    depthRulerGroup.add(rulerPole);

    // Depth collars
    const collarDepths = [0, -3.2, -7.2, -14.1];
    const collarColors = [0x38bdf8, 0xf59e0b, 0xa855f7, 0xef4444];
    collarDepths.forEach((cy, idx) => {
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.05, 8, 16),
        new THREE.MeshBasicMaterial({ color: collarColors[idx] })
      );
      collar.rotation.x = Math.PI / 2;
      collar.position.y = cy;
      depthRulerGroup.add(collar);
    });

    surfaceGroup.add(depthRulerGroup);
    scene.add(surfaceGroup);
    surfaceGroupRef.current = surfaceGroup;

    // 13. Atmospheric Mine Dust Particles (Floating motes in lantern beams)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = Math.random() * 3.2 + 0.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 28;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.065,
      transparent: true,
      opacity: 0.6,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // =========================================================================
    // 14. 16 PROCEDURAL 3D COAL PILLARS (P-01 to P-16)
    // SPACING EXPANDED TO 6.4 UNITS (4.2m Clear Gallery Width - Zero Congestion!)
    // =========================================================================
    const pillarMeshes = new Map<string, THREE.Mesh>();
    const pillarGeo = new THREE.BoxGeometry(2.2, 3.4, 2.2, 4, 4, 4);

    const spacing = 6.4; // Spacious, open, un-congested room-and-pillar extraction
    const offset = (3 * spacing) / 2; // = 9.6
    const currentPillars = useDashboardStore.getState().pillars;

    currentPillars.forEach((p) => {
      const [row, col] = p.gridPos;
      const posX = col * spacing - offset;
      const posZ = row * spacing - offset;

      const pMat = new THREE.MeshStandardMaterial({
        color: 0x1c222e,
        map: coalTexture,
        bumpMap: coalBump,
        bumpScale: 0.16,
        roughness: 0.72,
        metalness: 0.25,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });

      const mesh = new THREE.Mesh(pillarGeo, pMat);
      mesh.position.set(posX, 1.7, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { pillarId: p.id };

      // Base reinforced footing pad
      const footingGeo = new THREE.BoxGeometry(2.5, 0.22, 2.5);
      const footingMat = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x0f172a : 0x94a3b8,
        roughness: 0.9,
      });
      const footing = new THREE.Mesh(footingGeo, footingMat);
      footing.position.y = -1.6;
      mesh.add(footing);

      // Roof contact cap plate
      const capGeo = new THREE.BoxGeometry(2.4, 0.12, 2.4);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.6,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.65;
      mesh.add(cap);

      // Real Hardware Sensor Probe mounted on critical pillars P-06 and P-10
      if (p.id === 'P-06' || p.id === 'P-10') {
        const probeGroup = new THREE.Group();
        probeGroup.position.set(1.15, 0, 0); // Mounted on pillar rib

        // BF350 Strain sensor probe enclosure
        const probeBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.25, 0.14),
          new THREE.MeshStandardMaterial({ color: 0xe64a19, metalness: 0.8, roughness: 0.2 })
        );
        probeGroup.add(probeBox);

        // Blinking telemetry LED
        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        led.position.set(0.1, 0.08, 0);
        probeGroup.add(led);

        mesh.add(probeGroup);
      }

      scene.add(mesh);
      pillarMeshes.set(p.id, mesh);
    });

    // 15. Raycasting for Mouse Interaction (Pillars + Strata Layers with 2s Hover & Click)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoverTimer: NodeJS.Timeout | null = null;
    let hoveredLayerId: string | null = null;
    const pointerDownPos = { x: 0, y: 0 };
    const layerMeshes: THREE.Mesh[] = [floor, roof, topsoil, sandstone, shale, shaftCasing];

    const getRaycastHits = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Filter layer meshes: only include meshes whose ancestors and self are visible
      const visibleLayerMeshes = layerMeshes.filter(m => {
        if (!m.visible) return false;
        let p = m.parent;
        while (p && p !== scene) {
          if (!p.visible) return false;
          p = p.parent;
        }
        return true;
      });

      const targets = [...Array.from(pillarMeshes.values()), ...visibleLayerMeshes];
      return raycaster.intersectObjects(targets);
    };

    const clearHoverTimer = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      pointerDownPos.x = event.clientX;
      pointerDownPos.y = event.clientY;
      clearHoverTimer();
    };

    const onPointerMove = (event: MouseEvent) => {
      // If buttons !== 0, user is dragging OrbitControls (rotating or panning).
      // Never trigger hover while the user is actively manipulating the camera!
      if (event.buttons !== 0) {
        clearHoverTimer();
        hoveredLayerId = null;
        return;
      }

      const intersects = getRaycastHits(event.clientX, event.clientY);

      if (intersects.length > 0) {
        const topHit = intersects[0].object as THREE.Mesh;
        const layerId = topHit.userData.layerId as string | undefined;

        if (layerId && STRATA_LAYERS[layerId]) {
          if (hoveredLayerId !== layerId) {
            clearHoverTimer();
            hoveredLayerId = layerId;

            // Trigger layer info after 2 seconds (2000ms) of steady hover
            hoverTimer = setTimeout(() => {
              if (!isLayerPinnedRef.current) {
                setActiveLayer({ layer: STRATA_LAYERS[layerId], pinned: false });
              }
            }, 2000);
          }
          return;
        }
      }

      // If hovering empty space or a pillar:
      clearHoverTimer();
      hoveredLayerId = null;
      // If there is an active hover preview that wasn't pinned by a click, dismiss it smoothly
      if (!isLayerPinnedRef.current) {
        setActiveLayer(null);
      }
    };

    const onPointerUp = (event: MouseEvent) => {
      clearHoverTimer();

      // Check drag distance threshold
      const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
      if (dist >= 6) {
        // Was an OrbitControls drag (orbit, pan, or gesture) - ignore click!
        return;
      }

      // Valid intentional click!
      const intersects = getRaycastHits(event.clientX, event.clientY);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pId = hit.userData.pillarId;
        const layerId = hit.userData.layerId;

        if (pId) {
          // Clicked a pillar: select pillar for HUD and dismiss layer card
          selectPillarRef.current(pId);
          setActiveLayer(null);
          return;
        }

        if (layerId && STRATA_LAYERS[layerId]) {
          // Clicked a strata layer: immediately pin layer info card!
          setActiveLayer({ layer: STRATA_LAYERS[layerId], pinned: true });
          return;
        }
      } else {
        // Clicked empty background: dismiss pinned card if open
        if (isLayerPinnedRef.current) {
          setActiveLayer(null);
        }
      }
    };

    const onPointerLeave = () => {
      clearHoverTimer();
      hoveredLayerId = null;
      if (!isLayerPinnedRef.current) {
        setActiveLayer(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

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
        controls.autoRotateSpeed = 0.7;
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
            mat.emissiveIntensity = 0.7;
          } else {
            mat.color.setHex(isDarkMode ? 0x222a38 : 0x5a6578);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });

      // Realistic Dynamic Roof Sag Trough (Calculated across spacious 6.4m grid)
      if (roof && isSim) {
        const posAttr = roof.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          // Centered around yielding pillars (P-06 and P-10 in row 1-2, col 1)
          const dist = Math.sqrt((vx + 3.2) * (vx + 3.2) + (vy + 3.2) * (vy + 3.2));
          if (dist < 9.5) {
            const sag = Math.cos((dist / 9.5) * (Math.PI / 2)) * progress * 1.5;
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
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      clearHoverTimer();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode]);

  // Camera Presets optimized for spacious layout
  const setCameraPreset = (mode: 'iso' | 'walk' | 'top' | 'side') => {
    setCameraView(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'iso') {
      camera.position.set(24, 18, 26);
      controls.target.set(0, 5.0, 0);
    } else if (mode === 'walk') {
      // Standing in the wide 4.2m central haulage gallery between pillars
      camera.position.set(0, 1.7, 12.0);
      controls.target.set(0, 1.7, -12.0);
    } else if (mode === 'top') {
      // Architectural survey plan
      camera.position.set(0, 36, 0.001);
      controls.target.set(0, 0, 0);
    } else if (mode === 'side') {
      // Geological strata cross-section profile
      camera.position.set(36, 9.0, 0);
      controls.target.set(0, 9.0, 0);
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
      <div className="relative w-full h-[660px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 pointer-events-auto shadow-lg">
            <button
              onClick={() => setCameraPreset('iso')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'iso' ? 'bg-[#e64a19] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Isometric 3D
            </button>
            <button
              onClick={() => setCameraPreset('walk')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                cameraView === 'walk' ? 'bg-[#e64a19] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Inspector Gallery</span>
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'top' ? 'bg-[#e64a19] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Top-Down Plan
            </button>
            <button
              onClick={() => setCameraPreset('side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'side' ? 'bg-[#e64a19] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
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
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Surface & Strata Overburden ({showOverburden ? 'VISIBLE' : 'HIDDEN'})</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg ${
                autoRotate
                  ? 'bg-[#e64a19] text-white border-[#e64a19]'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>360° Orbit</span>
            </button>
          </div>
        </div>

        {/* Dynamic Strata Layer Inspector Card (2-Second Hover or Click) */}
        {activeLayer ? (
          <div
            className={`absolute top-16 right-4 z-20 max-w-sm w-80 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2 pointer-events-auto ${
              isDarkMode
                ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/60'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/70'
            }`}
          >
            {/* Header: Status badge & Dismiss button */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: activeLayer.layer.colorHex }}
                />
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${activeLayer.layer.badgeBg}`}
                >
                  {activeLayer.layer.badgeText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {activeLayer.pinned ? '📌 Pinned' : '⏱️ 2s Dwell'}
                </span>
                <button
                  onClick={() => setActiveLayer(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Close strata inspector"
                  title="Close strata inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Layer Title & Elevation Datum */}
            <div className="mb-2.5">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                {activeLayer.layer.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono font-semibold text-[#e64a19] dark:text-[#ff7a45]">
                  {activeLayer.layer.depthRL}
                </span>
                <span className="text-[10px] text-slate-400">• {activeLayer.layer.category}</span>
              </div>
            </div>

            {/* Geological Description */}
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {activeLayer.layer.description}
            </p>

            {/* Engineering Specifications Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono mb-2.5">
              {activeLayer.layer.engineeringProperties.map((prop, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <span className="text-slate-400 block text-[9px] font-sans truncate">{prop.label}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {prop.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Interaction Tip */}
            <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span>{activeLayer.pinned ? 'Click canvas or ✕ to dismiss' : 'Click layer to keep pinned'}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">
                Strata Radar
              </span>
            </div>
          </div>
        ) : (
          /* Discreet Discoverability Hint when no layer is active */
          <div className="absolute top-16 right-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md text-[11px] text-slate-500 dark:text-slate-400 font-mono transition-opacity duration-300">
            <Info className="w-3.5 h-3.5 text-[#e64a19]" />
            <span>Hover layer 2s or click to inspect strata</span>
          </div>
        )}

        {/* Selected Pillar Inspector Hologram HUD */}
        <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e64a19] animate-pulse" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
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

          <div className="grid grid-cols-3 gap-2 text-center text-xs my-3 font-mono">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans">Factor of Safety</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                FoS {selectedPillar.factorOfSafety.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans">Stress Load</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedPillar.stressMpa.toFixed(1)} <span className="text-[10px] font-normal">MPa</span>
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans">Displacement</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedPillar.displacementMm.toFixed(1)} <span className="text-[10px] font-normal">mm</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Click any 3D pillar to inspect. Switch to <strong>Inspector Gallery</strong> to walk along the 4.2m haulage roadway between steel arches.
          </p>
        </div>

        {/* Bottom Right: Color Legend & Subsidence Indicator */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs space-y-1.5 pointer-events-auto">
          {isSubsidenceSimActive && (
            <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-700 text-red-500 font-bold text-[11px] animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Strata Sagging Trough Active</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">FoS &gt; 2.0 (Stable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-amber-500 shadow-sm" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">FoS 1.5 - 2.0 (Stressed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-red-500 shadow-sm animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">FoS &lt; 1.5 (Critical Yield)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
