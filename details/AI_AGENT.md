# 🤖 What is an AI Agent?

In the context of **Learnscape**, an AI Agent is a **reasoning engine** that leverages a Large Language Model (LLM) to achieve specific goals by observing its environment and taking autonomous actions.

## 🧠 Core Concepts

### 1. Agency vs. Automation
*   **Automation:** A fixed script that always does X when Y happens (e.g., a "Contact Us" form).
*   **Agency:** The ability to determine *how* to solve a problem based on a high-level goal. In Learnscape, the agent doesn't just "show a label"; it reasons about *which* STEM domain (Physics vs. Math) is most relevant to the pixels it sees.

### 2. Design Patterns used in Learnscape
*   **Chain-of-Thought (CoT):** We guide the model to think through a sequence. Instead of asking "What is this?", we ask "1. Analyze the image. 2. Identify materials. 3. Derive STEM principles." This improves accuracy by allowing the model to "show its work."
*   **ReAct (Reason + Act):** While typically used for tool-calling, Learnscape uses a variant where the model **reasons** about a concept and then **acts** by generating a specific JSON schema that "commands" the browser to draw on the canvas.
*   **Sequential Multi-Agent Pipeline:**
    *   **Vision Specialist:** Interprets raw pixel data.
    *   **Curriculum Designer:** Brainstorms educational topics.
    *   **STEM Tutor:** Narrates the lesson.
    *   **Visual Engineer:** Directs the animated overlays.

## 💡 Interview Analogy
"If a standard AI is like a **static textbook**, Learnscape is like a **research assistant**. The textbook just gives you information if you turn to the right page. The assistant looks at what you're holding, researches its history and science, draws a diagram on a whiteboard for you, and explains it out loud. That 'active' workflow is the essence of an Agent."

## 🚀 Why Gemini 2.5 Flash?
We chose **Gemini 2.5 Flash** because it is a **Multimodal** native model. It doesn't need a separate "eyes" model and "brain" model; it processes images and text in the same high-dimensional space, reducing latency and increasing contextual understanding.