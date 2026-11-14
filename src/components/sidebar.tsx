"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Users,
  GitCommitHorizontal,
  Activity,
  FlaskConical,
  ScrollText,
  BookOpen,
  FileCode,
  Radio,
  Cpu,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview & Core Health",
  },
  {
    label: "Network Slices",
    href: "/slices",
    icon: Layers,
    badge: "2 Active",
    description: "SST / SD / DNN / Interfaces",
  },
  {
    label: "Subscribers",
    href: "/subscribers",
    icon: Users,
    description: "Open5GS IMSI & S-NSSAI Provisioning",
  },
  {
    label: "Signaling Flow",
    href: "/flow",
    icon: GitCommitHorizontal,
    badge: "Live",
    description: "Registration & PDU Flow Diagram",
  },
  {
    label: "Traffic & Ping",
    href: "/traffic",
    icon: Activity,
    description: "Per-Slice Latency & Throughput",
  },
  {
    label: "Test Lab",
    href: "/test-lab",
    icon: FlaskConical,
    description: "gNB / UE Control & Negative Slicing",
  },
  {
    label: "Live Logs",
    href: "/logs",
    icon: ScrollText,
    description: "AMF / SMF 5G Events Stream",
  },
  {
    label: "5G Slicing Guide",
    href: "/learn",
    icon: BookOpen,
    badge: "3GPP",
    description: "eMBB, URLLC & MIoT Concepts",
  },
  {
    label: "API Docs",
    href: "/api-docs",
    icon: FileCode,
    description: "OpenAPI Specification & Bridge",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/60 bg-card/60 backdrop-blur-md flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-tight">5G SliceCore</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Open5GS + UERANSIM
            </p>
          </div>
        </div>
      </div>

      {/* Slices Quick Status */}
      <div className="px-4 py-3 mx-3 my-3 bg-muted/40 rounded-xl border border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-medium">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-primary" /> Active Slices
          </span>
          <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
            PLMN 999/70
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-mono bg-background/80 px-2 py-1 rounded border border-border/30">
            <span className="font-semibold text-blue-500">Slice A (eMBB)</span>
            <span className="text-muted-foreground text-[11px]">SST 1 / uesimtun0</span>
          </div>
          <div className="flex items-center justify-between font-mono bg-background/80 px-2 py-1 rounded border border-border/30">
            <span className="font-semibold text-purple-500">Slice B (URLLC)</span>
            <span className="text-muted-foreground text-[11px]">SST 2 / uesimtun1</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex justify-between items-center mb-1">
          <span>Release:</span>
          <span className="font-mono text-foreground font-semibold">3GPP Rel-16</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Target IMSI:</span>
          <span className="font-mono text-[11px] text-foreground font-semibold">999700000000001</span>
        </div>
      </div>
    </aside>
  );
}
