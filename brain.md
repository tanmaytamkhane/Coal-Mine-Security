# brain.md — STRATA project memory

Read this file **before starting any task**. Append a dated entry to
`## Log Entries` **after finishing any task** — append only, never rewrite,
reorder or delete an older entry.

---

## Installed Packages

Check this list before installing anything new. Generated from `package.json`
on 2026-09-07.

### Runtime

| Package | Version |
|---|---|
| `@types/canvas-confetti` | ^1.9.0 |
| `@types/leaflet` | ^1.9.22 |
| `@types/three` | ^0.185.4 |
| `canvas-confetti` | ^1.9.4 |
| `clsx` | ^2.1.1 |
| `leaflet` | ^1.9.4 |
| `lucide-react` | ^1.41.0 |
| `motion` | ^13.2.0 |
| `next` | 14.2.15 |
| `react` | ^18 |
| `react-dom` | ^18 |
| `react-leaflet` | ^4.2.1 |
| `recharts` | ^3.10.1 |
| `tailwind-merge` | ^3.6.0 |
| `three` | ^0.185.1 |
| `zustand` | ^5.0.15 |

### Dev

`@types/node` ^20, `@types/react` ^18, `@types/react-dom` ^18, `eslint` ^8, `eslint-config-next` 14.2.15, `postcss` ^8, `tailwindcss` ^3.4.1, `typescript` ^5

### Python (`model_service/requirements.txt` — never in package.json)

`xgboost==3.0.5` (**pinned** — 3.4.x cannot deserialize the supplied joblib),
`scikit-learn>=1.4`, `joblib>=1.3`, `numpy>=1.26`, `pandas>=2.0`,
`fastapi>=0.110`, `uvicorn[standard]>=0.29`.

### Added 2026-09-07 (Step 6)

`@react-three/fiber` ^8.18.0 and `@react-three/drei` ^9.122.0.
**Majors are pinned by React**: R3F v8 pairs with React 18, v9 with React 19.
This project is React 18, so v8/drei9. Do not upgrade either without moving
React first.

### Still NOT installed, despite the master prompt calling them "already installed"

`socket.io-client` (Step 9 needs it) and `framer-motion`. `motion` ^13.2.0 is
installed and is the Framer Motion successor package, so `framer-motion` itself
is probably not needed — confirm before adding it.

### Known advisories — pre-existing, deliberately not fixed

`npm audit`: 5 vulnerabilities (4 high, 1 critical) in `next` 14.2.15 and
`glob`. `npm audit fix --force` would move Next across a major and break the
build. Not introduced by the Step 6 install.

---

## Color System

Tailwind **v3**, configured in `tailwind.config.ts` (`darkMode: 'class'`).
**Not v4** — there is no `@theme` block; the config file is the config.

| Token | Tailwind class | Value | Role |
|---|---|---|---|
| `mine.bg-dark` | `bg-mine-bg-dark` | `#0a0e14` | Canonical dark page background |
| `accent` | `bg-accent` / `text-accent` | `#38bdf8` | Navbar CTA, focus rings, active nav |
| `risk.normal` | `bg-risk-normal` | `#22c55e` | Tier `Normal` |
| `risk.watch` | `bg-risk-watch` | `#eab308` | Tier `Watch` |
| `risk.warning` | `bg-risk-warning` | `#f97316` | Tier `Warning` |
| `risk.critical` | `bg-risk-critical` | `#ef4444` | Tier `Critical` |

Also present (carried from the pre-existing build, not from the master
prompt): the `safety-*` orange ramp (`safety-500 #f95721`) and the rest of the
`mine.*` surface/card/border tokens.

### Risk tiers are owned by `lib/risk.ts`, not by Tailwind

`RISK_THRESHOLDS` (25 / 50 / 75) and `RISK_STYLES` in `lib/risk.ts` are the
**single source of truth** for which tier applies and what colour it is.
`RISK_STYLES[level]` carries a raw `hex` (for three.js and Recharts, which
cannot resolve CSS classes) plus ready-made `badge` / `text` / `border` / `bg`
/ `tint` class strings. The `risk.*` Tailwind tokens above only mirror those
hexes so Tailwind can emit static classes.

**Never build a class from a variable.** Tailwind scans source text, so
`` `bg-${tier}` `` generates nothing at all. Read `RISK_STYLES[level]`.

**`Normal` uses Tailwind `green-*`, not `emerald-*`.** `#22c55e` is exactly
`green-500`; `emerald-500` is `#10b981`. The class strings and the hex must
agree or the tier renders as two different greens.

---

## File/Folder Structure

Routes required by the master prompt are **`/` and `/dashboard`**. Six further
routes exist from the pre-existing build and have **not** been removed — see
the Current Status section below.

```
STRATA-TASQ/
├── CLAUDE.md
├── brain.md                        # this file
├── tailwind.config.ts              # Tailwind v3 config — THE config
├── .env.local                      # MODEL_SERVICE_URL (local npm runs only)
├── docker-compose.yml              # web + model, both published on 0.0.0.0
├── Dockerfile                      # Next.js app (node:20-alpine)
├── model_service/Dockerfile        # python:3.11-slim + libgomp1
├── firmware/                       # ESP32-C6 sketches — UNCOMPILED, UNFLASHED
│   ├── README.md                   # Arduino + ESP-IDF commands, endpoint map
│   ├── node1_underground/          # Zigbee ED -> UG-02
│   ├── node2_surface/              # Zigbee ED -> SF-02
│   └── coordinator/                # Zigbee ZCZR + WiFi -> POST /api/ingest
├── app/
│   ├── layout.tsx                  # document shell
│   ├── globals.css
│   ├── page.tsx                    # "/"          <- master prompt route
│   ├── api/predict/route.ts        # proxy to the Python model service
│   └── (app)/                      # route group: sidebar + header chrome
│       ├── layout.tsx
│       ├── dashboard/page.tsx      # "/dashboard" <- master prompt route
│       └── model/ map/ trends/ alerts/ about/    # EXTRA, not in the spec
├── components/
│   ├── Navbar.tsx                  # THE shared navbar — landing + all app routes
│   ├── MineScene3D.tsx             # R3F quadrant-1 canvas (ssr:false)
│   ├── ZoneFeedPanel.tsx           # quadrant 2 — per-zone cards + sparklines
│   ├── AlertsPanel.tsx             # quadrant 3 — glow reserved for Critical
│   ├── ZonePredictionPanel.tsx     # quadrant 4 — labelled SIMULATED
│   ├── DashboardStatusBar.tsx      # health % / mesh count / last event
│   ├── ui/glow-card.tsx            # Aceternity-style spotlight card (vendored)
│   └── ...                         # ~20 further components
├── lib/
│   ├── risk.ts                     # CANONICAL tiers, thresholds, colours
│   ├── mockDataEngine.ts           # per-node feed + subscribe(); the hardware seam
│   ├── store.ts                    # ingestEngineTick = THE telemetry entry point
│   ├── sensorSimulator.ts          # thin engine->store bridge + audio only
│   ├── constants.ts  store.ts  sensorSimulator.ts
│   ├── emergencyAlertService.ts    # SIMULATED SMS/siren/push dispatch
│   └── utils.ts
├── types/index.ts
├── model/                          # joblib + feature_meta.json + sample CSV
└── model_service/                  # FastAPI service (+ .venv, local only)
    └── features.py  main.py  requirements.txt  README.md
```

---

## Current Status

**Step 1 (project structure + dark theme) complete.** Typecheck clean, `next
build` clean, all 8 routes compile.

### This directory was NOT empty — backup is the only undo

It already held a complete earlier implementation (TASQ COAL-derived, 8 routes,
a working FastAPI model service) plus Docker packaging done 2026-09-07. A full
backup was taken before anything was overwritten:

```
C:\Users\tanay\Downloads\STRATA-TASQ-backup-2026-09-07.tar.gz   (524 KB)
```

Excludes `node_modules`, `.next`, `.venv`, `__pycache__` only. This directory
is **not** a git repository, so that archive is the only restore point. It also
holds the **only** copy of the previous 31 KB append-only brain.md log, which
the master prompt's FIRST section required be replaced with an empty one.
**Do not delete it.**

### Open deviations from the master prompt

1. **Six extra routes still exist** — `/model`, `/map`, `/trends`, `/alerts`,
   `/about`. The spec calls for two pages. Deletion was not in Step 1's scope,
   so they were left in place pending an explicit decision.
2. **Three declared dependencies are not installed.** The master prompt lists
   them as "already installed", but `package.json` has **no**
   `@react-three/fiber`, `@react-three/drei`, or `socket.io-client`. Step 6
   (R3F canvas) and Step 9 (Socket.io) will each need an install.
   `components/Mine3DScene.tsx` is currently **hand-rolled three.js**, not R3F.
   `framer-motion` is also absent; `motion` ^13.2.0 is installed instead.
