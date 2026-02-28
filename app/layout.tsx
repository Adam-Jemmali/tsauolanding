import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0066CC",
};

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
  // Tell crawlers not to translate — avoids CLS from translation banners
  other: {
    "google": "notranslate",
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

        {/* ── DNS-prefetch & preconnect for Vercel CDN + analytics ── */}
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://vercel.live" crossOrigin="anonymous" />

        {/* ── Preload first 5 hero frames so canvas paints immediately ── */}
        <link rel="preload" as="image" href="/sequence2s/sidibousaid/ezgif-frame-001.png" />
        <link rel="preload" as="image" href="/sequence2s/sidibousaid/ezgif-frame-002.png" />
        <link rel="preload" as="image" href="/sequence2s/sidibousaid/ezgif-frame-003.png" />
        <link rel="preload" as="image" href="/sequence2s/sidibousaid/ezgif-frame-004.png" />
        <link rel="preload" as="image" href="/sequence2s/sidibousaid/ezgif-frame-005.png" />

        {/* ── Prefetch the logo so navbar renders instantly ── */}
        <link rel="preload" as="image" href="/logo.png" />
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
