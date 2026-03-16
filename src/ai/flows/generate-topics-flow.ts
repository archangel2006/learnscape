'use server';
/**
 * @fileOverview A Genkit flow for generating STEM learning topics based on a detected object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTopicsInputSchema = z.object({
  analysis: z.object({
    primary_object: z.string(),
    materials: z.array(z.string()),
    visual_properties: z.array(z.string()),
  }).describe('The previously analyzed scene data.'),
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
  prompt: `You are an expert STEM curriculum designer. Given a detected real-world object and its properties from a previous visual analysis, generate relevant learning topics.

Object: {{{analysis.primary_object}}}
Materials: {{#each analysis.materials}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Visual Properties: {{#each analysis.visual_properties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

For each subject (Physics, Chemistry, Mathematics), provide an array of 4 to 6 concise, engaging concepts or principles that can be explored using this specific object.`,
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
