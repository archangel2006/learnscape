'use server';
/**
 * @fileOverview A Genkit flow for generating interactive STEM visualization data based on detected objects and concepts.
 *
 * - generateVisualizations - A function that handles the visualization generation process.
 * - GenerateVisualizationsInput - The input type for the generateVisualizations function.
 * - GenerateVisualizationsOutput - The return type for the generateVisualizations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisualizationSchema = z.object({
  type: z.enum(['vector', 'angle', 'line', 'circle', 'particles', 'wave', 'field', 'label']),
  x: z.number().min(0).max(1).describe('Normalized X coordinate (0-1)'),
  y: z.number().min(0).max(1).describe('Normalized Y coordinate (0-1)'),
  direction: z.enum(['up', 'down', 'left', 'right', 'clockwise', 'counter-clockwise']).optional(),
  label: z.string().optional().describe('Text label for the visualization'),
  behavior: z.string().optional().describe('For particles: bubbling, floating, sinking, etc.'),
  amplitude: z.number().optional().describe('For waves: height of the wave'),
  color: z.string().optional().describe('Suggested hex or CSS color'),
});

const GenerateVisualizationsInputSchema = z.object({
  object: z.string().describe('The identified real-world object.'),
  subject: z.string().describe('The STEM subject (Physics, Chemistry, or Mathematics).'),
  concept: z.string().describe('The specific concept to visualize.'),
});
export type GenerateVisualizationsInput = z.infer<typeof GenerateVisualizationsInputSchema>;

const GenerateVisualizationsOutputSchema = z.object({
  visualizations: z.array(VisualizationSchema).describe('A list of 2-5 visualization elements.'),
});
export type GenerateVisualizationsOutput = z.infer<typeof GenerateVisualizationsOutputSchema>;

export async function generateVisualizations(input: GenerateVisualizationsInput): Promise<GenerateVisualizationsOutput> {
  return generateVisualizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualizationsPrompt',
  input: { schema: GenerateVisualizationsInputSchema },
  output: { schema: GenerateVisualizationsOutputSchema },
  prompt: `You are an expert at visual STEM education. Your task is to generate interactive visual overlays that explain scientific concepts directly on a camera feed.

Object: {{{object}}}
Subject: {{{subject}}}
Concept: {{{concept}}}

Instructions:
- Generate 2 to 5 visualization elements that represent this concept relative to the object.
- Use normalized coordinates (x, y) where (0.5, 0.5) is the center of the image.
- Choose appropriate visualization types from the supported list: vector, angle, line, circle, particles, wave, field, label.
- The visualizations should be scientifically accurate but simplified for an educational overlay.

Example for "Hydrostatic Pressure" on a "Water Bottle":
- A "vector" pointing down labeled "Gravity".
- "particles" with behavior "sinking" near the bottom.
- A "label" at the top showing "Atmospheric Pressure".`,
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
