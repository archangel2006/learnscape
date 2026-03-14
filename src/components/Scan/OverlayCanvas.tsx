
"use client";

import React from "react";

export function OverlayCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="w-full h-full flex items-center justify-center">
        {/* Scanning Reticle */}
        <div className="w-64 h-64 border-2 border-primary/40 rounded-3xl relative">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-3xl" />
        </div>
      </div>
      
      {/* Detection Indicators */}
      <div className="absolute top-24 right-8 space-y-2 opacity-80">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Motion Vector Active
        </div>
      </div>
    </div>
  );
}
