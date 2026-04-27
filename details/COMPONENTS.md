# 🧩 Component Architecture

The frontend is built with **Next.js 15 (App Router)** and **Tailwind CSS**.

## 📂 Layer Breakdown

### 1. The Interactive Layer (`/scan/page.tsx`)
This is the "Orchestrator" of the UI.
*   **Key Logic:** Manages state for `sceneAnalysis`, `visualizations`, and `conceptExplanation`.
*   **Snippet:**
```tsx
const [sceneAnalysis, setSceneAnalysis] = useState<AnalyzeSceneOutput | null>(null);
// Triggers the chain reaction
const handleCapture = async () => {
  const analysis = await analyzeScene({ photoDataUri: frame });
  setSceneAnalysis(analysis); // Caches for other agents
};
```

### 2. The Vision Layer (`CameraView.tsx`)
*   **Tech:** `navigator.mediaDevices.getUserMedia`.
*   **Function:** Captures frames as Base64 strings to send to the Gemini Vision model.

### 3. The Visualization Layer (`OverlayCanvas.tsx`)
*   **Tech:** HTML5 Canvas API + `requestAnimationFrame`.
*   **Key Feature:** Implements a **Particle System** and **Wave Renderer**.
*   **Snippet:**
```tsx
const render = (time: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  visualizations.forEach(viz => {
    if (viz.type === "wave_motion") drawWave(ctx, ax, ay, viz.intensity, time);
  });
  requestAnimationFrame(render);
};
```

### 4. The Voice Layer (`speech-service.ts` & `VoiceControls.tsx`)
*   **Speech-to-Text:** Uses `webkitSpeechRecognition`.
*   **Text-to-Speech:** Uses `window.speechSynthesis`.
