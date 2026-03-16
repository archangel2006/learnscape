# 🌍Learnscape
Turn the world into your classroom.

Learnscape is an AI-powered visual learning system that helps users explore the physics, chemistry, and mathematics behind real-world objects. By pointing a camera at everyday objects, the system analyzes them using multimodal AI and generates contextual explanations, diagrams, and voice interactions to turn the environment into an interactive STEM learning experience.

---
## Deployed
https://learnscape-sage.vercel.app/

**⚠️ Note**: This project uses AI APIs with limited quota.
Please avoid excessive usage unless you are evaluating the project.

---

##  🚀 Core Features

1. **Object-Based Learning**: Users point their camera at a real-world object and the system identifies relevant scientific concepts related to it.
2. **AI Concept Generation**: The AI determines whether the object relates to physics, chemistry, or mathematics and suggests concepts that can be explored.
3. **Visual STEM Overlays**: The system generates educational diagram overlays such as force vectors, equations, structural diagrams, or chemical reactions directly on the camera feed.
4. **Voice Interaction**: Users can interact using voice to ask questions and receive spoken explanations.
5. **Interactive Concept Exploration**: Users can select different domains and explore multiple STEM concepts related to the same object.
6. **Learning Snapshot**: Users can capture the frame to save a visualized lesson including diagrams and explanations.

---

## 🤖 Generative AI Approach

Learnscape uses multimodal generative AI to dynamically create contextual learning content.

1. **Vision Understanding**: The system analyzes the camera feed to detect objects, materials, and structural features.
2. **Language Model Reasoning**: A large language model interprets the detected object and determines relevant STEM concepts.
3. **Agent-Based Logic**: An AI agent selects appropriate domains such as physics, chemistry, or mathematics and decides which concepts to explain.
4. **Generated Outputs**: The system produces voice explanations, concept summaries, visual diagram overlays, and chemical reaction visualizations.

---

## 🏗 System Architecture

```
                  Users (Learners / Students)
                                |
                                ▼
                 Frontend (Next.js Web Interface)
               - Camera Feed (Web Camera API)
               - Canvas Overlay Visualization
               - Concept Selection UI
               - Voice Interaction (Web Speech API)
                                |
                                ▼
                 Server Actions (Next.js Backend)
               - Handles AI requests
               - Manages scene analysis state
               - Coordinates AI pipeline
                                |
         ├───────────────────────────────────────────────┐
         ▼                                               ▼
 Vision & Scene Understanding                    AI Reasoning Layer
 (Object Detection)                              (Genkit + Gemini)

- Detect objects in camera frame                - Topic Generation
- Extract scene properties                      - Concept Explanation
- Identify materials & shapes                   - Educational reasoning
- Generate structured scene data                - Conversational responses

        │                                               │
        ▼                                               ▼
     Scene Analysis Data                           Explanation Output
   (Object, Materials, Properties)               STEM Concept Explanation
        │                                               │
        └───────────────────────┬───────────────────────┘
                                ▼
                      Visualization Engine
                    (Canvas / SVG Rendering)

                  - Concept animations
                  - Visual overlays
                  - Interactive learning cues
                                │
                                ▼
                     Voice Narration Layer
                       (Text-to-Speech)

                  - AI explanation spoken aloud
                  - Hands-free learning interaction

```
---
## Agent Architecture

<img width="1408" height="768" alt="Gemini_Generated_Image_n25gnkn25gnkn25g" src="https://github.com/user-attachments/assets/6e37da20-773e-4650-b129-3cc3f8cc5086" />

---

## 🛠 Tech Stack

| Layer | Technologies |
|------|-------------|
| **Frontend** | Next.js, HTML Canvas / SVG Overlays, Web Camera API, Web Speech API |
| **Backend** | Node.js, Genkit AI Framework |
| **AI Models** | Gemini API, Multimodal LLM, Vision Models, Speech-to-Text, Text-to-Speech |
| **Infrastructure** | Firebase Hosting, Cloud Run / Cloud Functions |

---

## 🧪 Reproducible Testing

To ensure the system functions correctly, follow these testing steps:

### 1. Environment Setup
- Ensure you have a valid `GEMINI_API_KEY` in your `.env` file.
- Run `npm install` to install dependencies.
- Start the development server: `npm run dev`.

### 2. AI Flow Testing
- Open the Genkit Developer UI: `npm run genkit:dev`.
- Test individual flows like `analyzeSceneFlow` by providing a sample image data URI.
- Verify that `generateTopicsFlow` and `explainConceptFlow` return structured JSON as expected.

### 3. End-to-End App Testing
- Navigate to `http://localhost:9002/scan`.
- **Camera Access**: Grant camera permissions when prompted. If on desktop, use a webcam.
- **Object Capture**: Point the camera at a distinct object (e.g., a mug, a plant, a keyboard) and click the camera button.
- **Verification**: 
    - Check that "Object Detected" status appears.
    - Confirm STEM subjects (Physics, Chemistry, Math) appear at the bottom.
    - Select a subject and then a concept; verify that voice narration starts and visual overlays appear on the canvas.
- **Voice Query**: Click the microphone icon, wait for "Listening...", and ask a question like "How is this made?". Verify the AI provides a contextual response.

---

##  ⚡ How It Works

1. User points the camera at an object.
2. The system analyzes the object using AI vision models.
3. The AI determines relevant STEM domains.
4. Users choose a concept to explore.
5. The system generates explanations and diagram overlays.
6. Users can ask follow-up questions using voice interaction.

---

## 🌱 Example Use Cases

- Understanding rotational motion by scanning a bicycle wheel
- Exploring structural forces in bridges and buildings
- Learning photosynthesis by scanning plant leaves
- Observing chemical reactions such as rust and corrosion

---

## 🔮 Future Improvements

- More advanced physics and chemistry simulations
- Adaptive learning paths personalized to the user
- Expanded STEM concept coverage
- Saving & Downloading scenes and conversations

---


