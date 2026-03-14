import { Eye, Layers, Mic, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Eye,
    title: "Real-World Vision",
    description: "AI analyzes objects around you with precision, identifying materials and properties."
  },
  {
    icon: Layers,
    title: "Interactive STEM Overlays",
    description: "Visual diagrams and annotations appear directly on the object in real-time."
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Ask questions naturally and receive clear, concise explanations instantly."
  },
  {
    icon: Zap,
    title: "Instant Learning",
    description: "Understand complex concepts in seconds through immersive visual storytelling."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Empowering Knowledge Through Vision</h2>
          <p className="text-muted-foreground text-lg">Our platform combines cutting-edge AI with educational design to make science tangible.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/20">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <feature.icon size={24} />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
