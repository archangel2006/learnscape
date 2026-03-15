"use client";

import React, { useEffect, useRef } from "react";
import { SystemStatusBadge, type SystemStatus } from "./SystemStatusBadge";

interface OverlayCanvasProps {
  status: SystemStatus;
  visualizations?: any[];
}

export function OverlayCanvas({ status, visualizations = [] }: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (visualizations.length > 0) {
        visualizations.forEach((viz) => {
          const x = viz.x * canvas.width;
          const y = viz.y * canvas.height;
          const color = viz.color || "hsl(221, 72%, 50%)"; // Use primary color as default

          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;

          switch (viz.type) {
            case "vector":
              drawVector(ctx, x, y, viz.direction || "up", viz.label);
              break;
            case "particles":
              drawParticles(ctx, x, y, viz.behavior || "bubbling", time);
              break;
            case "wave":
              drawWave(ctx, x, y, viz.amplitude || 20, time, viz.label);
              break;
            case "label":
              drawLabel(ctx, x, y, viz.label || "");
              break;
            case "circle":
              drawCircle(ctx, x, y, viz.label);
              break;
            case "line":
              drawLine(ctx, x, y, viz.label);
              break;
            case "angle":
              drawAngle(ctx, x, y, viz.label);
              break;
          }
        });
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [visualizations]);

  const drawVector = (ctx: CanvasRenderingContext2D, x: number, y: number, dir: string, label?: string) => {
    const len = 60;
    let dx = 0, dy = 0;
    if (dir === "up") dy = -len;
    else if (dir === "down") dy = len;
    else if (dir === "left") dx = -len;
    else if (dir === "right") dx = len;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    // Arrowhead
    const headlen = 10;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - headlen * Math.cos(angle - Math.PI / 6), y + dy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - headlen * Math.cos(angle + Math.PI / 6), y + dy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    if (label) {
      ctx.font = "bold 12px Inter";
      ctx.fillText(label, x + dx + 5, y + dy);
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, x: number, y: number, behavior: string, time: number) => {
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push({
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * -2,
          life: Math.random() * 100,
          size: Math.random() * 4 + 2
        });
      }
    }

    particlesRef.current.forEach(p => {
      p.life -= 1;
      if (behavior === "bubbling") {
        p.oy += p.vy;
        p.ox += p.vx;
      }
      
      if (p.life <= 0) {
        p.ox = x;
        p.oy = y;
        p.life = 100;
      }

      ctx.globalAlpha = p.life / 100;
      ctx.beginPath();
      ctx.arc(p.ox, p.oy, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  const drawWave = (ctx: CanvasRenderingContext2D, x: number, y: number, amp: number, time: number, label?: string) => {
    ctx.beginPath();
    for (let i = -50; i < 50; i++) {
      const px = x + i;
      const py = y + Math.sin(time * 0.01 + i * 0.1) * amp;
      if (i === -50) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (label) {
      ctx.font = "bold 12px Inter";
      ctx.fillText(label, x - 20, y - amp - 10);
    }
  };

  const drawLabel = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    ctx.font = "bold 14px Inter";
    const metrics = ctx.measureText(text);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x - 5, y - 15, metrics.width + 10, 20);
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, label?: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.stroke();
    if (label) {
      ctx.font = "bold 12px Inter";
      ctx.fillText(label, x - 20, y + 60);
    }
  };

  const drawLine = (ctx: CanvasRenderingContext2D, x: number, y: number, label?: string) => {
    ctx.beginPath();
    ctx.moveTo(x - 50, y);
    ctx.lineTo(x + 50, y);
    ctx.stroke();
    // End ticks
    ctx.moveTo(x - 50, y - 5); ctx.lineTo(x - 50, y + 5);
    ctx.moveTo(x + 50, y - 5); ctx.lineTo(x + 50, y + 5);
    ctx.stroke();
    if (label) {
      ctx.font = "bold 12px Inter";
      ctx.fillText(label, x - 20, y - 10);
    }
  };

  const drawAngle = (ctx: CanvasRenderingContext2D, x: number, y: number, label?: string) => {
    ctx.beginPath();
    ctx.moveTo(x + 50, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 35, y - 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, -Math.PI / 4, true);
    ctx.stroke();
    if (label) {
      ctx.font = "bold 12px Inter";
      ctx.fillText(label, x + 15, y - 10);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        {/* Unified Status Badge */}
        <SystemStatusBadge status={status} />
        
        {/* Scanning Reticle */}
        <div className="w-64 h-64 border-2 border-primary/40 rounded-3xl relative">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
