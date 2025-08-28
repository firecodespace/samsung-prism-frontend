// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SwipeProvider from "@/components/SwipeProvider";

export const metadata: Metadata = {
  title: "On Device LLM - 42X007",
  description: "Responsive UI for your local LLM running on a phone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
        <SwipeProvider>
          <Navbar />
          <main className="mx-auto max-w-4xl px-4 pt-26 pb-24 min-h-screen flex flex-col">
            {children}
          </main>
        </SwipeProvider>
      </body>
    </html>
  );
}