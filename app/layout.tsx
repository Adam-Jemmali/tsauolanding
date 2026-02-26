import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TSA @ uOttawa | Tunisian Student Association",
  description:
    "TSA @ uOttawa - A vibrant community celebrating Tunisian culture, building connections, and creating lasting memories at the University of Ottawa.",
  keywords: [
    "Tunisian Student Club",
    "Tunisian community",
    "student organization",
    "cultural events",
    "career growth",
    "networking",
  ],
  authors: [{ name: "Tunisian Student Club" }],
  openGraph: {
    title: "TSA @ uOttawa",
    description:
      "Celebrating Tunisian culture and building community at University of Ottawa.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}