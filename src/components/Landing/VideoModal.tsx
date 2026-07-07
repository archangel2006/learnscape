"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function VideoModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full gap-2 border-primary/20 hover:border-primary/50">
          <Play className="fill-primary text-primary" size={16} />
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Product Demo</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/C3IYzxx6Adg?autoplay=1&rel=0"
            title="Product Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
