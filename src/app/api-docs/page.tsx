import React from "react";
import { FileCode, Globe, Shield, Terminal } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bridge API routes connecting the Next.js frontend to Open5GS Core and UERANSIM
        </p>
      </div>

      <div className="space-y-4">
        {/* Route 1 */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                GET
              </span>
              <code className="text-sm font-bold text-foreground">/api/status</code>
            </div>
            <span className="text-xs text-muted-foreground">Phase 2</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Returns systemd service status (<code className="font-mono">systemctl is-active</code>) for AMF, SMF, UPF, and UERANSIM processes.
          </p>
        </div>

        {/* Route 2 */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                GET
              </span>
              <code className="text-sm font-bold text-foreground">/api/slices</code>
            </div>
            <span className="text-xs text-muted-foreground">Phase 2</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Returns active slices (SST, SD, DNN, IP pool, and live IP address from <code className="font-mono">ip -4 addr show</code>).
          </p>
        </div>

        {/* Route 3 */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
                POST
              </span>
              <code className="text-sm font-bold text-foreground">/api/ping</code>
            </div>
            <span className="text-xs text-muted-foreground">Phase 4</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Executes allow-listed ICMP ping through specific slice interface: <code className="font-mono">{`{ slice: "A" | "B" }`}</code>.
          </p>
        </div>

        {/* Route 4 */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 font-mono">
                POST / GET
              </span>
              <code className="text-sm font-bold text-foreground">/api/subscribers</code>
            </div>
            <span className="text-xs text-muted-foreground">Phase 3</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Inspects and updates MongoDB <code className="font-mono">open5gs.subscribers</code> collection with strict Zod validation.
          </p>
        </div>
      </div>
    </div>
  );
}

