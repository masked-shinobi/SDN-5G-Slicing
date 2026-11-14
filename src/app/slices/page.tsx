import React from "react";
import { DEFAULT_SLICES } from "@/lib/slicing-utils";
import { Layers, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SlicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Network Slices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualizing configured Single Network Slice Selection Assistance Information (S-NSSAI)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl font-semibold">
            PLMN: 999/70 (Open5GS Standalone)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_SLICES.map((slice) => (
          <div
            key={slice.id}
            className={`p-6 rounded-2xl bg-card border shadow-sm space-y-4 ${
              slice.id === "A" ? "border-blue-500/40" : "border-purple-500/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    slice.id === "A"
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                  }`}
                >
                  Slice {slice.id} • {slice.type}
                </span>
                <h3 className="text-xl font-bold mt-2 text-foreground">{slice.name}</h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono bg-muted rounded-lg font-bold">
                {slice.interface}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-muted/30 p-3 rounded-xl border border-border/40">
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">SST (Slice/Service Type)</span>
                <span className="font-bold text-foreground text-sm">{slice.sst}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">SD (Slice Differentiator)</span>
                <span className="font-bold text-foreground text-sm">{slice.sd}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">DNN (Data Network Name)</span>
                <span className="font-bold text-foreground text-sm">{slice.dnn}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">Subnet / IP Pool</span>
                <span className="font-bold text-foreground text-sm">{slice.ipPool}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{slice.description}</p>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Target KPI: {slice.targetKpi.latency}</span>
              <Link
                href="/traffic"
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Traffic Test <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
