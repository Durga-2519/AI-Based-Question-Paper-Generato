

"use client";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrainCircuit, Upload, FileText, Loader2, Lightbulb, Trash2, Pencil, Download, Settings, Wand2, Plus, Save, Check, X, RefreshCw, Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { understandContent } from "@/ai/flows/content-understanding";
import { generateQuestions, type GenerateQuestionsOutput } from "@/ai/flows/question-generation";
import { regenerateQuestion } from "@/ai/flows/question-regeneration";
import { QuestionItem } from "@/components/question-item";

const questionTypes = [
  { id: "MCQ", label: "Multiple Choice" },
  { id: "Short Answer", label: "Short Answer" },
  { id: "Long Answer", label: "Long Answer" },
  { id: "Fill in the Blanks", label: "Fill in the Blanks" },
] as const;

type QuestionType = (typeof questionTypes)[number]['id'];

const formSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  grade: z.string().min(1, { message: "Grade is required." }),
  syllabusContent: z.string().min(20, { message: "Syllabus content must be at least 20 characters." }),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
});

type Question = GenerateQuestionsOutput['questions'][0] & { locked?: boolean, isRegenerating?: boolean };

export default function QuestGenPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [paperTitle, setPaperTitle] = useState("Generated Question Paper");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(paperTitle);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      grade: "",
      syllabusContent: "",
      difficulty: "medium",
      questionTypes: ["MCQ", "Short Answer"],
    },
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('savedQuestPaper');
      if (savedData) {
        const savedPaper = JSON.parse(savedData);
        if(savedPaper && Array.isArray(savedPaper.questions) && savedPaper.questions.length > 0) {
            setGeneratedQuestions(savedPaper.questions);
            setPaperTitle(savedPaper.title || "Generated Question Paper");
            setEditableTitle(savedPaper.title || "Generated Question Paper");
            toast({ title: "Loaded Saved Paper", description: "Your previously saved question paper has been loaded." });
        }
      }
    } catch (error) {
      console.error("Failed to load data from local storage:", error);
      toast({ variant: "destructive", title: "Load Failed", description: "Could not load saved data from your browser." });
    }
  }, [toast]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ variant: "destructive", title: "File too large", description: "Please upload a file smaller than 5MB." });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const documentDataUri = reader.result as string;
        const result = await understandContent({ documentDataUri });
        if (result.summary && result.topics) {
          form.setValue('syllabusContent', result.topics.join('\n- '));
          toast({ title: "Content Understood", description: `Summary: ${result.summary.slice(0, 100)}...` });
        } else {
          throw new Error("Could not process document.");
        }
      };
      reader.onerror = (error) => {
        throw new Error("Failed to read file.");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not analyze the document. Please try again or enter topics manually." });
      console.error(error);
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    try {
      const result = await generateQuestions({
        topic: values.subject,
        difficulty: values.difficulty,
        questionTypes: values.questionTypes as QuestionType[],
        syllabusContent: values.syllabusContent,
      });
      if (result.questions && result.questions.length > 0) {
        setGeneratedQuestions(result.questions.map(q => ({...q, locked: false, isRegenerating: false})));
        toast({ title: "Success!", description: "Your question paper has been generated." });
      } else {
        throw new Error("AI returned no questions.");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate questions. Please try adjusting your inputs." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (index: number) => {
    const originalQuestion = generatedQuestions[index];
    if (originalQuestion.locked) {
      toast({ variant: "default", title: "Cannot Regenerate", description: "This question is locked." });
      return;
    }

    const newQuestions = [...generatedQuestions];
    newQuestions[index] = { ...newQuestions[index], isRegenerating: true };
    setGeneratedQuestions(newQuestions);

    try {
      const { subject, difficulty, syllabusContent } = form.getValues();
      const result = await regenerateQuestion({
        topic: subject,
        difficulty,
        questionType: originalQuestion.type,
        syllabusContent,
        originalQuestion: originalQuestion.question
      });
      
      const updatedQuestions = [...generatedQuestions];
      updatedQuestions[index] = { ...result, locked: false, isRegenerating: false };
      setGeneratedQuestions(updatedQuestions);

      toast({ title: "Question Regenerated", description: "A new version of the question has been created." });
    } catch (error) {
      console.error("Error regenerating question:", error);
      toast({ variant: "destructive", title: "Regeneration Failed", description: "Could not regenerate the question. Please try again." });
      const newQuestions = [...generatedQuestions];
      newQuestions[index] = { ...newQuestions[index], isRegenerating: false };
      setGeneratedQuestions(newQuestions);
    }
  };
  
  const toggleLock = (index: number) => {
    const newQuestions = [...generatedQuestions];
    newQuestions[index] = { ...newQuestions[index], locked: !newQuestions[index].locked };
    setGeneratedQuestions(newQuestions);
    toast({
      title: `Question ${newQuestions[index].locked ? 'Locked' : 'Unlocked'}`,
      description: `The question has been ${newQuestions[index].locked ? 'locked and is now read-only' : 'unlocked and can be edited'}.`,
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...generatedQuestions];
    newQuestions[index] = updatedQuestion;
    setGeneratedQuestions(newQuestions);
  };
  
  const deleteQuestion = (index: number) => {
    setGeneratedQuestions(generatedQuestions.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      type: "Short Answer",
      question: "New editable question...",
      answer: "Provide answer here.",
      locked: false,
      isRegenerating: false,
    };
    setGeneratedQuestions([...generatedQuestions, newQuestion]);
  }
  
  const savePaper = () => {
    try {
        const paperToSave = {
            title: paperTitle,
            questions: generatedQuestions
        };
        localStorage.setItem('savedQuestPaper', JSON.stringify(paperToSave));
        toast({ title: "Question Paper Saved!", description: "Your question paper has been saved in this browser." });
    } catch (error) {
        console.error("Failed to save to local storage:", error);
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save to your browser's storage." });
    }
  };

  const handleTitleSave = () => {
    setPaperTitle(editableTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditableTitle(paperTitle);
    setIsEditingTitle(false);
  };

  const finalizePaper = () => {
    try {
      const history = JSON.parse(localStorage.getItem('paperHistory') || '[]');
      const newHistoryEntry = {
        id: new Date().toISOString(),
        title: paperTitle,
        questions: generatedQuestions,
        finalizedDate: new Date().toLocaleDateString(),
      };
      history.unshift(newHistoryEntry);
      localStorage.setItem('paperHistory', JSON.stringify(history));
      localStorage.removeItem('savedQuestPaper');
      
      toast({
        title: 'Paper Finalized & Saved!',
        description: 'Your paper has been moved to your history.',
      });

      setGeneratedQuestions([]);
      setPaperTitle('Generated Question Paper');
      
      router.push('/history');

    } catch (error) {
        console.error("Failed to finalize paper:", error);
        toast({ variant: "destructive", title: "Finalize Failed", description: "Could not save the paper to history." });
    }
  };

  const allQuestionsLocked = generatedQuestions.length > 0 && generatedQuestions.every(q => q.locked);

  return (
    <main className="min-h-full bg-secondary/30 pt-28">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">QuizCraft AI</h1>
          </div>
          <p className="text-lg text-muted-foreground">The smart way to create professional question papers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 sticky top-28">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    <CardTitle>Quiz Configuration</CardTitle>
                </div>
                <CardDescription>Define the scope and content for your quiz.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl><Input placeholder="e.g., Physics" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="grade" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade/Class</FormLabel>
                          <FormControl><Input placeholder="e.g., 12th Grade" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="syllabusContent" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between items-center">
                          <span>Syllabus & Topics</span>
                           <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Upload
                          </Button>
                          <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                        </FormLabel>
                        <FormControl><Textarea placeholder="Enter topics, or upload a syllabus file..." className="min-h-[120px] resize-y" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="difficulty" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="questionTypes" render={() => (
                      <FormItem>
                        <div className="mb-4"><FormLabel>Question Types</FormLabel></div>
                        <div className="grid grid-cols-2 gap-4">
                        {questionTypes.map((item) => (
                          <FormField key={item.id} control={form.control} name="questionTypes" render={({ field }) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }} />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                          )} />
                        ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" disabled={isGenerating || isUploading} className="w-full">
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Generate Questions
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div id="question-paper" className="lg:col-span-3">
            <Card className="shadow-lg min-h-[600px]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3 group">
                        <FileText className="h-6 w-6" />
                        {isEditingTitle ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editableTitle} 
                              onChange={(e) => setEditableTitle(e.target.value)}
                              className="text-2xl font-semibold p-0 h-auto border-0 focus-visible:ring-0"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                            />
                            <Button variant="ghost" size="icon" onClick={handleTitleSave}><Check className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={handleTitleCancel}><X className="h-4 w-4" /></Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CardTitle>{paperTitle}</CardTitle>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditingTitle(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                    </div>
                  {generatedQuestions.length > 0 && (
                     <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={savePaper}><Save className="mr-2 h-4 w-4"/>Save Draft</Button>
                        <div className="flex items-center space-x-2 ml-4">
                            <Checkbox id="includeAnswers" checked={includeAnswers} onCheckedChange={(checked) => setIncludeAnswers(Boolean(checked))} />
                            <label htmlFor="includeAnswers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Show Answers
                            </label>
                        </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating && (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                )}

                {!isGenerating && generatedQuestions.length === 0 && (
                  <div className="text-center py-20">
                    <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Your questions will appear here</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Fill out the form to start generating, or load a saved session.</p>
                  </div>
                )}
                
                {generatedQuestions.length > 0 && (
                  <div className="space-y-6">
                    {generatedQuestions.map((q, index) => (
                      <QuestionItem 
                        key={`${q.question.slice(0, 10)}-${index}`} 
                        question={q} 
                        index={index}
                        updateQuestion={updateQuestion}
                        deleteQuestion={deleteQuestion}
                        regenerateQuestion={handleRegenerate}
                        toggleLock={toggleLock}
                        showAnswer={includeAnswers}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              {generatedQuestions.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <Button variant="outline" onClick={addQuestion}>
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                    <Button onClick={finalizePaper} disabled={!allQuestionsLocked}>
                        <Check className="mr-2 h-4 w-4" /> Finalize Paper
                    </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

    

    