3. **~30 hardcoded `emerald-*` usages bypass `RISK_STYLES`** across `app/` and
   `components/`. Some genuinely mean tier `Normal` (a violation of the
   single-source-of-truth rule); others mean "node online" and are unrelated to
   risk. Needs triage, not a blind find-and-replace.
4. **The running containers are built from pre-Step-1 code.** `docker compose
   up --build` is needed to pick up the new theme.
5. **zustand v5 selector trap — read before touching the store.** A selector
   that builds a NEW object or array (e.g. `selectMeshSummary`) must be wrapped
   in `useShallow` from `zustand/react/shallow`. Without it the default
   `Object.is` comparison sees a change every render and loops forever — React
   error #185, which took the whole dashboard down while `tsc`, `lint` and
   `build` all stayed green. `selectActiveAlerts` and `selectSensorsForZone`
   have the same shape and are currently unused: **wrap them before use.**
6. **A green build proves nothing about the browser.** Use the headless Chrome
   recipe in the 2026-09-07 3D-canvas log entry to check any client-only
   render.
7. **The ESP32 data path is BUILT (Step 9) but never met real firmware.**
   `POST /api/ingest` + SSE `/api/stream` work end to end, verified with a
   simulated coordinator on the same machine. Untested: real ESP32 firmware, a
   second physical device, and the README's Windows firewall rules.
8. **`/api/ingest` is unauthenticated.** Fine on an isolated mine LAN, wrong on
   anything routable — anyone who can reach port 3000 can inject readings and
   so trigger the emergency layer. A shared token header is the minimum before
   this leaves a lab.
9. **Firmware under `firmware/` has never been compiled or flashed.** No
   Arduino/ESP-IDF toolchain existed on the dev machine. Every calibration
   constant in it is a placeholder. This is the only untested part of the
   project.
10. **Ingest state is per Node process** (module-level in `lib/ingestBus.ts`).
   Correct for `next start` in one container; it would break across multiple
   workers or serverless. Redis or MQTT if that changes.

---

## Log Entries

Append-only. Newest entries at the bottom.

### 2026-09-07 — Step 1: project structure + dark theme

**What was built.** Converted the existing tree in place to the master prompt's
Step 1 spec rather than scaffolding fresh, because the directory already held a
working App Router build. No packages installed, none needed for this step.

**Routes.** Both required routes already existed and were verified present:
`/` at `app/page.tsx`, `/dashboard` at `app/(app)/dashboard/page.tsx` (inside
the `(app)` route group, which supplies sidebar + header chrome).

**Theme — `tailwind.config.ts`.** Set `mine.bg-dark` to `#0a0e14` (was
`#090d16`). Added `accent: '#38bdf8'` and a `risk.*` token group carrying the
four canonical tier hexes.

**Theme — `lib/risk.ts`.** The four canonical labels `Normal` / `Watch` /
`Warning` / `Critical` and the 25/50/75 thresholds were **already correct**, and
three of the four hexes already matched the spec exactly (`#eab308`, `#f97316`,
`#ef4444`). Only `Normal` changed: `#16a34a` -> `#22c55e`. Its class strings
were then moved `emerald-*` -> `green-*`, because `#22c55e` is `green-500`
while `emerald-500` is `#10b981` — leaving them mismatched would have rendered
the tier as two different greens depending on whether a component read `hex` or
a class string.

**Verification.** `npx tsc --noEmit` 0 errors. `npm run build` exit 0, all 8
routes compiled.

**Recommended next step.** Step 2 (shared Navbar). Two things to settle first:
the master prompt asks me to **confirm the "STRATA" wordmark** before
finalising it anywhere, and a decision is needed on the six extra routes, since
the navbar's link set (Home, Dashboard, How It Works, Technology) implies the
two-page structure and does not account for them.

### 2026-09-07 — Step 2: shared Navbar

**What was built.** `components/Navbar.tsx` — one navbar, rendered on the
landing page and on every operational route. No packages installed; it uses
`next/link`, `next/navigation` and `lucide-react`, all already present.

**Wordmark: "STRATA"**, kept as the master prompt's placeholder. The prompt
asked for confirmation before finalising it; the user replied "step 2" without
changing it, so it was taken as accepted. It appears in exactly one place now,
so changing it is a one-line edit.

**Contents.** Wordmark + hard-hat glyph + `SIH26025` chip on the left; links
Home / Dashboard / How It Works / Technology; a pill "Live Dashboard" CTA on
the right in accent `#38bdf8` with a `hover:shadow-[0_0_24px_-2px_#38bdf8]`
glow. Semi-transparent blurred background
(`bg-white/70 dark:bg-mine-bg-dark/70` + `backdrop-blur-xl`).

**De-duplication.** The landing page had its own inline `TopBar` with a second
STRATA wordmark and a second CTA. That function was **deleted** and replaced by
the shared component, so there is now exactly one navbar definition. Its unused
`HardHat` import was removed from `app/page.tsx` (it moved into `Navbar.tsx`),
which `next lint` caught as a build-breaking `no-unused-vars` error.

**`sticky`, not `fixed` — and the three layout fixes it forced.** The old
`TopBar` was `fixed`, which means it occupies no layout space and every page
below it must carry a matching top padding. That coupling breaks silently
whenever a route is added, so the shared navbar is `sticky top-0 z-50` instead.
Three consequences had to be handled:

1. `app/page.tsx` Hero was `min-h-[100svh] pt-16`. Dropped the padding and
   changed it to `min-h-[calc(100svh-4rem)]`, or the hero would have been one
   navbar-height taller than the viewport.
2. `components/Header.tsx` (the control-room bar) was `sticky top-0 z-30`.
   Under a `z-50` navbar it would have slid *behind* it and vanished on scroll.
   Now `sticky top-16 z-30`, so the two stack.
3. `components/Sidebar.tsx` was `min-h-screen`, which with the navbar above it
   in a flex column made every app route scroll by ~64px. Now
   `min-h-[calc(100vh-4rem)]`.

**`app/(app)/layout.tsx`** was restructured from a horizontal flex to
`flex-col` — navbar on top, then the sidebar + header + main row beneath it.

**Verification.** `tsc --noEmit` 0 errors, `next lint` clean, `npm run build`
exit 0, all 8 routes compiled. Served the production build and confirmed in the
returned markup that `/` and `/dashboard` both render the navbar, and that on
`/dashboard` the two bars carry distinct offsets — `sticky top-0 z-50`
(Navbar) and `sticky top-16 z-30` (Header).

**Trap worth recording:** an earlier `next start` on port 3100 survived
`pkill -f "next start"` and kept serving pre-fix HTML, which briefly looked
like the Header fix had not applied. Verify the PID with `netstat -ano` and
kill it with `taskkill //PID <pid> //F` on this machine — `pkill` is not
reliable here.

**Recommended next step.** Step 3 (landing page hero). Note the hero already
exists and already uses a **real photograph** at
`public/hero/mine-tunnel.jpg`, whereas Step 3 specifies a CSS-gradient +
dust-particle placeholder "since Higgsfield isn't wired in yet". The existing
photo is strictly better than the placeholder it asks for, so Step 3 is mostly
a copy/stat-strip reconciliation rather than a rebuild — confirm the intent
before touching the background.

### 2026-09-07 — Step 3: landing page hero

**Almost nothing needed building.** The hero already satisfied Step 3's spec.
No packages installed. Audited each requirement against the source rather than
assuming, and confirmed each string in the served production markup:

| Step 3 requirement | Status |
|---|---|
| Headline "Predict The Ground Before It Falls." | Already exact (`HEADLINE` const, word-by-word blur-in) |
| Subtext "AI-powered real-time subsidence monitoring for underground coal mines." | Already present verbatim as the opening clause, then continues past an em-dash |
| Stat strip, 3 stats | Already present — `226`, `Real-time`, `70%` |
| Stats flagged as placeholder / needs-citation | Already flagged, and hard to miss: an amber `PLACEHOLDER FIGURES — UNSOURCED, NEEDS CITATION BEFORE JUDGING` badge, a warning triangle beside every value, and a per-stat `note` naming what evidence each one still needs |
| Left-aligned, generous vertical spacing | Already so |
| Background swappable without touching layout | Already so — a single `next/image` `fill` layer; swapping the `src` (or replacing it with a `<video>`) needs no layout change |

