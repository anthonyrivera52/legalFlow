"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Lock, Building2, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // In production, fetch invitation details using the token
  const invitation = {
    email: "john@example.com",
    organizationName: "Anderson & Associates",
    role: "lawyer",
    message: "We'd like to invite you to join our law firm as a lawyer."
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsLoading(true);
    
    // In production:
    // 1. Create user account in Supabase Auth
    // 2. Accept invitation (update invitation status)
    // 3. Create membership for the user in the organization
    
    setTimeout(() => {
      setIsAccepted(true);
      setIsLoading(false);
    }, 1500);
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Welcome to the team!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully joined <strong>{invitation.organizationName}</strong>.
            </p>
            <Link href="/lawfirm">
              <Button className="w-full bg-navy-700 hover:bg-navy-800">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-navy-700 rounded-lg flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-navy-900">LexFlow</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">You&apos;ve been invited!</CardTitle>
            <CardDescription>
              {invitation.organizationName} has invited you to join their team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Building2 className="w-5 h-5 text-navy-700 mt-0.5" />
                <div>
                  <p className="font-medium">{invitation.organizationName}</p>
                  <p className="text-sm text-gray-500">Invitation to join as {invitation.role}</p>
                </div>
              </div>
              {invitation.message && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-gray-600 italic">&quot;{invitation.message}&quot;</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                This invitation will expire in 7 days. Create your account to accept.
              </p>
            </div>

            <form onSubmit={handleAccept} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-navy-700 hover:bg-navy-800"
                disabled={isLoading}
              >
                {isLoading ? "Accepting invitation..." : "Accept Invitation"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
