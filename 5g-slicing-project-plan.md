# 5G Network Slicing Project Plan

## Project Overview
A web dashboard and bridge layer for 5G Network Slicing using:
- **Next.js 15 (App Router)** + **TypeScript** (Strict Mode)
- **Tailwind CSS** + **shadcn/ui**
- **Lucide React** + **Recharts** + **Framer Motion**
- **Zod** schema validation + **MongoDB** official driver + **Vitest**
- **Open5GS Core** (AMF, SMF, UPF, NRF, UDM, UDR, PCF, NSSF, AUSF) + **UERANSIM** (gNB, UE)
- Slices:
  - **Slice A**: SST=1, SD=000001, DNN `internet`, Pool `10.45.0.0/24`, Interface `uesimtun0` (eMBB)
  - **Slice B**: SST=2, SD=000002, DNN `internet2`, Pool `10.46.0.0/24`, Interface `uesimtun1` (URLLC)
- Subscriber: IMSI `999700000000001`, PLMN `999/70`

## Build Phases

### Phase 1: Foundation & Layout
- Initialize project with Next.js App Router, TypeScript, Tailwind, Lucide icons, dark/light theme support.
- Set up sidebar navigation, header, theme toggle, and route shells for `/`, `/slices`, `/subscribers`, `/flow`, `/traffic`, `/test-lab`, `/logs`, `/learn`, `/api-docs`.
- Set up Vitest, ESLint, Prettier, `.env.local` / `.env.example`, Makefile, Git repo.
- Acceptance check: App runs at `localhost:3000` with working navigation and theme toggling.

### Phase 2: Core Status, Slices API & Dashboard
- Implement `/api/status` and `/api/slices` with dual-mode (live Open5GS/Linux command bridge + robust fallback/mock for simulation).
- Build Dashboard overview (Core health, gNB/UE status, active sessions) and `/slices` detailed cards with tooltips for SST, SD, S-NSSAI, DNN, IP pools.
- Acceptance check: Page displays 2 slices with correct SST/SD/IP pool and core status.

### Phase 3: Subscribers Management (MongoDB)
- Implement `/api/subscribers` (GET, POST, PUT, DELETE) connecting to Open5GS MongoDB collection (`open5gs.subscribers`) with Zod schema validation.
- Build `/subscribers` UI allowing viewing, adding, and toggling S-NSSAI slices for IMSI `999700000000001`.
- Acceptance check: Changes accurately reflected in MongoDB / Open5GS subscriber format.

### Phase 4: Per-Slice Traffic & Ping
- Implement `/api/ping` with allow-listed interfaces (`uesimtun0`, `uesimtun1`).
- Build `/traffic` page with real-time ping execution, latency comparison chart (Recharts), and jitter/packet stats.
- Acceptance check: Both slices return latency metrics and live chart updates.

### Phase 5: Test Lab (gNB/UE Control & Negative Slicing Test)
- Implement `/api/gnb` and `/api/ue` controls (start/stop) with allow-listed script execution.
- Implement negative test: UE requests unsubscribed slice (e.g., SST=3, SD=000003 / SST=3 SD=3) and AMF rejects with exact 5GSM / 5GMM cause code (`Slice not supported`).
- Acceptance check: Negative test shows explicit rejection reason and network response.

### Phase 6: Live Logs Viewer with 5G Filtering
- Implement `/api/logs` endpoint streaming or tailing Open5GS AMF/SMF logs.
- Build `/logs` UI with filtering for `NSSAI`, `S-NSSAI`, `Registration`, `PDU Session`, and severity levels.
- Acceptance check: NSSAI and Registration log lines highlighted with color-coded tags.

### Phase 7: Interactive Signaling Flow Animation
- Build `/flow` page featuring interactive Framer Motion animation of the 5G Standalone Registration and S-NSSAI Selection procedure:
  `UE -> gNB -> AMF -> UDM/UDR (Subscription Check) -> Allowed NSSAI -> SMF/UPF -> PDU Session Establishment`.
- Sync flow state with actual log events or interactive step-by-step playback.
- Acceptance check: Steps light up with detailed 3GPP signaling explanation as UE registers.

### Phase 8: Educational Learn Center & Polish
- Build `/learn` comprehensive guide explaining eMBB, URLLC, mMTC/MIoT, S-NSSAI breakdown (SST vs SD), NSSAI types (Configured, Requested, Allowed, Subscribed).
- Polish responsive design, accessibility, error states, and tooltips.
- Acceptance check: Beginner-readable educational walkthrough with interactive cards.

### Phase 9: Documentation, OpenAPI & Verification
- OpenAPI 3.0 specification (`openapi.yaml`) + Swagger UI at `/api-docs`.
- Comprehensive `README.md` with Mermaid architecture diagram and run instructions.
- Acceptance check: `npm run build`, lint, and tests all pass cleanly; repo ready for presentation.

### Phase 10 (Optional): Per-Slice QoS & Throughput Comparison
- Add AMBR / 5QI bandwidth comparison and iperf3 simulation between eMBB and URLLC slices.
