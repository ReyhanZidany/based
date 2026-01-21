"use client";

import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "@/components/ConnectWallet";
import ProofList from "@/components/ProofList";
import ProfileSearch from "@/components/ProfileSearch";
import { useAccount, useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import RecentActivity from "@/components/RecentActivity";
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




      {/* Value Prop Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {/* Builders: Blue */}
        <div className="bg-blue-600 text-white brutal-border brutal-shadow p-6 group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-white pb-2">For Builders</h3>
          <p className="font-bold text-sm leading-relaxed">
            Stop relying on PDFs. Build an <span className="bg-white text-blue-600 px-1">onchain legacy</span> that actually proves your impact.
          </p>
        </div>

        {/* Organizers: Yellow */}
        <div className="bg-[#FFE600] text-black brutal-border brutal-shadow p-6 group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">For Organizers</h3>
          <p className="font-bold text-sm leading-relaxed">
            Issue thousands of credentials in seconds. <span className="bg-black text-[#FFE600] px-1">Verifiable & Permanent.</span>
          </p>
        </div>

        {/* Recruiters: White */}
        <div className="bg-white text-black brutal-border brutal-shadow p-6 group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">For Recruiters</h3>
          <p className="font-bold text-sm leading-relaxed">
            Hire based on verified contribution history, <span className="bg-blue-600 text-white px-1">vetted by code.</span>
          </p>
        </div>
      </section>

      {/* Lifecycle Section */}
      <section className="bg-white text-black p-8 md:p-12 brutal-border brutal-shadow">
        <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase text-center italic tracking-tighter">
          <span className="text-blue-600">Reputation</span> Lifecycle
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-black -translate-y-1/2 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 bg-white p-6 border-2 border-black brutal-shadow-sm hover:translate-y-[-8px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-12 h-12 flex items-center justify-center font-black border-2 border-black rounded-full z-20">1</div>
            <div className="mt-6 text-center">
              <div className="font-black uppercase text-2xl mb-2 group-hover:text-blue-600 transition-colors">Issue</div>
              <p className="text-sm font-bold text-gray-600 leading-tight">Organization issues verifiable SBT credential.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 bg-white p-6 border-2 border-black brutal-shadow-sm hover:translate-y-[-8px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFE600] text-black w-12 h-12 flex items-center justify-center font-black border-2 border-black rounded-full z-20">2</div>
            <div className="mt-6 text-center">
              <div className="font-black uppercase text-2xl mb-2 group-hover:text-[#dbc600] transition-colors">Share</div>
              <p className="text-sm font-bold text-gray-600 leading-tight">Builder shares proof on Farcaster & X.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 bg-white p-6 border-2 border-black brutal-shadow-sm hover:translate-y-[-8px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white w-12 h-12 flex items-center justify-center font-black border-2 border-black rounded-full z-20">3</div>
            <div className="mt-6 text-center">
              <div className="font-black uppercase text-2xl mb-2">Vouch</div>
              <p className="text-sm font-bold text-gray-600 leading-tight">Community attests to skill & impact.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 bg-white p-6 border-2 border-black brutal-shadow-sm hover:translate-y-[-8px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black w-12 h-12 flex items-center justify-center font-black border-2 border-black rounded-full z-20">4</div>
            <div className="mt-6 text-center">
              <div className="font-black uppercase text-2xl mb-2">Query</div>
              <p className="text-sm font-bold text-gray-600 leading-tight">Recruiters find talent with proven history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-[#FFE600] brutal-border brutal-shadow p-4 flex items-center justify-center gap-4">
        <div className="font-black text-2xl">⚠️</div>
        <p className="font-bold text-black uppercase text-sm md:text-base">
          <span className="underline decoration-2 underline-offset-4">Disclaimer:</span> Based verifies <span className="bg-black text-[#FFE600] px-1">contribution</span>, not code quality. We provide the trust layer; humans provide the context.
        </p>
      </div>




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
          {/* Live Feed (Sidebar) */}
          <RecentActivity />
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