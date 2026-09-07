<div align="center">

# ⛏️ TASQ COAL — NMS-SEWS
### National Mine Strata Telemetry & Subsidence Early Warning System
**Smart India Hackathon 2026 • Problem Statement: SIH26025**  
*Ministry of Coal • Directorate General of Mines Safety (DGMS) • CMPDI Framework*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-0496ff?style=flat&logo=three.js)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-InSAR_GIS-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Inference-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-3.2.0-orange?style=flat)](https://xgboost.readthedocs.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![DGMS Statutory Compliance](https://img.shields.io/badge/DGMS_Statutory_Compliance-CMR--2017_Reg_111%2F112-red?style=flat)](https://dgms.gov.in/)

</div>

---

## 📌 1. Executive Summary & Problem Statement (SIH26025)

Underground bord-and-pillar and longwall coal mining in India accounts for vital domestic coal extraction across major basins (Jharia, Raniganj, Singrauli, Korba). However, depillaring operations fundamentally disturb subterranean stress equilibrium, inducing severe strata dilation, bed separation, roof fracturing, and catastrophic surface subsidence depression troughs.

### Key Industrial Challenges
1. **Human & Environmental Toll**: Unanticipated roof collapses constitute one of the primary causes of fatal accidents in Indian coal collieries under the **Mines Act, 1952**.
2. **Lagging Detection**: Conventional strata management relies predominantly on periodic physical tape extensometers, dial tell-tales, and manual leveling, which cannot provide continuous predictive warnings.
3. **Sensor-Space Disconnect**: Spaceborne Synthetic Aperture Radar (InSAR) and underground subterranean strain/tilt telemetry traditionally operate in siloes with no unified physics-ML correlation engine.

### The TASQ COAL Solution
**TASQ COAL (NMS-SEWS)** delivers a cyber-physical multi-tier early warning portal complying with **Coal Mines Regulations (CMR) 2017, Regulations 111 & 112** (Strata Control and Monitoring Plan - SCAMP). It fuses:
- **Subterranean IoT Telemetry (RL -248.0m)**: Vibrating wire strain gauges, MEMS bi-axial tiltmeters, and tri-axial geophones over self-healing Zigbee/LoRa mesh.
- **Surface Geotechnical Arrays (RL 0.0m)**: Linear potentiometers, extensometer ground pins, and 16 surface telemetry nodes.
- **Spaceborne Satellite InSAR Radar**: Copernicus Sentinel-1 SBAS-InSAR surface line-of-sight velocity heatmaps.
- **Predictive AI Engine**: High-frequency **XGBoost 3.2.0** multi-softprob model evaluating 39 geotechnical features in < 2ms.
- **Interactive 3D WebGL Digital Twin**: Real-time cross-section strata visualizer with dynamic subsidence sag trough simulation.
- **Statutory DGMS Compliance**: Automated **DGMS Technical Form-IV** emergency incident reports and evacuation checklist automation.

---

## 🏗️ 2. System Architecture

```
                                  🛰️ SPACEBORNE TIER
                        Copernicus Sentinel-1 (C-Band SAR)
                                         │
                                         ▼
                 Surface Line-of-Sight Deformation (SBAS-InSAR)
                        [-14.2 mm/yr Jharia Block IV]
                                         │
 ┌───────────────────────────────────────┴───────────────────────────────────────┐
 │                                                                               │
 ▼                                                                               ▼
🌍 SURFACE TELEMETRY (RL 0.0m)                                  ⛏️ SUBTERRANEAN WORKINGS (RL -248m)
• Pithead Station SF-01 Mast                                    • Seam XII Bord & Pillar Working Face
• 16 Surface IoT Ground Nodes                                   • BF350 Vibrating Wire Strain Gauges (µε)
• Linear Potentiometers (0-100mm)                               • MPU-6050 Bi-axial Roof Tiltmeters (°)
• MPU-6050 Surface Tiltmeters                                   • Tri-axial High-PPV Geophones (mm/s)
• GNSS Ground-Truth Marker Pin                                  • Hydraulic Sand Stowing Monitoring
 │                                                                               │
 └───────────────────────────────────────┬───────────────────────────────────────┘
                                         │
                                         ▼
                      FLAMEPROOF DRIFT GATEWAY (Ex ia I Mb)
                        Underground Zigbee 802.15.4 Mesh
                                         │
                             LoRa 865 MHz Sub-GHz Uplink
                                         │
                                         ▼
                      EDGE INFERENCE SERVER (Python FastAPI)
                      Model Engine: XGBoost 3.2.0 (400 Trees)
                 Input: 39 Multivariate Geotechnical Features
                 Latency: ~2ms | Metric: Subterranean Risk Index
                                         │
                                         ▼
                     NEXT.JS 14 PRODUCTION CONTROL PORTAL
                ┌────────────────────────┴────────────────────────┐
                ▼                                                 ▼
     Interactive 3D Strata Digital Twin                 Coalfield GIS & Satellite Map
     (Three.js WebGL / OrbitControls)                   (Leaflet InSAR Heatmap Layer)
```

---

## 🔬 3. Geotechnical Sensor Fleet & Hardware Specifications

| Sensor Type | Hardware | Location | Metric Tracked | Normal Limit | Warning | Critical Evacuation |
|---|---|---|---|---|---|---|
| **Linear Potentiometer** | CALT 100mm Extensometer | Ground Topsoil (RL 0.0m) | Ground Subsidence Displacement | `< 5.0 mm` | `10.0 mm` | `≥ 25.0 mm` |
| **Surface Tiltmeter** | InvenSense MPU-6050 | Surface Grade (RL 0.0m) | Surface Angular Tilt Angle | `< 0.25°` | `0.60°` | `≥ 1.50°` |
| **Surface Geophone** | 4.5 Hz Low-Freq Geophone | Pithead Mast SF-01 | Surface Ground Vibration PPV | `< 0.15 mm/s`| `0.45 mm/s` | `≥ 1.20 mm/s` |
| **Pillar Strain Gauge** | BF350-3AA Vibrating Wire | Seam XII Coal Pillar Core | Internal Microstrain ($\mu\varepsilon$) | `< 250 µε` | `350 µε` | `≥ 600 µε` |
| **Roof Tiltmeter** | MPU-6050 Gyro + Accel | Immediate Roof Strata (-244.6m)| Roof Inclination Angle | `< 0.80°` | `1.50°` | `≥ 3.00°` |
| **Underground Geophone** | 10 Hz Tri-axial Geophone | Haulage Roadway Floor | Seismic Particle Velocity | `< 0.40 mm/s`| `0.90 mm/s` | `≥ 2.50 mm/s` |
| **Borehole Extensometer** | MPBX 4-Point Anchor | Immediate Strata Overhead | Stratum Bed Separation | `< 2.0 mm` | `5.0 mm` | `≥ 12.0 mm` |

---

## 🌐 4. Portal Modules & Key Features

### 🏛️ 1. National Command Portal (`/`)
- **Executive Masthead**: National Emblem attribution, Ministry of Coal, and DGMS Dhanbad headquarters.
- **Monitored Coal Basins**: Live surveillance cards covering **Jharia Colliery (Panel XII-A)**, **Raniganj Coalfield (Sripur Seam VII)**, and **Singrauli Basin (Jayant Panel C)**.
- **Statutory Directive Banner**: Highlights DGMS Technical Circular compliance norms for continuous telemetry.
- **National Telemetry Metrics**: Basins online, instrumented seam depths, active mesh transceivers, and AI safety ratings.

### 📊 2. Strata Control Console (`/dashboard`)
- **Split-Horizon Stratum Switcher**: One-click toggling between **Above Surface (RL 0.0m)**, **Underground (RL -248.0m)**, and **Combined Telemetry**.
- **Dense Geotechnical Metric Cards**: Linear Potentiometer subsidence, MPU-6050 tilt angles, geophone RMS vibration velocity, and internal pillar strain with dynamic color-coded DGMS safety thresholds.
- **AI Subsidence Risk Index Gauge**: Real-time 0–100 geotechnical risk rating calculated dynamically by the XGBoost model.
- **Interactive Recharts Telemetry**: Dual-axis historical telemetry curves with threshold baseline indicators.
- **Live Fleet Tables**: Comprehensive node status, signal strength (dBm), battery levels, hardware types, and coordinates.

### 🧊 3. 3D Strata & Pillar Visualizer (`/model`)
- **Full Subterranean Geological Column (RL 0.0m to RL -248.0m)**:
  - *Surface Topsoil* (RL 0.0m Datum with concentric InSAR radar rings and 16 telemetry nodes)
  - *Barakar Sandstone Overburden* (RL -80.0m thick competent bridging cantilever beam)
  - *Carbonaceous Shale & Mudstone* (RL -160.0m impermeable hydrostatic aquitard)
  - *Immediate Mine Roof* (RL -244.6m bolting horizon with cable bolts)
  - *Seam XII Extraction Floor* (RL -248.0m Bord-and-Pillar grid with 4.2m haulage galleries)
- **Framed Isometric 3D Camera**: Pull-back default view showing the full subterranean block with breathing space on all sides.
- **Camera Presets**: `Isometric 3D`, `Inspector Gallery` (1.7m eye-level roadway walk), `Top-Down Plan`, and `Strata Cross-Section`.
- **Dynamic Subsidence Simulation**: Triggers localized sag trough depressions, strata shearing, and pillar yield coloring.
- **Interactive Geotechnical Scale**: Vertical depth rail from 0m to -248m with 2-second hover or click strata inspection.

### 🗺️ 4. Coalfield Georeferenced GIS (`/map`)
- **Sentinel-1 InSAR Heatmap Layer**: Real-time colored deformation velocity contours over Leaflet OpenStreetMap.
- **Multi-Coalfield Switcher**: Rapid switching between **Jharia Colliery (Block IV)**, **Karanpura Coalfields**, **Korba Coalfield**, and **Raniganj Colliery**.
- **Node Variant Filter**: Filter markers by *All Variants*, *Surface Only (RL 0.0m)*, or *Underground Only (RL -248.0m)*.
- **Sub-surface Gallery Matrix**: Balanced 2-column view displaying the 4×4 room-and-pillar layout alongside Seam XII geotechnical specifications (RMR 68, Factor of Safety 2.24, 4.2m roadways).

### 📈 5. Telemetry Analytics & Trends (`/trends`)
- High-frequency historical time-series analytics.
- Peak 24h microstrain, maximum differential roof tilt, and seismic energy release metrics.
- **1-Click CSV Export**: Downloads formatted sensor readings with timestamps, microstrain, tilt, geophone PPV, and risk scores.

### 🚨 6. Emergency Alerts & SOP Dispatch (`/alerts`)
- Real-time incident broadcast stream categorized into *Critical*, *Warning*, and *Nominal*.
- One-click incident acknowledgement with timestamp and officer ID attribution.
- **DGMS Evacuation SOP Checklist (CMR-111)**:
  - Sound Acoustic 110dB Warble Sirens
  - De-energize District 3.3kV High-Voltage Lines
  - Cap-Lamp RFID Muster Roll Verification (Clearance of 42 Miners)
  - Alert Mines Rescue Station (Dhanbad / Asansol)

### 📜 7. DGMS Regulations & System Architecture (`/about`)
- In-depth statutory breakdown of **CMR 2017 Regulations 111 & 112**.
- Bieniawski pillar strength calculations ($S_p = 7.18 \cdot h^{-0.66} \cdot w^{0.46}$).
- Details of the 4 core architecture pillars: Underground IoT Suite, Hybrid Physics-ML, Zigbee/LoRa Networking, and Copernicus Sentinel-1 InSAR.

---

## 💻 5. Technology Stack

### Frontend (Next.js App Router)
- **Framework**: Next.js 14.2.15 (React 18) with TypeScript
- **Styling**: Tailwind CSS v3.4 with custom dark/light theme engine
- **3D Graphics**: Three.js (r185) with OrbitControls, procedural textures, ACESFilmic tone mapping, and custom shader geometry
- **GIS Mapping**: Leaflet 1.9.4 & React-Leaflet with custom SVG pulsating node markers and InSAR overlays
- **Data Visualization**: Recharts 3.10 with custom tooltips, gradients, and reference lines
- **Icons**: Lucide React

### Backend (Python FastAPI & Machine Learning)
- **API Framework**: FastAPI with Uvicorn server and CORS middleware
- **Machine Learning**: XGBoost 3.2.0 (Multi-Softprob Classifier, 400 estimators, max depth 6)
- **Model Storage**: Joblib serialization (`mine_subsidence_model.joblib`)
- **Data Processing**: NumPy, Pandas, Scikit-learn

---

## 📂 6. Clean Repository Layout

```
d:/MyProjects/TASQ COAL/
├── app/
│   ├── about/page.tsx               # DGMS Regulations & Architecture specification
│   ├── alerts/page.tsx              # Emergency alerts & CMR-111 evacuation SOP
│   ├── dashboard/page.tsx           # Strata Control Console (live telemetry & metrics)
│   ├── map/page.tsx                 # Coalfield GIS & InSAR satellite heatmap
│   ├── model/page.tsx               # 3D Strata & Pillar Visualizer (WebGL digital twin)
│   ├── trends/page.tsx              # Telemetry trends, historical charts & CSV export
│   ├── globals.css                  # Global styles, Tailwind base & dark theme tokens
│   ├── layout.tsx                   # Root HTML layout with Inter/Geist fonts
│   └── page.tsx                     # National Command Landing Portal
├── backend/
│   ├── feature_meta.json            # 39 multivariate geotechnical feature names
│   ├── mine_subsidence_model.joblib # Trained XGBoost 3.2.0 model weights
│   └── server.py                    # FastAPI server exposing real-time ML inference
├── components/
│   ├── AlertBanner.tsx              # Emergency threshold breach broadcast banner
│   ├── AlertsList.tsx               # Compact alert stream component
│   ├── AppShell.tsx                 # Standardized max-w-[1600px] layout shell
│   ├── CoalfieldMap.tsx             # Interactive Leaflet map container & coalfield switcher
│   ├── Footer.tsx                   # Reusable official government portal footer
│   ├── GovHeaderStrip.tsx           # Indian tricolor ribbon, Ministry attribution & IST clock
│   ├── Header.tsx                   # Streamlined horizontal top navigation & action controls
│   ├── LeafletMapInner.tsx          # Leaflet map rendering with InSAR heatmaps & nodes
│   ├── Mine3DScene.tsx              # Full Three.js 3D subterranean digital twin
│   ├── PillarGrid.tsx               # 4x4 underground coal pillar stress grid
│   ├── RiskGaugeCard.tsx            # AI Subsidence Risk Index gauge (0-100)
│   ├── SurfaceTelemetrySection.tsx  # Surface sensor metric cards, chart & fleet table
│   ├── TelemetryChart.tsx           # Multi-metric historical area chart
│   └── UndergroundTelemetrySection.tsx # Underground sensor metric cards, chart & fleet table
├── lib/
│   ├── constants.ts                 # Coalfield zones, strata layers, and DGMS thresholds
│   ├── sensorSimulator.ts           # Background physics & sensor simulator with ML fallback
│   ├── store.ts                     # Zustand central store for state management
│   └── utils.ts                     # UI utility functions (clsx, twMerge)
├── public/
│   └── favicon.ico                  # National crest portal favicon
├── types/
│   └── index.ts                     # TypeScript interfaces (Telemetry, Sensor, Pillar, Alert)
├── launch_tasq_coal.bat             # 1-Click launcher for both backend & frontend
├── package.json                     # Node.js project manifest & dependencies
├── tailwind.config.ts               # Tailwind CSS theme configuration
├── tsconfig.json                    # TypeScript compiler options
└── README.md                        # Master project documentation
```

---

## 🚀 7. Quick Start & Setup Guide

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: v3.9, v3.10, or v3.11
- **Package Manager**: npm (bundled with Node.js)

---

### Option A: 1-Click Launch (Windows)
Double-click the bundled launcher in the project root:
```cmd
launch_tasq_coal.bat
```
This automatically boots:
1. Python FastAPI XGBoost ML Inference Server on **http://127.0.0.1:8000**
2. Next.js Production Web Dashboard on **http://localhost:3005**

---

### Option B: Manual Setup

#### Step 1: Start the Python ML Backend
```bash
cd backend
python -m pip install fastapi uvicorn joblib numpy scikit-learn xgboost pydantic
python server.py
```
*The ML inference server will be active at `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).*

#### Step 2: Build & Start the Next.js Frontend
```bash
# In the project root:
npm install

# Build optimized production bundle
npm run build

# Start the production server on port 3005
npm run start -- -p 3005
```

Open your browser and navigate to:
```
http://localhost:3005
```

---

## 📡 8. REST API Reference

The Python backend exposes high-performance endpoints for real-time sensor ingestion and XGBoost inference:

### `GET /` — Health & Model Metadata
```json
{
  "status": "online",
  "model_type": "<class 'xgboost.core.Booster'>",
  "total_features": 39,
  "top_features": {
    "depth_z": 43.3,
    "convergence_std_6h": 24.1,
    "crack_width_mm": 16.4,
    "vib_rms_g": 5.5
  }
}
```

### `POST /predict` — Real-Time Geotechnical Risk Assessment
**Request Payload:**
```json
{
  "strain_microstrain": 280.5,
  "tilt_deg": 1.15,
  "vib_rms_g": 0.12,
  "crack_width_mm": 2.4,
  "convergence_m": 0.022,
  "depth_z": 248.0,
  "safety_factor": 2.15,
  "pillar_id": "P-06",
  "is_simulation_active": false,
  "sim_progress": 0.0
}
```

**Response Payload:**
```json
{
  "risk_score": 38.4,
  "risk_status": "caution",
  "probabilities": {
    "normal": 0.58,
    "caution": 0.38,
    "critical": 0.04
  },
  "top_driver": "convergence_std_6h",
  "dgms_compliance": "CMR-111 / SCAMP Monitored",
  "inference_time_ms": 1.84
}
```

---

## 👥 9. Compliance & Acknowledgments

- **Regulatory Standard**: Coal Mines Regulations (CMR) 2017, Regulation 111 (Strata Control and Monitoring Plan) and Regulation 112 (Systematic Support Rules).
- **Statutory Authority**: Directorate General of Mines Safety (DGMS), Ministry of Coal, Government of India.
- **Geotechnical Standards**: Central Mine Planning and Design Institute (CMPDI), Ranchi.
- **Satellite Data**: European Space Agency (ESA) Copernicus Sentinel-1 Synthetic Aperture Radar (SAR).
- **Event**: Smart India Hackathon 2026 (Problem Statement ID: SIH26025).

---

<div align="center">
  <sub>© 2026 Directorate General of Mines Safety (DGMS), Ministry of Coal, Govt. of India. All rights reserved.</sub>
</div>