**Background: kept the real photograph.** Step 3 asks for a CSS gradient +
dust-particle placeholder "since Higgsfield image generation isn't wired in
yet". `public/hero/mine-tunnel.jpg` already exists and is strictly better than
the placeholder it stands in for. **The user explicitly confirmed: "no dont
swap".** The gradient/lamp/dust layers remain as *lighting on top of* the
photo, not as a substitute for it.

**The one real change — a Step 1 regression.** The landing page was painting a
hardcoded `#05060a` in 7 places (page ground, both hero grading gradients, the
stat-strip cells) while Step 1 had just made `#0a0e14` the canonical
background. That is precisely the landing-vs-dashboard mismatch Step 6 warns
about, so all 7 were unified to `#0a0e14`. Both are near-black; the change is
subtle and easy to revert if the grading looks off against the plate once seen
in a browser.

**Verification.** `tsc --noEmit` 0 errors, `next lint` clean, `npm run build`
exit 0. Served the build and confirmed the headline words, the exact subtext
sentence, all three stat values, the `PLACEHOLDER FIGURES` badge, the
`mine-tunnel.jpg` reference and the new `0a0e14` ground are all present in the
returned HTML.

**Still outstanding from Step 3's own warning:** the "226 deaths" figure needs
a real DGMS / Ministry of Coal citation and the "70% lower cost" claim needs a
costed BOM before this goes in front of judges. The UI says so on its face, but
saying so is not the same as fixing it.

**Recommended next step.** Step 4 (mock real-time data engine). Expect friction:
Step 4 specifies `lib/mockDataEngine.ts` with `UndergroundReading` /
`SurfaceReading` shapes carrying `microseismic` and `gas` fields, but this
codebase already has an equivalent simulator at `lib/sensorSimulator.ts` whose
channels are named for the actual rig (`vibrationMms` from the MPU6050,
`methanePctLel` from the MQ-4) and typed in `types/index.ts`. Building a second
parallel engine would create two competing data models. Recommend reconciling
onto the existing one and mapping the spec's field names across — but confirm
before starting, since it is a direct deviation from Step 4's literal wording.

### 2026-09-07 — Step 4: mock real-time data engine

**Built `lib/mockDataEngine.ts`** plus four new types in `types/index.ts`
(`NodePosition`, `UndergroundReading`, `SurfaceReading`, `ZoneReading`,
`EngineTick`). No packages installed — none needed.

**Deviation from the spec's field names, agreed in advance.** Step 4's literal
shapes carry `microseismic` and `gas`. Those are named for the parts actually
on the rig instead, because CLAUDE.md forbids inventing hardware:

| Spec field | This codebase | Why |
|---|---|---|
| `microseismic` | `vibrationMms` | There is **no geophone** on the rig. Vibration is MPU6050 accelerometer energy as peak particle velocity (mm/s). "Microseismic" would promise a sensitivity the hardware does not have. |
| `gas` | `methanePctLel` | The MQ-4 measures methane specifically, as % of the lower explosive limit. |
| `convergence` | `convergenceMm` | **Ultrasonic only.** Never mmWave. |
| `tilt` | `tiltAngleDeg` / `surfaceTiltDeg` | Node-1 and Node-2 both tilt; they must not collide in one field. |

Everything else in the spec's shapes is honoured: `nodeId`, `x`, `y`, `z`,
`timestamp`, `crackWidth` -> `crackWidthMm`, and the optional `humidity` /
`waterLevel` (as `humidityPct` / `waterLevelMm`) are provisioned exactly as
asked. They are emitted but **deliberately do not feed the risk score**, since
nothing on the rig BOM measures them yet.

**`ZoneGeotechnicalProfile` needed no work** — `ZONE_PROFILES` in
`lib/constants.ts` already matched the spec field-for-field (7 static entries,
one per zone, never updated on a tick).

**Coordinates had to be added.** Nodes carried `depth` but no x/y, which the
reading shapes require. Added `x` / `y` (metres from the shaft collar) to
`NodeSeed` and all 12 seeds. **A Node-2 shares its paired Node-1's (x, y) on
purpose** — it sits directly above it, and the pair is only meaningful because
both watch the same column of rock. They are separated by z alone. `z` is
metres relative to the surface datum, **negative below ground**: Node-1 at
`-depth`, Node-2 at `0`.

**Subscription pattern.** `subscribe(listener)` returns an unsubscribe
function; the interval starts on the first subscriber and stops on the last, so
nothing ticks behind a page that is not watching. The engine imports no React
and no Zustand, so the same feed can drive the store, a test, or a script.
Controls: `startEvent()`, `resetEvent()`, `setNodeDark()`, `getProgress()`,
`emitNow()`.

**Zones now diverge.** Each zone's severity is scaled by its own pillar
width:height ratio from `ZONE_PROFILES`, so a slender pillar degrades first
rather than the whole mine failing in lockstep. Per-node bounded random walks
stop twelve nodes reading as one sensor cloned twelve times — bounded because
an unbounded walk would eventually cross a threshold on its own and fire an
alert with no event behind it.

**A dark node emits NOTHING.** It is skipped from the tick entirely rather than
carried forward at its last value. Turning that silence into a Critical alert
is Step 5's job, which is the correct division: the engine reports what it
heard, the store decides what silence means.

**Verification — compiled it and actually ran it**, rather than trusting the
types:

```
CURVE   [[0,0],[0.1,0.065],[0.2,0.166],[0.34,0.34],[0.5,0.354],
         [0.7,0.463],[0.85,0.654],[1,0.97]]
monotonic: true      accelerates (late slope > early): true (0.101 -> 0.167)
zones emitted: 7     Z1 surface paired: true    Z6 surface: null
humidity/waterLevel present: true true
z: underground -246, surface 0
quiet-mine tiers: Normal            <- no false alarms at rest
after event: severity 0.970, tiers Watch/Critical/Normal, max score 99
Z3 present after UG-03 goes dark: false
ticks after unsubscribe: unchanged
```

`tsc --noEmit` 0 errors, `next lint` clean, `npm run build` exit 0.

**Known wrinkle, inherited deliberately.** The curve has a slope kink at the
inflection: it creeps to 0.34 by p=0.34, then nearly stalls (0.354 at p=0.5)
before accelerating hard. That is the *existing* simulator's formula, extracted
verbatim so the two cannot drift apart. The overall slow-then-fast shape holds
and the acceleration test passes, but the stall is an artefact rather than
geotechnics — worth smoothing if the demo ever pauses awkwardly at that point.

**IMPORTANT — two engines exist right now, on purpose and only briefly.**
`lib/sensorSimulator.ts` still computes its own channel values and writes
straight to the store; `lib/mockDataEngine.ts` is the new per-node feed and is
**not yet wired to anything**. Nothing is broken and nothing is duplicated at
runtime, because no one subscribes to the new engine yet. **Step 5 must
converge them** — point the store at `subscribe()` and retire the duplicated
channel maths inside `sensorSimulator.ts` — or the project ends up with two
competing definitions of the same mine.

**Recommended next step.** Step 5 (Zustand store), whose first job is the
convergence described above.

### 2026-09-07 — Step 5: Zustand store, wired to the engine

**The two engines are now one.** This was Step 5's first job and it is done.
No packages installed.

**What moved where.** `lib/sensorSimulator.ts` used to compute every channel
value AND fold it into the store, which fused the data model to React and left
no seam for real hardware. It is now a ~40-line bridge that does only what
genuinely belongs to React: subscribes to the engine, and plays audio. All
channel maths lives in `lib/mockDataEngine.ts`; all state-folding lives in the
store's new `ingestEngineTick`.

**`ingestEngineTick` is the SINGLE entry point for telemetry.** Simulated ticks
go through it today and the Step 9 ESP32 endpoint will go through the same
door, so the signal-loss and threshold rules exist in exactly one place and
cannot drift into two implementations.

**New store state**

- `zones: Record<string, ZoneReading>` — the latest per-zone reading, Node-1
  plus its paired Node-2. A zone whose Node-1 is dark is **deleted from this
  map**, never held at a stale value.
- Per-zone risk (`riskLevel` on each `ZoneReading`) alongside the existing
  mine-wide rollup. The mine-wide score is now the **worst** zone, not an
  average — averaging a developing event against six quiet zones hides the
  precursor.
- `triggerSubsidenceEvent` / `resetSimulation` / `dropNode` now drive the
  engine (`startEvent` / `resetEvent` / `setNodeDark`) instead of keeping a
  second copy of the progression.

**Loss of signal is an alarm, not a gap — implemented in the store**

A node past `SIGNAL_LOSS_TIMEOUT_MS` (2x the 3s cadence) is marked offline, its
sensors are frozen at `status: 'offline'` / `lastUpdated: 'No signal'` with
their values **not advanced**, a Critical `signal-loss` alert is raised with
DGMS code `DGMS/TECH/CIRC-04`, and `dispatchEmergency` fires. Restoration
raises a `signal-restored` alert at severity `Normal` — good news is never an
alarm.

