import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import ClientSideFeatures from "@/components/ClientSideFeatures";
import CustomAutumnProvider from "@/lib/autumn-provider";
import UKServiceSchema from "@/components/UKServiceSchema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
    title: {
      default: "Large Group Accommodation Across the UK | Group Escape Houses",
      template: "%s | Group Escape Houses"
    },
      description: "Luxury large group accommodation across the UK with hot tubs, pools, and stylish interiors. Expert group holiday planning for 10 to 30 guests.",
      metadataBase: new URL("https://www.groupescapehouses.co.uk"),
      alternates: {
        canonical: "https://www.groupescapehouses.co.uk",
      },
    formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "5Y_FiF2qaStUJ-oNPw4DIxA8AUWw-pnJ999FgRUzpgk",
  },
    icons: {
      icon: [
        { url: '/icon', sizes: '32x32', type: 'image/jpeg' },
      ],
      apple: [
        { url: '/apple-icon', sizes: '180x180', type: 'image/jpeg' },
      ],
    },
  };
  
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <html lang="en">
          <head>
            <link rel="icon" href="/icon" />
            <link rel="apple-touch-icon" href="/apple-icon" />
          <link rel="preconnect" href="https://slelguoygbfzlpylpxfs.supabase.co" />
          <link rel="preconnect" href="https://images.unsplash.com" />
          <link rel="preconnect" href="https://v3b.fal.media" />
          <link rel="dns-prefetch" href="https://slelguoygbfzlpylpxfs.supabase.co" />
        </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased font-body`}>
        <UKServiceSchema />
        <ErrorReporter />
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="8330e9be-5e47-4f2b-bda0-4162d899b6d9"
        />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/route-messenger.js"
            strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CustomAutumnProvider>
          {children}
        </CustomAutumnProvider>

        <ClientSideFeatures />
      </body>
    </html>
  );
}
