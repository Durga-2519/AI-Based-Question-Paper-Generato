
import Link from "next/link";
import { BrainCircuit, Target, Users } from "lucide-react";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-20">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Us</div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Empowering Educators with AI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  QuizCraft AI was born from a simple idea: to leverage the power of artificial intelligence to solve a real-world problem for educators. We believe that teachers' time is best spent inspiring students, not getting bogged down in administrative tasks.
                </p>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our mission is to provide an intuitive, powerful, and reliable tool that streamlines the creation of high-quality assessment materials, giving educators more time to focus on what truly matters.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://assets.techcircle.in/uploads/article-image/2024/06/images/34869-genai.jpg"
                  data-ai-hint="team collaboration"
                  width="600"
                  height="400"
                  alt="Our Team"
                  className="overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-12 md:grid-cols-2">
              <div className="space-y-4">
                  <Target className="h-10 w-10 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
                  <p className="text-muted-foreground">
                    To build the most intelligent and user-friendly question generation platform that saves educators countless hours and helps create more effective assessments for students worldwide.
                  </p>
              </div>
              <div className="space-y-4">
                  <Users className="h-10 w-10 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tighter">Our Team</h2>
                   <p className="text-muted-foreground">
                    We are a passionate group of developers, educators, and AI enthusiasts dedicated to improving the educational landscape. We combine cutting-edge technology with real-world teaching experience to build tools that make a difference.
                  </p>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
