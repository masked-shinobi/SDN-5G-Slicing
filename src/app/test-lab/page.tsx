import React from "react";
import { FlaskConical, ShieldAlert, Play, Square, AlertTriangle } from "lucide-react";

export default function TestLabPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">5G Slicing Test Lab</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive gNB/UE process controls and 3GPP Negative Slicing Rejection verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">UERANSIM Process Control</h3>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
              Allow-listed Scripts Only
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Execute safe start/stop triggers via backend helper scripts located at <code className="bg-muted px-1.5 py-0.5 rounded font-mono">~/5g-demo/scripts/</code>.
          </p>
          <div className="flex gap-3">
            <button disabled className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed">
              Start gNB
            </button>
            <button disabled className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed">
              Start UE
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-destructive/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-destructive flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Negative Slicing Test
            </h3>
            <span className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded">
              Phase 5
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Attempt to register an unprovisioned slice (e.g. <code className="font-mono bg-muted px-1 rounded">SST=3 SD=000003</code>) and demonstrate 3GPP AMF rejection code: <span className="text-foreground font-semibold">Slice Not Supported</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
