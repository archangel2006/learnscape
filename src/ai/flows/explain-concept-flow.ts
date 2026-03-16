'use server';
/**
 * @fileOverview A Genkit flow that generates a conversational STEM explanation for a specific concept.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainConceptInputSchema = z.object({
  analysis: z.object({
    primary_object: z.string(),
    materials: z.array(z.string()),
    visual_properties: z.array(z.string()),
  }).describe('The previously analyzed scene data.'),
  subject: z.string().describe('The STEM subject (Physics, Chemistry, or Mathematics).'),
  concept: z.string().describe('The specific concept to explain.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('A friendly, conversational explanation of the concept.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}

const explainConceptPrompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: { schema: ExplainConceptInputSchema },
  output: { schema: ExplainConceptOutputSchema },
  prompt: `You are an expert STEM educator. Your task is to explain a specific scientific concept related to a previously identified object.

Object: {{{analysis.primary_object}}}
Materials: {{#each analysis.materials}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Visual Properties: {{#each analysis.visual_properties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Subject: {{{subject}}}
Concept: {{{concept}}}

Instructions:
- Explain the concept in a friendly, conversational way.
- Relate the explanation directly to the identified object.
- Avoid textbook-style language; use clear sentences suitable for speech.
- Limit the response to 100–120 words maximum.

Structure:
1. A short introduction referencing the object.
2. A simple explanation of the concept.
3. A real-world example connected to the object.
4. One interesting insight or fact.`,
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
