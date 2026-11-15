"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Layers,
  Zap,
  Clock,
  Cpu,
  Car,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ArrowRight,
  Database,
  Smartphone,
  Send,
  CheckCheck,
  Info,
  Sliders,
} from "lucide-react";
import {
  STANDARD_SLICES,
  NSSAI_CATEGORIES,
  decodeSnssai,
} from "@/lib/learn-data";

export default function LearnPage() {
  const [calcSst, setCalcSst] = useState<number>(1);
  const [calcSd, setCalcSd] = useState<string>("000001");

  const decoded = decodeSnssai(calcSst, calcSd);

  return (
    <div className="space-y-10 max-w-5xl pb-16">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
          <BookOpen className="w-3.5 h-3.5" /> 3GPP Technical Specifications Explainer (TS 23.501 / TS 23.502)
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Understanding 5G Network Slicing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A beginner-readable, comprehensive guide to SST, SD, S-NSSAI, NSSAI categories, and ITU-R IMT-2020 slice behavior.
        </p>
      </div>

      {/* Conceptual Analogy: The Multi-Lane Highway */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/40 border border-border shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> The Core Concept: Dedicated Virtual Lanes
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Think of physical 5G radio and fiber infrastructure as a multi-lane highway. Rather than forcing all traffic—whether an ambulance needing guaranteed clear roads, a high-speed sports car streaming 8K video, or a slow delivery truck sending sensor telemetry—into the exact same congested lane, 
          <strong> 5G Network Slicing creates logically isolated virtual networks (slices)</strong> on top of the same physical hardware.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
            <span className="font-bold text-blue-500">Virtual Isolation</span>
            <p className="text-muted-foreground mt-1">
              Traffic from one slice cannot congest or inspect traffic from another slice.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs">
            <span className="font-bold text-purple-500">Custom Performance</span>
            <p className="text-muted-foreground mt-1">
              Each slice is configured with specific QoS, latency bounds, and bandwidth AMBR.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
            <span className="font-bold text-emerald-500">Tailored Core Functions</span>
            <p className="text-muted-foreground mt-1">
              Different slices can bind to different UPFs, routing data directly to local edge clouds.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive S-NSSAI Wire Calculator */}
      <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" /> Interactive S-NSSAI Wire Decoder & Inspector
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Experiment with SST and SD values to see how 3GPP encodes and classifies slices on the wire.
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-muted border border-border">
            3GPP TS 23.501 § 5.15
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Select SST (Slice/Service Type):
            </label>
            <select
              value={calcSst}
              onChange={(e) => setCalcSst(Number(e.target.value))}
              className="w-full text-xs rounded-lg border border-input bg-background px-3 py-2 focus:ring-1 focus:ring-primary"
            >
              <option value={1}>SST 1 — eMBB (Enhanced Mobile Broadband)</option>
              <option value={2}>SST 2 — URLLC (Ultra-Reliable Low-Latency)</option>
              <option value={3}>SST 3 — MIoT (Massive IoT / mMTC)</option>
              <option value={4}>SST 4 — V2X (Vehicle-to-Everything)</option>
              <option value={5}>SST 5 — HMTC (High-perf Machine Comm)</option>
              <option value={130}>SST 130 — Private Enterprise Slice (Custom)</option>
              <option value={200}>SST 200 — Operator Dedicated Slice (Custom)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Enter SD (Slice Differentiator - Hex):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={calcSd}
                onChange={(e) => setCalcSd(e.target.value)}
                placeholder="000001"
                className="w-full text-xs font-mono uppercase rounded-lg border border-input bg-background px-3 py-2 focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  setCalcSst(1);
                  setCalcSd("000001");
                }}
                className="text-[11px] px-2 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground whitespace-nowrap"
                title="Reset to Slice A"
              >
                Slice A
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcSst(2);
                  setCalcSd("000002");
                }}
                className="text-[11px] px-2 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground whitespace-nowrap"
                title="Reset to Slice B"
              >
                Slice B
              </button>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-foreground">
              Category Classification:
            </label>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50 text-xs font-medium truncate">
              {decoded.sliceCategory}
            </div>
          </div>
        </div>

        {/* Decoder Output Visualizer */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" /> 3GPP Information Element (IE) Wire Layout (4 Octets / 32 Bits):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="text-[10px] text-muted-foreground uppercase font-sans font-semibold">Octet 1 (8 bits)</div>
              <div className="text-base font-bold text-primary mt-1">SST = {decoded.sst}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">0x{decoded.sst.toString(16).padStart(2, "0").toUpperCase()}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border sm:col-span-3">
              <div className="text-[10px] text-muted-foreground uppercase font-sans font-semibold">Octets 2, 3, 4: SD (24 bits)</div>
              <div className="text-base font-bold text-foreground mt-1">SD = {decoded.sdHex} (Dec: {decoded.sdDec})</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Wire Bytes: {decoded.wireOctets}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs pt-1 gap-2 text-muted-foreground">
            <div>
              <strong>Full S-NSSAI: </strong>
              <code className="bg-card px-1.5 py-0.5 rounded font-mono border border-border/40 text-foreground">
                {decoded.snssaiString}
              </code>
            </div>
            <div>
              <strong>Status: </strong>
              <span className={decoded.isStandardSst ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                {decoded.isStandardSst ? "Standardized 3GPP Slice" : "Operator-Specific Custom Slice"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The Standard 3GPP Slice Types (SST 1 to 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Standardized 3GPP Slice/Service Types (SST)</h2>
          <span className="text-xs text-muted-foreground">Defined in 3GPP TS 23.501 Table 5.15.2.2-1</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STANDARD_SLICES.map((slice) => {
            const Icon =
              slice.sst === 1
                ? Zap
                : slice.sst === 2
                ? Clock
                : slice.sst === 3
                ? Cpu
                : slice.sst === 4
                ? Car
                : Radio;

            return (
              <div
                key={slice.sst}
                className={`p-5 rounded-2xl bg-card border ${slice.borderClass} shadow-sm space-y-3 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${slice.badgeClass}`}>
                    SST = {slice.sst}
                  </span>
                  <Icon className="w-4 h-4" style={{ color: slice.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{slice.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{slice.fullName}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed min-h-[3rem]">
                  {slice.focus}
                </p>

                {/* KPI Targets */}
                <div className="text-xs font-mono bg-muted/40 p-2.5 rounded-lg space-y-1">
                  <div>
                    <strong className="font-sans text-[11px] text-muted-foreground">Throughput: </strong>
                    <span className="text-foreground">{slice.targetKpi.throughput}</span>
                  </div>
                  <div>
                    <strong className="font-sans text-[11px] text-muted-foreground">Latency: </strong>
                    <span className="text-foreground">{slice.targetKpi.latency}</span>
                  </div>
                  <div>
                    <strong className="font-sans text-[11px] text-muted-foreground">Reliability: </strong>
                    <span className="text-foreground">{slice.targetKpi.reliability}</span>
                  </div>
                  {slice.targetKpi.density && (
                    <div>
                      <strong className="font-sans text-[11px] text-muted-foreground">Density: </strong>
                      <span className="text-foreground">{slice.targetKpi.density}</span>
                    </div>
                  )}
                </div>

                {/* Example Uses */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground">Example Use Cases:</div>
                  <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
                    {slice.exampleUses.slice(0, 3).map((use, i) => (
                      <li key={i}>{use}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anatomy of a Slice: SST vs SD vs S-NSSAI vs NSSAI */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
        <h3 className="text-lg font-bold">Anatomy of 5G Slicing Identifiers</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The 3GPP slicing hierarchy ranges from individual byte fields up to the complete list of authorized slices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> SST (Slice/Service Type)
            </h4>
            <p className="text-muted-foreground">
              An 8-bit integer (0–255) defining the standardized expected network behavior (e.g., 1 = eMBB, 2 = URLLC, 3 = MIoT, 4 = V2X). Values 0–127 are globally standardized by 3GPP; values 128–255 are operator-specific.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> SD (Slice Differentiator)
            </h4>
            <p className="text-muted-foreground">
              A 24-bit optional hex identifier (3 octets, e.g. <code className="font-mono bg-muted px-1 rounded">000001</code>). It allows operators to run multiple distinct slices of the same type—for example, separate eMBB slices for enterprise customer A vs customer B.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> S-NSSAI (Single NSSAI)
            </h4>
            <p className="text-muted-foreground">
              The fundamental slice identifier combining SST + optional SD (e.g., <code className="font-mono bg-muted px-1 rounded">SST: 1, SD: 000001</code>). Stored on the SIM and referenced by gNB, AMF, SMF, and UPF.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> NSSAI (The Slice List)
            </h4>
            <p className="text-muted-foreground">
              A collection of up to 8 S-NSSAIs transmitted simultaneously during signaling. There are four distinct lifecycle types: Subscribed, Configured, Requested, and Allowed.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 NSSAI Categories Table */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">The 4 NSSAI Categories Explained</h3>
          <span className="text-xs text-muted-foreground">3GPP TS 23.501 § 5.15.2</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NSSAI_CATEGORIES.map((cat) => {
            const Icon =
              cat.category === "Subscribed"
                ? Database
                : cat.category === "Configured"
                ? Smartphone
                : cat.category === "Requested"
                ? Send
                : CheckCheck;

            return (
              <div key={cat.category} className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{cat.category} NSSAI</h4>
                    <span className="text-[10px] text-muted-foreground">Max {cat.maxCount} slices</span>
                  </div>
                </div>
                <div className="pt-1">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground">Where it lives:</div>
                  <div className="font-medium text-foreground">{cat.whereStored}</div>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-1">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* What Our Demo Proves vs What It Does Not (Section 1b) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-emerald-500/30 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-emerald-500 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> What This Demo Proves
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our Open5GS + UERANSIM deployment rigorously validates the complete end-to-end control-plane and data-plane slicing specifications:
          </p>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              <strong>Slice Identification:</strong> The UE requests distinct S-NSSAIs (<code className="font-mono">SST 1/SD 000001</code> and <code className="font-mono">SST 2/SD 000002</code>) which are verified by AMF against UDM.
            </li>
            <li>
              <strong>Data Plane Isolation:</strong> Slice A is bound to IP pool <code className="font-mono">10.45.0.0/24</code> on <code className="font-mono">uesimtun0</code>, while Slice B is bound to IP pool <code className="font-mono">10.46.0.0/24</code> on <code className="font-mono">uesimtun1</code>.
            </li>
            <li>
              <strong>Access Authorization Enforcement:</strong> When a device requests an unsubscribed slice (e.g. SST 3, SD 000003), the AMF rejects the request with <strong>3GPP 5GMM Cause #62 (Slice Not Supported)</strong>.
            </li>
            <li>
              <strong>Independent Routing:</strong> Packets sent via <code className="font-mono">ping -I uesimtun0</code> travel strictly through Slice A&apos;s UPF session, separate from Slice B.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-amber-500/30 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Important Technical Note: What It Does Not Prove
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Be precise during project presentations: <strong>SST is solely an identity, not a guarantee of speed</strong>.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed space-y-2">
            <div>
              <strong>Do not claim:</strong> &ldquo;Slice B is faster or has lower ping than Slice A.&rdquo;
            </div>
            <div>
              <strong>Why?</strong> In this software demo, both virtual interfaces (<code className="font-mono">uesimtun0</code> and <code className="font-mono">uesimtun1</code>) run on the same CPU, kernel, and network loopback. Baseline ping round-trip times are virtually identical (~0.2–0.5 ms).
            </div>
            <div>
              <strong>Real-world QoS:</strong> In production 5G networks, low latency and bandwidth guarantees are enforced by <strong>5QI QoS flows, AMBR bandwidth policing, and edge UPF placement</strong> closer to the radio cell.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
