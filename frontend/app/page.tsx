"use client";

import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "@/components/ConnectWallet";
import ProofList from "@/components/ProofList";
import ProfileSearch from "@/components/ProfileSearch";
import { useAccount, useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import { useState, useEffect } from "react";

export default function Home() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if issuer to show CTA
  const { data: isIssuer } = useReadContract({
    address: BASED_CONTRACT as `0x${string}`,
    abi: BASED_ABI,
    functionName: "authorizedIssuers",
    args: address ? [address] : undefined,
  });

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 selection:bg-blue-100 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live on Base Sepolia
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Reputation on <span className="text-blue-600">Base</span>. <br className="hidden md:block" />
            Verifiable & Forever.
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            Mint verifiable proofs of contribution for hackathons, workshops, and communities.
            Build your onchain resume today.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
              <ProfileSearch />
              <p className="text-center text-xs text-gray-400 mt-2">
                Try searching <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">0x...</code> to find a builder
              </p>
            </div>

            <div className="flex gap-4">
              {/* CTA handled by Navbar, but can add secondary here if needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Social Proof */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500 font-medium">Onchain</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Base</p>
            <p className="text-sm text-gray-500 font-medium">Secured</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">SBT</p>
            <p className="text-sm text-gray-500 font-medium">Non-transferable</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Zero</p>
            <p className="text-sm text-gray-500 font-medium">Platform Fees</p>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">

        {/* Minting Section (Issuer CTA) */}
        {!!isIssuer && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 shadow-sm relative overflow-hidden text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Issuer Dashboard</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">You have authorization to mint new proofs. Issue credentials for your hackathon winners and participants.</p>
            <a href="/mint" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30">
              Go to Mint Page →
            </a>
          </section>
        )}

        {/* My Proofs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>Your Proofs</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">Dashboard</span>
            </h2>
          </div>
          <ProofList />
        </section>
      </div>
    </main>
  );
}