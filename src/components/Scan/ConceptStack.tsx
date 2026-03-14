
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ConceptStackProps {
  concepts: string[];
  isVisible: boolean;
  onConceptSelect?: (concept: string) => void;
  subjectLabel?: string;
}

export function ConceptStack({ 
  concepts, 
  isVisible, 
  onConceptSelect,
  subjectLabel 
}: ConceptStackProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (concept: string) => {
    if (onConceptSelect) onConceptSelect(concept);
    setIsOpen(false);
  };

  if (!isVisible) return null;

  // Desktop View (Large screens)
  const DesktopStack = (
    <div 
      className={cn(
        "hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 transition-all duration-500 ease-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0 pointer-events-none"
      )}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-1 ml-1">
        Concepts: {subjectLabel}
      </div>
      {concepts.map((concept, idx) => (
        <div 
          key={idx}
          onClick={() => handleSelect(concept)}
          className="group flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 pl-4 pr-6 text-white transition-all hover:bg-primary/20 hover:border-primary/40 cursor-pointer shadow-2xl"
          style={{ transitionDelay: `${idx * 50}ms` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold whitespace-nowrap">{concept}</span>
          <Sparkles size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );

  // Tablet/Mobile View (Using Sheet)
  const MobileTabletStack = (
    <div className="lg:hidden absolute right-6 top-1/2 -translate-y-1/2 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xl border-white/20 text-white shadow-2xl hover:bg-primary hover:border-primary transition-all group"
          >
            <List size={24} className="text-primary group-hover:text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side={isMobile ? "bottom" : "right"} 
          className={cn(
            "bg-black/90 backdrop-blur-2xl border-white/10 text-white",
            isMobile ? "h-[60vh] rounded-t-3xl" : "w-[300px]"
          )}
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-primary text-xs font-black uppercase tracking-widest">
              {subjectLabel} Concepts
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3">
            {concepts.map((concept, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelect(concept)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-primary/20 hover:border-primary/40 transition-all active:scale-[0.98]"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-bold text-sm">{concept}</span>
                <Sparkles size={14} className="ml-auto text-primary/50" />
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      {DesktopStack}
      {MobileTabletStack}
    </>
  );
}
