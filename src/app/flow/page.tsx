"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommitHorizontal,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Radio,
  Wifi,
  Server,
  Database,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  FileCode,
} from "lucide-react";
import { SIGNALING_STEPS, FlowStep } from "@/lib/signaling-flow";

export default function SignalingFlowPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const step: FlowStep = SIGNALING_STEPS[currentStepIndex];

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % SIGNALING_STEPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % SIGNALING_STEPS.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev - 1 + SIGNALING_STEPS.length) % SIGNALING_STEPS.length);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Node position helper for topology highlighting
  const isNodeActive = (nodeName: string) => {
    if (step.source.toLowerCase().includes(nodeName.toLowerCase())) return true;
    if (step.target.toLowerCase().includes(nodeName.toLowerCase())) return true;
    return false;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <GitCommitHorizontal className="w-3.5 h-3.5" /> 3GPP TS 23.502 Procedural State Machine
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Animated Signaling Flow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            End-to-end 5G Standalone (SA) Registration, NSSAI exchange, and dual PDU Session establishment
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isPlaying
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                : "bg-primary text-primary-foreground shadow-sm"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Flow
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-l border-border/50 ml-1"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Node Topology Diagram */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">5G Core Network Functions & Reference Points</span>
          <span className="font-mono bg-muted px-2 py-0.5 rounded">
            Step {step.stepNumber} of 6
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative py-4">
          {/* Node 1: UE */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("ue")
                ? "bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold mb-2">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">Simulated UE</div>
            <div className="text-[10px] text-muted-foreground font-mono">nr-ue</div>
          </div>

          {/* Node 2: gNodeB */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("gnb") || isNodeActive("gnodeb")
                ? "bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold mb-2">
              <Radio className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">gNodeB</div>
            <div className="text-[10px] text-muted-foreground font-mono">nr-gnb</div>
          </div>

          {/* Node 3: AMF */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("amf")
                ? "bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold mb-2">
              <Server className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">AMF</div>
            <div className="text-[10px] text-muted-foreground font-mono">open5gs-amfd</div>
          </div>

          {/* Node 4: UDM/MongoDB */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("udm") || isNodeActive("mongodb")
                ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold mb-2">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">UDM / UDR</div>
            <div className="text-[10px] text-muted-foreground font-mono">MongoDB</div>
          </div>

          {/* Node 5: SMF */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("smf")
                ? "bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">SMF</div>
            <div className="text-[10px] text-muted-foreground font-mono">open5gs-smfd</div>
          </div>

          {/* Node 6: UPF */}
          <div
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
              isNodeActive("upf")
                ? "bg-pink-500/10 border-pink-500 shadow-md shadow-pink-500/20 scale-105"
                : "bg-muted/30 border-border/60 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs">UPF Tunnels</div>
            <div className="text-[10px] text-muted-foreground font-mono">uesimtun0/1</div>
          </div>
        </div>

        {/* Animated Direction Banner */}
        <div className="p-3 bg-muted/40 rounded-xl border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{step.source}</span>
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-primary font-bold"
            >
              ➔
            </motion.div>
            <span className="font-bold text-foreground">{step.target}</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Ref Point: {step.referencePoint}
            </span>
            <span className="text-muted-foreground text-[11px] hidden sm:inline-block">
              {step.protocol}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Step Timeline (Steps light up) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-tight text-foreground">
          3GPP TS 23.502 Registration & Slicing Timeline
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {SIGNALING_STEPS.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.02]"
                    : isPast
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-card border-border/60 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span>Step {s.stepNumber}</span>
                  {isPast && <CheckCircle2 className="w-3 h-3" />}
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </div>
                <div className="font-bold text-xs truncate">{s.source} ➔ {s.target}</div>
                <div className="text-[10px] truncate opacity-80 mt-0.5">{s.referencePoint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail & Information Elements Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step Explanation */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div>
              <span className="text-xs font-mono font-bold text-primary">
                Procedure Step {step.stepNumber}
              </span>
              <h3 className="font-bold text-lg text-foreground mt-0.5">{step.title}</h3>
            </div>
            <span className="text-xs font-mono bg-muted px-2.5 py-1 rounded-lg border border-border/40 text-muted-foreground">
              {step.specReference}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/40 text-xs space-y-1">
            <span className="font-bold text-foreground block">Signaling Purpose:</span>
            <p className="text-muted-foreground leading-relaxed">{step.summary}</p>
          </div>
        </div>

        {/* Decoded 3GPP Information Elements (IEs) */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <FileCode className="w-4 h-4 text-primary" /> Decoded 3GPP Information Elements
          </div>

          <div className="space-y-2 text-xs font-mono">
            {step.informationElements.map((ie, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border ${
                  ie.highlight
                    ? "bg-primary/10 border-primary/40 text-foreground font-semibold"
                    : "bg-muted/40 border-border/40 text-muted-foreground"
                }`}
              >
                <div className="text-[10px] text-muted-foreground font-sans mb-0.5">
                  {ie.name}
                </div>
                <div className="break-all">{ie.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
