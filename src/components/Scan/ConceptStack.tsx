
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ConceptStackProps {
  concepts: string[];
  isVisible: boolean;
}

export function ConceptStack({ concepts, isVisible }: ConceptStackProps) {
  return (
    <div 
      className={cn(
        "absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 transition-all duration-500 ease-out",
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-12 opacity-0 pointer-events-none"
      )}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-1 ml-1">
        Concepts
      </div>
      {concepts.map((concept, idx) => (
        <div 
          key={idx}
          className="group flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 pl-4 pr-6 text-white transition-all hover:bg-primary/20 hover:border-primary/40 cursor-pointer shadow-2xl"
          style={{ 
            transitionDelay: isVisible ? `${idx * 50}ms` : '0ms' 
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold whitespace-nowrap">{concept}</span>
          <Sparkles size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
