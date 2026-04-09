import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "UAIP Ala-Too · Course Catalog",
  description:
    "The Unified Academic Information Portal (UAIP) course catalog for Ala-Too International University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--uaip-bg)] text-[var(--uaip-text-primary)]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
