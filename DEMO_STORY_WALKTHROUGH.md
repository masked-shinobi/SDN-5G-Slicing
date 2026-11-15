# 5G Network Slicing: Interactive Demo & Presentation Story Guide

> **Project:** 5G Network Slicing Dashboard & Open5GS / UERANSIM Bridge  
> **Target Audience:** Professors, Examiners, SDN Evaluators, and Telecom Engineers  
> **Format:** End-to-End Storytelling Narrative (Chronological Chapters 1 to 8)  
> **Live App URL:** [http://localhost:3000](http://localhost:3000)

---

## 🚀 Act 0: Quickstart & Setup (How to Run)

### Option A: Running on the Ubuntu 5G Host Machine (Live Open5GS + UERANSIM)
If you are presenting directly on your Ubuntu machine where Open5GS and UERANSIM are installed:

1. **Verify or start the 5G Core:**
   ```bash
   cd ~/5g-demo/scripts
   ./start-core.sh
   ./check-all.sh
   ```
2. **Start the Next.js Dashboard:**
   ```bash
   cd ~/slicing-dashboard   # (or project directory)
   npm install
   npm run build
   npm start
   ```
3. Open your browser to **[http://localhost:3000](http://localhost:3000)**.

### Option B: Running in Dev / Simulation Mode (Windows / Laptop Standalone)
The project includes a **Dual-Mode Resilient Engine**: if Open5GS or Linux TUN interfaces are not present (e.g. on Windows or Mac), the bridge activates high-fidelity simulated telemetry so the entire dashboard, animations, ping charts, and negative tests work seamlessly without crashing!

1. Open a terminal in the project directory:
   ```powershell
   npm install
   npm run build
   npm start
   ```
2. Open **[http://localhost:3000](http://localhost:3000)**.

---

## 🎭 The Story Chain: "A Tale of Two Slices"

Present this narrative chapter by chapter. Each chapter guides your audience through the exact page, what to click, what to point out on screen, and the precise technical script to speak.

```mermaid
journey
    title 5G Slicing Demo Story Chain
    section The Concept
      The Multi-Lane Highway Analogy: 5: Presenter
      3GPP S-NSSAI Wire Layout: 5: Presenter
    section The Core Ground Truth
      10 Core Functions Health Check: 5: Presenter
      MongoDB Subscription Entitlement: 5: Presenter
    section The RAN & Signaling
      gNodeB & Mobile UE Launch: 5: Presenter
      Animated 6-Step 3GPP Flow: 5: Presenter
    section Data Plane Isolation
      Dual TUN Interfaces & Subnets: 5: Presenter
      ICMP Ping Traffic Isolation: 5: Presenter
    section Security & QoS
      Negative Rejection (Cause #62): 5: Presenter
      5QI Throughput & AMBR Policing: 5: Presenter
```

---

### 📖 Chapter 1: The Metaphor — The Multi-Lane Highway
* **Where to Navigate:** Click **"Learn"** on the sidebar or open **[`/learn`](http://localhost:3000/learn)**.
* **What to Show on Screen:**
  1. The **"What is a Network Slice?"** analogy banner.
  2. The **"Interactive S-NSSAI Wire Decoder & Inspector"**.
* **What to Click:**
  - Click the **"Slice A"** shortcut button (`SST: 1`, `SD: 000001`).
  - Click the **"Slice B"** shortcut button (`SST: 2`, `SD: 000002`).
  - Select `SST 4 (V2X)` or enter a custom hex SD to show real-time 32-bit byte calculation.
* **What to Say to Your Audience:**
  > *"In legacy 4G LTE networks, all users—whether someone streaming 8K video, a hospital robot performing surgery, or an electric utility meter—share the same physical pipe with best-effort contention.*  
  > *In 5G Standalone, **Network Slicing creates logically isolated virtual networks over the same physical infrastructure**.*  
  > *Notice this wire decoder: 3GPP defines each slice as an **S-NSSAI** formed by an 8-bit **SST** (Slice/Service Type) and a 24-bit **SD** (Slice Differentiator). In our live setup, we have configured two distinct slices: **Slice A (eMBB)** for high bandwidth, and **Slice B (URLLC)** for ultra-reliable low latency."*

---

### 📖 Chapter 2: The Core Ground Truth — Core Health & Subscription Data
* **Where to Navigate:** Click **"Dashboard"** (`/`) and then **"Subscribers"** (`/subscribers`).
* **What to Show on Screen:**
  1. **Dashboard (`/`):** All 10 Open5GS core network functions (`amfd`, `smfd`, `upfd`, `udmd`, `udrd`, `pcfd`, `nssfd`, `ausfd`, `nrfd`) showing green `active` badges.
  2. **Subscribers (`/subscribers`):** Profile card for IMSI `999700000000001` with provisioned S-NSSAIs in MongoDB.
* **What to Say to Your Audience:**
  > *"Before any device can connect, the 5G Core must be running and the subscriber contract must exist in the **Unified Data Repository (UDR)**.*  
  > *Here on the Dashboard, our Next.js bridge queries systemd to verify the core control plane and user plane functions are live.*  
  > *On the Subscribers page, we interface with Open5GS's **MongoDB database**. You can see subscriber `999700000000001` is contractually provisioned with two **Subscribed S-NSSAIs**: Slice A (`1/000001`) and Slice B (`2/000002`). This is the ground truth against which all connections are authenticated."*

---

### 📖 Chapter 3: Powering Up the RAN — Radio & Mobile UE
* **Where to Navigate:** Click **"Test Lab"** (`/test-lab`).
* **What to Show on Screen:**
  - The **UERANSIM Process Control** cards (`nr-gnb` and `nr-ue`).
* **What to Click:**
  - Click **"Start nr-gnb"**: Point out the live PID, interface binding (`127.0.0.1`), and confirmation that the N2 SCTP association to Open5GS AMF is established.
  - Click **"Start nr-ue"**: Observe the UE transitioning to `Connected` state with IMSI `999700000000001`.
* **What to Say to Your Audience:**
  > *"Now we bring up the simulated radio environment using UERANSIM. First, we launch the simulated gNodeB, which sets up the NGAP N2 association over SCTP to the AMF.*  
  > *Next, we boot the simulated UE. Watch as it sends its initial NAS registration over the radio interface and requests access to our configured slices."*

---

### 📖 Chapter 4: The Control Plane Journey — The Animated 3GPP Flow
* **Where to Navigate:** Click **"Flow Animation"** (`/flow`).
* **What to Show on Screen:**
  - The interactive 6-node network topology: `UE ➔ gNB ➔ AMF ➔ UDM/MongoDB ➔ SMF ➔ UPF`.
* **What to Click:**
  - Click **"Play"** (or use **"Next Step"**) to walk through steps 1 through 6.
  - Click on **Step 1**, **Step 3**, and **Step 4** to highlight the decoded 3GPP Information Elements.
* **What to Say to Your Audience:**
  > *"What actually happens under the hood when a 5G sliced UE connects? Let's trace the exact 3GPP TS 23.502 signaling sequence:*  
  > *1. **Step 1:** The UE sends a NAS Registration Request containing its **Requested NSSAI** (`1/000001` & `2/000002`).*  
  > *2. **Step 2:** The gNodeB encapsulates this into an NGAP Initial UE Message and routes it to the AMF.*  
  > *3. **Step 3:** The AMF queries the UDM/UDR subscription data from MongoDB to verify if this subscriber is allowed to use these slices.*  
  > *4. **Step 4:** The AMF sends back a NAS Registration Accept containing the **Allowed NSSAI**.*  
  > *5. **Steps 5 & 6:** The UE requests two PDU sessions. The SMF selects the UPF, creates PFCP session tunnels over N4, and the Linux kernel binds each session to separate virtual network interfaces: `uesimtun0` for Slice A and `uesimtun1` for Slice B."*

---

### 📖 Chapter 5: Data Plane Isolation — Separate Virtual Lanes in Action
* **Where to Navigate:** Click **"Traffic & QoS"** (`/traffic`) on the **"ICMP Ping (Isolation)"** tab.
* **What to Show on Screen:**
  - The side-by-side action cards for **Slice A (`uesimtun0`)** and **Slice B (`uesimtun1`)**.
  - The live Recharts RTT latency graph.
  - The raw execution console at the bottom.
* **What to Click:**
  - Click **"Ping 8.8.8.8 via Slice A (uesimtun0)"**: Observe the terminal output showing ICMP packets traveling strictly through `uesimtun0` (`10.45.0.2`).
  - Click **"Ping 8.8.8.8 via Slice B (uesimtun1)"**: Observe ICMP packets traveling through `uesimtun1` (`10.46.0.2`).
  - Click **"Benchmark Both Slices"**: Show both lines plotting on the multi-line chart.
* **What to Say to Your Audience:**
  > *"Now we prove **Data Plane Traffic Isolation**. Even though both slices run on the same machine, they do not share network sockets or IP subnets.*  
  > *When we ping via Slice A, traffic is routed through TUN device `uesimtun0` on the `10.45.0.0/24` subnet.*  
  > *When we ping via Slice B, traffic is routed through `uesimtun1` on `10.46.0.0/24`.*  
  > *Neither slice can spy on, intercept, or saturate the other slice's tunnel!"*

---

### 📖 Chapter 6: Enforcing The Law — The Negative Security Test
* **Where to Navigate:** Return to **"Test Lab"** (`/test-lab`).
* **What to Show on Screen:**
  - The **"Negative Slicing Test Workbench"** card.
* **What to Click:**
  - Verify `Requested SST: 3` and `Requested SD: 000003` (unsubscribed slice).
  - Click **"Execute Negative Rejection Test"**.
  - Point out the red rejection banner displaying **3GPP 5GMM Cause #62 (Slice Not Supported)**.
* **What to Say to Your Audience:**
  > *"In networking security, proving that unauthorized traffic is rejected is just as crucial as showing authorized traffic works.*  
  > *Here, our UE attempts a rogue registration requesting **SST: 3, SD: 000003** (mMTC IoT slice), which was never provisioned in the subscriber's MongoDB profile.*  
  > *Notice what happens: The Open5GS AMF immediately detects the mismatch, enforces 3GPP access control, and issues an explicit rejection with **3GPP 5GMM Cause Code #62: Slice Not Supported**.*  
  > *This demonstrates real-time authorization enforcement at the 5G control plane."*

---

### 📖 Chapter 7: The Master Question — 5QI QoS & Bandwidth Policing
* **Where to Navigate:** Go to **"Traffic & QoS"** (`/traffic`) and click the tab **"5QI QoS & Throughput (Phase 10)"**.
* **What to Show on Screen:**
  - The **3GPP 5QI QoS & AMBR Specifications** panel comparing 5QI 9 vs 5QI 82.
  - The **Throughput Benchmark Controller** and the dual **Bandwidth Throughput Timeline (Area Chart)**.
* **What to Click:**
  - Click **"Run Slice A Throughput Benchmark (eMBB)"**: Observe throughput ramping up to ~140 Mbps.
  - Click **"Run Slice B Throughput Benchmark (URLLC)"**: Observe throughput tightly capped at deterministic 48–50 Mbps with <0.5 ms jitter and 0% packet loss.
* **What to Say to Your Audience (Crucial Presentation Point!):**
  > *"A critical question examiners often ask is: 'If Slice B is URLLC and Slice A is eMBB, why were their ping latencies identical in Chapter 5?'*  
  > *Here is the key insight: **SST is solely an identity; real performance differentiation comes from 5QI QoS profiles, AMBR bandwidth policing, and UPF placement.** Since both TUN devices run on the same CPU kernel, raw ICMP ping will look similar.*  
  > *However, look at this Throughput & QoS benchmark:*  
  > *- **Slice A** is mapped to **5QI = 9 (Non-GBR)** with a 1 Gbps AMBR, allowing TCP to burst aggressively to peak capacity for streaming and large downloads.*  
  > *- **Slice B** is mapped to **5QI = 82 (Delay-critical GBR)** with a deterministic 50 Mbps AMBR cap. It sacrifices raw burst speed to guarantee sub-millisecond jitter and zero packet drops for mission-critical automation.*  
  > *This proves how 5G operators deliver tailored performance for drastically different industry use cases."*

---

### 📖 Chapter 8: Auditing & Developer Standards — Live Logs & OpenAPI Spec
* **Where to Navigate:** Click **"Live Logs"** (`/logs`) and then **"API Docs"** (`/api-docs`).
* **What to Show on Screen:**
  1. **Logs (`/logs`):** Click the **"NSSAI"** filter pill; observe highlighted lines showing Allowed NSSAI selection.
  2. **API Docs (`/api-docs`):** Show the OpenAPI 3.0.3 Explorer. Click **"Try It Out"** on `/api/status` and `/api/test-lab/negative`.
* **What to Say to Your Audience:**
  > *"To ensure auditability, our Live Logs viewer tails the Open5GS AMF and SMF log streams in real time with dedicated 5G keyword filters.*  
  > *Finally, the entire dashboard is backed by a secure, non-root bridge layer fully documented under the **OpenAPI 3.0.3 standard**.*  
  > *Anyone can inspect the schemas, download `openapi.yaml`, or integrate external SDN controllers using these endpoints."*

---

## 🎯 Quick Presenter Cheatsheet & Examiner Q&A

| Potential Examiner Question | The Winning Answer |
|---|---|
| **"Why is Slice B ping not 1 ms if it is URLLC?"** | *"SST defines slice identity and intent. Actual latency guarantees in physical networks come from 5QI QoS flows, AMBR traffic policing, and deploying the UPF at the edge near the gNB. On a single laptop, both virtual interfaces share the Linux loopback kernel, so ICMP ping is ~0.3 ms on both. Phase 10 proves how 5QI and AMBR enforce true bandwidth and jitter differentiation."* |
| **"What prevents arbitrary shell execution from the web?"** | *"The frontend never sends raw shell strings. The bridge layer uses `child_process.execFile` with hardcoded binary paths and strict allow-listed arguments (`systemctl is-active`, `ip -4 addr`, `ping -I uesimtunX`). All payloads are validated using Zod schemas."* |
| **"Where is slicing data stored?"** | *"Provisioned subscriber slices are stored in MongoDB (`open5gs.subscribers`). Active RAN slices are held in gNodeB and AMF memory, while session IP tunnels are managed by SMF and UPF."* |
| **"What 3GPP cause code indicates an unauthorized slice?"** | *"3GPP 5GMM Cause #62: 'Slice Not Supported'. We demonstrate this dynamically in Chapter 6."* |

---

*End of Demo Guide. Keep this open during your presentation for a flawless, structured demonstration!*