**A real bug the runtime test caught.** Killing `UG-05` also raised a Critical
signal-loss for `SF-05`, because the engine skipped the whole zone when its
underground node went dark, so the surface node fell silent as a side effect.
Physically wrong: a Node-2 is an independent radio on the surface, and a roof
fall that destroys the Node-1 below it need not destroy it. That is a false
Critical for a node that is still transmitting — precisely the kind of false
alarm that teaches an operator to stop trusting the alarm.

Fixed by adding `EngineTick.orphanSurface`: surface readings whose paired
Node-1 is dark are emitted separately, and the store counts them as reporting
and still feeds their sensor channels. Signal-loss alerts for one dead node
went from **2 to 1**.

**Threshold alerts are now per zone**, keyed `zone:channel:level`, with
hysteresis — a crossing re-arms only once the channel falls back below 85% of
its warning limit. Verified: 22 threshold alerts after a full event, still 22
after ten further ticks, so a channel parked above its limit does not shout
every three seconds.

**Verification — compiled the store and ran it against the engine**

```
quiet mine:      7 zones, risk 7 Normal, mesh 12/12, all zones Normal
Z6 surface:      null                    Z1 surface: SF-01
UG-05 dark:      signal-loss alerts 1 (Critical, DGMS/TECH/CIRC-04)
                 UG-05 online false | Z5 removed from zones map
                 UG-05 sensors 'offline', lastUpdated 'No signal'
                 SF-05 NOT falsely reported lost
restored:        signal-restored x1, severity Normal
after event:     risk 99 Critical
                 Z1=Watch Z2=Critical Z3=Watch Z4=Critical Z5=Watch
                 Z6=Watch Z7=Normal        <- zones diverge, not lockstep
                 EMERGENCY_ALERT_DISPATCHED fired for critical-risk
thresholds:      22 -> 22 over 10 further ticks (no repeat spam)
telemetry:       history tracks the worst zone; length stable at 21
```

`tsc --noEmit` 0 errors, `next lint` clean, `npm run build` exit 0, all 8
routes.

**Audio now follows the store's judgement** rather than re-deciding it: the
bridge chimes on the newest alert if it is Critical or Warning, and stays
silent for `Normal` and `Watch`.

**Recommended next step.** Step 6 (dashboard layout). Two blockers to settle
first: `@react-three/fiber` + `@react-three/drei` are **still not installed**
(Step 6 asks for an R3F canvas; `Mine3DScene.tsx` is hand-rolled three.js), and
there is no Aceternity/21st.dev component in the tree yet, which Step 6 asks
for by name. Also note the dashboard does not yet read the new per-zone
`zones` map — it still renders from `sensors` / `pillars`, so surfacing
per-zone risk is part of Step 6's work.

### 2026-09-07 — Step 6: dashboard layout (4-quadrant control room)

**Packages installed** — the first install of this whole run.
`@react-three/fiber@8.18.0` and `@react-three/drei@9.122.0`.

**Version choice was checked against the docs, not guessed.** R3F pairs with a
specific React major: **v8 ↔ React 18, v9 ↔ React 19**. This project is React
18, so v8 (and drei 9, which pairs with R3F 8). Installing the current v9/v10
would have failed at runtime. Both resolved deduped against the existing
`three@0.185.1`.

`npm audit` reports 5 vulnerabilities (4 high, 1 critical) in **`next` 14.2.15
and `glob`**. These are **pre-existing and unrelated to this install**;
`npm audit fix --force` would upgrade Next across a major and break the build,
so they are left alone and recorded here instead.

**New components**

| File | Role |
|---|---|
| `components/ui/glow-card.tsx` | Aceternity-style spotlight card, **vendored** (Aceternity is copy-paste, not an npm dep) alongside the other `components/ui/` primitives |
| `components/MineScene3D.tsx` | Quadrant 1 — R3F canvas, grid floor, OrbitControls, node markers |
| `components/ZoneFeedPanel.tsx` | Quadrant 2 — per-zone cards with Recharts sparklines |
| `components/AlertsPanel.tsx` | Quadrant 3 — scrolling alert history |
| `components/ZonePredictionPanel.tsx` | Quadrant 4 — per-zone classification + confidence |
| `components/DashboardStatusBar.tsx` | Top strip — health index, mesh count, last event |

**The dashboard now reads the per-zone `zones` map** built in Step 5, rather
than only the flat `sensors` array. Per-zone risk is finally visible, which was
the point of Step 5's store work.

**Why the glow is restrained.** `GlowCard`'s spotlight responds ONLY to the
pointer — it appears on hover, vanishes on leave, and has no idle pulse or
shimmer. This screen is watched for hours; continuous ambient motion on a data
surface trains a person to stop noticing movement, which is the exact reflex a
subsidence alarm depends on. The red halo is reserved for **Critical and
unacknowledged** rows. If everything glows, nothing does.

**3D view — coordinate mapping is the part to get right.** Plan coordinates are
metres (x/y 120..700, z 0 to -260). Three.js is y-up, so axes are remapped, not
passed through:

```
three.x <- (plan.x - centreX) / 40      three.y <- plan.z / 26      three.z <- (plan.y - centreY) / 40
```

Depth is compressed harder than the plan (26 vs 40) because a true-to-scale
250 m drop under a 600 m plan renders as an unreadable spike. That is a
legibility choice, and the UI labels the view "Depth exaggerated".

Cubes are Node-1, spheres are Node-2, and a line ties each pair — they watch
one column of rock from opposite ends. **An offline node renders grey, never
its last known tier colour**, because painting a dark node reassuring green is
the same lie as carrying a stale reading forward. `frameloop="demand"` so a
static scene does not run a 60fps loop behind a dashboard nobody is rotating.
Loaded via `next/dynamic` with `ssr: false` — WebGL cannot render on the
server, and eager import would drag three.js into first load.

**A real bug caught by checking the served HTML.** `zones` is empty until the
first engine tick (3s), and both panels treated "no reading" as "node dark".
Result: **7 false SIGNAL LOST criticals and 7 NO PREDICTION cards on every
single page load**, confirmed by grepping the response — exactly the
cry-wolf failure this project exists to avoid, shipped into the alarm surface
itself. Fixed by separating the two states: `!reading && online` now renders a
neutral dashed "Awaiting first report…" placeholder, and only `!online` renders
the Critical treatment. Re-verified on first paint:

```
SIGNAL LOST            0        Awaiting first report  7
NO PREDICTION          0        Awaiting data          7
```

**Prediction panel provenance.** Every card carries a
`SIMULATED SCORE — MODEL WIRED AT STEP 8` badge, and the header states that
confidence is distance-from-tier-boundary, **not** a calibrated probability. A
dark node yields `NO PREDICTION`, mirroring what the Python service does at
Step 8 rather than guessing on stale data.

**Verification.** `tsc --noEmit` 0 errors, `next lint` clean, `npm run build`
exit 0, all 8 routes. Served the production build and confirmed all four
quadrant headers plus the three status-bar tiles are present in the returned
markup, and that no false criticals appear on first paint.

**NOT verified — the 3D canvas has never been seen.** `ssr: false` means the
R3F scene never runs during a server render, so nothing above exercises it.
Orbit controls, marker placement, depth exaggeration, the pair lines and the
`Html` node labels are **all unconfirmed visually**. This is the single biggest
untested surface in the project right now.

**Deviation from the brief.** Step 6 asks for four quadrants; the layout is two
rows of two (3D + feed, then alerts + prediction), which is the same four
panels in a shape that survives a narrow window. `components/Mine3DScene.tsx`
(the 778-line hand-rolled three.js scene on `/model`) was **left untouched** —
it is a different, more detailed view, and rewriting it in R3F would be a large
change for no visible gain.

**Recommended next step.** Step 7 (emergency alert layer). Note
`lib/emergencyAlertService.ts` and `components/EmergencyBanner.tsx` already
exist and are already wired — Step 5's `ingestEngineTick` calls
`dispatchEmergency` on both Critical escalation and signal loss, and the
console dispatch was observed firing in the Step 5 runtime test. Step 7 is
therefore mostly an audit and a documentation task (recording which real
provider each simulated channel stands in for), not a build.

### 2026-09-07 — 3D canvas: verified in a real browser, three bugs fixed

The Step 6 entry above closed with "the 3D canvas has never been seen". It has
now been rendered, screenshotted and debugged. **No packages installed.**

