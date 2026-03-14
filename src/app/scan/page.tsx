import { CameraView } from "@/components/Scan/CameraView";
import { ControlPanel } from "@/components/Scan/ControlPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="h-screen w-full relative flex flex-col bg-black">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg">L</div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:inline-block">Learnscape</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hidden md:block">
            Live Analysis
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative">
        <CameraView />
        <ControlPanel />
      </main>
      
      {/* Scanning status banner */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-max bg-primary/20 backdrop-blur-md border border-primary/30 px-6 py-2 rounded-full pointer-events-none animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">Calibrating Visual Engine</span>
        </div>
      </div>
    </div>
  );
}
