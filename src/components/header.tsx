"use client";

import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Activity, ShieldCheck, Wifi, Server } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border/60 bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Quick System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-foreground font-semibold">5G Core Standalone (SA)</span>
          <span className="text-xs text-muted-foreground hidden sm:inline-block border-l border-border pl-3">
            Open5GS v2.7+ • UERANSIM v3.2.6
          </span>
        </div>

        {/* Status badges */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Server className="w-3 h-3" />
            AMF/SMF/UPF Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Wifi className="w-3 h-3" />
            gNB Connected
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-3 h-3" />
            Slices Isolated
          </span>
        </div>
      </div>

      {/* Right: Slice Pills & Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Quick Slice Indicators */}
        <div className="hidden md:flex items-center gap-2 mr-2">
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Slice A (eMBB)</span>
            <span className="text-muted-foreground text-[10px]">10.45.0.0/24</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Slice B (URLLC)</span>
            <span className="text-muted-foreground text-[10px]">10.46.0.0/24</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

