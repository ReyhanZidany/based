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
    <main className="min-h-screen bg-gray-50/50 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <div className="relative border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live on Base Sepolia
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Reputation on <span className="text-blue-600">Base</span>.
            <br />
            Verifiable & Forever.
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10 leading-relaxed">
            Mint verifiable proofs of contribution for hackathons, workshops, and communities.
            Build your onchain resume today.
          </p>

          <div className="w-full max-w-sm mx-auto">
            <ProfileSearch />
          </div>
        </div>
      </div>

      {/* Stats/Social Proof (Subtle) */}
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 flex justify-center gap-12 text-center overflow-x-auto">
          <div>
            <p className="text-xl font-bold text-gray-900">100%</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Onchain</p>
          </div>
          <div className="w-px bg-gray-200 h-10 my-auto hidden sm:block"></div>
          <div>
            <p className="text-xl font-bold text-gray-900">Base</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Secured</p>
          </div>
          <div className="w-px bg-gray-200 h-10 my-auto hidden sm:block"></div>
          <div>
            <p className="text-xl font-bold text-gray-900">SBT</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Non-transferable</p>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* Minting Section (Issuer CTA) */}
        {!!isIssuer && (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Issuer Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">You are authorized to mint new proofs and credentials.</p>
            </div>
            <Link
              href="/mint"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm shrink-0"
            >
              Go to Mint Page →
            </Link>
          </section>
        )}

        {/* My Proofs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Proofs</h2>
            {address && (
              <Link href={`/profile/${address}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View Public Profile →
              </Link>
            )}
          </div>
          <ProofList />
        </section>
      </div>
    </main>
  );
}