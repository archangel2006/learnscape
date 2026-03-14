import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoModal } from "./VideoModal";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="container px-4 mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium border rounded-full bg-background/50 backdrop-blur-sm border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles size={14} />
          <span>AI-Powered Visual Learning</span>
        </div>
        
        <h1 className="mb-6 text-6xl md:text-8xl font-black tracking-tight font-headline animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Learnscape
        </h1>
        
        <p className="mb-4 text-2xl md:text-3xl font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          Turn the world into your classroom.
        </p>
        
        <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground/80 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
          Discover the physics, chemistry, and mathematics behind real-world objects using AI-powered visual learning.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-20 duration-700 delay-500">
          <Link href="/scan">
            <Button size="lg" className="rounded-full px-8 text-lg h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              Start Exploring
            </Button>
          </Link>
          <VideoModal />
        </div>
      </div>
    </section>
  );
}
