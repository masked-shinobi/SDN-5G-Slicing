"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollText,
  Filter,
  Terminal,
  RefreshCw,
  Search,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { ParsedLogEntry } from "@/lib/log-reader";

const QUICK_FILTERS = [
  { label: "All Logs", value: "" },
  { label: "NSSAI / S-NSSAI", value: "NSSAI" },
  { label: "Registration", value: "Registration" },
  { label: "PDU Session", value: "PDU" },
  { label: "Slice A (eMBB)", value: "Slice-A" },
  { label: "Slice B (URLLC)", value: "Slice-B" },
  { label: "Rejections / Warnings", value: "WARN" },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<ParsedLogEntry[]>([]);
  const [service, setService] = useState<"all" | "amf" | "smf">("all");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const queryFilter = searchQuery.trim() || activeFilter;
      const params = new URLSearchParams({
        service,
        filter: queryFilter,
        limit: "150",
      });
      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  }, [service, activeFilter, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 2500);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.service.toUpperCase()}] ${l.level}: ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <ScrollText className="w-3.5 h-3.5" /> Open5GS Core Log Stream
          </div>
          <h1 className="text-3xl font-bold tracking-tight">5G Core Live Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring of <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/var/log/open5gs/amf.log</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">smf.log</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
              autoRefresh
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {autoRefresh ? "Live Tail On" : "Live Tail Paused"}
          </button>

          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={copyLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Filter and Switcher Controls */}
      <div className="space-y-3">
        {/* Service Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <button
            onClick={() => setService("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              service === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            All 5G Core Logs
          </button>
          <button
            onClick={() => setService("amf")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              service === "amf"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            AMF (Signaling & S-NSSAI)
          </button>
          <button
            onClick={() => setService("smf")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              service === "smf"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            SMF (PDU Sessions & IP Pools)
          </button>
        </div>

        {/* Quick Filter Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FILTERS.map((f) => {
              const isSelected = activeFilter === f.value;
              return (
                <button
                  key={f.label}
                  onClick={() => {
                    setActiveFilter(f.value);
                    setSearchQuery("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveFilter("");
              }}
              placeholder="Search log messages..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Terminal Console */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-3.5 bg-muted/60 border-b border-border/50 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 font-semibold">
            <Terminal className="w-4 h-4 text-primary" />
            <span>Open5GS Core Event Console ({logs.length} entries)</span>
          </div>
          <span className="text-muted-foreground text-[11px]">
            Highlighting: <strong className="text-primary">NSSAI</strong> • <strong className="text-emerald-400">Allowed</strong> • <strong className="text-red-400">Rejected</strong>
          </span>
        </div>

        <div className="divide-y divide-border/20 max-h-[600px] overflow-y-auto font-mono text-xs bg-slate-950 p-2 text-slate-300">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-sans text-xs">
              No matching log lines found. Try clearing your filter or selecting &quot;All Logs&quot;.
            </div>
          ) : (
            logs.map((log) => {
              const isHighlight = log.isNssaiRelated;
              const isWarn = log.level === "WARN" || log.message.includes("REJECTED");

              return (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-3 transition-colors ${
                    isWarn
                      ? "bg-red-950/40 border border-red-500/30 text-red-200"
                      : isHighlight
                      ? "bg-blue-950/30 border border-blue-500/30 text-blue-100"
                      : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-[10px] text-slate-500 shrink-0 pt-0.5">
                      {log.timestamp.split("T")[1]?.replace("Z", "")}
                    </span>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        log.service === "amf"
                          ? "bg-purple-900/60 text-purple-300 border border-purple-700/50"
                          : "bg-blue-900/60 text-blue-300 border border-blue-700/50"
                      }`}
                    >
                      {log.service.toUpperCase()}
                    </span>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        log.level === "WARN"
                          ? "bg-amber-900/60 text-amber-300"
                          : log.level === "ERROR"
                          ? "bg-red-900/60 text-red-300"
                          : "bg-emerald-900/60 text-emerald-300"
                      }`}
                    >
                      {log.level}
                    </span>

                    <div className="leading-relaxed break-all font-mono">
                      {log.message}
                    </div>
                  </div>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1 shrink-0 self-start md:self-auto font-sans">
                    {log.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          tag === "NSSAI" || tag === "S-NSSAI"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : tag === "Rejected"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
