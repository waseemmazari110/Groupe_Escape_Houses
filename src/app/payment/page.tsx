"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { PLANS, PlanId } from "@/lib/plans";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") as PlanId | null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = planId ? PLANS[planId] : null;

  useEffect(() => {
    if (!planId || !plan) {
      router.push("/choose-plan");
    }
  }, [planId, plan, router]);

  const handleCheckout = async () => {
    if (!planId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/owner-sign-up?redirect=/payment?plan=" + planId);
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Complete Your Purchase
            </h1>
            <p className="text-lg text-[var(--color-neutral-dark)]">
              You&apos;re subscribing to the {plan.name} plan
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {plan.name} Plan
              </h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                  £{plan.price}
                </span>
                <span className="text-[var(--color-neutral-dark)]">+ VAT / year</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent-sage)]" />
                  <span className="text-[var(--color-neutral-dark)]">{feature}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={loading}
              size="lg"
              className="w-full rounded-2xl px-8 py-6 font-semibold text-white transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-50"
              style={{ background: "var(--color-accent-sage)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay £${plan.price} + VAT`
              )}
            </Button>

            <p className="text-center text-sm text-[var(--color-neutral-dark)] mt-4">
              Secure payment powered by Stripe
            </p>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/choose-plan")}
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              ← Back to plan selection
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
