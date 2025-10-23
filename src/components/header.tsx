

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, LogOut, User, History } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return null;
}

function deleteCookie(name: string) {
    if (typeof document === 'undefined') return;
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      setIsAuthenticated(!!getCookie("auth"));
      setUserEmail(getCookie("userEmail"));
    };
    checkAuth();
    
    // In case the cookie is set on another tab, we can listen for changes
    window.addEventListener('storage', checkAuth);
    // Also re-check on navigation
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("auth");
    deleteCookie("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
    window.location.href = '/login';
  };

  const AuthNav = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">AI Educator</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail || 'm@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/history"><History className="mr-2 h-4 w-4" /> History</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const PublicNav = () => (
    <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
      <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        Pricing
      </Link>
      <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        About
      </Link>
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
       <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </nav>
  );
  
  const AuthHeaderLinks = () => (
    <>
      <Link href="/questgen" className="text-sm font-medium hover:underline underline-offset-4">
        Quiz Generator
      </Link>
      <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        Pricing
      </Link>
      <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
        About
      </Link>
    </>
  )

  const MobileNav = () => (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-4 py-6">
            {isAuthenticated ? (
               <AuthHeaderLinks />
            ) : (
              <>
                <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Features</Link>
                <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Pricing</Link>
                <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>About</Link>
                <hr/>
                <Link href="/login"><Button variant="outline" className="w-full">Login</Button></Link>
                <Link href="/signup"><Button className="w-full">Sign Up</Button></Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <BrainCircuit className="h-6 w-6" />
              <span className="font-semibold text-lg">QuizCraft AI</span>
            </Link>
             <nav className="hidden md:flex gap-6 items-center">
                {isClient && isAuthenticated ? <AuthHeaderLinks/> : null }
             </nav>
             <div className="flex items-center gap-4">
                {isClient && isAuthenticated ? <AuthNav /> : (isClient ? <PublicNav /> : null) }
                {isClient && <MobileNav />}
             </div>
        </div>
      </header>
  )
}

    