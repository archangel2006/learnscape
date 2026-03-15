"use client";

import React, { useEffect, useRef } from "react";
import { SystemStatusBadge, type SystemStatus } from "./SystemStatusBadge";

interface OverlayCanvasProps {
  status: SystemStatus;
  visualizations?: any[];
}

class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 0;
  maxLife: number = 0;
  size: number = 0;
  color: string = "";

  constructor(x: number, y: number, behavior: string, color: string) {
    this.reset(x, y, behavior, color);
  }

  reset(x: number, y: number, behavior: string, color: string) {
    this.x = x + (Math.random() - 0.5) * 100;
    this.y = y + (Math.random() - 0.5) * 100;
    this.color = color;
    this.maxLife = 50 + Math.random() * 50;
    this.life = this.maxLife;
    this.size = Math.random() * 3 + 1;

    switch (behavior) {
      case "gravity_field":
        this.vy = 2 + Math.random() * 3;
        this.vx = (Math.random() - 0.5) * 1;
        break;
      case "bubbling_reaction":
        this.vy = -(1 + Math.random() * 2);
        this.vx = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 5 + 2;
        break;
      case "diffusion":
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        break;
      case "molecule_motion":
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        break;
      case "electron_flow":
        this.vx = 4;
        this.vy = 0;
        break;
      default:
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }
  }

  update(x: number, y: number, behavior: string) {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;

    if (this.life <= 0) {
      this.reset(x, y, behavior, this.color);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function OverlayCanvas({ status, visualizations = [] }: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesMap = useRef<Map<string, Particle[]>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define the focus frame area (256x256 centered)
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;
      const frameSize = 256;
      const box = {
        x: centerX - frameSize / 2,
        y: centerY - frameSize / 2,
        w: frameSize,
        h: frameSize
      };

      if (visualizations.length > 0) {
        visualizations.forEach((viz, idx) => {
          const vizKey = `${viz.type}-${idx}`;
          const color = viz.color || "hsl(221, 72%, 50%)";
          
          // Calculate anchor point within the focus frame
          let ax = box.x + box.w / 2;
          let ay = box.y + box.h / 2;

          if (viz.anchor === 'top') ay = box.y + 20;
          if (viz.anchor === 'bottom') ay = box.y + box.h - 20;
          if (viz.anchor === 'left') ax = box.x + 20;
          if (viz.anchor === 'right') ax = box.x + box.w - 20;

          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";

          switch (viz.type) {
            case "gravity_field":
            case "molecule_motion":
            case "bubbling_reaction":
            case "diffusion":
            case "electron_flow":
              renderParticleSystem(ctx, vizKey, ax, ay, viz.type, color, viz.particleCount || 20);
              break;
            case "wave_motion":
              drawWave(ctx, ax, ay, viz.intensity || 0.5, time, viz.label);
              break;
            case "force_vectors":
              drawForceVector(ctx, ax, ay, viz.direction || "up", time, viz.label);
              break;
            case "geometry_cylinder":
              drawCylinder(ctx, box.x + box.w/2, box.y + box.h/2, 80, 140, viz.showRadius, viz.showHeight, time);
              break;
            case "angle_rotation":
              drawAngleRotation(ctx, ax, ay, time, viz.label);
              break;
            case "circular_motion":
              drawCircularMotion(ctx, ax, ay, 50, time, viz.label);
              break;
            case "label":
              drawLabel(ctx, ax, ay, viz.label || "");
              break;
          }
        });
      }

      requestRef.current = requestAnimationFrame(render);
    };

    const renderParticleSystem = (ctx: CanvasRenderingContext2D, key: string, x: number, y: number, behavior: string, color: string, count: number) => {
      let particles = particlesMap.current.get(key);
      if (!particles) {
        particles = Array.from({ length: count }, () => new Particle(x, y, behavior, color));
        particlesMap.current.set(key, particles);
      }

      particles.forEach(p => {
        p.update(x, y, behavior);
        p.draw(ctx);
      });
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [visualizations]);

  // Specific rendering helpers
  const drawWave = (ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number, time: number, label?: string) => {
    ctx.beginPath();
    const amp = 20 * intensity;
    const freq = 0.05;
    for (let i = -80; i < 80; i++) {
      const px = x + i;
      const py = y + Math.sin(time * 0.01 + i * freq) * amp;
      if (i === -80) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (label) drawLabel(ctx, x, y - amp - 20, label);
  };

  const drawForceVector = (ctx: CanvasRenderingContext2D, x: number, y: number, dir: string, time: number, label?: string) => {
    const pulse = Math.sin(time * 0.005) * 10;
    const len = 60 + pulse;
    let dx = 0, dy = 0;
    if (dir === "up") dy = -len;
    else if (dir === "down") dy = len;
    else if (dir === "left") dx = -len;
    else if (dir === "right") dx = len;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    const headlen = 12;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - headlen * Math.cos(angle - Math.PI / 6), y + dy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - headlen * Math.cos(angle + Math.PI / 6), y + dy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    if (label) drawLabel(ctx, x + dx, y + dy - 10, label);
  };

  const drawCylinder = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, h: number, showR?: boolean, showH?: boolean, time: number) => {
    const pulse = Math.sin(time * 0.002) * 5;
    const curR = r + pulse;
    const curH = h + pulse;

    ctx.setLineDash([5, 5]);
    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(x, y - curH/2, curR, curR/3, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Bottom ellipse
    ctx.beginPath();
    ctx.ellipse(x, y + curH/2, curR, curR/3, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Sides
    ctx.beginPath();
    ctx.moveTo(x - curR, y - curH/2); ctx.lineTo(x - curR, y + curH/2);
    ctx.moveTo(x + curR, y - curH/2); ctx.lineTo(x + curR, y + curH/2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showR) {
      ctx.beginPath();
      ctx.moveTo(x, y - curH/2); ctx.lineTo(x + curR, y - curH/2);
      ctx.stroke();
      drawLabel(ctx, x + curR/2, y - curH/2 - 10, "radius");
    }
    if (showH) {
      ctx.beginPath();
      ctx.moveTo(x + curR + 20, y - curH/2); ctx.lineTo(x + curR + 20, y + curH/2);
      ctx.stroke();
      drawLabel(ctx, x + curR + 30, y, "height");
    }
  };

  const drawAngleRotation = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number, label?: string) => {
    const angle = (time * 0.001) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 60, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(-angle) * 60, y + Math.sin(-angle) * 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, -angle, true);
    ctx.stroke();
    if (label) drawLabel(ctx, x + 30, y - 40, label);
  };

  const drawCircularMotion = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, time: number, label?: string) => {
    const angle = time * 0.002;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    
    if (label) drawLabel(ctx, x, y - r - 20, label);
  };

  const drawLabel = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    ctx.font = "bold 12px Inter";
    const metrics = ctx.measureText(text);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(x - metrics.width/2 - 6, y - 10, metrics.width + 12, 20, 4);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 4);
    ctx.textAlign = "start";
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <SystemStatusBadge status={status} />
        
        {/* Scanning Reticle / Focus Frame */}
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
