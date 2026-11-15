"use client";

import React, { useEffect, useState } from "react";
import {
  FlaskConical,
  Radio,
  Wifi,
  Play,
  Square,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { NegativeTestResult } from "@/lib/process-manager";

export default function TestLabPage() {
  // Process states
  const [gnbRunning, setGnbRunning] = useState(true);
  const [ueRunning, setUeRunning] = useState(true);
  const [loadingGnb, setLoadingGnb] = useState(false);
  const [loadingUe, setLoadingUe] = useState(false);

  // Negative test state
  const [testSst, setTestSst] = useState<number>(3);
  const [testSd, setTestSd] = useState<string>("000003");
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<NegativeTestResult | null>(null);

  const fetchProcesses = async () => {
    try {
      const [resGnb, resUe] = await Promise.all([fetch("/api/gnb"), fetch("/api/ue")]);
      const dataGnb = await resGnb.json();
      const dataUe = await resUe.json();
      if (dataGnb.success) setGnbRunning(dataGnb.gnb.running);
      if (dataUe.success) setUeRunning(dataUe.ue.running);
    } catch (e) {
      console.error("Failed to load process status", e);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleGnbAction = async (action: "start" | "stop") => {
    setLoadingGnb(true);
    try {
      const res = await fetch("/api/gnb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setGnbRunning(data.running);
      }
    } finally {
      setLoadingGnb(false);
    }
  };

  const handleUeAction = async (action: "start" | "stop") => {
    setLoadingUe(true);
    try {
      const res = await fetch("/api/ue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setUeRunning(data.running);
      }
    } finally {
      setLoadingUe(false);
    }
  };

  const executeNegativeTest = async () => {
    setRunningTest(true);
    try {
      const res = await fetch("/api/test-lab/negative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sst: Number(testSst),
          sd: testSd.padStart(6, "0").toUpperCase(),
          imsi: "999700000000001",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.result);
      }
    } finally {
      setRunningTest(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <FlaskConical className="w-3.5 h-3.5" /> 3GPP TS 24.501 Testing Workbench
          </div>
          <h1 className="text-3xl font-bold tracking-tight">5G Slicing Test Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control UERANSIM processes and verify 3GPP slice authorization & negative rejection behavior
          </p>
        </div>

        <button
          onClick={fetchProcesses}
          className="p-2 self-start rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh process states"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Top Process Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* gNodeB Process Card */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">UERANSIM nr-gnb</h3>
                <p className="text-xs text-muted-foreground font-mono">PLMN: 999/70 • TAC: 1</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                gnbRunning
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  gnbRunning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                }`}
              />
              {gnbRunning ? "Running" : "Stopped"}
            </span>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs font-mono space-y-1">
            <div className="text-muted-foreground"># SCTP/NGAP Interface:</div>
            <div className="text-foreground">127.0.0.1:38412 ➔ Open5GS AMF (127.0.0.5)</div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleGnbAction("start")}
              disabled={loadingGnb || gnbRunning}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start gNB
            </button>
            <button
              onClick={() => handleGnbAction("stop")}
              disabled={loadingGnb || !gnbRunning}
              className="flex-1 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop gNB
            </button>
          </div>
        </div>

        {/* UE Process Card */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">UERANSIM nr-ue</h3>
                <p className="text-xs text-muted-foreground font-mono">IMSI: 999700000000001</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                ueRunning
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  ueRunning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                }`}
              />
              {ueRunning ? "Registered" : "Deregistered"}
            </span>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs font-mono space-y-1">
            <div className="text-muted-foreground"># Active PDU Tunnels:</div>
            <div className="text-foreground">
              {ueRunning ? "uesimtun0 (10.45.0.2) + uesimtun1 (10.46.0.2)" : "None"}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleUeAction("start")}
              disabled={loadingUe || ueRunning}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start UE
            </button>
            <button
              onClick={() => handleUeAction("stop")}
              disabled={loadingUe || !ueRunning}
              className="flex-1 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop UE
            </button>
          </div>
        </div>
      </div>

      {/* Negative Slicing Authorization Test Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-destructive/30 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-destructive font-bold text-lg">
              <ShieldAlert className="w-5 h-5" /> 3GPP Negative Slicing Authorization Test
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Verify 3GPP TS 24.501 slice admission control: The simulated UE transmits a Registration Request demanding an <strong>unsubscribed S-NSSAI</strong>. The Open5GS AMF checks UDM subscription data and rejects the unauthorized slice.
            </p>
          </div>

          {/* Test Configuration Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border/50 text-xs font-mono">
              <span className="text-muted-foreground pl-2 font-sans">Target S-NSSAI:</span>
              <span className="bg-background px-2.5 py-1 rounded font-bold text-destructive">
                SST: {testSst} / SD: {testSd}
              </span>
            </div>

            <button
              onClick={executeNegativeTest}
              disabled={runningTest}
              className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {runningTest ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" /> Run Negative Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Verdict Card */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-destructive text-white px-2 py-0.5 rounded">
                      VERDICT: {testResult.verdict}
                    </span>
                    <h4 className="font-bold text-sm text-foreground">
                      3GPP 5GMM Cause #{testResult.nasCause.causeCode}: {testResult.nasCause.causeName}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {testResult.nasCause.details}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono bg-background/80 px-3 py-1.5 rounded-lg border border-border/40 text-muted-foreground shrink-0">
                Protocol: <strong>{testResult.nasCause.protocol}</strong>
              </div>
            </div>

            {/* Slices Separation Verdict Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Allowed NSSAI */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Allowed NSSAI (Accepted)
                  </span>
                  <span className="text-[10px] font-mono">2 Slices</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {testResult.allowedNssai.map((s, idx) => (
                    <div key={idx} className="bg-background/80 p-1.5 rounded border border-emerald-500/20 text-foreground">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejected NSSAI */}
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-destructive">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Rejected NSSAI (Denied)
                  </span>
                  <span className="text-[10px] font-mono">1 Slice</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {testResult.rejectedNssai.map((rej, idx) => (
                    <div key={idx} className="bg-background/80 p-1.5 rounded border border-destructive/20 space-y-1">
                      <div className="font-bold text-destructive">{rej.snssai}</div>
                      <div className="text-[10px] text-muted-foreground font-sans">
                        {rej.rejectionCause}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDU Session Status */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" /> PDU Sessions Outcome
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="bg-background/80 p-1.5 rounded border border-border/40 text-emerald-600 dark:text-emerald-400">
                    Slice A: {testResult.pduSessionStatus.sliceA}
                  </div>
                  <div className="bg-background/80 p-1.5 rounded border border-border/40 text-emerald-600 dark:text-emerald-400">
                    Slice B: {testResult.pduSessionStatus.sliceB}
                  </div>
                  <div className="bg-background/80 p-1.5 rounded border border-border/40 text-destructive">
                    Requested: {testResult.pduSessionStatus.requestedSlice}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Open5GS Signaling Traces */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-3 bg-muted/50 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                  <Terminal className="w-4 h-4 text-destructive" />
                  <span>Open5GS AMF / UERANSIM Negative Slicing NAS Signaling Traces</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Filter: Registration & NSSAI Reject
                </span>
              </div>
              <pre className="p-4 font-mono text-[11px] bg-slate-950 text-slate-200 overflow-x-auto max-h-56 leading-relaxed">
                {testResult.logTraces.map((line, idx) => {
                  let color = "text-slate-300";
                  if (line.includes("REJECTED") || line.includes("WARN")) color = "text-red-400 font-semibold";
                  if (line.includes("Allowed NSSAI")) color = "text-emerald-400";
                  if (line.includes("Requested NSSAI")) color = "text-blue-400";

                  return (
                    <div key={idx} className={color}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
