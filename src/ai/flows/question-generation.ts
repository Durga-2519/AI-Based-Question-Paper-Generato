'use server';

/**
 * @fileOverview Question generation AI agent.
 *
 * - generateQuestions - A function that handles the question generation process.
 * - GenerateQuestionsInput - The input type for the generateQuestions function.
 * - GenerateQuestionsOutput - The return type for the generateQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which questions should be generated.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the questions.'),
  questionTypes: z
    .array(z.enum(['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks']))
    .describe('The types of questions to generate.'),
  syllabusContent: z.string().optional().describe('The syllabus or content to use for question generation.'),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

const QuestionSchema = z.object({
  type: z.enum(['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks']),
  question: z.string(),
  answer: z.string().optional(),
  options: z.array(z.string()).optional(),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The generated questions.'),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: GenerateQuestionsInputSchema},
  output: {schema: GenerateQuestionsOutputSchema},
  prompt: `You are an expert educator specializing in generating questions for various subjects and difficulty levels.

You will generate questions based on the provided topic, difficulty, question types, and syllabus content (if provided).

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Question Types: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Syllabus Content: {{{syllabusContent}}}

Ensure that the generated questions are relevant, accurate, and appropriate for the specified difficulty level.
For the answers, use Markdown formatting to improve readability. Use bold text for emphasis on key terms. For answers that include code, please format them using Markdown code blocks (\`\`\`).

Output the questions in the following JSON format:

{
  "questions": [
    {
      "type": "MCQ",
      "question": "...",
      "answer": "...",
      "options": ["...", "...", "...", "..."]
    },
    {
      "type": "Short Answer",
      "question": "...",
      "answer": "..."
    },
    {
      "type": "Long Answer",
      "question": "...",
      "answer": "..."
    },
    {
      "type": "Fill in the Blanks",
      "question": "...",
      "answer": "..."
    }
  ]
}
`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
