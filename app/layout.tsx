import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/ui/CookieConsent";
import ScrollUI from "@/components/ui/ScrollUI";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const geist = Geist({ subsets: ["latin"], display: "swap" });

const BASE_URL = "https://www.alcosheets.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Alco Sheets | Premium Aluminium Composite Panels",
    template: "%s | Alco Sheets",
  },
  description: "Alco Sheets is a leading manufacturer and supplier of Aluminium Composite Panels (ACP), fire-rated cladding, and premium facade solutions worldwide.",
  keywords: ["ACP panels", "aluminium composite panel", "cladding", "facade", "fire rated panels", "Alco Sheets", "ACP manufacturer", "Dubai ACP", "building materials"],
  authors: [{ name: "Alco Sheets", url: BASE_URL }],
  creator: "Alco Sheets",
  publisher: "Alco Sheets",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website", locale: "en_US", url: BASE_URL, siteName: "Alco Sheets",
    title: "Alco Sheets | Premium Aluminium Composite Panels",
    description: "World-class ACP panels engineered for durability, aesthetics, and performance.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Alco Sheets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alco Sheets | Premium Aluminium Composite Panels",
    description: "World-class ACP panels engineered for durability, aesthetics, and performance.",
    images: ["/og-image.jpg"],
    creator: "@alcosheets",
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <ScrollUI />
        {children}
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
