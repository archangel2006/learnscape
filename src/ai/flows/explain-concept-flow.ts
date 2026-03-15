'use server';
/**
 * @fileOverview A Genkit flow that generates a conversational STEM explanation for a specific concept related to a scanned object.
 *
 * - explainConcept - A function that handles the explanation generation process.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainConceptInputSchema = z.object({
  objectName: z.string().describe('The name of the detected object.'),
  materials: z.array(z.string()).describe('Materials identified in the object.'),
  visualProperties: z.array(z.string()).describe('Visual characteristics of the object.'),
  subject: z.string().describe('The STEM subject (Physics, Chemistry, or Mathematics).'),
  concept: z.string().describe('The specific concept to explain.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('A friendly, conversational explanation of the concept tailored to the object.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}

const explainConceptPrompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: { schema: ExplainConceptInputSchema },
  output: { schema: ExplainConceptOutputSchema },
  prompt: `You are an expert STEM educator. Your task is to explain a specific scientific concept to a student who is looking at a real-world object through their camera.

Object: {{{objectName}}}
Materials: {{#each materials}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Visual Properties: {{#each visualProperties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Subject: {{{subject}}}
Concept: {{{concept}}}

Instructions:
- Explain the concept in a friendly and conversational way, like a teacher guiding a student.
- Relate the explanation directly to the scanned object whenever possible.
- Avoid textbook-style language; use clear, natural sentences suitable for speech narration.
- The explanation should last approximately 45–60 seconds when read aloud.

Structure:
1. A short introduction referencing the object.
2. A simple explanation of the concept.
3. A real-world example connected to the object.
4. One interesting insight or fact to keep the user engaged.`,
});

const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async (input) => {
    const { output } = await explainConceptPrompt(input);
    return output!;
  }
);
