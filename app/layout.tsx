import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutreachAI - AI-Powered Cold Outreach Platform",
  description: "Generate personalized cold outreach emails at scale using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