**How, given no browser extension.** The Claude Chrome extension is not
connected in this environment, so the installed Chrome was driven directly in
headless mode — no new dependency:

```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
  --disable-gpu --no-sandbox --user-data-dir=<tmp> --enable-unsafe-swiftshader \
  --virtual-time-budget=16000 --window-size=1600,1400 \
  --screenshot=<out.png> http://localhost:<port>/dashboard
```

`--enable-unsafe-swiftshader` is what gives software WebGL with no GPU.
Swap `--screenshot` for `--dump-dom` to capture the hydrated DOM, and add
`--enable-logging=stderr --v=0` to capture console output. **This is the
repeatable way to check a client-only render in this project.**

#### Bug 1 — the dashboard was completely broken in the browser

`--dump-dom` returned `<html id="__next_error__">` and 8.9 KB: the page was
throwing on hydration. Every other route was fine, so it was Step 6 code. The
console gave **React error #185 — "Maximum update depth exceeded"**, an
infinite render loop.

Cause: `selectMeshSummary` builds a **new object on every call**, and
`DashboardStatusBar` passed it straight to `useDashboardStore`. Under **zustand
v5** the default comparison is `Object.is`, so a fresh object each render reads
as a change every render — forever. Fixed with `useShallow` from
`zustand/react/shallow`.

**This is a trap for the whole codebase, not one component.** Any selector that
builds an object or array must be wrapped in `useShallow` under v5.
`selectActiveAlerts` and `selectSensorsForZone` in `lib/store.ts` have the same
shape and are currently unused — **wrap them before using them.** Note that
`useDashboardStore()` with no selector is safe (it returns the state object by
reference); it merely over-renders.

`tsc`, `next lint` and `next build` all passed while this bug was live. A green
build says nothing about whether a client component mounts.

#### Bug 2 — the page heading was hidden behind the header

The `Control Room` h1 and both DGMS badges rendered underneath the sticky
control-room `Header`. Cause: the column wrapping `Header` had
`overflow-x-hidden`. CSS computes `overflow-y` to `auto` when `overflow-x` is
`hidden`, which turned that column into the **scroll container** for the
header's `position: sticky`. `top-16` was then measured from the top of the
column — which already sits below the navbar — double-counting the navbar and
floating the header 64px down over the content. Removed it; `min-w-0` alone is
what actually prevents flex overflow.

#### Bug 3 — framing put the interesting half out of shot

`DEPTH_SCALE` 26 placed the seam at y ≈ **-10** under a plan only 13 wide, with
the camera targeting the origin (the surface) and `maxPolarAngle` locked above
the horizon — so the underground layer sat far below the frame, behind the
grid. Fixed: `DEPTH_SCALE` 60 (seam at y ≈ -4.3, ratio 0.32), camera target
moved to `[0, -2, 0]` (mid-depth, not the surface), `maxPolarAngle` relaxed to
`PI/1.7` (~106°) so the seam can be inspected from slightly below, and the grid
given `DoubleSide` so it stays visible from underneath.

#### `frameloop` — left on the default, deliberately

`frameloop="demand"` was in place initially. It is off now: demand only draws
when something calls `invalidate()`, which makes a silently blank canvas
possible on a missed invalidation, and a monitoring view that renders nothing
is a far worse failure than redrawing 12 meshes. This does not breach the
no-ambient-motion rule — the scene is static between ticks, so the loop
repaints identical frames with no visible movement.

**A blank canvas in headless capture is usually a SwiftShader race, not a bug.**
Two runs of the identical command produced 179 KB (blank) and 283 KB
(rendered). Always capture twice before believing a blank canvas.

#### Pure-logic test

`buildMarkers()` was extracted from the component so the coordinate mapping can
be tested without WebGL:

```
markers 12 | pairs 5 (Z6/Z7 correctly excluded — no surface node)
centred on origin: true      all surface y == 0: true    all underground y < 0: true
plan extent 13.38 | depth 4.33 | ratio 0.32 | fits the 24x24 grid
pair UG-01/SF-01 share x,z and differ only in y: true
UG-02 in a Critical zone -> Critical;  UG-02 dark -> offline (NOT Critical)
no zone data -> Normal (no crash);  all coords finite: true
```

#### Confirmed on screen

Grid floor, 7 green cubes (Node-1), 5 spheres (Node-2), vertical lines tying
each pair, the selected zone's `UG-02`/`SF-02` labels in accent cyan, orbit
framing showing both layers. Console **clean** — zero errors or warnings. All
four quadrants, all 7 zone cards with separated Node-1/Node-2 channels, and
`No surface node paired` appearing **exactly twice** (Z6, Z7) as the hardware
spec requires.

**Still unverified:** interaction. Orbit-drag, clicking a marker to select a
zone, and the Critical/offline marker colours **on screen** were not exercised
— headless capture cannot drive the mouse. The colour logic itself is unit
tested above.

---

### 2026-09-07 — Step 7: emergency alert layer (audit, not a build)

**Nothing needed building.** `lib/emergencyAlertService.ts` and
`components/EmergencyBanner.tsx` already existed and were already wired: Step
5's `ingestEngineTick` calls `dispatchEmergency` on **both** triggers the brief
names — a zone crossing into `Critical`, and any `signal-loss`. No packages
installed. Step 7 was therefore an audit plus the documentation the brief asks
for, below.

**Separation from the Alerts panel is real, not cosmetic.** `EmergencyBanner`
subscribes to `emergencyAlertService` directly — *not* to the store's `alerts`
array — and renders as a `fixed inset-x-0 top-4 z-[100]` overlay that is red on
near-black in both themes and **does not auto-dismiss**. The Alerts panel is a
log an engineer reads at their own pace; this is an interruption stating that a
dispatch has gone to people who are not looking at this screen at all.

#### Which real service each simulated call stands in for

Every channel below is **simulated**. `ConsoleEmergencyProvider` logs a
structured `EMERGENCY_ALERT_DISPATCHED` object and returns success. Nothing
leaves the machine.

| Channel | Simulated by | Real service it stands in for | What going live needs |
|---|---|---|---|
| `sms` | console log | **Twilio Programmable SMS** (or MSG91 / Gupshup for Indian DLT compliance) | Account SID + auth token, a DLT-registered sender ID and template, and a worker roster keyed by zone |
| `push` | console log | **Firebase Cloud Messaging** to a worker/resident app, or **web-push** (VAPID) for the browser | FCM server key, device-token store, topic per zone |
| `siren` | console log | **Physical siren relay at the pit head** — an ESP32/PLC on the same Zigbee mesh, or a dry-contact relay over Modbus TCP | A relay endpoint, a hold-time policy, and a manual override that a human can always reach |
| `pa-system` | console log | **Underground PA / tannoy**, typically a SIP page to the mine's existing system | SIP trunk credentials, a pre-recorded evacuation announcement per zone |

**To go live, write one class implementing `EmergencyProvider` and call
`emergencyAlertService.registerProvider()`.** No caller changes anywhere —
verified by test, below. `send()` must never throw; a provider outage has to
degrade to "this channel failed" so the remaining channels still fire.

**Cooldown.** `COOLDOWN_MS = 90_000`, keyed `zone:reason:node`. Re-alerting the
same zone for the same reason every 3 seconds would be worse than useless — it
would train people to ignore the channel outright. `dispatch()` returns `null`
when suppressed, so callers can fire on every tick without tracking state.

**Verification — the service was compiled and exercised**

```
critical-risk   -> "EVACUATE — Pillar P-06", 4 channels, all ok
signal-loss     -> "MONITORING LOST — Depillaring Zone", names UG-05, distinct copy
cooldown        -> duplicate suppressed (null)
                   different zone still fires: true
                   same zone + different reason still fires: true
subscribers     -> 4 records delivered (this is what drives the banner)
provider swap   -> custom provider invoked, results span both providers
throwing provider -> dispatch still returns, bad channel recorded not thrown,
                     other providers still succeed
```

**Recommended next step.** Step 8 is already largely built — `model/`,
`model_service/main.py`, `features.py` and `app/api/predict/route.ts` all exist
and the containerised service answers `/health` with `{"ok":true,
"features":39}`. The real outstanding work is that the **dashboard's new
`ZonePredictionPanel` is NOT wired to `/api/predict`** — it still shows the
simulated score behind its `SIMULATED SCORE — MODEL WIRED AT STEP 8` badge.
Wiring that, with the mock score as the documented fallback, is Step 8. Bear in
mind the open debt in `## Current Status`: the trained model does not
discriminate, so wiring it will not make the numbers meaningful — only honest
about their provenance.

### 2026-09-07 — Step 8: trained model wired to the dashboard

