import React from "react";
import { Users, Database, ShieldAlert, Plus } from "lucide-react";

export default function SubscribersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriber Provisioning</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Open5GS MongoDB Subscriber management (collection: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">open5gs.subscribers</code>)
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Subscriber IMSI: 999700000000001</h3>
              <p className="text-xs text-muted-foreground font-mono">PLMN: 999 / 70 • Security: XOR / Milenage</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Provisioned in MongoDB
          </span>
        </div>

        <div className="border border-border/50 rounded-xl overflow-hidden text-xs">
          <div className="bg-muted/60 p-3 font-semibold grid grid-cols-4">
            <span>Slice Name</span>
            <span>S-NSSAI (SST / SD)</span>
            <span>Data Network (DNN)</span>
            <span>Allocated Subnet</span>
          </div>
          <div className="divide-y divide-border/40 font-mono">
            <div className="p-3 grid grid-cols-4 items-center">
              <span className="font-sans font-medium text-blue-500">Slice A (eMBB)</span>
              <span>SST: 1 / SD: 000001</span>
              <span>internet</span>
              <span>10.45.0.0/24</span>
            </div>
            <div className="p-3 grid grid-cols-4 items-center">
              <span className="font-sans font-medium text-purple-500">Slice B (URLLC)</span>
              <span>SST: 2 / SD: 000002</span>
              <span>internet2</span>
              <span>10.46.0.0/24</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Phase 3 Feature Preview:</p>
          Live CRUD operations directly connected to Open5GS MongoDB instance with Zod schema validation will be active in Phase 3.
        </div>
      </div>
    </div>
  );
}
