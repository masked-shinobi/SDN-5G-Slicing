import React from "react";
import { BookOpen, Layers, Zap, Clock, Cpu, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
          <BookOpen className="w-3.5 h-3.5" /> 3GPP Technical Specifications Explainer
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Understanding 5G Network Slicing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A beginner-readable guide to S-NSSAI, SST, SD, NSSAI types, and slice behavior.
        </p>
      </div>

      {/* Slice Concept Analogy */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/40 border border-border shadow-sm space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> What is a Network Slice?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Think of a physical 5G network as a multi-lane highway. Rather than forcing all traffic—whether an ambulance, a high-speed sports car, or a slow delivery truck—into the same congested lane, 
          <strong> 5G Network Slicing creates dedicated virtual lanes</strong> on top of the same shared physical infrastructure. Each slice has its own dedicated logic, security rules, IP address pool, and performance profile.
        </p>
      </div>

      {/* The 3 Core Slice Types */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Standard 3GPP Slice Types (SST)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* eMBB */}
          <div className="p-6 rounded-2xl bg-card border border-blue-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                SST = 1
              </span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg">eMBB</h3>
            <p className="text-xs font-medium text-muted-foreground">Enhanced Mobile Broadband</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Focuses on ultra-fast data speeds, high bandwidth, and wide-area coverage.
            </p>
            <div className="text-xs font-mono bg-muted/40 p-2.5 rounded-lg space-y-1">
              <div><strong className="font-sans text-[11px] text-muted-foreground">Peak:</strong> ~20 Gbps</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Target:</strong> ~100 Mbps/user</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Use:</strong> 4K/8K video, VR/AR</div>
            </div>
          </div>

          {/* URLLC */}
          <div className="p-6 rounded-2xl bg-card border border-purple-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">
                SST = 2
              </span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg">URLLC</h3>
            <p className="text-xs font-medium text-muted-foreground">Ultra-Reliable Low-Latency Comm</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Focuses on near-instant data transfer with extreme reliability for mission-critical tasks.
            </p>
            <div className="text-xs font-mono bg-muted/40 p-2.5 rounded-lg space-y-1">
              <div><strong className="font-sans text-[11px] text-muted-foreground">Latency:</strong> ~1 ms</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Reliability:</strong> 99.999%</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Use:</strong> Robotics, surgery, smart grid</div>
            </div>
          </div>

          {/* mMTC / MIoT */}
          <div className="p-6 rounded-2xl bg-card border border-emerald-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                SST = 3
              </span>
              <Cpu className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg">mMTC / MIoT</h3>
            <p className="text-xs font-medium text-muted-foreground">Massive Machine-Type Comm</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Focuses on massive density of low-power devices sending small, periodic telemetry bursts.
            </p>
            <div className="text-xs font-mono bg-muted/40 p-2.5 rounded-lg space-y-1">
              <div><strong className="font-sans text-[11px] text-muted-foreground">Density:</strong> Up to 1M devices/km²</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Battery:</strong> 10+ year life</div>
              <div><strong className="font-sans text-[11px] text-muted-foreground">Use:</strong> Smart meters, agriculture</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms breakdown */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <h3 className="text-lg font-bold">Key Terminology Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <h4 className="font-bold text-sm text-foreground">SST (Slice/Service Type)</h4>
            <p className="text-muted-foreground">
              An 8-bit integer (0–255) defining the standardized expected network behavior (e.g. 1 = eMBB, 2 = URLLC, 3 = MIoT, 4 = V2X).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <h4 className="font-bold text-sm text-foreground">SD (Slice Differentiator)</h4>
            <p className="text-muted-foreground">
              A 24-bit (6 hex characters) optional identifier distinguishing different slices with the same SST (e.g., enterprise customer A vs customer B).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <h4 className="font-bold text-sm text-foreground">S-NSSAI</h4>
            <p className="text-muted-foreground">
              Single Network Slice Selection Assistance Information. The combination of SST + SD (e.g., <code className="bg-muted px-1 rounded font-mono">SST: 1, SD: 000001</code>).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
            <h4 className="font-bold text-sm text-foreground">NSSAI (The List)</h4>
            <p className="text-muted-foreground">
              A collection of up to 8 S-NSSAIs simultaneously supported for a UE (e.g., Subscribed, Requested, Allowed, or Configured NSSAI).
            </p>
          </div>
        </div>
      </div>

      {/* What this demo proves vs what it does not */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-emerald-500/30 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-emerald-500 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> What this Demo Proves
          </h4>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
            <li><strong>Slice Identification:</strong> Distinct S-NSSAI signalling between UE, gNB, and AMF.</li>
            <li><strong>Traffic Isolation:</strong> Separate IP pools (<code className="font-mono">10.45.0.0/24</code> vs <code className="font-mono">10.46.0.0/24</code>) and separate tun interfaces (<code className="font-mono">uesimtun0</code> vs <code className="font-mono">uesimtun1</code>).</li>
            <li><strong>Authorization:</strong> Negative test verifying rejection when a UE requests an unprovisioned slice.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-amber-500/30 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Important Technical Note
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The SST by itself is an <strong>identity</strong>. True physical differences in latency and throughput come from QoS profiles (5QI, AMBR) and UPF placement. Because both simulated interfaces run on the same machine kernel, baseline ping latencies will be identical unless bandwidth throttling / QoS traffic shaping is applied (explored in Phase 10).
          </p>
        </div>
      </div>
    </div>
  );
}
