import { DualAuthForm } from "@/components/auth/DualAuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Group Escape Houses",
  description: "Sign in to your account to manage your bookings and saved properties on Group Escape Houses.",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
          <Suspense fallback={
            <div className="w-full max-w-md h-[500px] bg-white rounded-2xl shadow-xl animate-pulse" />
          }>
            <DualAuthForm initialTab="guest" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
