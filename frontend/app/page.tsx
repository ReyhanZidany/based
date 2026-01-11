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
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-12">

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white brutal-border brutal-shadow p-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="inline-block bg-blue-600 text-white px-3 py-1 font-bold text-xs uppercase mb-6 brutal-shadow-sm border-2 border-black">
              Base Sepolia Live
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              PROOF<br />
              OF<br />
              <span className="text-blue-600">WORK.</span>
            </h1>
          </div>
          <p className="text-lg font-bold border-t-2 border-black pt-6 mt-6 max-w-sm">
            Mint verifiable credentials. Build your onchain reputation. Forever.
          </p>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-[#FFE600] brutal-border brutal-shadow p-6 flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-black mb-4 uppercase">Check Reputation</h2>
            <div className="w-full max-w-xs mx-auto">
              <ProfileSearch />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-white brutal-border brutal-shadow p-4 flex flex-col justify-center items-center text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-default">
              <span className="text-4xl font-black block">100%</span>
              <span className="text-xs font-bold uppercase mt-1">Onchain</span>
            </div>
            <div className="bg-blue-600 text-white brutal-border brutal-shadow p-4 flex flex-col justify-center items-center text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-default">
              <span className="text-4xl font-black block">SBT</span>
              <span className="text-xs font-bold uppercase mt-1">Non-transferable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Sidebar / Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Issuer Card */}
          {!!isIssuer && (
            <div className="bg-black text-white p-6 brutal-border brutal-shadow">
              <h2 className="text-xl font-bold mb-2 uppercase text-yellow-400">/// ADMIN ACCESS</h2>
              <p className="text-sm text-gray-300 mb-6 font-mono">
                Authorized Issuer detected. Access the minting terminal.
              </p>
              <Link
                href="/mint"
                className="block w-full text-center bg-white text-black font-bold py-3 border-2 border-transparent hover:bg-gray-200 transition-colors uppercase tracking-widest"
              >
                Enter Minting Console
              </Link>
            </div>
          )}

          {/* Profile Card */}
          {address && (
            <div className="bg-white p-6 brutal-border brutal-shadow">
              <h3 className="font-bold text-lg mb-4 uppercase border-b-2 border-black pb-2">User Status</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-bold">{address.slice(0, 6)}...{address.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Network:</span>
                  <span className="text-green-600 font-bold">Base Sepolia</span>
                </div>
              </div>
              <Link
                href={`/profile/${address}`}
                className="mt-6 inline-block w-full text-center border-2 border-black py-2 font-bold hover:bg-black hover:text-white transition-all text-xs uppercase"
              >
                View Public Passport
              </Link>
            </div>
          )}
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-8">
          <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-2">
            <h2 className="text-3xl font-black uppercase italic">My Proofs</h2>
            <span className="bg-black text-white text-xs px-2 py-1 font-mono">LIVE FEED</span>
          </div>
          <ProofList />
        </div>

      </div>
    </main>
  );
}