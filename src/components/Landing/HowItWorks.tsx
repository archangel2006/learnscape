import { Camera, Search, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Camera,
    title: "1. Point Your Camera",
    description: "Use your phone camera to scan real-world objects.",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: Search,
    title: "2. AI Detects Concepts",
    description: "The system identifies relevant STEM concepts.",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: BookOpen,
    title: "3. Learn Visually",
    description: "Interactive overlays explain the science directly on the object.",
    color: "bg-emerald-500/10 text-emerald-500"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl md:text-4xl font-bold text-center font-headline">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <Card key={idx} className="border-none shadow-none bg-transparent group">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${step.color}`}>
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
