"use client";

import { useState, useEffect, useRef } from "react";
import { CameraView, type CameraViewHandle } from "@/components/Scan/CameraView";
import { OverlayCanvas } from "@/components/Scan/OverlayCanvas";
import { SubjectPillBar } from "@/components/Scan/SubjectPillBar";
import { ConceptStack } from "@/components/Scan/ConceptStack";
import { VoiceControls } from "@/components/Scan/VoiceControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { type SystemStatus } from "@/components/Scan/SystemStatusBadge";
import { analyzeScene } from "@/ai/flows/analyze-scene-flow";

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
  const cameraRef = useRef<CameraViewHandle>(null);
  const [subjects] = useState(INITIAL_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('initializing');
  
  // AI Detection State
  const [detectedObject, setDetectedObject] = useState<string | null>(null);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSystemStatus('ready');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleConceptSelect = (concept: string) => {
    setSystemStatus('analyzing');
    toast({
      title: "Concept Selected",
      description: `Analyzing: ${concept} in real-time.`,
    });
    
    setTimeout(() => {
      setSystemStatus('active');
    }, 1500);
  };

  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id);
    if (systemStatus === 'active') {
      setSystemStatus('ready');
    }
  };

  const handleCapture = async () => {
    if (isAnalyzing) return;
    
    const frame = cameraRef.current?.getFrame();
    if (!frame) {
      toast({
        variant: "destructive",
        title: "Capture Failed",
        description: "Could not grab frame from camera.",
      });
      return;
    }

    setIsAnalyzing(true);
    setSystemStatus('analyzing');

    try {
      const result = await analyzeScene({ photoDataUri: frame });
      setDetectedObject(result.object);
      setDetectedMaterials(result.materials);
      setConfidenceScore(result.confidence);
      setSystemStatus('active');
      
      toast({
        title: "Object Identified",
        description: `Detected: ${result.object} (${Math.round(result.confidence * 100)}% confidence)`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setSystemStatus('error');
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to identify object. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative">
        <CameraView ref={cameraRef} />
        <OverlayCanvas status={systemStatus} />
        
        {/* Right Side Concept Stack */}
        <ConceptStack 
          concepts={selectedSubject?.concepts || []} 
          isVisible={!!selectedSubjectId} 
          subjectLabel={selectedSubject?.label}
          onConceptSelect={handleConceptSelect}
        />

        {/* Bottom Controls Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-40 space-y-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          
          {/* Dynamic Subject Bar */}
          <div className="flex justify-center">
            <SubjectPillBar 
              subjects={subjects} 
              selectedId={selectedSubjectId} 
              onSelect={handleSubjectSelect} 
            />
          </div>

          {/* Main Action Bar */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            <VoiceControls />
            
            <div className="relative group">
              <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <Button 
                onClick={handleCapture}
                disabled={isAnalyzing}
                size="icon" 
                className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl relative z-10 border-4 border-white/20"
              >
                {isAnalyzing ? <Loader2 size={32} className="animate-spin" /> : <Camera size={32} />}
              </Button>
            </div>
            
            <div className="w-14 h-14" /> {/* Symmetry Spacer */}
          </div>
        </div>
      </main>
    </div>
  );
}
