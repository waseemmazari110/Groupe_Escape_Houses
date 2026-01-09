import { GuestSignUpForm } from "@/components/auth/GuestSignUpForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GuestSignUpPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
          <GuestSignUpForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
