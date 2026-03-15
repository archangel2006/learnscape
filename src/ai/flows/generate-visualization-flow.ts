'use server';
/**
 * @fileOverview A Genkit flow for generating animated STEM visualization instructions based on detected objects and concepts.
 *
 * - generateVisualizations - A function that handles the visualization generation process.
 * - GenerateVisualizationsInput - The input type for the generateVisualizations function.
 * - GenerateVisualizationsOutput - The return type for the generateVisualizations function.
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
  anchor: z.enum(['center', 'top', 'bottom', 'left', 'right', 'inside']).describe('Where to anchor the visualization relative to the object focus frame.'),
  particleCount: z.number().optional().describe('Number of particles for field or motion effects.'),
  direction: z.enum(['up', 'down', 'left', 'right', 'clockwise', 'counter-clockwise']).optional(),
  label: z.string().optional().describe('Text label for annotations.'),
  showRadius: z.boolean().optional(),
  showHeight: z.boolean().optional(),
  intensity: z.number().min(0).max(1).optional().describe('Speed or magnitude of the animation (0 to 1).'),
  color: z.string().optional().describe('Suggested hex or CSS color for the visual.'),
});

const GenerateVisualizationsInputSchema = z.object({
  object: z.string().describe('The identified real-world object.'),
  subject: z.string().describe('The STEM subject (Physics, Chemistry, or Mathematics).'),
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
  prompt: `You are an expert at interactive STEM visualizations. Your task is to generate animated visual overlays that explain scientific concepts directly on a camera feed.

Object: {{{object}}}
Subject: {{{subject}}}
Concept: {{{concept}}}

Instructions:
- Generate 2 to 5 visualization elements that represent this concept in motion.
- Focus on intuitive, animated educational visuals.
- The visualizations will be anchored to the center focus reticle (the object's area).
- Use supported types: gravity_field, force_vectors, wave_motion, molecule_motion, bubbling_reaction, diffusion, electron_flow, geometry_cylinder, angle_rotation, circular_motion, label.

Example for "Kinetic Theory" on "Boiling Water":
- type: "molecule_motion", anchor: "inside", particleCount: 30, intensity: 0.8, label: "High Kinetic Energy"
- type: "bubbling_reaction", anchor: "bottom", intensity: 0.6
- type: "label", anchor: "top", label: "Phase Transition"

Example for "Cylinder Volume" on a "Cup":
- type: "geometry_cylinder", anchor: "center", showRadius: true, showHeight: true
- type: "label", anchor: "right", label: "V = πr²h"`,
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
