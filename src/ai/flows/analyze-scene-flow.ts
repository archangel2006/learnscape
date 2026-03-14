'use server';
/**
 * @fileOverview A Genkit flow for analyzing a camera frame to identify objects, materials, and properties.
 *
 * - analyzeScene - A function that handles the scene analysis process.
 * - AnalyzeSceneInput - The input type for the analyzeScene function.
 * - AnalyzeSceneOutput - The return type for the analyzeScene function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSceneInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a real-world scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSceneInput = z.infer<typeof AnalyzeSceneInputSchema>;

const AnalyzeSceneOutputSchema = z.object({
  primary_object: z.string().describe('The main identified object near the center.'),
  secondary_elements: z.array(z.string()).describe('Other visible elements if relevant.'),
  materials: z.array(z.string()).describe('A list of materials present in the identified object.'),
  visual_properties: z.array(z.string()).describe('Visible characteristics like shape, texture, or surface properties.'),
  confidence: z.number().describe('A confidence score between 0 and 1 for the identification.'),
});
export type AnalyzeSceneOutput = z.infer<typeof AnalyzeSceneOutputSchema>;

export async function analyzeScene(input: AnalyzeSceneInput): Promise<AnalyzeSceneOutput> {
  return analyzeSceneFlow(input);
}

const analyzeScenePrompt = ai.definePrompt({
  name: 'analyzeScenePrompt',
  input: { schema: AnalyzeSceneInputSchema },
  output: { schema: AnalyzeSceneOutputSchema },
  prompt: `You are an expert at visual object recognition. Your task is to identify the main object closest to the center of the image provided. 
The focus frame in the center represents the user's primary area of interest.

Analyze the image and return a JSON object with:
- "primary_object": The common name of the object.
- "secondary_elements": An array of other relevant elements visible in the scene.
- "materials": An array of materials the object is likely made of.
- "visual_properties": An array of visible characteristics like shape, surface texture, or transparency.
- "confidence": Your confidence score for this identification (a number between 0 and 1).

Photo: {{media url=photoDataUri}}`,
});

const analyzeSceneFlow = ai.defineFlow(
  {
    name: 'analyzeSceneFlow',
    inputSchema: AnalyzeSceneInputSchema,
    outputSchema: AnalyzeSceneOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeScenePrompt(input);
    return output!;
  }
);
