"use client";

import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";

import Link from "next/link";

// Update Props
export default function ProofList({ address: propAddress }: { address?: string }) {
  const { address: connectedAddress, isConnected } = useAccount();

  // Use propAddress if available, otherwise fallback to connectedAddress
  const targetAddress = propAddress || connectedAddress;
  const isViewingOwnProfile = propAddress === connectedAddress || !propAddress;

  const { data, isLoading } = useReadContract({
    address: BASED_CONTRACT as `0x${string}`,
    abi: BASED_ABI,
    functionName: "getContributorProofs",
    args: targetAddress ? [targetAddress] : undefined,
  });

  const proofIdsArray = (data ?? []) as bigint[];

  // ✅ Logic tetap sama
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⛔ Render logic
  if (!mounted) return null;

  // If no address is provided via props AND wallet is not connected, show connect prompt
  if (!propAddress && !isConnected) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-400 text-sm">Please connect wallet to view proofs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="relative overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm h-[180px] animate-pulse">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200" />
            <div className="p-5 pl-7 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (proofIdsArray.length === 0) {
    return (
      <div className="text-center py-10 bg-white brutal-border brutal-shadow-sm">
        <p className="text-black font-bold text-lg uppercase">
          {isViewingOwnProfile ? "No proofs found." : "This user has no proofs yet."}
        </p>
        {isViewingOwnProfile && (
          <p className="text-gray-500 text-sm font-mono mt-2">{'>'} INIT_CONTRIBUTION_SEQUENCE</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {proofIdsArray.map((id) => (
        <ProofItem key={id.toString()} tokenId={id} />
      ))}
    </div>
  );
}

// Sub-component ProofItem (Neo-Brutalist Design)
function ProofItem({ tokenId }: { tokenId: bigint }) {
  const { data } = useReadContract({
    address: BASED_CONTRACT as `0x${string}`,
    abi: BASED_ABI,
    functionName: "getProofDetails",
    args: [tokenId],
  });

  if (!data) return null;

  const proof = data as {
    projectName: string;
    role: string;
    issuer: string;
    isActive: boolean;
    timestamp: bigint;
  };

  return (
    <div className="group relative bg-white brutal-border brutal-shadow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Decorative colored strip based on status */}
      <div className={`h-2 w-full border-b-2 border-black ${proof.isActive ? 'bg-blue-600' : 'bg-red-500'}`} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-black text-xl text-black leading-tight uppercase">
              {proof.projectName}
            </h3>
            <p className="text-blue-700 font-bold font-mono text-xs mt-1 bg-blue-100 inline-block px-1 border border-black">
              {proof.role}
            </p>
          </div>

          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-2 border-black ${proof.isActive
            ? "bg-green-400 text-black"
            : "bg-red-500 text-white"
            }`}>
            {proof.isActive ? "VERIFIED" : "REVOKED"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 text-xs font-mono border-t-2 border-dashed border-gray-300 pt-4 mt-2">
          <div>
            <p className="uppercase text-[10px] text-gray-500 font-bold mb-0.5">ISSUER_ID</p>
            <p className="text-black truncate w-24 sm:w-auto" title={proof.issuer}>
              {proof.issuer.slice(0, 6)}...{proof.issuer.slice(-4)}
            </p>
          </div>
          <div className="text-right">
            <p className="uppercase text-[10px] text-gray-500 font-bold mb-0.5">TIMESTAMP</p>
            <p className="text-black">
              {new Date(Number(proof.timestamp) * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center pt-2">
          <Link
            href={`/proof/${tokenId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-black px-4 py-2 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all"
          >
            VIEW PROOF
            <span className="text-lg leading-none">→</span>
          </Link>

          <a
            href={`https://sepolia.basescan.org/token/${BASED_CONTRACT}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase"
          >
            [BASESCAN]
          </a>
        </div>
      </div>
    </div>
  );
}