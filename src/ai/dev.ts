import { config } from 'dotenv';
config();

import '@/ai/flows/explain-scanned-object-flow.ts';
import '@/ai/flows/voice-query-for-scanned-object-flow.ts';
import '@/ai/flows/generate-visual-overlay-suggestions-flow.ts';
import '@/ai/flows/analyze-scene-flow.ts';
import '@/ai/flows/generate-topics-flow.ts';
