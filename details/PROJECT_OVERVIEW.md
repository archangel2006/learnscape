# 🌍 Learnscape: Project Overview

Learnscape is a production-ready prototype of an AI-powered visual tutor that bridges the gap between the physical world and abstract STEM education.

## 🏗️ The Tech Stack

| Technology | Role | Key Benefit |
| :--- | :--- | :--- |
| **Next.js 15** | App Framework | Server Actions for secure AI calls; optimized hydration. |
| **Genkit** | AI Framework | Type-safe AI flows; built-in observability and tracing. |
| **Gemini 2.5 Flash** | Multimodal LLM | Industry-leading vision-to-text speed and reasoning. |
| **Tailwind CSS** | Styling | Rapid utility-first HUD-style interface design. |
| **Web Speech API** | Voice UI | Native browser support for hands-free learning. |

---

## 👔 Interview Preparation

### ⭐ STAR Method (Professional Experience)
*   **Situation:** Traditional STEM education is often abstract. Students see a car or a bridge but don't "see" the physics principles like torque or structural tension.
*   **Task:** Build an immersive application that provides real-time scientific insights using a camera.
*   **Action:** I architected a **Multimodal Agentic Pipeline**. I implemented a sequential flow using **Genkit** where a Vision model performs scene analysis once, caching the context for downstream agents. I built a custom **Canvas visualization engine** that interprets AI-generated JSON to draw animated vector diagrams over the camera feed.
*   **Result:** A high-performance web app that identifies objects with 90%+ confidence and provides narrated, visualized STEM lessons in under 3 seconds.

### 📈 SWOT Analysis
*   **Strengths:**
    *   **Low Latency:** Optimized pipeline avoids redundant vision calls.
    *   **Immersive UI:** HUD-style overlays make learning feel like a video game.
    *   **Multimodal:** Combines Vision, Voice, and Graphics for all learning styles.
*   **Weaknesses:**
    *   **Camera Dependency:** Requires physical camera access and good lighting.
    *   **API Usage:** High reliance on external LLM availability.
*   **Opportunities:**
    *   **AR Integration:** Porting to WebXR for Apple Vision Pro or Meta Quest.
    *   **Gamification:** Adding "Knowledge Badges" for scanning unique categories.
*   **Threats:**
    *   **Privacy Concerns:** Users may be hesitant to share camera feeds.

---

## 📂 Documentation Deep Dives
*   [AI Architecture](./AI_ARCHITECTURE.md) - Understanding the Agentic Pipeline.
*   [AI Agents Explained](./AI_AGENT.md) - What is an Agent in plain English.
*   [Component Breakdown](./COMPONENTS.md) - Frontend and Rendering logic.
*   [Deployment Guide](./DEPLOYMENT.md) - Cloud Hosting & Secrets management.

---

## 🚀 Setup & Deployment
1.  **Clone:** `npm install`
2.  **API Key:** Add `GEMINI_API_KEY` to `.env`.
3.  **Dev Mode:** `npm run dev` (Port 9002).
4.  **Genkit UI:** `npm run genkit:dev` for flow testing and prompt debugging.
