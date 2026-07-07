"use client";

import { useState, useEffect, useRef } from "react";
import { CameraView, type CameraViewHandle } from "@/components/Scan/CameraView";
import { OverlayCanvas } from "@/components/Scan/OverlayCanvas";
import { SubjectPillBar } from "@/components/Scan/SubjectPillBar";
import { ConceptStack } from "@/components/Scan/ConceptStack";
import { VoiceControls } from "@/components/Scan/VoiceControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Loader2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { type SystemStatus } from "@/components/Scan/SystemStatusBadge";
import { analyzeScene, type AnalyzeSceneOutput } from "@/ai/flows/analyze-scene-flow";
import { generateTopics } from "@/ai/flows/generate-topics-flow";
import { explainConcept } from "@/ai/flows/explain-concept-flow";
import { generateVisualizations } from "@/ai/flows/generate-visualization-flow";
import { voiceQueryForScannedObject } from "@/ai/flows/voice-query-for-scanned-object-flow";
import { speak, stopSpeaking } from "@/lib/speech-service";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  
  // Application State
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [conceptExplanation, setConceptExplanation] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('initializing');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  
  // Scene Analysis Context (REUSED)
  const [sceneAnalysis, setSceneAnalysis] = useState<AnalyzeSceneOutput | null>(null);
  
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
    if (!sceneAnalysis || isGeneratingExplanation) return;
    
    setSelectedConcept(concept);
    setIsGeneratingExplanation(true);
    setSystemStatus('analyzing');
    stopSpeaking();
    setVisualizations([]);
    setIsExplanationOpen(false);

    try {
      const [explanationResult, vizResult] = await Promise.all([
        explainConcept({
          analysis: {
            primary_object: sceneAnalysis.primary_object,
            materials: sceneAnalysis.materials,
            visual_properties: sceneAnalysis.visual_properties,
          },
          subject: selectedSubject?.label || "",
          concept: concept
        }),
        generateVisualizations({
          analysis: {
            primary_object: sceneAnalysis.primary_object,
          },
          subject: selectedSubject?.label || "",
          concept: concept
        })
      ]);

      setConceptExplanation(explanationResult.explanation);
      setVisualizations(vizResult.visualizations);
      setSystemStatus('active');
      speak(explanationResult.explanation);
      
      toast({
        title: "Analysis Ready",
        description: "Visualizations active. Tap the document icon for full explanation.",
      });
      
    } catch (error) {
      console.error("Explanation error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate concept details.",
      });
      setSystemStatus('error');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleVoiceQuery = async (query: string) => {
    if (!sceneAnalysis || isGeneratingExplanation) return;

    setSystemStatus('analyzing');
    stopSpeaking();
    setIsGeneratingExplanation(true);
    setConceptExplanation(null);
    setSelectedConcept("Voice Query");
    setVisualizations([]);

    try {
      const contextStr = `Object: ${sceneAnalysis.primary_object}. Materials: ${sceneAnalysis.materials.join(', ')}. Visual Properties: ${sceneAnalysis.visual_properties.join(', ')}. Currently selected subject: ${selectedSubject?.label || 'General'}.`;
      
      const [response, vizResult] = await Promise.all([
        voiceQueryForScannedObject({
          voiceQuery: query,
          scannedObjectInfo: contextStr
        }),
        generateVisualizations({
          analysis: {
            primary_object: sceneAnalysis.primary_object,
          },
          subject: selectedSubject?.label || "Physics", // Fallback to physics for generic viz
          concept: query
        })
      ]);

      setConceptExplanation(response.explanation);
      setVisualizations(vizResult.visualizations);
      setSystemStatus('active');
      speak(response.explanation);

      toast({
        title: "Voice Response Ready",
        description: "Answering your question about the object.",
      });

    } catch (error) {
      console.error("Voice query error:", error);
      setSystemStatus('error');
      toast({
        variant: "destructive",
        title: "Query Failed",
        description: "Could not process your voice request.",
      });
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedConcept(null);
    setConceptExplanation(null);
    setVisualizations([]);
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
    setVisualizations([]);
    setIsExplanationOpen(false);
    setSceneAnalysis(null);
    stopSpeaking();

    try {
      const analysis = await analyzeScene({ photoDataUri: frame });
      setSceneAnalysis(analysis);
      
      setSystemStatus('active');
      
      toast({
        title: "Object Identified",
        description: `Detected: ${analysis.primary_object}`,
      });

      const topics = await generateTopics({
        analysis: {
          primary_object: analysis.primary_object,
          materials: analysis.materials,
          visual_properties: analysis.visual_properties,
        },
      });

      setSubjects([
        { id: 'physics', label: 'Physics', concepts: topics.physics },
        { id: 'chemistry', label: 'Chemistry', concepts: topics.chemistry },
        { id: 'mathematics', label: 'Mathematics', concepts: topics.mathematics },
      ]);

      speak(`I see a ${analysis.primary_object}. Would you like to explore the physics, chemistry, or mathematics behind it? You can also ask me a specific question using the microphone.`);

    } catch (error) {
      console.error("Detection error:", error);
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
        <OverlayCanvas status={systemStatus} visualizations={visualizations} />
        
        {/* Right Side Concept Stack */}
        <ConceptStack 
          concepts={selectedSubject?.concepts || []} 
          isVisible={!!selectedSubjectId} 
          subjectLabel={selectedSubject?.label}
          onConceptSelect={handleConceptSelect}
        />

        {/* Analysis Trigger Button */}
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

        {/* Explanation Dialog Modal */}
        <Dialog open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
          <DialogContent
            className={[
              // Base layout
              "p-0 overflow-hidden",
              // Glassmorphism background
              "bg-black/40 backdrop-blur-2xl",
              // Border & shadow
              "border border-white/10 shadow-2xl ring-1 ring-white/10",
              // Positioning & sizing — compact floating card
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[92vw] max-w-sm",
              "max-h-[75vh]",
              // Rounded
              "rounded-2xl",
              // Text color
              "text-white",
            ].join(" ")}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <DialogHeader className="px-4 pt-4 pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-primary text-xs font-black uppercase tracking-widest text-left leading-tight line-clamp-2">
                      {selectedConcept}
                    </DialogTitle>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-left mt-0.5">
                      {selectedSubject?.label || 'General'} Explanation
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Scrollable content */}
              <ScrollArea className="flex-1 overflow-y-auto max-h-[45vh]">
                <div className="px-4 py-4 space-y-4">
                  <p className="text-sm leading-relaxed font-medium text-white/90">
                    {conceptExplanation}
                  </p>

                  {sceneAnalysis && (
                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2">
                          Materials
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {sceneAnalysis.materials.map((m, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-bold text-white/60 uppercase tracking-tighter"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2">
                          Object
                        </h4>
                        <span className="px-2 py-0.5 bg-primary/10 rounded-md text-[9px] font-bold text-primary uppercase tracking-tighter">
                          {sceneAnalysis.primary_object}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5 bg-white/5 shrink-0">
                <p className="text-[8px] text-white/20 font-bold uppercase tracking-[0.2em] text-center">
                  Learnscape Visual STEM Engine
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        {/* Bottom Controls Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-40 space-y-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex justify-center">
            <SubjectPillBar 
              subjects={subjects} 
              selectedId={selectedSubjectId} 
              onSelect={handleSubjectSelect} 
            />
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto">
            <VoiceControls 
              onQuery={handleVoiceQuery}
              disabled={!sceneAnalysis || isAnalyzing || isGeneratingExplanation}
            />
            
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
            
            <div className="w-14 h-14" />
          </div>
        </div>
      </main>
    </div>
  );
}
