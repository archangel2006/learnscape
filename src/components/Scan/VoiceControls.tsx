
"use client";

import React from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoiceControls() {
  return (
    <Button 
      size="icon" 
      variant="outline" 
      className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all group"
    >
      <Mic size={24} className="text-primary group-hover:text-white transition-colors" />
    </Button>
  );
}
