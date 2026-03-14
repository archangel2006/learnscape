'use server';
/**
 * @fileOverview A Genkit flow for processing voice queries about scanned objects.
 *
 * - voiceQueryForScannedObject - A function that handles natural language questions about scanned objects.
 * - VoiceQueryForScannedObjectInput - The input type for the voiceQueryForScannedObject function.
 * - VoiceQueryForScannedObjectOutput - The return type for the voiceQueryForScannedObject function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceQueryForScannedObjectInputSchema = z.object({
  voiceQuery: z
    .string()
    .describe(
      'The natural language question asked by the user about the scanned object.'
    ),
  scannedObjectInfo: z
    .string()
    .describe(
      'A description or summary of the scanned object, providing context for the AI.'
    ),
});
export type VoiceQueryForScannedObjectInput = z.infer<
  typeof VoiceQueryForScannedObjectInputSchema
>;

const VoiceQueryForScannedObjectOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      "A concise, AI-generated explanation in response to the user's question about the scanned object."
    ),
});
export type VoiceQueryForScannedObjectOutput = z.infer<
  typeof VoiceQueryForScannedObjectOutputSchema
>;

export async function voiceQueryForScannedObject(
  input: VoiceQueryForScannedObjectInput
): Promise<VoiceQueryForScannedObjectOutput> {
  return voiceQueryForScannedObjectFlow(input);
}

const voiceQueryPrompt = ai.definePrompt({
  name: 'voiceQueryPrompt',
  input: { schema: VoiceQueryForScannedObjectInputSchema },
  output: { schema: VoiceQueryForScannedObjectOutputSchema },
  prompt: `You are an expert educator on STEM topics. Your goal is to provide concise and accurate explanations for complex scientific concepts related to real-world objects.

The user has scanned an object, which is described as:
Object Information: {{{scannedObjectInfo}}}

The user is asking the following question about this object:
Question: "{{{voiceQuery}}}"

Please provide a concise, relevant, and easy-to-understand explanation to their question based on the object information.`,
});

const voiceQueryForScannedObjectFlow = ai.defineFlow(
  {
    name: 'voiceQueryForScannedObjectFlow',
    inputSchema: VoiceQueryForScannedObjectInputSchema,
    outputSchema: VoiceQueryForScannedObjectOutputSchema,
  },
  async (input) => {
    const { output } = await voiceQueryPrompt(input);
    return output!;
  }
);
