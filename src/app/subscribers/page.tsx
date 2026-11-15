"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Database,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Open5gsSubscriber, SliceItem } from "@/lib/subscriber-schema";
import { formatSnssai, getSliceTypeBySst } from "@/lib/slicing-utils";

export default function SubscribersPage() {
  const [subscriber, setSubscriber] = useState<Open5gsSubscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formSst, setFormSst] = useState<number>(3);
  const [formSd, setFormSd] = useState<string>("000003");
  const [formDnn, setFormDnn] = useState<string>("iot");
  const [formIpPool, setFormIpPool] = useState<string>("10.47.0.0/24");
  const [formDownlink, setFormDownlink] = useState<string>("50 Mbps");
  const [formUplink, setFormUplink] = useState<string>("20 Mbps");
  const [formDefault, setFormDefault] = useState<boolean>(false);

  const fetchSubscriber = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/subscribers?imsi=999700000000001");
      const data = await res.json();
      if (data.success) {
        setSubscriber(data.subscriber);
      }
    } catch (err) {
      console.error("Failed to load subscriber", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, []);

  const handleAddSlice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        imsi: "999700000000001",
        slice: {
          sst: Number(formSst),
          sd: formSd.padStart(6, "0").toUpperCase(),
          dnn: formDnn.trim(),
          ipPool: formIpPool.trim(),
          default_indicator: formDefault,
          ambrDownlink: formDownlink,
          ambrUplink: formUplink,
          fiveQi: Number(formSst) === 2 ? 1 : 9,
        },
      };

      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        setNotification({
          type: "success",
          message: json.message || "Slice successfully provisioned in MongoDB!",
        });
        setSubscriber(json.subscriber);
        setIsAddModalOpen(false);
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to provision slice",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Network request failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlice = async (sst: number, sd: string) => {
    if (
      !confirm(
        `Are you sure you want to deprovision S-NSSAI (SST: ${sst}, SD: ${sd}) for IMSI 999700000000001?`
      )
    ) {
      return;
    }

    setSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imsi: "999700000000001",
          sst,
          sd,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setNotification({
          type: "success",
          message: json.message || "Slice removed successfully",
        });
        setSubscriber(json.subscriber);
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to delete slice",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to delete slice",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Database className="w-3.5 h-3.5" /> Open5GS MongoDB Provisioning
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriber Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Subscribed S-NSSAIs stored in MongoDB collection:{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">
              open5gs.subscribers
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscriber}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh subscriber"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Provision Network Slice
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-destructive/10 text-destructive border border-destructive/30"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Subscriber Card */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-foreground">
                  IMSI: {subscriber?.imsi || "999700000000001"}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Provisioned
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                PLMN: {subscriber?.plmn.mcc} / {subscriber?.plmn.mnc} (Open5GS SA Standalone Core)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-xs font-mono">
              <span className="text-muted-foreground">Auth Algorithm: </span>
              <span className="font-bold text-foreground">5G AKA / Milenage</span>
            </div>
          </div>
        </div>

        {/* Security Parameters Collapsible/Preview */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-muted-foreground font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" /> Subscriber 5G Security Context
            </span>
            <span className="text-[11px] text-muted-foreground">Open5GS Authentication Vectors</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="bg-background/80 p-2 rounded border border-border/30">
              <span className="text-muted-foreground block text-[10px]">Permanent Key (K)</span>
              <span className="truncate block font-semibold text-foreground">
                {subscriber?.security.k}
              </span>
            </div>
            <div className="bg-background/80 p-2 rounded border border-border/30">
              <span className="text-muted-foreground block text-[10px]">Operator Code (OPc)</span>
              <span className="truncate block font-semibold text-foreground">
                {subscriber?.security.opc}
              </span>
            </div>
            <div className="bg-background/80 p-2 rounded border border-border/30">
              <span className="text-muted-foreground block text-[10px]">AMF</span>
              <span className="truncate block font-semibold text-foreground">
                {subscriber?.security.amf}
              </span>
            </div>
            <div className="bg-background/80 p-2 rounded border border-border/30">
              <span className="text-muted-foreground block text-[10px]">SQN</span>
              <span className="truncate block font-semibold text-foreground">
                {subscriber?.security.sqn}
              </span>
            </div>
          </div>
        </div>

        {/* Subscribed S-NSSAIs Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Subscribed Network Slices (S-NSSAIs)
            </h4>
            <span className="text-xs text-muted-foreground font-mono">
              Total: {subscriber?.slices.length ?? 0} Slices
            </span>
          </div>

          <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70 text-muted-foreground font-semibold border-b border-border/50">
                  <tr>
                    <th className="p-3.5">Slice Type</th>
                    <th className="p-3.5">S-NSSAI (SST / SD)</th>
                    <th className="p-3.5">DNN (Data Network)</th>
                    <th className="p-3.5">Allocated Subnet</th>
                    <th className="p-3.5">Bandwidth (AMBR)</th>
                    <th className="p-3.5">Default</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {subscriber?.slices.map((slice) => {
                    const type = getSliceTypeBySst(slice.sst);
                    const isBaseline =
                      (slice.sst === 1 && slice.sd === "000001") ||
                      (slice.sst === 2 && slice.sd === "000002");

                    return (
                      <tr key={`${slice.sst}-${slice.sd}`} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              type === "eMBB"
                                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                : type === "URLLC"
                                ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            }`}
                          >
                            {type}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-foreground">
                          {formatSnssai(slice.sst, slice.sd)}
                        </td>
                        <td className="p-3.5 text-foreground">{slice.dnn}</td>
                        <td className="p-3.5 text-muted-foreground">{slice.ipPool || "Dynamic Pool"}</td>
                        <td className="p-3.5 text-muted-foreground">
                          {slice.ambrDownlink} DL / {slice.ambrUplink} UL
                        </td>
                        <td className="p-3.5">
                          {slice.default_indicator ? (
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                              Default
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Optional</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-sans">
                          <button
                            onClick={() => handleDeleteSlice(slice.sst, slice.sd)}
                            disabled={submitting}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title={isBaseline ? "Baseline project slice" : "Deprovision slice"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Provisioning Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h3 className="font-bold text-lg text-foreground">Provision 5G Network Slice</h3>
                <p className="text-xs text-muted-foreground">
                  Adds S-NSSAI to Open5GS UDM/UDR subscription profile
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    SST (Slice/Service Type)
                  </label>
                  <select
                    value={formSst}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormSst(val);
                      if (val === 1) {
                        setFormDnn("internet");
                        setFormSd("000001");
                      } else if (val === 2) {
                        setFormDnn("internet2");
                        setFormSd("000002");
                      } else if (val === 3) {
                        setFormDnn("iot");
                        setFormSd("000003");
                      } else if (val === 4) {
                        setFormDnn("v2x");
                        setFormSd("000004");
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value={1}>SST 1 • eMBB (Mobile Broadband)</option>
                    <option value={2}>SST 2 • URLLC (Ultra-Reliable)</option>
                    <option value={3}>SST 3 • MIoT / mMTC (Massive IoT)</option>
                    <option value={4}>SST 4 • V2X (Vehicles)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    SD (Slice Differentiator - 6 Hex)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formSd}
                    onChange={(e) => setFormSd(e.target.value.toUpperCase())}
                    placeholder="000003"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono uppercase focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    DNN (Data Network Name)
                  </label>
                  <input
                    type="text"
                    value={formDnn}
                    onChange={(e) => setFormDnn(e.target.value)}
                    placeholder="iot"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    IP Subnet Pool
                  </label>
                  <input
                    type="text"
                    value={formIpPool}
                    onChange={(e) => setFormIpPool(e.target.value)}
                    placeholder="10.47.0.0/24"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Downlink AMBR
                  </label>
                  <input
                    type="text"
                    value={formDownlink}
                    onChange={(e) => setFormDownlink(e.target.value)}
                    placeholder="50 Mbps"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Uplink AMBR
                  </label>
                  <input
                    type="text"
                    value={formUplink}
                    onChange={(e) => setFormUplink(e.target.value)}
                    placeholder="20 Mbps"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default_ind"
                  checked={formDefault}
                  onChange={(e) => setFormDefault(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="default_ind" className="text-foreground font-medium cursor-pointer">
                  Set as Default Subscribed Slice
                </label>
              </div>

              <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm"
                >
                  {submitting ? "Saving..." : "Provision Slice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
