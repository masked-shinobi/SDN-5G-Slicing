import React from "react";
import Link from "next/link";
import {
  Layers,
  Activity,
  Server,
  Radio,
  Wifi,
  Users,
  ShieldCheck,
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
  GitCommitHorizontal,
  ScrollText,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            3GPP Standalone (SA) Slicing Architecture
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            5G End-to-End Network Slicing
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Multi-tenant network virtualization running on <span className="text-foreground font-semibold">Open5GS 5G Core</span> and <span className="text-foreground font-semibold">UERANSIM v3.2.6</span>. 
            Isolated data networks, dedicated IP pools, and differentiated QoS profiles for eMBB and URLLC services.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/slices"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25"
            >
              Explore Slices <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/traffic"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-500" /> Test Per-Slice Ping
            </Link>
            <Link
              href="/flow"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              <GitCommitHorizontal className="w-4 h-4 text-blue-500" /> View Signaling Flow
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 5G Core Status */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">5G Core Services</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">10/10</span>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Healthy
            </span>
          </div>
          <p className="text-xs text-muted-foreground">AMF, SMF, UPF, NRF, UDM, UDR active</p>
        </div>

        {/* Card 2: Active Slices */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Active Slices</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">2 Slices</span>
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
              SST 1 & SST 2
            </span>
          </div>
          <p className="text-xs text-muted-foreground">eMBB (internet) + URLLC (internet2)</p>
        </div>

        {/* Card 3: Connected gNB */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">gNodeB (Radio)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">Connected</span>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              NGAP Up
            </span>
          </div>
          <p className="text-xs text-muted-foreground">UERANSIM nr-gnb (PLMN 999/70)</p>
        </div>

        {/* Card 4: Registered UE */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Registered UE</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">1 UE</span>
            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              2 PDU Sessions
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground truncate">IMSI: 999700000000001</p>
        </div>
      </div>

      {/* Slices Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Active 5G Network Slices</h2>
            <p className="text-xs text-muted-foreground">
              Isolated user-plane network tunnels bound to virtual interfaces
            </p>
          </div>
          <Link
            href="/slices"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            Manage Slices <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slice A: eMBB */}
          <div className="rounded-2xl bg-card border border-blue-500/30 p-6 space-y-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    Slice A • eMBB
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Enhanced Mobile Broadband</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-muted-foreground">Interface:</span>
                <span className="font-bold text-foreground ml-1.5 bg-muted px-2 py-1 rounded">
                  uesimtun0
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-border/50 text-xs font-mono">
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">SST</span>
                <span className="font-bold text-blue-500">1</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">SD</span>
                <span className="font-bold text-foreground">000001</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">DNN</span>
                <span className="font-bold text-foreground">internet</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">IP POOL</span>
                <span className="font-bold text-foreground">10.45.0.0/24</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for ultra-high throughput applications like 4K/8K video streaming and general internet browsing with wide-area coverage.
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Target: 20 Gbps peak / 100 Mbps per user</span>
              </div>
              <Link
                href="/traffic"
                className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1"
              >
                Ping Slice A <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Slice B: URLLC */}
          <div className="rounded-2xl bg-card border border-purple-500/30 p-6 space-y-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-bold">
                  B
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    Slice B • URLLC
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Ultra-Reliable Low-Latency Communication</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-muted-foreground">Interface:</span>
                <span className="font-bold text-foreground ml-1.5 bg-muted px-2 py-1 rounded">
                  uesimtun1
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-border/50 text-xs font-mono">
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">SST</span>
                <span className="font-bold text-purple-500">2</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">SD</span>
                <span className="font-bold text-foreground">000002</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">DNN</span>
                <span className="font-bold text-foreground">internet2</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <span className="text-[10px] text-muted-foreground block font-sans">IP POOL</span>
                <span className="font-bold text-foreground">10.46.0.0/24</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for mission-critical low-latency transfer with 99.999% reliability for industrial automation, robotics, and smart grids.
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>Target: ~1 ms latency / 99.999% reliability</span>
              </div>
              <Link
                href="/traffic"
                className="text-xs font-medium text-purple-500 hover:text-purple-400 flex items-center gap-1"
              >
                Ping Slice B <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Project Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/subscribers"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Subscriber Provisioning</h4>
            <p className="text-xs text-muted-foreground">
              Manage subscribed S-NSSAI slices in MongoDB for IMSI 999700000000001.
            </p>
          </Link>

          <Link
            href="/flow"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <GitCommitHorizontal className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Animated Signaling Flow</h4>
            <p className="text-xs text-muted-foreground">
              Visualizes UE registration, NSSAI exchange, and PDU session creation step-by-step.
            </p>
          </Link>

          <Link
            href="/test-lab"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Negative Slicing Test</h4>
            <p className="text-xs text-muted-foreground">
              Request unsubscribed SST 3 / SD 3 and verify rejection by Open5GS AMF.
            </p>
          </Link>

          <Link
            href="/traffic"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Activity className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Traffic & Latency Benchmark</h4>
            <p className="text-xs text-muted-foreground">
              Run real-time ping on uesimtun0 & uesimtun1 with live chart updates.
            </p>
          </Link>

          <Link
            href="/logs"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <ScrollText className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Live 5G Core Logs</h4>
            <p className="text-xs text-muted-foreground">
              Filter AMF/SMF logs in real-time for NSSAI, S-NSSAI, and Registration events.
            </p>
          </Link>

          <Link
            href="/learn"
            className="p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-foreground">5G Slicing Education</h4>
            <p className="text-xs text-muted-foreground">
              Learn SST, SD, S-NSSAI, and NSSAI types (Configured, Requested, Allowed, Subscribed).
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
