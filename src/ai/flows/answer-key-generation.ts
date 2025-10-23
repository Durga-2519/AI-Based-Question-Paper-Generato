'use server';

/**
 * @fileOverview A flow for generating an answer key for a set of questions.
 *
 * - generateAnswerKey - A function that generates an answer key for a given set of questions.
 * - GenerateAnswerKeyInput - The input type for the generateAnswerKey function.
 * - GenerateAnswerKeyOutput - The return type for the generateAnswerKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerKeyInputSchema = z.object({
  questions: z.array(z.string()).describe('An array of questions to generate answers for.'),
});

export type GenerateAnswerKeyInput = z.infer<typeof GenerateAnswerKeyInputSchema>;

const GenerateAnswerKeyOutputSchema = z.object({
  answerKey: z.array(z.string()).describe('An array of answers corresponding to the questions.'),
});

export type GenerateAnswerKeyOutput = z.infer<typeof GenerateAnswerKeyOutputSchema>;

export async function generateAnswerKey(input: GenerateAnswerKeyInput): Promise<GenerateAnswerKeyOutput> {
  return generateAnswerKeyFlow(input);
}

const answerKeyPrompt = ai.definePrompt({
  name: 'answerKeyPrompt',
  input: {schema: GenerateAnswerKeyInputSchema},
  output: {schema: GenerateAnswerKeyOutputSchema},
  prompt: `You are an expert at generating answer keys for question papers.

  Generate an answer key for the following questions:

  {% for question in questions %}
  {{ loop.index }}. {{ question }}
  {% endfor %}

  Return the answer key as a numbered list, with each answer corresponding to the question with the same number.
  Do not include the question in the answer key, only the answer.
  For the answers, use Markdown formatting to improve readability. Use **bold text** for emphasis on key terms. For answers that include code, please format them using Markdown code blocks (\`\`\`).
  The answer should be concise and to the point.

  Here is the answer key:
  `,
});

const generateAnswerKeyFlow = ai.defineFlow(
  {
    name: 'generateAnswerKeyFlow',
    inputSchema: GenerateAnswerKeyInputSchema,
    outputSchema: GenerateAnswerKeyOutputSchema,
  },
  async input => {
    const {output} = await answerKeyPrompt(input);
    return output!;
  }
);
