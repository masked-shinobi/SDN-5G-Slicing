import React from "react";
import { Activity, Zap, Clock, ArrowRight } from "lucide-react";

export default function TrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Per-Slice Traffic & Latency</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Measure isolation and round-trip latency across virtual interfaces <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">uesimtun0</code> (Slice A) and <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">uesimtun1</code> (Slice B)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slice A Ping Card */}
        <div className="p-6 rounded-2xl bg-card border border-blue-500/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Slice A • eMBB</span>
              <h3 className="text-lg font-bold">Interface: uesimtun0</h3>
            </div>
            <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-md">
              Pool: 10.45.0.0/24
            </span>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs font-mono space-y-1">
            <div className="text-muted-foreground"># Allow-listed test command:</div>
            <div className="text-foreground font-semibold">ping -I uesimtun0 -c 4 8.8.8.8</div>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm opacity-80 cursor-not-allowed"
          >
            Phase 4 Live Execution Ready
          </button>
        </div>

        {/* Slice B Ping Card */}
        <div className="p-6 rounded-2xl bg-card border border-purple-500/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Slice B • URLLC</span>
              <h3 className="text-lg font-bold">Interface: uesimtun1</h3>
            </div>
            <span className="text-xs font-mono bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-md">
              Pool: 10.46.0.0/24
            </span>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs font-mono space-y-1">
            <div className="text-muted-foreground"># Allow-listed test command:</div>
            <div className="text-foreground font-semibold">ping -I uesimtun1 -c 4 8.8.8.8</div>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm opacity-80 cursor-not-allowed"
          >
            Phase 4 Live Execution Ready
          </button>
        </div>
      </div>
    </div>
  );
}
