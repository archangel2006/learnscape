import { Box, Code2, Cpu, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tech = [
  { name: "Gemini AI", icon: Cpu, desc: "State-of-the-art vision models" },
  { name: "Firebase", icon: Globe, desc: "Scalable global infrastructure" },
  { name: "Genkit", icon: Box, desc: "Advanced AI framework orchestration" },
  { name: "Next.js", icon: Code2, desc: "Modern full-stack performance" }
];

export function TechStack() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold text-center mb-16 text-muted-foreground uppercase tracking-widest">Built With Modern Tech</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {tech.map((item, idx) => (
            <Card key={idx} className="border-none bg-secondary/50 hover:bg-secondary transition-colors group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <item.icon size={32} className="mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
