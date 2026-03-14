
"use client";

import { useState } from "react";
import { CameraView } from "@/components/Scan/CameraView";
import { OverlayCanvas } from "@/components/Scan/OverlayCanvas";
import { SubjectPillBar } from "@/components/Scan/SubjectPillBar";
import { ConceptStack } from "@/components/Scan/ConceptStack";
import { VoiceControls } from "@/components/Scan/VoiceControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft } from "lucide-react";
import Link from "next/link";

const INITIAL_SUBJECTS = [
  { 
    id: 'physics', 
    label: 'Physics', 
    concepts: ['Kinematics', 'Force', 'Thermodynamics', 'Momentum'] 
  },
  { 
    id: 'chemistry', 
    label: 'Chemistry', 
    concepts: ['Atomic Structure', 'Molecular Bonds', 'Reactions', 'Stoichiometry'] 
  },
  { 
    id: 'mathematics', 
    label: 'Mathematics', 
    concepts: ['Calculus', 'Linear Algebra', 'Geometry', 'Trigonometry'] 
  },
];

export default function ScanPage() {
  const [subjects] = useState(INITIAL_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="h-svh w-full relative flex flex-col bg-black overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/" className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg">L</div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:inline-block">Learnscape</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hidden md:block">
            Live Analysis
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative">
        <CameraView />
        <OverlayCanvas />
        
        {/* Right Side Concept Stack */}
        <ConceptStack 
          concepts={selectedSubject?.concepts || []} 
          isVisible={!!selectedSubjectId} 
        />

        {/* Bottom Controls Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-40 space-y-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          
          {/* Dynamic Subject Bar */}
          <div className="flex justify-center">
            <SubjectPillBar 
              subjects={subjects} 
              selectedId={selectedSubjectId} 
              onSelect={setSelectedSubjectId} 
            />
          </div>

          {/* Main Action Bar */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            <VoiceControls />
            
            <div className="relative group">
              <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <Button size="icon" className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl relative z-10 border-4 border-white/20">
                <Camera size={32} />
              </Button>
            </div>
            
            <div className="w-14 h-14" /> {/* Symmetry Spacer */}
          </div>
        </div>
      </main>
      
      {/* Scanning status banner */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-max bg-primary/20 backdrop-blur-md border border-primary/30 px-6 py-2 rounded-full pointer-events-none animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">Calibrating Visual Engine</span>
        </div>
      </div>
    </div>
  );
}
