
"use client";

import { useState } from "react";
import type { GenerateQuestionsOutput } from "@/ai/flows/question-generation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X, RefreshCw, Lock, Unlock, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Question = GenerateQuestionsOutput['questions'][0] & { locked?: boolean, isRegenerating?: boolean };

interface QuestionItemProps {
  question: Question;
  index: number;
  updateQuestion: (index: number, updatedQuestion: Question) => void;
  deleteQuestion: (index: number) => void;
  regenerateQuestion: (index: number) => void;
  toggleLock: (index: number) => void;
  showAnswer: boolean;
}

function AnswerDisplay({ answer, className }: { answer: string, className?: string }) {
  const isCodeBlock = answer.trim().startsWith('```') && answer.trim().endsWith('```');

  if (isCodeBlock) {
    const code = answer.trim().slice(3, -3).trim();
    const lang = answer.match(/^```(\w+)/)?.[1] || '';
    return (
      <pre className={cn("bg-muted p-3 rounded-md overflow-x-auto relative", className)}>
        {lang && <span className="absolute top-1 right-2 text-xs text-muted-foreground">{lang}</span>}
        <code className="font-code text-sm">{code}</code>
      </pre>
    );
  }

  const createMarkup = () => {
    const html = answer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="font-code bg-muted px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div 
      className={cn("text-sm text-muted-foreground whitespace-pre-wrap", className)}
      dangerouslySetInnerHTML={createMarkup()} 
    />
  );
}

export function QuestionItem({ question, index, updateQuestion, deleteQuestion, regenerateQuestion, toggleLock, showAnswer }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState<Question>(question);
  const { toast } = useToast();

  const handleSave = () => {
    updateQuestion(index, editableQuestion);
    setIsEditing(false);
    toast({
        title: "Question Saved",
        description: "Your changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditableQuestion(question);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (question.isRegenerating) {
    return <Skeleton className="h-32 w-full" />;
  }

  const renderQuestionContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <Textarea 
            value={editableQuestion.question}
            onChange={(e) => setEditableQuestion({...editableQuestion, question: e.target.value})}
            className="text-base"
            autoFocus
          />
          {editableQuestion.type === 'MCQ' && editableQuestion.options && (
            <div className="space-y-2">
              {editableQuestion.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                   <Input 
                     value={option}
                     onChange={(e) => {
                       const newOptions = [...(editableQuestion.options || [])];
                       newOptions[i] = e.target.value;
                       setEditableQuestion({...editableQuestion, options: newOptions});
                     }}
                   />
                </div>
              ))}
            </div>
          )}
          <Textarea 
            value={editableQuestion.answer || ""}
            onChange={(e) => setEditableQuestion({...editableQuestion, answer: e.target.value})}
            placeholder="Answer"
            className="text-sm min-h-[100px]"
          />
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <p className="font-medium text-lg">{index + 1}. {question.question}</p>
        {question.type === 'MCQ' && question.options && (
          <RadioGroup disabled className="space-y-2 ml-6">
            {question.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${index}-${i}`} />
                <Label htmlFor={`${index}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {showAnswer && question.answer && (
          <div className="pl-6 pt-2">
            <p className="text-sm font-semibold text-primary">Answer:</p>
            <AnswerDisplay answer={question.answer} />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className={cn("p-4 relative group transition-shadow hover:shadow-md", question.locked && "bg-muted/50")}>
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
            <div className="flex-grow pr-24">
                {renderQuestionContent()}
            </div>
            <Badge variant="secondary" className="absolute top-4 right-4 capitalize">{question.type.toLowerCase().replace('_', ' ')}</Badge>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Save question" disabled={question.locked}>
                    <Check className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have edited an AI-generated question. Please double-check the question and answer for accuracy before saving.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Save Changes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Cancel edit">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => toggleLock(index)} aria-label={question.locked ? "Unlock question" : "Lock question"}>
                {question.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => regenerateQuestion(index)} aria-label="Regenerate question" disabled={question.locked}>
                 <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit question" disabled={question.locked}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteQuestion(index)} aria-label="Delete question" disabled={question.locked}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
