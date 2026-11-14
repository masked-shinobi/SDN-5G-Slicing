import React from "react";
import { GitCommitHorizontal, Radio, Server, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignalingFlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Animated Signaling Flow</h1>
        <p className="text-sm text-muted-foreground mt-1">
          End-to-end 3GPP 5G Standalone Registration and S-NSSAI Selection sequence
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h3 className="font-bold text-lg">3GPP TS 23.502 Registration & PDU Establishment</h3>
            <p className="text-xs text-muted-foreground">Interactive step-by-step state machine preview</p>
          </div>
          <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-semibold">
            Standby for Phase 7
          </span>
        </div>

        {/* Conceptual visual steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Step 1</span>
            <h4 className="font-bold text-sm">UE NAS Registration</h4>
            <p className="text-xs text-muted-foreground">UE transmits Requested NSSAI (SST 1, SST 2) via RRC</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step 2</span>
            <h4 className="font-bold text-sm">gNB NGAP Forward</h4>
            <p className="text-xs text-muted-foreground">NGAP Initial UE Message routed to Open5GS AMF</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step 3</span>
            <h4 className="font-bold text-sm">AMF Subscription Check</h4>
            <p className="text-xs text-muted-foreground">Queries UDM/UDR for subscribed S-NSSAIs</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step 4</span>
            <h4 className="font-bold text-sm">Allowed NSSAI Granted</h4>
            <p className="text-xs text-muted-foreground">AMF returns Allowed NSSAI in Registration Accept</p>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Step 5</span>
            <h4 className="font-bold text-sm">PDU Sessions Created</h4>
            <p className="text-xs text-muted-foreground">Dual user plane tunnels: uesimtun0 & uesimtun1</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground">
          In Phase 7, this page features an interactive Framer Motion animation with event log synchronization, live message inspection, and simulated Wireshark-level packet details.
        </div>
      </div>
    </div>
  );
}
