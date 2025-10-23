import { config } from 'dotenv';
config();

import '@/ai/flows/question-generation.ts';
import '@/ai/flows/question-regeneration.ts';
import '@/ai/flows/answer-key-generation.ts';
import '@/ai/flows/content-understanding.ts';
