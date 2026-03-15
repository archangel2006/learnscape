"use client";

import { useState, useEffect, useRef } from "react";
import { CameraView, type CameraViewHandle } from "@/components/Scan/CameraView";
import { OverlayCanvas } from "@/components/Scan/OverlayCanvas";
import { SubjectPillBar } from "@/components/Scan/SubjectPillBar";
import { ConceptStack } from "@/components/Scan/ConceptStack";
import { VoiceControls } from "@/components/Scan/VoiceControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Loader2, X, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { type SystemStatus } from "@/components/Scan/SystemStatusBadge";
import { analyzeScene } from "@/ai/flows/analyze-scene-flow";
import { generateTopics } from "@/ai/flows/generate-topics-flow";
import { explainConcept } from "@/ai/flows/explain-concept-flow";
import { speak, stopSpeaking } from "@/lib/speech-service";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [conceptExplanation, setConceptExplanation] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('initializing');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  
  // AI Detection State
  const [detectedObject, setDetectedObject] = useState<string | null>(null);
  const [detectedSecondaryElements, setDetectedSecondaryElements] = useState<string[]>([]);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const [detectedVisualProperties, setDetectedVisualProperties] = useState<string[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSystemStatus('ready');
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, []);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleConceptSelect = async (concept: string) => {
    if (!detectedObject || isGeneratingExplanation) return;
    
    setSelectedConcept(concept);
    setIsGeneratingExplanation(true);
    setSystemStatus('analyzing');
    stopSpeaking();
    // Reset explanation sheet state
    setIsExplanationOpen(false);

    try {
      const result = await explainConcept({
        objectName: detectedObject,
        materials: detectedMaterials,
        visualProperties: detectedVisualProperties,
        subject: selectedSubject?.label || "",
        concept: concept
      });

      setConceptExplanation(result.explanation);
      setSystemStatus('active');
      speak(result.explanation);
      
      toast({
        title: "Analysis Ready",
        description: "Tap the document icon to read the explanation.",
      });
      
    } catch (error) {
      console.error("Explanation error:", error);
      toast({
        variant: "destructive",
        title: "Explanation Failed",
        description: "Could not generate concept explanation.",
      });
      setSystemStatus('error');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedConcept(null);
    setConceptExplanation(null);
    setIsExplanationOpen(false);
    stopSpeaking();
    
    if (systemStatus === 'active') {
      setSystemStatus('ready');
    }
    
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      speak(`You selected ${subject.label}. Here are some ${subject.label} concepts related to this object. Which one would you like to explore?`);
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
    setConceptExplanation(null);
    setSelectedConcept(null);
    setIsExplanationOpen(false);
    stopSpeaking();

    try {
      const result = await analyzeScene({ photoDataUri: frame });
      
      setDetectedObject(result.primary_object);
      setDetectedSecondaryElements(result.secondary_elements);
      setDetectedMaterials(result.materials);
      setDetectedVisualProperties(result.visual_properties);
      setConfidenceScore(result.confidence);
      
      setSystemStatus('active');
      
      toast({
        title: "Object Identified",
        description: `Detected: ${result.primary_object}`,
      });

      const topics = await generateTopics({
        objectName: result.primary_object,
        materials: result.materials,
        visualProperties: result.visual_properties,
      });

      setSubjects([
        { id: 'physics', label: 'Physics', concepts: topics.physics },
        { id: 'chemistry', label: 'Chemistry', concepts: topics.chemistry },
        { id: 'mathematics', label: 'Mathematics', concepts: topics.mathematics },
      ]);

      speak(`I see a ${result.primary_object}. Would you like to explore the physics, chemistry, or mathematics behind it?`);

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

        {/* Analysis Trigger Button (only visible when explanation exists) */}
        {conceptExplanation && (
          <div className="absolute right-6 top-[20%] lg:top-[30%] z-40 animate-in fade-in zoom-in slide-in-from-right-4 duration-500">
            <Button
              onClick={() => setIsExplanationOpen(true)}
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xl border-white/20 text-primary hover:bg-primary hover:text-white transition-all shadow-2xl ring-1 ring-white/10 group"
            >
              <FileText size={28} className="group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-black" />
              <span className="sr-only">Open Analysis</span>
            </Button>
          </div>
        )}

        {/* Explanation Sheet */}
        <Sheet open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
          <SheetContent 
            side="right" 
            className="w-full sm:max-w-md bg-black/90 backdrop-blur-2xl border-white/10 text-white p-0 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <SheetHeader className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <div>
                    <SheetTitle className="text-primary text-xs font-black uppercase tracking-widest text-left">
                      {selectedConcept}
                    </SheetTitle>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest text-left">
                      {selectedSubject?.label} Explanation
                    </p>
                  </div>
                </div>
              </SheetHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <p className="text-sm md:text-base leading-relaxed font-medium text-white/90">
                    {conceptExplanation}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3">Contextual Data</h4>
                    <div className="flex flex-wrap gap-2">
                      {detectedMaterials.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold text-white/60 uppercase tracking-tighter">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

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
                disabled={isAnalyzing || isGeneratingExplanation}
                size="icon" 
                className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl relative z-10 border-4 border-white/20"
              >
                {(isAnalyzing || isGeneratingExplanation) ? <Loader2 size={32} className="animate-spin" /> : <Camera size={32} />}
              </Button>
            </div>
            
            <div className="w-14 h-14" /> {/* Symmetry Spacer */}
          </div>
        </div>
      </main>
    </div>
  );
}
