// src/ai/flows/content-understanding.ts
'use server';

/**
 * @fileOverview A content understanding AI agent.
 *
 * - understandContent - A function that handles the content understanding process.
 * - UnderstandContentInput - The input type for the understandContent function.
 * - UnderstandContentOutput - The return type for the understandContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandContentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document containing syllabus information, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type UnderstandContentInput = z.infer<typeof UnderstandContentInputSchema>;

const UnderstandContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the content in the document.'),
  topics: z.array(z.string()).describe('A list of topics covered in the document.'),
});
export type UnderstandContentOutput = z.infer<typeof UnderstandContentOutputSchema>;

export async function understandContent(input: UnderstandContentInput): Promise<UnderstandContentOutput> {
  return understandContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandContentPrompt',
  input: {schema: UnderstandContentInputSchema},
  output: {schema: UnderstandContentOutputSchema},
  prompt: `You are an expert educator.  You will analyze the document provided, summarize the content, and identify the topics covered in the document.

Document: {{media url=documentDataUri}}`,
});

const understandContentFlow = ai.defineFlow(
  {
    name: 'understandContentFlow',
    inputSchema: UnderstandContentInputSchema,
    outputSchema: UnderstandContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
