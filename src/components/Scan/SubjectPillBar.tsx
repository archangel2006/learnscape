
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  label: string;
}

interface SubjectPillBarProps {
  subjects: Subject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SubjectPillBar({ subjects, selectedId, onSelect }: SubjectPillBarProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-full px-4">
      {subjects.map((subject) => {
        const isSelected = selectedId === subject.id;
        return (
          <button
            key={subject.id}
            onClick={() => onSelect(subject.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border backdrop-blur-md",
              isSelected 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                : "bg-black/10 text-white/80 border-white/20 hover:bg-blue/40 hover:text-white"
            )}
          >
            {subject.label}
          </button>
        );
      })}
    </div>
  );
}
