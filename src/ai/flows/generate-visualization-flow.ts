'use server';
/**
 * @fileOverview A Genkit flow for generating animated STEM visualization instructions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VisualizationTypeSchema = z.enum([
  'gravity_field',
  'force_vectors',
  'wave_motion',
  'molecule_motion',
  'bubbling_reaction',
  'diffusion',
  'electron_flow',
  'geometry_cylinder',
  'angle_rotation',
  'circular_motion',
  'label',
]);

const VisualizationSchema = z.object({
  type: VisualizationTypeSchema,
  anchor: z.enum(['center', 'top', 'bottom', 'left', 'right', 'inside']).describe('Where to anchor the visualization.'),
  particleCount: z.number().optional(),
  direction: z.enum(['up', 'down', 'left', 'right', 'clockwise', 'counter-clockwise']).optional(),
  label: z.string().optional(),
  showRadius: z.boolean().optional(),
  showHeight: z.boolean().optional(),
  intensity: z.number().min(0).max(1).optional(),
  color: z.string().optional(),
});

const GenerateVisualizationsInputSchema = z.object({
  analysis: z.object({
    primary_object: z.string(),
  }).describe('The previously analyzed scene data.'),
  subject: z.string().describe('The STEM subject.'),
  concept: z.string().describe('The specific concept to visualize.'),
});
export type GenerateVisualizationsInput = z.infer<typeof GenerateVisualizationsInputSchema>;

const GenerateVisualizationsOutputSchema = z.object({
  visualizations: z.array(VisualizationSchema).describe('A list of 2-5 animated visualization instructions.'),
});
export type GenerateVisualizationsOutput = z.infer<typeof GenerateVisualizationsOutputSchema>;

export async function generateVisualizations(input: GenerateVisualizationsInput): Promise<GenerateVisualizationsOutput> {
  return generateVisualizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualizationsPrompt',
  input: { schema: GenerateVisualizationsInputSchema },
  output: { schema: GenerateVisualizationsOutputSchema },
  prompt: `You are an expert at interactive STEM visualizations. Generate animated visual overlays that explain scientific concepts based on a previously identified object.

Object: {{{analysis.primary_object}}}
Subject: {{{subject}}}
Concept: {{{concept}}}

Generate 2 to 5 visualization elements. Use supported types: gravity_field, force_vectors, wave_motion, molecule_motion, bubbling_reaction, diffusion, electron_flow, geometry_cylinder, angle_rotation, circular_motion, label.`,
});

const generateVisualizationsFlow = ai.defineFlow(
  {
    name: 'generateVisualizationsFlow',
    inputSchema: GenerateVisualizationsInputSchema,
    outputSchema: GenerateVisualizationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
