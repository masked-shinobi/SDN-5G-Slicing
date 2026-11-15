"use client";

import React, { useState } from "react";
import {
  Activity,
  Zap,
  Clock,
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { PingResult } from "@/lib/types";

interface ChartPoint {
  sequence: string;
  sliceA?: number;
  sliceB?: number;
}

export default function TrafficPage() {
  const [loadingSliceA, setLoadingSliceA] = useState(false);
  const [loadingSliceB, setLoadingSliceB] = useState(false);
  const [resultA, setResultA] = useState<PingResult | null>(null);
  const [resultB, setResultB] = useState<PingResult | null>(null);
  const [history, setHistory] = useState<ChartPoint[]>([
    { sequence: "Init", sliceA: 14.2, sliceB: 12.4 },
  ]);
  const [activeConsole, setActiveConsole] = useState<string>(
    "# Select a slice above to execute allow-listed ICMP ping: ping -I uesimtunX -c 4 8.8.8.8"
  );

  const runPing = async (slice: "A" | "B") => {
    if (slice === "A") setLoadingSliceA(true);
    if (slice === "B") setLoadingSliceB(true);

    try {
      const res = await fetch("/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slice, target: "8.8.8.8" }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        const ping: PingResult = data.result;

        if (slice === "A") {
          setResultA(ping);
          setActiveConsole(`[Slice A via uesimtun0]\n${ping.rawOutput}`);
        } else {
          setResultB(ping);
          setActiveConsole(`[Slice B via uesimtun1]\n${ping.rawOutput}`);
        }

        // Update history chart
        setHistory((prev) => {
          const nextSeq = `Run ${prev.length}`;
          const lastPoint = prev[prev.length - 1] || {};
          const newPoint: ChartPoint = {
            sequence: nextSeq,
            sliceA: slice === "A" ? ping.rttAvgMs : lastPoint.sliceA,
            sliceB: slice === "B" ? ping.rttAvgMs : lastPoint.sliceB,
          };
          return [...prev.slice(-9), newPoint];
        });
      }
    } catch (err: any) {
      setActiveConsole(`Error executing ping: ${err?.message || String(err)}`);
    } finally {
      if (slice === "A") setLoadingSliceA(false);
      if (slice === "B") setLoadingSliceB(false);
    }
  };

  const runBenchmarkBoth = async () => {
    await runPing("A");
    await runPing("B");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Activity className="w-3.5 h-3.5" /> Data Plane Isolation Verification
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Per-Slice Traffic & Latency</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send real ICMP packet traffic through individual virtual slice interfaces:{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">
              uesimtun0
            </code>{" "}
            (Slice A) and{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">
              uesimtun1
            </code>{" "}
            (Slice B)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runBenchmarkBoth}
            disabled={loadingSliceA || loadingSliceB}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" /> Benchmark Both Slices
          </button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slice A Trigger */}
        <div className="p-6 rounded-2xl bg-card border border-blue-500/40 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  Slice A • eMBB
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    uesimtun0
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">DNN: internet • Pool: 10.45.0.0/24</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Avg Latency</span>
              <span className="text-sm font-bold text-blue-500">
                {resultA ? `${resultA.rttAvgMs.toFixed(2)} ms` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Min / Max</span>
              <span className="text-xs font-bold text-foreground">
                {resultA ? `${resultA.rttMinMs}/${resultA.rttMaxMs}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Packet Loss</span>
              <span className="text-xs font-bold text-emerald-500">
                {resultA ? `${resultA.packetLossPercent}%` : "0%"}
              </span>
            </div>
          </div>

          <button
            onClick={() => runPing("A")}
            disabled={loadingSliceA}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loadingSliceA ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pinging via uesimtun0...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" /> Ping 8.8.8.8 via Slice A (uesimtun0)
              </>
            )}
          </button>
        </div>

        {/* Slice B Trigger */}
        <div className="p-6 rounded-2xl bg-card border border-purple-500/40 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center font-bold">
                B
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  Slice B • URLLC
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    uesimtun1
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">DNN: internet2 • Pool: 10.46.0.0/24</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Avg Latency</span>
              <span className="text-sm font-bold text-purple-500">
                {resultB ? `${resultB.rttAvgMs.toFixed(2)} ms` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Min / Max</span>
              <span className="text-xs font-bold text-foreground">
                {resultB ? `${resultB.rttMinMs}/${resultB.rttMaxMs}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Packet Loss</span>
              <span className="text-xs font-bold text-emerald-500">
                {resultB ? `${resultB.packetLossPercent}%` : "0%"}
              </span>
            </div>
          </div>

          <button
            onClick={() => runPing("B")}
            disabled={loadingSliceB}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loadingSliceB ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pinging via uesimtun1...
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" /> Ping 8.8.8.8 via Slice B (uesimtun1)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latency Comparison Chart */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Latency Comparison Chart (RTT ms)
            </h3>
            <p className="text-xs text-muted-foreground">
              Round-trip times comparing eMBB Slice A (blue) vs URLLC Slice B (purple)
            </p>
          </div>
          <span className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-muted-foreground">
            Target: 8.8.8.8
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="sequence" tick={{ fontSize: 11 }} />
              <YAxis unit=" ms" tick={{ fontSize: 11 }} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="sliceA"
                name="Slice A (eMBB / uesimtun0)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="sliceB"
                name="Slice B (URLLC / uesimtun1)"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Output Terminal Box */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm space-y-0">
        <div className="p-3.5 bg-muted/60 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold">
            <Terminal className="w-4 h-4 text-primary" />
            <span>Allow-listed ICMP Traffic Execution Console</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Command: ping -I &lt;interface&gt; -c 4 8.8.8.8
          </span>
        </div>
        <pre className="p-5 font-mono text-xs bg-slate-950 text-emerald-400 overflow-x-auto min-h-[140px] whitespace-pre-wrap leading-relaxed">
          {activeConsole}
        </pre>
      </div>

      {/* Technical Presentation Note */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground flex items-start gap-3">
        <div className="p-1 rounded-full bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
          <Activity className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <strong className="text-foreground font-semibold">Demo Presentation Note:</strong>
          <p leading-relaxed>
            Both slices run on the same local Linux network stack, so ping latencies are naturally close. This test proves <strong>strict traffic routing isolation</strong>: ICMP packets destined for the same target traverse distinct virtual interfaces (`uesimtun0` vs `uesimtun1`) and dedicated UPF session subnets (`10.45.0.0/24` vs `10.46.0.0/24`). Real QoS differentiation is governed by 5QI and AMBR bandwidth shaping.
          </p>
        </div>
      </div>
    </div>
  );
}
