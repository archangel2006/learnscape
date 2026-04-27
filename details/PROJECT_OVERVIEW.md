# 🌍 Learnscape: Project Overview

Learnscape is a production-ready prototype of an AI-powered visual tutor.

## 🛠️ Tech Stack Explained
*   **Next.js 15:** Framework for SSR, Server Actions (used for AI calls), and fast routing.
*   **Genkit:** Firebase's AI orchestration framework. It handles retries, schemas, and model management.
*   **Gemini 2.5 Flash:** A high-speed, multimodal model optimized for low latency in vision and text tasks.
*   **Shadcn UI:** A component library providing accessible, beautiful building blocks (Dialogs, Sheets, Buttons).
*   **Web Speech API:** Browser-native API for listening to user queries and speaking AI responses.

## 🛠️ Setup Instructions
1.  **Clone & Install:** `npm install`
2.  **Env Config:** Create a `.env` file with `GEMINI_API_KEY`.
3.  **Run:** `npm run dev` (Access at port 9002).
4.  **AI Dev:** `npm run genkit:dev` to test individual AI flows in the Genkit UI.

---

## 👔 Interview Preparation

### ⭐ STAR Method
*   **Situation:** STEM education is often abstract. Students see a bridge or a car but don't "see" the physics or math behind it.
*   **Task:** Create an immersive application that turns the physical world into an interactive learning environment.
*   **Action:** I built a multimodal system using Next.js and Gemini. I implemented an agentic pipeline where a Vision model identifies objects, and specialized text models generate curriculum topics and animated visual overlays. I optimized the pipeline to cache vision results, saving API costs and reducing latency.
*   **Result:** A fully responsive web app where a user can point their camera at any object and immediately get a visual and auditory STEM lesson.

### 📈 SWOT Analysis
*   **Strengths:**
    *   Highly interactive and multimodal (Vision + Voice + Graphics).
    *   Cost-efficient pipeline (Vision cached).
    *   Clean, modern "Glassmorphism" UI.
*   **Weaknesses:**
    *   Requires browser camera permissions.
    *   Relies on API connectivity.
*   **Opportunities:**
    *   Integration with AR glasses (Apple Vision Pro/Quest).
    *   Gamification (Badges for scanning new object categories).
*   **Threats:**
    *   Rising costs of LLM tokens.
    *   Native integration of similar features in iOS/Android cameras.
