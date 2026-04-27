# 🤖 What is an AI Agent?

In the context of **Learnscape**, an AI Agent is more than just a chatbot; it's a **reasoning engine** that uses a Large Language Model (LLM) to achieve specific goals by observing its environment and taking actions.

## 🧠 Key Concepts

### 1. The Reasoning Engine
An agent uses models like **Gemini 2.5 Flash** as its "brain." Instead of just predicting the next word, it follows logic to solve a task (e.g., "Identify this object, then find its physics properties").

### 2. Design Patterns used in Agents
*   **Chain-of-Thought (CoT):** This is when we prompt the AI to "think step-by-step." In Learnscape, the AI first analyzes the image, *then* breaks down the materials, and *then* derives the STEM topics.
*   **ReAct (Reason + Act):** While Learnscape uses a structured pipeline, the agent "acts" by generating structured JSON that the frontend "executes" (like drawing on the canvas).
*   **Sequential Multi-Agent System:** You can think of Learnscape as a team of specialized mini-agents:
    *   **The Vision Agent:** Analyzes the scene.
    *   **The Curriculum Agent:** Designs the STEM topics.
    *   **The Tutor Agent:** Explains the concepts.
    *   **The Visualizer Agent:** Decides how to animate the explanation.

## 💡 Simple Example for Interviews
"Imagine a regular AI is like a book—you can read it and get information. An **AI Agent** is like a research assistant. If you give the assistant a camera, they don't just tell you what they see; they research the science behind it, draw a diagram on a whiteboard for you, and explain it out loud. That 'active' workflow is what makes it an agent."

## 🚀 Why Learnscape is "Agentic"
It doesn't just return text. It:
1.  **Perceives** via the camera (Multimodal).
2.  **Reasons** about STEM domains.
3.  **Outputs** structured instructions for a UI to animate (Visual Overlays).
