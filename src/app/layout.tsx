import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Navbar } from "@/components/Navbar";
import { getProfile } from "@/lib/data";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "AIoT Portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile().catch(() => null);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar name={profile?.name} resumeUrl={profile?.resumeUrl} />
        <PageTransition>{children}</PageTransition>
        <Footer name={profile?.name} email={profile?.email} />
      </body>
    </html>
  );
}
