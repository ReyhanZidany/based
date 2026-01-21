import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NetworkGuard from "@/components/NetworkGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL("https://based-indonesia.vercel.app"),
  title: "BASED | The Onchain Resume for Based Builders",
  description:
    "Based is the reputation layer for the Base ecosystem. Mint verifiable Soulbound Tokens (SBTs) for your hackathon wins, contributions, and community impact.",
  keywords: [
    "Base",
    "Base Indonesia",
    "Onchain Reputation",
    "Soulbound Tokens",
    "SBT",
    "Web3 Resume",
    "Hackathon",
    "Based ID",
    "Reyhan Zidany",
  ],
  authors: [{ name: "Reyhan Zidany" }],
  openGraph: {
    title: "BASED | The Onchain Resume for Based Builders",
    description:
      "Mint verifiable credentials. Build your onchain reputation. Forever. The Etherscan for Human Impact on Base.",
    url: "https://based-indonesia.vercel.app",
    siteName: "BASED",
    images: [
      {
        url: "/based-id.png", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "BASED - Onchain Reputation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BASED | The Onchain Resume for Based Builders",
    description:
      "Mint verifiable credentials. Build your onchain reputation. Forever.",
    creator: "@reyhanzidany", // Adjust if needed
    images: ["/based-id.png"],
  },
  verification: {
    google: "gJ8w0XMGGcbZFHNz6RYO-HL3RdQ156Q14S5VLgzaWUQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#0052FF", // Changed to Base Blue
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <NextTopLoader color="#0052FF" showSpinner={false} />
          <NetworkGuard />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}