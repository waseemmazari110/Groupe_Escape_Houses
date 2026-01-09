import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Party Houses UK",

  description: "Christmas party houses UK. Large luxury properties for family gatherings and festive celebrations.",
  alternates: {
    canonical: "/christmas",
  },
};

export default function ChristmasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
