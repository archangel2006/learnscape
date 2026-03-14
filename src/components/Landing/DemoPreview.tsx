import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export function DemoPreview() {
  const demoImage = PlaceHolderImages.find(img => img.id === 'demo-preview');
  
  return (
    <section className="py-24 bg-secondary/20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-headline leading-tight">See the Unseen.</h2>
            <p className="text-xl text-muted-foreground">
              Watch as Learnscape identifies forces, angles, and chemical processes happening in front of you. 
              Our intuitive UI brings scientific notation to life.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs shrink-0">1</div>
                <p className="font-medium">Force vectors visualized in real-time</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs shrink-0">2</div>
                <p className="font-medium">Angle measurements for mechanical structures</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs shrink-0">3</div>
                <p className="font-medium">Material composition alerts and facts</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background aspect-[4/3]">
              {demoImage && (
                <Image 
                  src={demoImage.imageUrl} 
                  alt={demoImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={demoImage.imageHint}
                />
              )}
              {/* Mock Overlays */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md px-3 py-1">Scanning: Photosynthesis</Badge>
                  <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse" />
                </div>
                
                <div className="relative h-full w-full">
                  {/* Mock Arrow */}
                  <div className="absolute top-1/2 left-1/3 flex flex-col items-center">
                    <div className="text-white text-xs font-bold mb-1 drop-shadow-md">Solar Energy Absorption</div>
                    <svg width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="white" strokeWidth="2">
                      <path d="M10 30 L90 10" markerEnd="url(#arrowhead)" />
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Mock Label */}
                  <div className="absolute bottom-1/4 right-1/4 bg-primary/80 backdrop-blur-md text-white p-2 rounded border border-white/20 text-xs">
                    <div className="font-bold">Stomata</div>
                    <div>Gas exchange ports</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decor elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
