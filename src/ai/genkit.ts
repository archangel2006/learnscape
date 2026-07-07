import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// A prioritized list of fallback Gemini models in case the primary model is out of credits/quota or rate-limited.
export const FALLBACK_MODELS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-pro',
  'googleai/gemini-2.0-flash',
  'googleai/gemini-1.5-flash',
  'googleai/gemini-1.5-pro',
];

/**
 * Runs a Genkit prompt function with automatic model fallback in case of errors.
 */
export async function runPromptWithFallback<TInput, TOutput>(
  promptFn: (input: TInput, options?: { model?: string }) => Promise<{ output?: TOutput | null }>,
  input: TInput
): Promise<{ output: TOutput }> {
  let lastError: any = null;
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`[AI Fallback] Attempting execution with model: ${model}`);
      const result = await promptFn(input, { model });
      if (result && result.output) {
        console.log(`[AI Fallback] Successfully executed using model: ${model}`);
        return { output: result.output };
      }
    } catch (err: any) {
      console.warn(`[AI Fallback] Model ${model} execution failed:`, err?.message || err);
      lastError = err;
    }
  }
  throw new Error(`All Gemini fallback models failed. Last error: ${lastError?.message || lastError}`);
}

