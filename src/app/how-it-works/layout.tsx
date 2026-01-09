import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Book | Simple Enquiry & Direct Booking",
  description: "Simple 4-step direct enquiry and booking process. Find your perfect house and book directly with property owners for the best rates.",
  keywords: ["how to book hen party house", "hen weekend booking process", "direct booking luxury houses", "enquire direct"],
  openGraph: {
    title: "How Our Enquiry Process Works",

    description: "Easy 4-step process to find and book your perfect group property directly with owners.",
    url: "https://www.groupescapehouses.co.uk/how-it-works",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}