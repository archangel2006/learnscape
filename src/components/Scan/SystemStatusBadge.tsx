
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type SystemStatus = 'initializing' | 'ready' | 'analyzing' | 'active' | 'error';

interface SystemStatusBadgeProps {
  status: SystemStatus;
}

const statusConfig = {
  initializing: {
    label: "Initializing Camera",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-500",
  },
  ready: {
    label: "System Ready",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  analyzing: {
    label: "Analyzing Object",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    dot: "bg-blue-500",
  },
  active: {
    label: "Visualization Active",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  error: {
    label: "System Error",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
    dot: "bg-red-500",
  },
};

export function SystemStatusBadge({ status }: SystemStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md animate-in fade-in zoom-in duration-500 pointer-events-none",
      config.color
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
      <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
}
