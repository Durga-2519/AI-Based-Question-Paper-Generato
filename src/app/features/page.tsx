
import Link from "next/link";
import { BrainCircuit, Bot, FileUp, Edit, FileDown, CheckCircle, Type, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FeaturesPage() {
  const features = [
    {
      icon: <FileUp className="h-10 w-10 text-primary" />,
      title: "Multiple Input Modes",
      description: "Provide content by manually entering topics, or by uploading existing DOCX and PDF documents.",
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "AI Content Analysis",
      description: "Our intelligent system analyzes your input to deeply understand the subject matter and key topics.",
    },
    {
      icon: <Type className="h-10 w-10 text-primary" />,
      title: "Versatile Question Types",
      description: "Generate a wide variety of questions, including Multiple Choice, Short Answer, Long Answer, and Fill-in-the-Blanks.",
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: "Full Editing Control",
      description: "Easily edit, delete, reorder, or even regenerate individual questions to perfectly match your needs.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Automatic Answer Keys",
      description: "Save time with automatically generated answer keys for every question paper created.",
    },
    {
      icon: <FileDown className="h-10 w-10 text-primary" />,
      title: "Flexible Export Options",
      description: "Export your final question paper and answer key in either PDF or DOCX format, ready for printing or digital distribution.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-20">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Features to Streamline Your Workflow
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  QuizCraft AI is packed with tools designed to make question paper creation effortless and efficient.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
