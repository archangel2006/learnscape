import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container px-4 mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 font-headline">Explore the Science Around You</h2>
        <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10">
          Join thousands of students and lifelong learners who are turning their surroundings into interactive experiments.
        </p>
        <Link href="/scan">
          <Button size="lg" variant="secondary" className="rounded-full px-10 text-lg h-14 font-bold shadow-2xl">
            Launch Learnscape
          </Button>
        </Link>
      </div>
    </section>
  );
}
