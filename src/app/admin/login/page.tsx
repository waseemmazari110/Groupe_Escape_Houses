"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Shield, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/admin/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Check if user is admin
        const userRole = (data.user as any).role;
        if (userRole !== "admin") {
          toast.error("Access denied. Admin credentials required.");
          await authClient.signOut();
          setIsLoading(false);
          return;
        }

        toast.success("Welcome back, Admin!");
        router.push(callbackURL);
        router.refresh();
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Login" showHeader={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-slate-200">
            <CardHeader className="space-y-4 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-center font-bold text-slate-800">
                Admin Access
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                Secure login to admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@groupescapehouses.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Access Admin Portal
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                  <p className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">Restricted Access</span>
                  </p>
                  <p className="mt-2">
                    Not an admin?{" "}
                    <a href="/owner-login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                      Owner Portal
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
