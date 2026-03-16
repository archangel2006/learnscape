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
           
              <Image 
                  src="/example.png"
                  alt="example image"
                  fill
                  className="object-cover"
      
              />
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  );
}
