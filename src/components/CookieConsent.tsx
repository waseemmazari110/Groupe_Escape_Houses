"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-up">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="rounded-2xl shadow-2xl p-6 md:p-8 relative"
          style={{ 
            background: "var(--color-text-primary)",
            color: "var(--color-bg-primary)"
          }}
        >
          <button
            onClick={declineCookies}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pr-8">
            <div className="flex-1">
              <h3 
                className="text-xl md:text-2xl mb-2 font-semibold"
                style={{ 
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent-gold)"
                }}
              >
                We Use Cookies
              </h3>
              <p className="text-sm md:text-base text-[var(--color-bg-secondary)] leading-relaxed">
                We use cookies to enhance your browsing experience, analyse site traffic, and provide personalised content. By clicking "Accept", you consent to our use of cookies.{" "}
                <Link 
                  href="/privacy" 
                  className="underline hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  Read our Privacy Policy
                </Link>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={declineCookies}
                variant="outline"
                className="rounded-xl px-6 py-3 font-medium border-2 transition-all hover:bg-white/10"
                style={{
                  borderColor: "var(--color-accent-sage)",
                  color: "var(--color-bg-primary)"
                }}
              >
                Decline
              </Button>
              <Button
                onClick={acceptCookies}
                className="rounded-xl px-8 py-3 font-semibold transition-all hover:shadow-lg"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white"
                }}
              >
                Accept Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}