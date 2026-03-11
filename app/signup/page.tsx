"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Mail, Lock, User, ArrowRight, Check, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"verify" | "create">("verify");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // In production, this would verify the invitation code via API
  const handleVerifyInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // For demo: derive email from invitation code
    // In production: verify code via API and get email from invitation
    const demoEmail = invitationCode.includes('@') 
      ? invitationCode 
      : `user@${invitationCode.toLowerCase().replace(/\s+/g, '')}.com`;
    setEmail(demoEmail);

    // Demo: accept any code for testing
    setTimeout(() => {
      setStep("create");
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    // In production, this would:
    // 1. Verify invitation is valid
    // 2. Create user in Supabase Auth
    // 3. Accept invitation (update invitation status)
    // 4. Create membership for user in organization
    
    setTimeout(() => {
      window.location.href = "/lawfirm";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            <CardTitle className="text-2xl">
              {step === "verify" ? "Join an Organization" : "Create Your Account"}
            </CardTitle>
            <CardDescription>
              {step === "verify" 
                ? "Enter your invitation code to join a law firm" 
                : "Complete your account setup"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "verify" ? (
              <form onSubmit={handleVerifyInvitation} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invitation Code</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Enter invitation code"
                      className="pl-10"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Request an invitation from your law firm administrator
                  </p>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">For Law Firm Administrators</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Organizations are created by the platform super admin. Contact your platform administrator to get started.
                  </p>
                  <Link href="/login" className="text-sm text-blue-700 font-medium hover:underline">
                    Contact Support →
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-navy-700 hover:bg-navy-800"
                  disabled={isLoading || !invitationCode}
                >
                  {isLoading ? "Verifying..." : "Continue"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-navy-700 hover:bg-navy-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep("verify")}
                >
                  Back
                </Button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-navy-700 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
