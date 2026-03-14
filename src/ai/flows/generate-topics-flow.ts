'use server';
/**
 * @fileOverview A Genkit flow for generating STEM learning topics based on a detected object.
 *
 * - generateTopics - A function that generates subject-specific concepts.
 * - GenerateTopicsInput - The input type for the generateTopics function.
 * - GenerateTopicsOutput - The return type for the generateTopics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTopicsInputSchema = z.object({
  objectName: z.string().describe('The name of the detected object.'),
  materials: z.array(z.string()).describe('Materials identified in the object.'),
  visualProperties: z.array(z.string()).describe('Visual characteristics of the object.'),
});
export type GenerateTopicsInput = z.infer<typeof GenerateTopicsInputSchema>;

const GenerateTopicsOutputSchema = z.object({
  physics: z.array(z.string()).describe('4-6 Physics concepts related to the object.'),
  chemistry: z.array(z.string()).describe('4-6 Chemistry concepts related to the object.'),
  mathematics: z.array(z.string()).describe('4-6 Mathematics concepts related to the object.'),
});
export type GenerateTopicsOutput = z.infer<typeof GenerateTopicsOutputSchema>;

export async function generateTopics(input: GenerateTopicsInput): Promise<GenerateTopicsOutput> {
  return generateTopicsFlow(input);
}

const generateTopicsPrompt = ai.definePrompt({
  name: 'generateTopicsPrompt',
  input: { schema: GenerateTopicsInputSchema },
  output: { schema: GenerateTopicsOutputSchema },
  prompt: `You are an expert STEM curriculum designer. Given a detected real-world object and its properties, generate relevant learning topics for three subjects: Physics, Chemistry, and Mathematics.

For each subject, provide an array of 4 to 6 concise, engaging concepts or principles that can be explored or demonstrated using this specific object.

Object: {{{objectName}}}
Materials: {{#each materials}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Visual Properties: {{#each visualProperties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Ensure the concepts are high-level but specific enough to be visualized or explained in a mobile learning app context.`,
});

const generateTopicsFlow = ai.defineFlow(
  {
    name: 'generateTopicsFlow',
    inputSchema: GenerateTopicsInputSchema,
    outputSchema: GenerateTopicsOutputSchema,
  },
  async (input) => {
    const { output } = await generateTopicsPrompt(input);
    return output!;
  }
);
