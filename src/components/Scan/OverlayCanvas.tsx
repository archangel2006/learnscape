
"use client";

import React from "react";
import { SystemStatusBadge, type SystemStatus } from "./SystemStatusBadge";

interface OverlayCanvasProps {
  status: SystemStatus;
}

export function OverlayCanvas({ status }: OverlayCanvasProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        {/* Unified Status Badge */}
        <SystemStatusBadge status={status} />
        
        {/* Scanning Reticle */}
        <div className="w-64 h-64 border-2 border-primary/40 rounded-3xl relative">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
