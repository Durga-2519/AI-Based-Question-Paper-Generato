
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Coming Soon</h1>
          <p className="text-lg text-muted-foreground mt-2">This page is under construction.</p>
          <Link href="/">
              <span className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md">Go Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
