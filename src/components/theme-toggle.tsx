"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-muted/40 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
      <button
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className={`p-1.5 rounded-lg transition-all ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className={`p-1.5 rounded-lg transition-all ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        aria-label="System theme"
        className={`p-1.5 rounded-lg transition-all ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Follow System"
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
}
