"use client";

import React, { useState } from "react";
import {
  FileCode,
  Globe,
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Layers,
  Activity,
  Radio,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  category: "core" | "slices" | "traffic" | "ran" | "logs";
  method: "GET" | "POST" | "DELETE";
  path: string;
  summary: string;
  description: string;
  defaultBody?: string;
  curlExample: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "status",
    category: "core",
    method: "GET",
    path: "/api/status",
    summary: "5G Core & RAN Service Health",
    description: "Returns systemctl state of Open5GS AMF, SMF, UPF, UDM, and UERANSIM process status.",
    curlExample: "curl -s http://localhost:3000/api/status",
  },
  {
    id: "slices",
    category: "slices",
    method: "GET",
    path: "/api/slices",
    summary: "List Active 5G Slices & Kernel IPs",
    description: "Returns provisioned slices (SST 1/SD 000001, SST 2/SD 000002) merged with Linux kernel TUN interfaces (uesimtun0, uesimtun1).",
    curlExample: "curl -s http://localhost:3000/api/slices",
  },
  {
    id: "subscribers-get",
    category: "slices",
    method: "GET",
    path: "/api/subscribers?imsi=999700000000001",
    summary: "Get Subscribed S-NSSAIs from MongoDB",
    description: "Reads subscriber provisioning document from MongoDB collection open5gs.subscribers.",
    curlExample: "curl -s \"http://localhost:3000/api/subscribers?imsi=999700000000001\"",
  },
  {
    id: "ping-slice-a",
    category: "traffic",
    method: "POST",
    path: "/api/ping",
    summary: "Execute Per-Slice ICMP Ping",
    description: "Executes allow-listed ICMP ping via slice-bound TUN interface (uesimtun0 for Slice A, uesimtun1 for Slice B).",
    defaultBody: JSON.stringify({ slice: "A", count: 4, target: "8.8.8.8" }, null, 2),
    curlExample: 'curl -X POST http://localhost:3000/api/ping -H "Content-Type: application/json" -d \'{"slice":"A","count":4}\'',
  },
  {
    id: "throughput-benchmark",
    category: "traffic",
    method: "POST",
    path: "/api/traffic/throughput",
    summary: "Execute 5QI QoS & Throughput Benchmark",
    description: "Evaluates per-slice throughput (Mbps), AMBR rate shaping, and jitter under 5QI 9 (eMBB) and 5QI 82 (URLLC).",
    defaultBody: JSON.stringify({ slice: "A", durationSeconds: 6 }, null, 2),
    curlExample: 'curl -X POST http://localhost:3000/api/traffic/throughput -H "Content-Type: application/json" -d \'{"slice":"A","durationSeconds":6}\'',
  },
  {
    id: "test-lab-negative",
    category: "core",
    method: "POST",
    path: "/api/test-lab/negative",
    summary: "Negative Slicing Rejection Test",
    description: "Requests an unprovisioned slice (SST 3, SD 000003) to trigger and verify 3GPP 5GMM Cause #62 (Slice Not Supported).",
    defaultBody: JSON.stringify({ requestedSst: 3, requestedSd: "000003" }, null, 2),
    curlExample: 'curl -X POST http://localhost:3000/api/test-lab/negative -H "Content-Type: application/json" -d \'{"requestedSst":3}\'',
  },
  {
    id: "gnb-status",
    category: "ran",
    method: "POST",
    path: "/api/gnb",
    summary: "Control nr-gnb (Simulated gNodeB)",
    description: "Starts, stops, or checks status of the UERANSIM gNB process using allow-listed scripts.",
    defaultBody: JSON.stringify({ action: "status" }, null, 2),
    curlExample: 'curl -X POST http://localhost:3000/api/gnb -H "Content-Type: application/json" -d \'{"action":"status"}\'',
  },
  {
    id: "ue-status",
    category: "ran",
    method: "POST",
    path: "/api/ue",
    summary: "Control nr-ue (Simulated UE)",
    description: "Starts, stops, or checks status of the UERANSIM UE process using allow-listed scripts.",
    defaultBody: JSON.stringify({ action: "status" }, null, 2),
    curlExample: 'curl -X POST http://localhost:3000/api/ue -H "Content-Type: application/json" -d \'{"action":"status"}\'',
  },
  {
    id: "logs",
    category: "logs",
    method: "GET",
    path: "/api/logs?service=all&filter=NSSAI&limit=20",
    summary: "Live Core Function Log Stream",
    description: "Queries Open5GS AMF/SMF logs with keyword filtering (NSSAI, Registration, PDU).",
    curlExample: "curl -s \"http://localhost:3000/api/logs?service=all&filter=NSSAI\"",
  },
];

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRequests, setActiveRequests] = useState<{ [key: string]: boolean }>({});
  const [responses, setResponses] = useState<{
    [key: string]: { status: number; duration: number; data: unknown };
  }>({});
  const [customBodies, setCustomBodies] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEndpoints = ENDPOINTS.filter(
    (ep) => selectedCategory === "all" || ep.category === selectedCategory
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecute = async (endpoint: ApiEndpoint) => {
    setActiveRequests((prev) => ({ ...prev, [endpoint.id]: true }));
    const startTime = performance.now();

    try {
      let res: Response;
      const bodyText = customBodies[endpoint.id] || endpoint.defaultBody;

      if (endpoint.method === "GET") {
        res = await fetch(endpoint.path);
      } else {
        res = await fetch(endpoint.path, {
          method: endpoint.method,
          headers: { "Content-Type": "application/json" },
          body: bodyText,
        });
      }

      const duration = Math.round(performance.now() - startTime);
      const json = await res.json();
      setResponses((prev) => ({
        ...prev,
        [endpoint.id]: { status: res.status, duration, data: json },
      }));
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      setResponses((prev) => ({
        ...prev,
        [endpoint.id]: {
          status: 500,
          duration,
          data: { error: err instanceof Error ? err.message : String(err) },
        },
      }));
    } finally {
      setActiveRequests((prev) => ({ ...prev, [endpoint.id]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <FileCode className="w-3.5 h-3.5" /> OpenAPI 3.0.3 Bridge Specification
          </div>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation & Explorer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore and execute the secure Next.js bridge endpoints interfacing with Open5GS Core and UERANSIM.
          </p>
        </div>

        <a
          href="/api/openapi"
          target="_blank"
          download="openapi.yaml"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
        >
          <Download className="w-4 h-4" /> Download openapi.yaml
        </a>
      </div>

      {/* Security Architecture Callout */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-foreground">Strict Command Allow-Listing & Sandbox Isolation</div>
          <p className="text-muted-foreground leading-relaxed">
            The browser never communicates directly with the underlying Linux kernel or Open5GS services. All requests pass through these Next.js Route Handlers which enforce static allow-lists, Zod payload validation, and non-root execution.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Endpoints" },
          { id: "core", label: "Core Health & Test Lab" },
          { id: "slices", label: "Slicing & Subscribers" },
          { id: "traffic", label: "Per-Slice Ping" },
          { id: "ran", label: "RAN Controls (gNB / UE)" },
          { id: "logs", label: "Core Logs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted border border-border/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {filteredEndpoints.map((ep) => {
          const isPending = activeRequests[ep.id];
          const response = responses[ep.id];

          return (
            <div
              key={ep.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 transition-all"
            >
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg font-mono border ${
                      ep.method === "GET"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : ep.method === "POST"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm font-bold text-foreground font-mono">{ep.path}</code>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(ep.id, ep.curlExample)}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted text-xs inline-flex items-center gap-1"
                    title="Copy cURL command"
                  >
                    {copiedId === ep.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px] hidden sm:inline">cURL</span>
                  </button>

                  <button
                    onClick={() => handleExecute(ep)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm disabled:opacity-50 transition-all"
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Try It Out
                  </button>
                </div>
              </div>

              {/* Summary & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">{ep.summary}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ep.description}</p>
              </div>

              {/* Request Body Editor (for POST) */}
              {ep.defaultBody && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Request Payload (JSON):
                  </div>
                  <textarea
                    rows={ep.defaultBody.split("\n").length || 3}
                    defaultValue={ep.defaultBody}
                    onChange={(e) =>
                      setCustomBodies((prev) => ({ ...prev, [ep.id]: e.target.value }))
                    }
                    className="w-full text-xs font-mono p-3 rounded-xl border border-input bg-muted/30 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              )}

              {/* Response Viewer */}
              {response && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Response Status:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                          response.status >= 200 && response.status < 300
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        {response.status} {response.status === 200 ? "OK" : "ERROR"}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {response.duration} ms
                      </span>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-muted/60 border border-border/60 text-xs font-mono overflow-x-auto max-h-64 text-foreground">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