**No packages installed.** `model/`, `model_service/` and
`app/api/predict/route.ts` already existed; the gap was that Step 6's
`ZonePredictionPanel` still showed the engine's simulated score. It now calls
the real service.

**New:** `lib/usePrediction.ts` — polls `/api/predict` for every zone.
**Changed:** `ZonePredictionPanel` renders provenance; `lib/store.ts` gained
`zoneWindow`.

**`zoneWindow`** keeps the last 40 full `ZoneReading`s per zone (~2 min at the
3s cadence) — the rolling window the service needs to rebuild its rate and
rolling-stat features. The model was trained on 6-hour windows, so the service
returns a `note` flagging the shorter span as directional only, and that note
is surfaced on the card. A longer client window would not fix that; it would
only make the request bigger.

**Polling is deliberately slower than the feed:** `REFRESH_MS = 12_000` against
a 3s tick. Predicting every tick for 7 zones would be 7 requests every 3
seconds for a number that moves far slower than that. The effect reads live
state through a ref so it mounts **once**, instead of being torn down and
restarted on every tick.

#### THE BUG THAT MATTERED — plan coordinate fed into the model's dominant feature

`model_service/features.py` carries a long comment about the two systems
disagreeing on which axis is down. It expects the **graphics** convention on
the wire (payload `y` = depth, payload `z` = a plan coordinate) and swaps them
internally. But the `UndergroundReading` built at Step 4 uses the **survey**
convention (`x`/`y` are plan, `z` is depth, negative).

Sending our shape straight through therefore fed **plan northing 310 into the
model's `z`** — the feature carrying **43% of total importance**. The service
said so plainly in its diagnostics and I nearly missed it:

```
before:  "model_depth_z": 310.0     <- plan northing. Wrong.
after:   "model_depth_z": -248.0    <- actual depth. Correct.
```

Fixed in `toServiceWindow()` by swapping y/z, at the **same boundary** that
maps `vibrationMms -> microseismic` and `methanePctLel -> gas`. All wire-format
translation lives in that one function; the app keeps hardware-accurate names
and survey coordinates everywhere else.

**Do not "tidy" that swap away.** It looks like a mistake and is not.

`depth_outside_training_range` stays `true` even after the fix: the zones sit
at 246-260 m while the model only ever saw ~296-305 m. Every prediction still
extrapolates on its dominant feature. That is a data problem, not a wiring one.

#### Provenance is now the UI's job

Three states, never conflated, each labelled on the card itself:

| Source | Badge | When |
|---|---|---|
| `model` | `TRAINED MODEL` | the classifier answered |
| `fallback` | `SIMULATED FALLBACK` | service unreachable/slow — engine's own score, **said out loud** |
| `none` | `NO PREDICTION` | node dark, or the service itself reported `signal_loss` |

A silent fallback would be the worst available option: it looks exactly like a
real prediction. The panel header additionally reports
`MODEL SERVICE LIVE · n/7 ZONES` or `MODEL SERVICE UNREACHABLE`.

#### Verification — against the real containerised service, in a browser

```
docker compose up -d model            -> /health {"ok":true,"features":39}

direct POST :8000/predict (40-point window)
  riskLabel Normal | confidence 0.8584 | hazardProbability 0.0054
  note: "Rolling features ... Directional only."
stale window (lastSeenAgeMs 9000)
  signal_loss true, "Not predicting on stale data."

dashboard, service UP    -> TRAINED MODEL x7, "MODEL SERVICE LIVE · 7/7 ZONES",
                            p(hazard) x7, "Model confidence" x7,
                            "Directional only" x7
docker compose stop model
dashboard, service DOWN  -> TRAINED MODEL x0, SIMULATED FALLBACK x7 (+1 header),
                            "MODEL SERVICE UNREACHABLE",
                            "showing the simulated score" x7
```

Screenshot confirms per-zone cards reading `Normal`, `p(hazard) 0.0094 /
0.0068 / 0.0085 / 0.0080`, model confidence 82-84%.

`tsc --noEmit` 0 errors, `next lint` clean, `npm run build` exit 0.

#### The open debt is unchanged and now visible

Those hazard probabilities — 0.0054 to 0.0094 across every zone — are the
**known model defect** recorded in `## Current Status`: the classifier does not
discriminate. Wiring it in has made the numbers *honest about their
provenance*, not meaningful. **Do not present this as a working predictor to
judges.** It needs retraining without the coordinate features, on balanced
data. The confidence bar reads 82-84% because that is confidence in the
assigned class (`Normal`), which is trivially high when the model calls
everything Normal.

**Recommended next step.** Step 9 — the hardware ingest path. See the note on
the server-to-browser gap in `## Current Status`, which is the part of Step 9
that is not obvious from the brief.

### 2026-09-07 — Step 9: hardware ingestion + SSE push

**No packages installed.** In particular **`socket.io-client` was NOT added** —
see the transport decision below.

**New files**

| File | Role |
|---|---|
| `lib/fuse.ts` | `fuseZoneRisk()` — extracted so the simulator and the hardware path score identically |
| `lib/ingestBus.ts` | Server-side hub: newest frame per node, assembles `EngineTick`, fans out to SSE |
| `app/api/ingest/route.ts` | `POST` from the ESP32-C6 coordinator; `GET` for a reachability check |
| `app/api/stream/route.ts` | SSE stream — the server-to-browser half |
| `lib/useHardwareFeed.ts` | Client `EventSource` subscriber; folds frames through `ingestEngineTick` |

**Changed:** `store.ts` gained `dataSource`; `sensorSimulator.ts` stands down
when hardware is live; `TelemetryRunner` mounts both feeds;
`DashboardStatusBar` gained a DATA SOURCE tile; the dashboard header chip now
tracks the real source; `README.md` gained a full hardware section.

#### The gap the brief did not mention

Step 9 asks to "update the Zustand store (server-side), then emit it over
Socket.io". The store is **not** server-side — it lives in the browser. An
ESP32 POSTing to a route handler cannot push into an already-open tab; HTTP
only answers the request it was handed. Without a server-to-client channel,
real frames would land on the server and the dashboard would never see them.
Publishing ports 3000/8000 makes the host *reachable*; it does not make the
dashboard *update*.

**SSE was chosen over Socket.io** because telemetry flows one way only
(hardware -> dashboard), SSE is plain HTTP so it needs no upgrade handling, no
second port and no extra Docker/proxy config, `EventSource` reconnects on its
own, and it costs **no new dependency**. A WebSocket would buy bidirectionality
this feed does not use.

#### Design decisions worth keeping

- **`nodeId` is the only required field.** Node kind and `zoneId` are resolved
  from the registry, never trusted from the wire — a Node-2 cannot claim to be
  a Node-1 and start reporting methane. Unknown ids are **rejected**, not
  invented, so a firmware typo fails loudly instead of appearing as a phantom
  sensor. Every channel defaults, because firmware forced to send a complete
  object breaks the day a sensor is added.
- **Both vocabularies accepted on the wire** (`convergenceMm` or
  `convergence`, `vibrationMms` or `microseismic`, `methanePctLel` or `gas`) —
  a dropped channel would read as a quiet sensor rather than a mistake.
- **Batching**: `{"readings":[...]}` so a coordinator sends one request per
  cycle rather than one TCP connection per node.
- **500ms coalescing** before emitting. Twelve nodes on a 3s cadence arrive as
  scattered frames; a tick per frame would push ~4 near-duplicate SSE messages
  a second.
- **Stale frames are omitted, never carried forward** — same 6s rule as the
  simulator, which is what lets the store turn silence into a Critical alert.
- **A dark Node-1 does not silence its Node-2.** Orphan surface readings are
  emitted separately, the same fix made in Step 5.

#### Source arbitration

Both feeds are mounted at once (the brief requires the mock and hardware paths
to drive the same store). If both wrote, they would overwrite each other every
tick and the dashboard would flicker between two versions of the mine.

Hardware wins: the first real frame flips `dataSource` to `'hardware'` and the
simulator returns early. If the mesh goes quiet for **30s** — well past the 6s
signal-loss timeout, so alerts fire first — the simulator resumes.

**That fallback is a demo convenience and must never be read as monitoring
behaviour.** Silence from real hardware is an alarm. It is safe only because
the signal-loss alerts have already fired by then, and because the UI states
which source is live in two places: the DATA SOURCE tile
(`ESP32 MESH — LIVE` / `SIMULATED`) and the header chip.

Fixing that chip mattered: it previously read "Live simulated feed · Demo mode"
**while real hardware data was on screen** — the same class of lie as showing a
stale reading as current.

#### Verification — end to end, with a simulated coordinator

