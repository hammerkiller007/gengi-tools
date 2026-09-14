import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const ui = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const editorial = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gengiai — the startup sandbox",
  description: "Where startup people think out loud. Post ideas, tear them down, build the good ones together.",
  openGraph: {
    title: "Gengiai — the startup sandbox",
    description: "Where startup people think out loud. Post ideas, tear them down, build the good ones together.",
    images: [{ url: "/brand/gengiai-lockup.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gengiai — the startup sandbox",
    description: "Where startup people think out loud. Post ideas, tear them down, build the good ones together.",
    images: ["/brand/gengiai-lockup.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ui.variable} ${editorial.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
