"use client";

import { Mic, Camera, Flame, Ruler, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const suggestions = [
  { icon: Weight, label: "Forces" },
  { icon: Ruler, label: "Angles" },
  { icon: Flame, label: "Corrosion" }
];

export function ControlPanel() {
  return (
    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 space-y-6 z-20">
      {/* Concept Suggestions */}
      <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {suggestions.map((item, idx) => (
          <Badge 
            key={idx} 
            variant="secondary" 
            className="px-4 py-2 bg-background/60 backdrop-blur-lg border-white/10 text-foreground cursor-pointer hover:bg-primary hover:text-white transition-colors gap-2 whitespace-nowrap"
          >
            <item.icon size={14} />
            {item.label}
          </Badge>
        ))}
      </div>
      
      {/* Main Controls */}
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Button size="icon" variant="outline" className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-md border-white/20 hover:bg-background/80">
          <Mic size={24} className="text-primary" />
        </Button>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
          <Button size="icon" className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl relative z-10 border-4 border-white/20">
            <Camera size={32} />
          </Button>
        </div>
        
        <div className="w-14 h-14" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
}
