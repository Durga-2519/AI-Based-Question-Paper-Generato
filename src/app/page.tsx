
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookCheck, Bot, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full pt-20 md:pt-32 lg:pt-40 xl:pt-48 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Professional Question Papers with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    QuizCraft AI helps you generate high-quality quizzes and exams from your syllabus or topics in minutes. Save time and create better assessments.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                   <Link href="/login">
                    <Button size="lg" variant="secondary" className="w-full min-[400px]:w-auto">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="https://blog.bismart.com/hubfs/IA%20Generativa%20e%20IA%20General.jpg"
                data-ai-hint="generative artificial intelligence"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How QuizCraft AI Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies the entire question paper creation process, from understanding your content to generating and exporting the final quiz.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Upload Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Start by uploading your syllabus or just typing in the topics you want to cover. Our AI will analyze the content to understand the key concepts.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                      <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Generate Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Choose question types (MCQs, short answers, etc.) and difficulty levels. Our AI generates relevant questions based on your input.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                      <BookCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Review & Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Review the generated questions, edit them as needed, and export your professional-looking question paper in PDF or DOCX format.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
