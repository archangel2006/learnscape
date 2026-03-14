import { HeroSection } from "@/components/Landing/HeroSection";
import { HowItWorks } from "@/components/Landing/HowItWorks";
import { FeaturesSection } from "@/components/Landing/FeaturesSection";
import { DemoPreview } from "@/components/Landing/DemoPreview";
import { TechStack } from "@/components/Landing/TechStack";
import { FinalCTA } from "@/components/Landing/FinalCTA";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-background/70 backdrop-blur-md">
        <div className="container px-4 h-20 flex items-center justify-between mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">L</div>
            <span className="text-2xl font-black tracking-tight font-headline">Learnscape</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/scan" 
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-sm"
            >
              Start App
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <DemoPreview />
        <TechStack />
        <FinalCTA />
      </main>
      
      <footer className="py-12 border-t border-border/50 text-center">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">L</div>
            <span className="text-xl font-black tracking-tight">Learnscape</span>
          </div>
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Learnscape AI. Making the invisible visible.</p>
        </div>
      </footer>
    </div>
  );
}
