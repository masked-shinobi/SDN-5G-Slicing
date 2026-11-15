"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  Radio,
  Server,
  Network,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { SliceInfo } from "@/lib/types";
import { InfoTooltip } from "@/components/info-tooltip";

export default function SlicesPage() {
  const [slices, setSlices] = useState<SliceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlices = async () => {
    try {
      const res = await fetch("/api/slices");
      if (res.ok) {
        const json = await res.json();
        setSlices(json.slices);
      }
    } catch (err) {
      console.error("Failed to fetch slices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlices();
    const interval = setInterval(fetchSlices, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Network className="w-3.5 h-3.5" /> 3GPP TS 23.501 Slice Architecture
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Active Network Slices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            End-to-end logical networks defined by Single Network Slice Selection Assistance Information (S-NSSAI)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-muted px-3 py-1.5 rounded-xl border border-border/60">
            PLMN: <strong>999 / 70</strong>
          </span>
          <button
            onClick={fetchSlices}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Refresh slices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slices.map((slice) => {
          const isSliceA = slice.id === "A";

          return (
            <div
              key={slice.id}
              className={`p-6 rounded-2xl bg-card border shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md ${
                isSliceA ? "border-blue-500/40" : "border-purple-500/40"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${
                      isSliceA
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                    }`}
                  >
                    {slice.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-foreground">{slice.name}</h3>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          slice.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {slice.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isSliceA ? "Enhanced Mobile Broadband" : "Ultra-Reliable Low-Latency Comm"}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-semibold border border-border/50">
                  {slice.interface}
                </span>
              </div>

              {/* 3GPP Technical Identifiers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-muted/40 p-3.5 rounded-xl border border-border/50 text-xs font-mono">
                {/* SST */}
                <div className="p-2.5 rounded-lg bg-background/80 border border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans mb-1">
                    <span>SST</span>
                    <InfoTooltip
                      term="Slice/Service Type (SST)"
                      definition="An 8-bit integer (1-255) identifying the expected slice service behavior and performance requirements."
                      example="SST 1 = eMBB, SST 2 = URLLC, SST 3 = MIoT"
                    />
                  </div>
                  <div className={`text-base font-bold ${isSliceA ? "text-blue-500" : "text-purple-500"}`}>
                    {slice.sst}
                  </div>
                </div>

                {/* SD */}
                <div className="p-2.5 rounded-lg bg-background/80 border border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans mb-1">
                    <span>SD</span>
                    <InfoTooltip
                      term="Slice Differentiator (SD)"
                      definition="A 24-bit (6 hex digits) optional identifier distinguishing multiple slices with the exact same SST."
                      example="e.g. 000001 vs 000002"
                    />
                  </div>
                  <div className="text-base font-bold text-foreground">{slice.sd}</div>
                </div>

                {/* DNN */}
                <div className="p-2.5 rounded-lg bg-background/80 border border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans mb-1">
                    <span>DNN</span>
                    <InfoTooltip
                      term="Data Network Name (DNN)"
                      definition="Equivalent to 4G APN. Identifies the external data network packet gateway or destination."
                      example="e.g. 'internet' or 'internet2'"
                    />
                  </div>
                  <div className="text-base font-bold text-foreground truncate">{slice.dnn}</div>
                </div>

                {/* IP Pool */}
                <div className="p-2.5 rounded-lg bg-background/80 border border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans mb-1">
                    <span>Subnet Pool</span>
                    <InfoTooltip
                      term="Subnet / IP Pool"
                      definition="Dedicated IPv4 CIDR pool assigned to this slice's UPF session for traffic isolation."
                      example="10.45.0.0/24 vs 10.46.0.0/24"
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground truncate">{slice.ipPool}</div>
                </div>
              </div>

              {/* Assigned IP & Tunnel info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40 text-xs font-mono">
                <span className="text-muted-foreground">Assigned UE Tunnel IP:</span>
                <span className="font-bold text-foreground bg-background px-2.5 py-1 rounded border border-border/50">
                  {slice.assignedIp || "10.45.0.2"}
                </span>
              </div>

              {/* Description & KPI */}
              <p className="text-xs text-muted-foreground leading-relaxed">{slice.description}</p>

              {/* Target KPI & Action */}
              <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {isSliceA ? (
                    <Zap className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-purple-500" />
                  )}
                  <span>KPI: {slice.targetKpi.latency}</span>
                </div>

                <Link
                  href="/traffic"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSliceA
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Ping via {slice.interface}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slicing Technical Architecture Explanation */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> Slice Identification & Isolation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-foreground text-sm">Control Plane Isolation</h4>
            <p leading-relaxed>
              The UE requests S-NSSAIs during initial registration. The AMF verifies subscriber records in MongoDB/UDR and returns only <strong>Allowed NSSAI</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-foreground text-sm">User Plane Isolation</h4>
            <p leading-relaxed>
              Each slice binds to a distinct tunnel interface (<code className="font-mono">uesimtun0</code> & <code className="font-mono">uesimtun1</code>) with non-overlapping subnets.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-foreground text-sm">QoS Profile Differentiation</h4>
            <p leading-relaxed>
              eMBB uses high-bandwidth AMBR targets for throughput, while URLLC uses prioritized 5QI scheduling for deterministic latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
