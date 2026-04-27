# 🚀 Deployment & Cloud Infrastructure

Learnscape is a production-grade Next.js 15 application designed to be deployed on high-performance serverless platforms.

## ☁️ Deployment Targets

### 1. Firebase App Hosting (Recommended)
Learnscape is optimized for **Firebase App Hosting**, which automatically manages the infrastructure for Next.js 15 apps, including Server Actions and environment secrets.

#### Why Firebase App Hosting?
*   **Zero-Config Next.js:** Handles the complex build process of Next.js 15.
*   **Secret Manager Integration:** Securely injects `GEMINI_API_KEY` without exposing it in the codebase.
*   **Global CDN:** Serves the landing page and static assets from the edge.

#### Step-by-Step Setup
1.  **Project Creation:** Create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  **App Hosting Setup:** Navigate to the "App Hosting" tab and click "Get Started".
3.  **GitHub Connection:** Connect your repository and select the branch to deploy.
4.  **Secrets Configuration:**
    *   The deployment will look for an `apphosting.yaml` file.
    *   Add your `GEMINI_API_KEY` in the Firebase Console under the App Hosting settings to ensure Genkit can authenticate with Google AI.

### 2. Vercel Deployment
As a standard Next.js application, Learnscape can be deployed to Vercel with a single click.

*   **Configuration:** Vercel automatically detects the App Router and optimizes the build.
*   **Env Vars:** Add `GEMINI_API_KEY` in **Project Settings > Environment Variables**.

## ⚙️ Project Configuration Files

### `apphosting.yaml`
Located in the root, this file defines the runtime environment for the backend.
```yaml
runConfig:
  maxInstances: 2 # Limits scaling to manage API quota costs
  cpu: 1          # Standard compute for Genkit flows
  memory: 1Gi     # Adequate for multimodal processing
```

### `next.config.ts`
We have configured image optimization to allow remote patterns from placeholder services and Unsplash, ensuring the UI remains performant across different network conditions.

## 🛡️ Security Considerations

*   **API Key Protection:** `GEMINI_API_KEY` is strictly handled as a server-side environment variable. It is **never** exposed to the client-side browser bundle.
*   **CORS & Origins:** The camera feed processing happens locally in the browser, and the resulting Base64 data is sent over encrypted HTTPS to the Server Actions.

## 📈 Monitoring & Observability
*   **Genkit Tracing:** In a production environment, you can enable Genkit tracing to monitor the latency and token usage of your `analyzeScene` and `explainConcept` flows.
*   **Vercel Analytics / Google Analytics:** Used to track user engagement on the landing page vs. the scanner app.