```
GET  /api/ingest        -> ok, lists the 12 known nodeIds
POST unknown node UG-99 -> {"ok":false,"rejected":[{"reason":"unknown-node"}]}
POST batch UG-01/SF-02/UG-02 -> {"ok":true,"accepted":["UG-02","SF-02","UG-01"]}
GET  /api/ingest        -> zonesReporting 2   (Z1 surface null: SF-01 silent)
GET  /api/stream        -> retry:3000, event:hello, then a full EngineTick with
                           coordinates filled from the registry and risk fused
after 8s of silence     -> zonesReporting 0   (stale dropped, not carried)
```

Browser, coordinator posting 5 nodes every 2s:

```
DATA SOURCE   ESP32 MESH — LIVE      (green)
Live Sensor Feed  3/7 zones reporting
Z1  convergence 2.7  strain 147  vibration 0.2  methane 1.4  tilt 0.35
Z2  convergence 4.2  strain 168  vibration 0.55 methane 2.1  tilt 0.41
    surface tilt 0.07 / crack 1.4          <- exactly the POSTed values
dashboardsConnected = 1
```

Browser, no hardware: `DATA SOURCE SIMULATED` (amber), chip reads "Live
simulated feed · Demo mode", zones show neutral "Awaiting first report from
UG-0x" placeholders.

`tsc --noEmit` 0 errors, `next lint` clean, `npm run build` exit 0; `/api/ingest`
and `/api/stream` both registered dynamic.

#### Headless-Chrome trap discovered here

**An open SSE connection stops `--dump-dom` and `--screenshot` from ever
returning** — headless waits for network idle, which a live stream never
reaches. Both invocations hung until killed. The fix is `--timeout=<ms>`, which
caps the wait and writes the screenshot anyway:

```
chrome --headless=new --disable-gpu --no-sandbox --user-data-dir=<tmp> \
  --timeout=13000 --enable-unsafe-swiftshader --window-size=1600,1200 \
  --screenshot=<out.png> http://localhost:<port>/dashboard
```

Note `--virtual-time-budget` does **not** help here; it pauses on pending
network activity.

#### Known limitation — read before deploying anywhere but one container

Ingested state is module-level, so it is **per Node process**. Correct for
`next start` in a single container, which is this project's deployment. It
would NOT survive multiple workers or serverless — each instance would hold a
different slice of the mesh. Moving to either means putting the bus behind
Redis or MQTT.

#### Still not done

- **Nothing has been tested against real ESP32 firmware or a second physical
  device.** The coordinator was simulated with `curl` from the same machine.
  The firewall rules in the README are **written but unverified** — no second
  device was available here.
- `/api/ingest` is **unauthenticated**. Fine on an isolated mine LAN, wrong on
  anything routable; anyone who can reach port 3000 can inject readings and
  therefore trigger the emergency layer. A shared token header would be the
  minimum before this leaves a lab.

### 2026-09-07 — ESP32-C6 firmware + provisioned-node filtering

**No packages installed.**

**New:** `firmware/node1_underground/`, `firmware/node2_surface/`,
`firmware/coordinator/`, `firmware/README.md`.
**Changed:** `lib/constants.ts` gained `ACTIVE_NODE_IDS` / `ACTIVE_MESH_NODES` /
`ACTIVE_ZONES`; store, ingest bus, both panels, `usePrediction` and
`MineScene3D` now read the ACTIVE lists; `.env.local` documents the opt-in.

#### FIRMWARE IS UNVERIFIED — the one part of this project that is

There is no Arduino or ESP-IDF toolchain on this machine (`arduino-cli` and
`idf.py` both absent), so **nothing under `firmware/` has been compiled, let
alone flashed.** It is written against the `arduino-esp32` Zigbee API as
documented, checked against the current docs rather than memory
(`ZigbeeAnalog`, `addAnalogInput()`, `setAnalogInput(float)`,
`setAnalogInputReporting(min,max,delta)`, `reportAnalogInput()`,
`onAnalogInputChange(cb)`). Requires **core 3.1.0+** — the Zigbee library does
not exist in 2.x.

#### Why five endpoints on Node-1

The ZCL Analog Input cluster carries **one float per endpoint**, so each sensor
channel needs its own. Node-1 uses EP 10-14 (tilt/strain/convergence/vibration/
methane), Node-2 uses 10-11 on the device mapped to **20-21** on the
coordinator so the two devices' channels cannot collide. The endpoint table is
in `firmware/README.md`; change one side only and values silently land in the
wrong channel.

#### Three boards fill exactly ONE zone — and that needed a code change

12 nodes are modelled; three boards populate one zone (Z2, the zone that has
both an underground and a surface node). The other 10 would sit silent and
raise a Critical signal-loss alert every few seconds — correct for a real mine,
ruinous for a demo, because it buries the alerts that matter.

`NEXT_PUBLIC_STRATA_ACTIVE_NODES` (comma-separated ids) narrows what the
dashboard EXPECTS to hear from. It never silences a node that is expected and
quiet — that is still an alarm. Unset means the full 12-node mesh.

**Verified** with `NEXT_PUBLIC_STRATA_ACTIVE_NODES=UG-02,SF-02` and a simulated
coordinator POSTing both nodes every 2s:

```
DATA SOURCE       ESP32 MESH — LIVE
header chip       "Live ESP32 mesh feed"   (green, not "simulated")
ZIGBEE MESH       2/2 nodes online          <- not 2/12
Live Sensor Feed  1/1 zones reporting       <- only Z2
Z2  convergence 4.6  strain 172  vibration 0.62  methane 2.3  tilt 0.44
    surface tilt 0.08 / crack 1.6           <- exactly the POSTed values
3D view           one cube + one sphere, joined by the pair line
alerts            zero false signal-loss
```

It is **commented out** in `.env.local` by default so the simulated demo keeps
all 7 zones. `NEXT_PUBLIC_*` is baked in at build time — **rebuild after
changing it**.

#### Firmware decisions worth keeping

- **A failed sensor is never transmitted as 0.0.** `NaN` readings are skipped
  so the value goes stale and the dashboard reports it honestly. Sending 0
  would read as a healthy quiet channel — the exact failure this project
  exists to prevent.
- **Convergence is closure since install**, not raw ultrasonic standoff. The
  sketch captures a baseline at boot. A raw distance means nothing alone.
- **Ultrasonic is median-of-5** — a dusty gallery gives noisy pings.
- **Crack width is averaged over 16 samples**; a long lead to a pot on a crack
  face picks up mains hum, and unaveraged jitter of tenths of a millimetre
  looks like real ground movement on a chart.
- **Reporting max interval is 5s**, deliberately under the dashboard's 6s
  signal-loss timeout, or a healthy node looks dark.
- **The coordinator omits stale channels** (>6s) from the POST rather than
  sending old values, matching the server's own rule.
- **WiFi failure does not block Zigbee collection**, so readings resume the
  moment the uplink returns.

#### THE MAIN INTEGRATION RISK — decide this early

The coordinator runs **Zigbee (802.15.4) and WiFi on one 2.4 GHz radio**. They
coexist (`CONFIG_ESP_COEX_SW_COEXIST_ENABLE=y`) but time-share one antenna, so
expect occasional dropped Zigbee reports while an HTTP POST is in flight.

If unstable on the bench, split the roles: coordinator stays Zigbee-only and
passes frames over UART to a second board owning WiFi. One extra board, no
contention. **Not a decision to make the night before the demo.**

#### Calibration placeholders — these are NOT measurements

1. `HX_COUNTS_PER_USTRAIN = 21.0` — depends on bridge excitation, gauge factor,
   amplifier gain.
2. MQ-4 → % LEL is a linear stand-in; a real reading needs Rs/Ro against the
   datasheet curve after 24-48h burn-in.
3. `POT_TRAVEL_MM = 50.0` — set to your actual slide-pot travel.

Vibration integrates MPU6050 acceleration assuming a dominant ~30 Hz component.
There is no geophone on this rig, which is why the channel is called
"vibration" and never "microseismic".

#### ESP-IDF path

`firmware/README.md` carries both toolchains: Arduino IDE settings (Zigbee mode
`ED` vs `ZCZR`, partition scheme `Zigbee 4MB with spiffs`), the `arduino-cli`
equivalents, and the ESP-IDF route — `idf.py set-target esp32c6`, the
menuconfig keys, `sdkconfig.defaults` for both roles, and a
`partitions_zigbee.csv` with the required `zb_storage`/`zb_fct` partitions.
The `.ino` sketches are Arduino-API and will not build under plain ESP-IDF
without the Arduino component.

**Bring-up order:** coordinator first (it forms the network), then the end
devices. **`idf.py erase-flash` between attempts** — Zigbee network state
persists in NVS, so a board that joined a previous network keeps trying to
rejoin one that no longer exists. That single issue wastes more bench time than
anything else.

