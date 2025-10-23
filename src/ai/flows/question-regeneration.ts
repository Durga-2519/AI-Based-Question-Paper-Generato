'use server';

/**
 * @fileOverview Question regeneration AI agent.
 *
 * - regenerateQuestion - A function that handles the question regeneration process.
 * - RegenerateQuestionInput - The input type for the regenerateQuestion function.
 * - RegenerateQuestionOutput - The return type for the regenerateQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for which the question should be regenerated.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the question.'),
  questionType: z.enum(['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks']).describe('The type of question to regenerate.'),
  syllabusContent: z.string().optional().describe('The syllabus or content to use for question regeneration.'),
  originalQuestion: z.string().describe('The original question to be replaced.'),
});
export type RegenerateQuestionInput = z.infer<typeof RegenerateQuestionInputSchema>;

const QuestionSchema = z.object({
  type: z.enum(['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks']),
  question: z.string(),
  answer: z.string().optional(),
  options: z.array(z.string()).optional(),
});
export type RegenerateQuestionOutput = z.infer<typeof QuestionSchema>;


export async function regenerateQuestion(input: RegenerateQuestionInput): Promise<RegenerateQuestionOutput> {
  return regenerateQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regenerateQuestionPrompt',
  input: {schema: RegenerateQuestionInputSchema},
  output: {schema: QuestionSchema},
  prompt: `You are an expert educator. Your task is to regenerate a single question.

The new question MUST be different from the original one but cover the same topic and difficulty.

Original Question: {{{originalQuestion}}}
Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Question Type: {{{questionType}}}
Syllabus Content: {{{syllabusContent}}}

Ensure the regenerated question is relevant, accurate, and appropriate for the specified difficulty level.
For the answer, use Markdown formatting to improve readability. Use **bold text** for emphasis on key terms. For answers that include code, please format them using Markdown code blocks (\`\`\`).

Output the single new question in the following JSON format:

{
  "type": "...",
  "question": "...",
  "answer": "...",
  "options": ["...", "...", "...", "..."]
}
`,
});

const regenerateQuestionFlow = ai.defineFlow(
  {
    name: 'regenerateQuestionFlow',
    inputSchema: RegenerateQuestionInputSchema,
    outputSchema: QuestionSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
