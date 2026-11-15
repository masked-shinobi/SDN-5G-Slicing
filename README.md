# 5G Network Slicing Dashboard & Bridge

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Open5GS](https://img.shields.io/badge/Open5GS-v2.7+-orange?style=flat)](https://open5gs.org/)
[![UERANSIM](https://img.shields.io/badge/UERANSIM-v3.2.6-purple?style=flat)](https://github.com/aligungr/UERANSIM)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0.3-green?style=flat&logo=openapi-initiative)](https://openapis.org/)

A full-stack, enterprise-grade 5G Network Slicing Dashboard and bridge layer built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It interfaces with an **Open5GS 5G Core** and **UERANSIM (v3.2.6)** running on Ubuntu to provide real-time control, live monitoring, dynamic 3GPP signaling visualization, per-slice traffic isolation testing, and access authorization validation.

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Browser ["Web Browser UI (Next.js 15 App Router)"]
        UI_Dash["/ (Dashboard & Health)"]
        UI_Slices["/slices (S-NSSAI Cards & KPIs)"]
        UI_Subscribers["/subscribers (MongoDB Provisioning)"]
        UI_Traffic["/traffic (Live ICMP RTT Chart)"]
        UI_Flow["/flow (3GPP Signaling Animation)"]
        UI_Lab["/test-lab (RAN Control & Negative Test)"]
        UI_Logs["/logs (Live NSSAI Log Viewer)"]
        UI_Learn["/learn (3GPP Spec Explainer)"]
        UI_Docs["/api-docs (OpenAPI 3.0 Explorer)"]
    end

    subgraph BridgeLayer ["Next.js Server-Side Bridge (/api/*)"]
        API_Status["/api/status (systemctl is-active)"]
        API_Slices["/api/slices (ip -4 addr show)"]
        API_Subs["/api/subscribers (MongoDB Driver + Zod)"]
        API_Ping["/api/ping (Allow-listed ping -I)"]
        API_RAN["/api/gnb & /api/ue (Process Control)"]
        API_Neg["/api/test-lab/negative (Cause #62 Verifier)"]
        API_Logs["/api/logs (AMF/SMF File Reader)"]
    end

    subgraph LinuxKernel ["Host Operating System / Linux Kernel"]
        TUN0["uesimtun0 (10.45.0.2/24)"]
        TUN1["uesimtun1 (10.46.0.2/24)"]
        IP_Tables["iptables NAT / ogstun"]
    end

    subgraph 5GCore ["Open5GS 5G Standalone Core"]
        AMF["AMF (Access & Mobility)"]
        SMF["SMF (Session Management)"]
        UPF["UPF (User Plane Function)"]
        UDM["UDM / UDR (Subscription Data)"]
        NRF["NRF / PCF / NSSF / AUSF"]
        MongoDB[("MongoDB (open5gs.subscribers)")]
    end

    subgraph RAN ["UERANSIM (Simulated 5G RAN & UE)"]
        GNB["nr-gnb (Simulated gNodeB)"]
        UE["nr-ue (Simulated UE - IMSI 999700000000001)"]
    end

    %% Connections
    Browser --> BridgeLayer
    BridgeLayer -->|Allow-listed CLI & Sockets| LinuxKernel
    BridgeLayer -->|Official MongoDB Driver| MongoDB
    BridgeLayer -->|Log File Streaming| 5GCore
    GNB <==>|NGAP / N2 SCTP| AMF
    UE <==>|3GPP NAS-5GS| AMF
    SMF <==>|PFCP / N4 GTP-U| UPF
    UE -.->|Binds PDU Session 1| TUN0
    UE -.->|Binds PDU Session 2| TUN1
    TUN0 -->|Slice A: eMBB| UPF
    TUN1 -->|Slice B: URLLC| UPF
```

---

## 5G Slicing Deployment Specifications

| Parameter | Slice A (eMBB) | Slice B (URLLC) |
|---|---|---|
| **Slice / Service Type (SST)** | **1** (Enhanced Mobile Broadband) | **2** (Ultra-Reliable Low-Latency) |
| **Slice Differentiator (SD)** | `000001` (Hex, 24-bit) | `000002` (Hex, 24-bit) |
| **Standard S-NSSAI** | `SST: 1 \| SD: 000001` | `SST: 2 \| SD: 000002` |
| **Data Network Name (DNN)** | `internet` | `internet2` |
| **Allocated IP Pool** | `10.45.0.0/24` | `10.46.0.0/24` |
| **Assigned Linux TUN Interface** | `uesimtun0` | `uesimtun1` |
| **Subscriber IMSI / PLMN** | `999700000000001` / `999/70` | `999700000000001` / `999/70` |
| **ITU-R Target Focus** | High throughput (peak ~20 Gbps) | Low latency (~1 ms), 99.999% reliability |

---

## 3-Command Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Start the dashboard server
npm start
```
The dashboard will be accessible at: **[http://localhost:3000](http://localhost:3000)**.

For rapid development with hot-reloading:
```bash
npm run dev
```

---

## 5-Minute Live Presentation Script

Use this exact sequence during project demonstrations to present the full end-to-end functionality:

1. **Introduction & Concepts (`/learn`)**:
   - Navigate to `/learn`.
   - Explain the 5G slicing highway analogy: dedicated virtual networks running over shared physical infrastructure.
   - Use the **Interactive S-NSSAI Wire Decoder** to demonstrate how SST (8 bits) and SD (24 bits) form a 32-bit wire Information Element.
2. **5G Core Health & Topology (`/`)**:
   - Open `/` to verify all 10 Open5GS core network functions (`amfd`, `smfd`, `upfd`, `udmd`, etc.) are active.
3. **Subscriber Entitlement (`/subscribers`)**:
   - Open `/subscribers` to inspect IMSI `999700000000001` provisioned in MongoDB.
   - Show that the subscriber is entitled to both Slice A and Slice B.
4. **RAN Process Activation (`/test-lab`)**:
   - Open `/test-lab`. Start `nr-gnb` (verify N2 SCTP link to AMF) and start `nr-ue` (verify 3GPP Registration).
5. **Data Plane Traffic Isolation (`/traffic`)**:
   - Open `/traffic`. Click **"Ping via Slice A"** (`uesimtun0` ➔ `10.45.0.x`).
   - Click **"Ping via Slice B"** (`uesimtun1` ➔ `10.46.0.x`).
   - Show the real-time Recharts multi-line latency chart and raw terminal output proving packet segregation.
6. **Negative Authorization Test (`/test-lab`)**:
   - In `/test-lab`, execute the Negative Slicing Rejection Test requesting unprovisioned slice `SST: 3, SD: 000003`.
   - Show that Open5GS AMF immediately enforces access control and rejects the session with **3GPP 5GMM Cause #62 (Slice Not Supported)**.
7. **Interactive Signaling Walkthrough (`/flow`)**:
   - Open `/flow` to observe the animated 6-step registration and PDU session establishment sequence with decoded 3GPP Information Elements.
8. **OpenAPI Bridge Verification (`/api-docs`)**:
   - Open `/api-docs` to demonstrate self-documenting endpoints and execute live requests directly from the UI.

---

## Security Architecture

1. **Strict Command Allow-Listing**:
   The web frontend never issues arbitrary shell commands. All system interactions are mediated by server-side Route Handlers with hardcoded commands and parameter arrays executed via `child_process.execFile`:
   - `systemctl is-active <service>`
   - `ip -4 addr show <interface>`
   - `ping -I <uesimtun0|uesimtun1> -c <count> <target>`
2. **Zod Schema Validation**:
   All user inputs (IMSI strings, SST integers, hex SD formats, AMBR bandwidths) are strictly validated before MongoDB updates.
3. **Dual-Mode Resilient Execution**:
   - **Host Ubuntu Mode**: Automatically interacts with native Open5GS systemd services, UERANSIM TUN interfaces, and local MongoDB.
   - **Dev / Simulation Mode**: When run on Windows or developer laptops without Open5GS, the bridge seamlessly activates high-fidelity simulated telemetry so developers can test UI and workflows offline.

---

## Testing & Quality Control

```bash
# Run unit tests across all 8 test suites
npm test

# Run ESLint code quality checks
npm run lint

# Compile production bundle
npm run build
```

---

## API Reference

The project includes an **OpenAPI 3.0.3 specification** located at [`openapi.yaml`](file:///d:/SEMESTER%20-%207/Software%20Defined%20Networks/SDN%20USE%20CASE/openapi.yaml). You can also explore and execute all endpoints interactively in your browser at:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**.
