"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export function GuestSignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        role: "guest", // Explicitly set role
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/account/dashboard");
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error("An error occurred during sign up");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-500 hover:text-[var(--color-accent-sage)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Sign In
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Create Guest Account
        </h1>
        <p className="text-gray-600 mt-2">
          Save your favourite properties and track your enquiries.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name.."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border-gray-300 focus:ring-[var(--color-accent-sage)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-gray-300 focus:ring-[var(--color-accent-sage)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters.."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl border-gray-300 pr-10 focus:ring-[var(--color-accent-sage)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium text-gray-600 leading-normal"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-[var(--color-accent-sage)] hover:underline">
                Terms and Conditions
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[var(--color-accent-sage)] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full py-6 text-lg font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-gray-900 hover:text-[var(--color-accent-sage)] transition-colors underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
