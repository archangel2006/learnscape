# 🏗️ AI Architecture & Pipeline

Learnscape uses a **Linear Agentic Pipeline** orchestrated by **Genkit**.

## 🔄 The Pipeline Flow

1.  **Scene Analysis (Multimodal Vision):**
    *   **Input:** Data URI Image.
    *   **Model:** Gemini 2.5 Flash (Vision).
    *   **Goal:** Extract `primary_object`, `materials`, and `visual_properties`.
    *   *Key Code (genkit.ts):* Uses `googleAI` plugin with multimodal support.

2.  **Topic Generation (Reasoning):**
    *   **Input:** Analysis results from Step 1.
    *   **Goal:** Brainstorm 4-6 concepts for Physics, Chemistry, and Math.
    *   **Prompting:** Uses **Few-Shot Prompting** logic to ensure topics are educational and concise.

3.  **Concept Explanation (Narrative):**
    *   **Input:** Object Context + User Choice.
    *   **Goal:** 100-word conversational explanation.
    *   **Pattern:** **Persona Prompting** ("You are an expert STEM educator").

4.  **Visual Overlay Generation (Structured Output):**
    *   **Input:** Object Context + Concept.
    *   **Goal:** Return an array of animation instructions (e.g., `gravity_field`, `wave_motion`).
    *   **Critical Detail:** The AI doesn't draw; it returns a **JSON Schema** that the React `OverlayCanvas` interprets.

## 🛠️ Prompt Engineering Techniques
*   **Role Prompting:** Assigning the AI a specific role (Curriculum Designer, STEM Tutor).
*   **Structured Output (JSON):** Using Zod schemas in Genkit to ensure the AI always returns data the code can parse without crashing.
*   **Contextual Injection:** We pass the "Scene Analysis" into every subsequent call so the AI "remembers" what it's looking at without re-running expensive vision calls.
