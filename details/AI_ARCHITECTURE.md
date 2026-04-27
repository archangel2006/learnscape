# 🏗️ AI Architecture & Pipeline

Learnscape uses a **Linear Agentic Pipeline** orchestrated by **Genkit**. This architecture ensures that high-cost Vision operations happen once, while low-cost Text operations happen dynamically.

## 🔄 The Multi-Stage Pipeline

### Stage 1: Multimodal Vision (The "Observer")
The system captures a Base64 frame and sends it to Gemini.
```typescript
// Key Logic in analyze-scene-flow.ts
const analyzeScenePrompt = ai.definePrompt({
  name: 'analyzeScenePrompt',
  prompt: `Analyze the image... return JSON with primary_object, materials, and confidence.
           Photo: {{media url=photoDataUri}}`,
});
```
*   **Why?** This creates the "Source of Truth" context for the rest of the session.

### Stage 2: Topic Generation (The "Planner")
We pass the output of Stage 1 (Text) into the next agent. We **do not** pass the image again to save bandwidth and tokens.
*   **Technique:** **Role Prompting**. We tell the AI: "You are an expert STEM curriculum designer."
*   **Technique:** **Structured Output**. Using Zod schemas ensures the UI never breaks.

### Stage 3: Dynamic Explanation & Visualization (The "Executors")
When a user clicks a topic, two agents run in parallel:
1.  **Narrator Agent:** Generates 100-120 words of speech-optimized text.
2.  **Visualizer Agent:** Generates an array of "Animation Instructions."

```typescript
// Example Visualizer Output Schema
const VisualizationSchema = z.object({
  type: z.enum(['gravity_field', 'wave_motion', ...]),
  anchor: z.enum(['center', 'top', ...]),
  intensity: z.number().min(0).max(1)
});
```

## 🛠️ Prompt Engineering Deep-Dive

*   **Context Injection:** We "hydrate" every prompt with the initial Analysis.
    *   *Input:* `analysis: { primary_object: "Cup", materials: ["Ceramic"] }`
    *   *Prompt:* "Explain the thermodynamics of a {{{analysis.primary_object}}} made of {{#each analysis.materials}}{{{this}}}{{/each}}."
*   **Few-Shotting:** In our prompts, we provide examples of "Good" vs "Bad" topics to guide the AI toward educational rigor.
*   **Negative Constraints:** We explicitly tell the AI: "Avoid textbook jargon," and "Limit to 120 words" to ensure the Voice UI is snappy and engaging.

## 📊 Token Management
By performing vision analysis **only once** and passing text context to subsequent stages, we reduce our token consumption per user session by approximately **70%** compared to a naive approach where the image is sent with every question.