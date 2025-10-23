
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, FilePlus } from 'lucide-react';

type Question = {
  type: string;
  question: string;
  answer?: string;
  options?: string[];
};

type Paper = {
  id: string;
  title: string;
  questions: Question[];
  finalizedDate: string;
};

export default function HistoryPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedPapers = localStorage.getItem('paperHistory');
      if (storedPapers) {
        setPapers(JSON.parse(storedPapers));
      }
    } catch (error) {
      console.error('Failed to load paper history from local storage:', error);
      // Optionally, show a toast notification
    }
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30 pt-20">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <header className="flex flex-col items-center text-center mb-12">
              <History className="h-12 w-12 text-primary mb-4" />
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Question Paper History</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Review your previously finalized question papers.
              </p>
            </header>

            {papers.length > 0 ? (
              <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
                {papers.map((paper) => (
                  <AccordionItem value={paper.id} key={paper.id}>
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex justify-between w-full pr-4">
                        <span>{paper.title}</span>
                        <span className="text-sm text-muted-foreground font-normal">
                          Finalized on: {paper.finalizedDate}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card className="shadow-none border-none">
                        <CardContent className="pt-6 space-y-4">
                          {paper.questions.map((q, index) => (
                            <div key={index} className="p-4 rounded-lg border">
                              <p className="font-semibold">
                                {index + 1}. {q.question}
                              </p>
                              <Badge variant="outline" className="capitalize mt-2">
                                {q.type.toLowerCase().replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-2xl font-semibold">No History Found</h2>
                <p className="text-muted-foreground mt-2">
                  You haven't finalized any question papers yet.
                </p>
                <Link href="/questgen" passHref>
                  <Button className="mt-6">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create a New Paper
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

    