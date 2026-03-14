# 🌍Learnscape
Turn the world into your classroom.

Learnscape is an AI-powered visual learning system that helps users explore the physics, chemistry, and mathematics behind real-world objects. By pointing a camera at everyday objects, the system analyzes them using multimodal AI and generates contextual explanations, diagrams, and voice interactions to turn the environment into an interactive STEM learning experience.

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

Generative AI enables Learnscape to generate educational explanations for any real-world object instead of relying on predefined content.

---

## 🏗 System Architecture

```
User Camera Input  
      ↓  
Frontend Interface (Camera + Overlay)
      ↓  
Frame Capture  
      ↓  
Vision Model Analysis  
      ↓  
AI Agent Reasoning  
      ↓  
Concept Selection  
      ↓  
Generated Outputs  
• Voice explanation  
• Diagram overlays  
• Concept summaries  
```
---

## 🛠 Tech Stack

| Layer | Technologies |
|------|-------------|
| **Frontend** | Next.js, HTML Canvas / SVG Overlays, Web Camera API, Web Speech API |
| **Backend** | Node.js, Genkit AI Framework |
| **AI Models** | Gemini API, Multimodal LLM, Vision Models, Speech-to-Text, Text-to-Speech |
| **Infrastructure** | Firebase Hosting, Cloud Run / Cloud Functions |

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

- Real-time AR object tracking
- Expanded STEM concept coverage
- Personalized learning paths
- Integration with educational platforms

---

## License
