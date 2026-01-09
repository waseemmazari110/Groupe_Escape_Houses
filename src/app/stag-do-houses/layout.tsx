import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stag Do Houses",

  description: "Best stag do houses UK. Epic group accommodation with games rooms, hot tubs and space for stag weekends.",
  alternates: {
    canonical: "/stag-do-houses",
  },
};

export default function StagDoHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
