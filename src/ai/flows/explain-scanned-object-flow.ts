'use server';
/**
 * @fileOverview A Genkit flow that explains the STEM concepts behind a scanned real-world object.
 *
 * - explainScannedObject - A function that handles the explanation process.
 * - ExplainScannedObjectInput - The input type for the explainScannedObject function.
 * - ExplainScannedObjectOutput - The return type for the explainScannedObject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainScannedObjectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a real-world object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe("A textual description of the scanned object and any specific user questions."),
});
export type ExplainScannedObjectInput = z.infer<typeof ExplainScannedObjectInputSchema>;

const ExplainScannedObjectOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A concise and clear explanation of the underlying STEM concepts and principles relevant to the object.'
    ),
});
export type ExplainScannedObjectOutput = z.infer<typeof ExplainScannedObjectOutputSchema>;

export async function explainScannedObject(input: ExplainScannedObjectInput): Promise<ExplainScannedObjectOutput> {
  return explainScannedObjectFlow(input);
}

const explainScannedObjectPrompt = ai.definePrompt({
  name: 'explainScannedObjectPrompt',
  input: {schema: ExplainScannedObjectInputSchema},
  output: {schema: ExplainScannedObjectOutputSchema},
  prompt: `You are an expert STEM educator. Your task is to provide a concise and clear explanation of the underlying science (Physics, Chemistry, Biology, Mathematics, or Technology) behind a real-world object based on its image and description.

Explain the relevant STEM concepts and principles. Keep the explanation engaging and easy to understand for a broad audience.

Object Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const explainScannedObjectFlow = ai.defineFlow(
  {
    name: 'explainScannedObjectFlow',
    inputSchema: ExplainScannedObjectInputSchema,
    outputSchema: ExplainScannedObjectOutputSchema,
  },
  async input => {
    const {output} = await explainScannedObjectPrompt(input);
    return output!;
  }
);