**Recommended next step.** Flash and bench-test. Everything server-side is
proven; the firmware is the untested half. Before the demo, also resolve the
`/api/ingest` authentication gap and the unsourced landing-page statistics.

### 2026-09-07 — Two-Tier Hardware Telemetry: Above-the-Surface & Underground Integration

**User Request**: Reflect actual project hardware sensors on the dashboard according to `brain.md`:
- **Underground**: MPU-6050 (Tilt & Vibration), HX711 (24-bit ADC Amplification), BF350 (Microstrain), MQ-4 (Methane CH4).
- **Above the Surface**: MPU-6050 (Surface Tilt & Ground Motion), Linear Potentiometer (0-50mm Subsidence Displacement & Crack Extensometer).
- **Layout Order**: First the readings of Above the Surface sensors, and when scrolling down, Underground sensors.

**What was built:**
1. **`types/index.ts`**:
   - Expanded `SensorType` with `'linear_pot' | 'mpu6050_tilt' | 'mpu6050_vib' | 'bf350_strain' | 'mq4_gas'`.
   - Updated `SensorNode` with `domain: 'surface' | 'underground'`, `hardwareModel`, and `rawSignal`.
   - Updated `TelemetryPoint` with dedicated surface channels (`surfaceDisplacementMm`, `surfaceCrackWidthMm`, `surfaceTiltDeg`, `surfaceVibrationMms`) and underground channels (`undergroundStrainMicrostrain`, `undergroundHx711Counts`, `undergroundTiltDeg`, `undergroundVibrationMms`, `methanePctLel`, `convergenceMm`).
2. **`lib/constants.ts`**:
   - Defined `SURFACE_THRESHOLDS` (Linear Pot 10/25mm, Surface Tilt 0.80/1.80°, Surface Vib 2.5/6.0 mm/s) and `UNDERGROUND_THRESHOLDS` (BF350 350/600 µε, Roof Tilt 1.50/3.00°, Strata Vib 5.0/12.0 mm/s, MQ-4 Methane 0.80/1.25% LEL).
   - Partitioned `INITIAL_SENSOR_NODES` into Above-the-Surface fleet (POT-01, POT-02, MPU-01, MPU-02) and Underground Seam XII fleet (BF350-01, BF350-02, MPU-01, MPU-02, MQ4-01, MQ4-02).
3. **`lib/sensorSimulator.ts`**:
   - Computes synchronized physical kinematics for both surface (Linear Potentiometers & surface IMUs) and underground strata (BF350, HX711 24-bit counts, subterranean IMUs, MQ-4 catalytic resistance).
   - Feeds the live XGBoost model (`/predict`) with real-time crack width and strain.
4. **`components/SurfaceTelemetrySection.tsx`**:
   - First dashboard section: Linear Potentiometer 50mm displacement gauge, Tension Fissure extensometer, MPU-6050 surface slope level gauge, MPU-6050 ground PPV vibration bar, and Surface Live Fleet frame.
5. **`components/UndergroundTelemetrySection.tsx`**:
   - Second dashboard section (revealed on scroll): BF350 + HX711 24-bit counts, derived pillar stress (MPa), MPU-6050 roof strata delamination compass, MPU-6050 strata shock PPV, MQ-4 methane concentration (% LEL / ppm proxy), and Underground Seam XII Fleet table.
6. **`components/TelemetryChart.tsx`**:
   - Added interactive tabs to switch between BF350 Strain, MPU Tilt, MPU Vib, MQ-4 Methane, and Surface Potentiometer.
7. **`app/dashboard/page.tsx`**:
   - Two-tier layout with master stratum topology overview, surface section first, underground section second on scroll, followed by correlation chart, room-and-pillar grid, and DGMS Form-IV alerts.

**Verification**: `npm run build` exit 0, all 10/10 static pages compiled cleanly. Verified live on `http://localhost:3005/dashboard`.

### 2026-09-07 — Quick Stratum Switcher Buttons & Dedicated Telemetry Graphs

**User Request**:
- Add two buttons on top of control console (one for underground and one for above surface) to switch between them easily.
- Add dedicated real-time dynamic graphs for both surface and underground metrics.

**What was built:**
1. **`app/dashboard/page.tsx`**:
   - Added interactive `activeTelemetryTab` state (`'all' | 'surface' | 'underground'`).
   - Built top console stratum switcher bar:
     - `[Above the Surface (SF-01/SF-02)]` (Sky blue active badge, 4 sensors)
     - `[Underground Strata (UG-01/UG-02)]` (Safety orange active badge, 6 sensors)
     - `[Combined View (All)]` (Full two-tier overview)
   - Real-time tab filtering: selectively isolates the Surface or Underground section, or displays both in sequence.
2. **`components/SurfaceTelemetrySection.tsx`**:
   - Added dedicated **Surface Deformation & Ground Kinematics Graph**:
     - Toggle between "Linear Pot: Subsidence & Fissure (mm)" and "MPU-6050: Slope Tilt & PPV (°)".
     - Real-time Recharts AreaChart with gradient fills and DGMS warning ($10\text{ mm}$) / breach ($25\text{ mm}$) reference lines.
3. **`components/UndergroundTelemetrySection.tsx`**:
   - Added dedicated **Subterranean Seam XII Strata Telemetry Graph**:
     - Toggle between "BF350 Strain & HX711 (µε)", "MPU-6050: Roof Tilt & Vib (°)", and "MQ-4 Methane (% LEL)".
     - Real-time Recharts AreaChart with DGMS Level-1 ($350\,\mu\epsilon$), Yield ($600\,\mu\epsilon$), and CMR Reg 169 Trip ($1.25\%\text{ LEL}$) reference lines.

**Verification**: `npm run build` exit 0, all 10/10 static pages compiled. Live test on `http://localhost:3005/dashboard` confirmed buttons and both graphs render cleanly.

### 2026-09-07 — Shift Sensor Readings Right to the Top & Complete Text Minimization

**User Request**:
- "shift readings upside wtf is that and please keep content very less u have just given so much text there whyyy keep less texts and just keep imp info dont add anything stuff please"
- Remove the wordy "TWO-TIER STRATA CONTROL & TELEMETRY TOPOLOGY" block shown in the uploaded screenshot (`media_1788766347858.png`).
- Shift the actual sensor reading meters directly to the top of the dashboard.
- Drastically minimize text across the console: remove explanatory paragraphs, verbose subtitles, subtext clutter, and filler; show only essential data (sensor names, large numbers, units, minimal status badges, and compact gauges).

**What was built:**
1. **`app/dashboard/page.tsx`**:
   - **Deleted** the entire verbose `TWO-TIER STRATA CONTROL & TELEMETRY TOPOLOGY` card completely.
   - Streamlined top header: minimal title `Strata Control Console` + `LIVE TELEMETRY` dot + Colliery Panel tag.
   - Compact stratum switcher bar (`[Above Surface (4)]`, `[Underground (4)]`, `[Combined]`).
   - Positioned the actual sensor readings (`SurfaceMetricCards` or `UndergroundMetricCards`) in `lg:col-span-3` directly alongside `RiskGaugeCard` in `lg:col-span-1` on the **VERY FIRST ROW** above the fold. Zero scrolling needed.
2. **`components/SurfaceTelemetrySection.tsx`**:
   - Stripped all descriptive paragraphs and wordy subtext.
   - Refactored into clean modular components:
     - `SurfaceMetricCards`: 4 high-density metric cards (Ground Subsidence [Linear Pot 50mm], Tension Fissure [Extensometer 100mm], Slope Tilt [MPU-6050], Surface Vibration [MPU-6050 PPV]) with big numbers, status pills, and minimal visual meters.
     - `SurfaceGraphCard`: Minimal live stream area chart with quick toggle buttons.
     - `SurfaceFleetTable`: Clean tabular summary with zero filler text.
3. **`components/UndergroundTelemetrySection.tsx`**:
   - Stripped all explanatory essays, verbose calibration explanations, and filler boxes.
   - Refactored into modular components:
     - `UndergroundMetricCards`: 4 high-density metric cards (Pillar Microstrain [BF350+HX711], Roof Strata Tilt [MPU-6050], Strata Vibration [MPU-6050], Methane Gas [MQ-4]) with big bold values, clean status badges, and minimal visual gauges.
     - `UndergroundGraphCard`: Minimal real-time area chart with 3 channel toggles.
     - `UndergroundFleetTable`: Clean tabular summary.

**Verification**: `npm run build` compiled 10/10 routes with zero errors. Next.js production server running on port 3005. Verified on `http://localhost:3005/dashboard`.



