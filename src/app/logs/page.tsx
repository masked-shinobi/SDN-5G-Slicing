import React from "react";
import { ScrollText, Filter, Terminal } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">5G Core Live Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time Open5GS AMF and SMF log viewer with 3GPP S-NSSAI syntax highlighting
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono font-semibold">/var/log/open5gs/amf.log</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-muted px-2.5 py-1 rounded-lg font-mono">Filter: NSSAI / S-NSSAI</span>
          </div>
        </div>

        <div className="p-6 font-mono text-xs text-muted-foreground space-y-2 bg-slate-950 text-slate-200">
          <div>[amf] INFO: Open5GS AMF daemon initialized (v2.7.2)</div>
          <div>[amf] INFO: gNB connected: nr-gnb (PLMN: 999/70, TAC: 1)</div>
          <div className="text-emerald-400">[amf] INFO: [imsi-999700000000001] Registration Request received: Requested NSSAI [SST:1, SD:000001], [SST:2, SD:000002]</div>
          <div className="text-blue-400">[amf] INFO: [imsi-999700000000001] Allowed NSSAI accepted: [SST:1, SD:000001], [SST:2, SD:000002]</div>
          <div className="text-purple-400">[smf] INFO: [imsi-999700000000001] PDU Session Established: DNN [internet], IP [10.45.0.2] via uesimtun0</div>
          <div className="text-purple-400">[smf] INFO: [imsi-999700000000001] PDU Session Established: DNN [internet2], IP [10.46.0.2] via uesimtun1</div>
        </div>
      </div>
    </div>
  );
}
