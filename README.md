# QuizCraft AI

QuizCraft AI is a modern web application designed to help educators create professional-quality question papers and quizzes with the power of generative AI. It streamlines the assessment creation process, from content input to final review, giving teachers more time to focus on their students.

This project is built with Next.js, TypeScript, and ShadCN UI, utilizing Genkit for its AI capabilities.

## ✨ Core Features

*   **User Authentication**: Secure sign-up and login functionality with protected routes for authenticated users.
*   **AI-Powered Question Generation**:
    *   **Multiple Input Modes**: Generate questions by manually entering topics or by uploading syllabus documents (PDF, DOCX, TXT).
    *   **Content Analysis**: An AI agent analyzes uploaded documents to summarize content and extract key topics.
    *   **Customizable Generation**: Configure the subject, grade level, difficulty (easy, medium, hard), and question types (Multiple Choice, Short Answer, Long Answer, Fill in the Blanks).
*   **Interactive Review & Editing**:
    *   **Full Editing Control**: Manually edit the text of any generated question and its answer.
    *   **AI Regeneration**: Regenerate a specific question with a single click, asking the AI for a new version while keeping the same topic and difficulty.
    *   **Lock Questions**: Lock questions you are satisfied with to prevent accidental changes.
    *   **Save & Resume**: Save your work-in-progress question paper in the browser and automatically resume your session later.
*   **Answer Key Generation**: Automatically generate a formatted answer key for your question set.
*   **History**: Finalized question papers are saved to a personal history page for future reference.
*   **User Profile**: A dedicated page for users to view their account information.

## 💻 Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **AI Integration**: ( Google's Gemini models)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🚀 Getting Started

To get the application running locally:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up environment variables**:
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
This will start the Next.js application on `http://localhost:9002`.
