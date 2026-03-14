'use server';
/**
 * @fileOverview A Genkit flow for generating visual overlay suggestions for STEM concepts on identified objects.
 *
 * - generateVisualOverlaySuggestions - A function that handles the generation of visual overlay suggestions.
 * - GenerateVisualOverlaySuggestionsInput - The input type for the generateVisualOverlaySuggestions function.
 * - GenerateVisualOverlaySuggestionsOutput - The return type for the generateVisualOverlaySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualOverlaySuggestionsInputSchema = z.object({
  objectDescription: z.string().describe('A detailed description of the identified object.'),
  context: z.string().optional().describe('Additional context about the scene or user interest, which might influence the types of concepts to highlight.'),
});
export type GenerateVisualOverlaySuggestionsInput = z.infer<typeof GenerateVisualOverlaySuggestionsInputSchema>;

const OverlaySuggestionSchema = z.object({
  type: z.enum(['label', 'arrow', 'diagram_line', 'diagram_circle', 'diagram_rectangle']).describe('The type of visual overlay. Can be a label, an arrow, or a simple geometric diagram like a line, circle, or rectangle.'),
  text: z.string().describe('The text to display for the overlay (e.g., label text, arrow annotation, diagram description).'),
  concept: z.string().describe('The STEM concept highlighted by this overlay (e.g., "Gravity", "Leverage", "Friction", "Thermal Expansion").'),
  targetAreaDescription: z.string().describe('A textual description of where this overlay should be conceptually placed on the object (e.g., "top-right corner", "along the main axis", "across the center", "around the pivot point"). This will guide the UI in placing the overlay.'),
});

const GenerateVisualOverlaySuggestionsOutputSchema = z.object({
  overlaySuggestions: z.array(OverlaySuggestionSchema).describe('An array of suggested visual overlays, each describing its type, text, concept, and target placement.'),
});
export type GenerateVisualOverlaySuggestionsOutput = z.infer<typeof GenerateVisualOverlaySuggestionsOutputSchema>;

export async function generateVisualOverlaySuggestions(input: GenerateVisualOverlaySuggestionsInput): Promise<GenerateVisualOverlaySuggestionsOutput> {
  return generateVisualOverlaySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualOverlaySuggestionsPrompt',
  input: {schema: GenerateVisualOverlaySuggestionsInputSchema},
  output: {schema: GenerateVisualOverlaySuggestionsOutputSchema},
  prompt: `You are an expert visual explainer for STEM concepts. Your task is to generate interactive visual overlay suggestions for real-world objects, suitable for display on a camera feed. These overlays should highlight scientific principles in an easy-to-understand way.

Given the identified object and any additional context, suggest relevant labels, arrows, and simple geometric diagrams (lines, circles, rectangles) that can be drawn directly on the object to explain a STEM concept. For each suggestion, provide:
- The type of overlay (label, arrow, diagram_line, diagram_circle, diagram_rectangle).
- The exact text to display with the overlay.
- The specific STEM concept it illustrates.
- A clear, concise textual description of where this overlay should be placed on the object. Be as descriptive as possible to guide a visual rendering system.

Object Description: {{{objectDescription}}}
{{#if context}}
Context/User Interest: {{{context}}}
{{/if}}

Example Output Structure:
{
  "overlaySuggestions": [
    {
      "type": "label",
      "text": "Fulcrum",
      "concept": "Leverage",
      "targetAreaDescription": "At the pivot point of the lever arm."
    },
    {
      "type": "arrow",
      "text": "Force Applied",
      "concept": "Force",
      "targetAreaDescription": "Starting from the user's hand applying pressure and pointing towards the object."
    },
    {
      "type": "diagram_line",
      "text": "Moment Arm",
      "concept": "Torque",
      "targetAreaDescription": "A line segment perpendicular from the fulcrum to the line of action of the applied force."
    }
  ]
}

Your output MUST be a JSON object conforming to the described schema, with an array of overlay suggestions.`,
});

const generateVisualOverlaySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateVisualOverlaySuggestionsFlow',
    inputSchema: GenerateVisualOverlaySuggestionsInputSchema,
    outputSchema: GenerateVisualOverlaySuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
