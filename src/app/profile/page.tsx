
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return null;
}

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "AI Educator",
    email: "",
    avatar: "https://placehold.co/100x100.png"
  });

  useEffect(() => {
    const email = getCookie('userEmail');
    if (email) {
      setUser(prev => ({ ...prev, email }));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary/30 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
            </div>
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <CardDescription>Manage your account settings and profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email} disabled />
            </div>
            <Button className="w-full">Update Profile</Button>
            <Button variant="outline" className="w-full">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
