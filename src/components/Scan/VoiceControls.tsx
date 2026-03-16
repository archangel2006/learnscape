"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Loader2, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceControlsProps {
  onQuery?: (query: string) => void;
  disabled?: boolean;
}

export function VoiceControls({ onQuery, disabled }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Standard Speech Recognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onQuery) onQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onQuery]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {isListening && (
        <div className="absolute -top-10 flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            Listening...
          </span>
        </div>
      )}
      <Button 
        onClick={toggleListening}
        disabled={disabled}
        size="icon" 
        variant="outline" 
        className={cn(
          "w-14 h-14 rounded-full backdrop-blur-xl border-white/20 transition-all duration-300 group shadow-2xl ring-1 ring-white/10",
          isListening 
            ? "bg-primary border-primary text-white scale-110 shadow-primary/40" 
            : "bg-black/50 hover:bg-primary/20 hover:border-primary/50"
        )}
      >
        {isListening ? (
          <Mic className="animate-pulse" size={24} />
        ) : (
          <Mic size={24} className="text-primary group-hover:text-white transition-colors" />
        )}
      </Button>
    </div>
  );
}
