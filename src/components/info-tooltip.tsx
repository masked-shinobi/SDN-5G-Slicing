"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  term: string;
  definition: string;
  example?: string;
}

export function InfoTooltip({ term, definition, example }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1 group">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
        aria-label={`Definition for ${term}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-xl shadow-lg border border-border animate-in fade-in zoom-in-95 pointer-events-none"
        >
          <div className="font-bold text-foreground mb-1">{term}</div>
          <div className="text-muted-foreground leading-relaxed">{definition}</div>
          {example && (
            <div className="mt-1.5 pt-1.5 border-t border-border/50 text-[11px] font-mono text-primary">
              {example}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </span>
  );
}
