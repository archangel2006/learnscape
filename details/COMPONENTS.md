# 🧩 Component Architecture

The frontend is a **Next.js 15 (App Router)** application optimized for real-time interaction.

## 📂 Layered Breakdown

### 1. The Orchestrator (`/scan/page.tsx`)
This "Controller" manages the state transition from 'Idle' to 'Scanning' to 'Learning'.
```tsx
// Key State Management
const [sceneAnalysis, setSceneAnalysis] = useState<AnalyzeSceneOutput | null>(null);
const [visualizations, setVisualizations] = useState<any[]>([]);

// Parallel Execution Pattern
const handleConceptSelect = async (concept: string) => {
  const [explanation, viz] = await Promise.all([
    explainConcept({...}), 
    generateVisualizations({...})
  ]);
  setConceptExplanation(explanation);
  setVisualizations(viz.visualizations);
};
```

### 2. The Vision Layer (`CameraView.tsx`)
Uses the **Web MediaDevices API**. It exposes a `getFrame()` method via `useImperativeHandle`.
```tsx
// Capturing a frame for AI
const canvas = document.createElement("canvas");
ctx.drawImage(videoRef.current, 0, 0);
return canvas.toDataURL("image/jpeg", 0.8); // 80% quality for speed
```

### 3. The Graphics Engine (`OverlayCanvas.tsx`)
A custom **Canvas2D renderer**. Instead of SVG or DOM elements (which are slow for 100+ particles), we use a standard `requestAnimationFrame` loop.
*   **Coordinate Scaling:** We convert normalized AI coordinates (0 to 1) to screen pixels using `canvas.clientWidth`.
*   **Particle Systems:** Classes for `Particle` and `Wave` handle their own physics updates.

### 4. The Voice Layer (`speech-service.ts`)
We use the **Web Speech API** for zero-latency TTS (Text-to-Speech) and STT (Speech-to-Text).
*   **Accessibility:** Allows hands-free operation while the user is holding their phone up to an object.

## 🎨 Design System
*   **Glassmorphism:** `bg-black/60 backdrop-blur-md border-white/10`. This style was chosen to make the UI feel like a futuristic AR HUD (Heads-Up Display) without requiring heavy 3D engines.
*   **Shadcn UI:** Used for complex components like `Dialog` (for the long-form analysis) and `Sheet` (for mobile-responsive menus).