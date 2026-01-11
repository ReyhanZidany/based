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
      <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">
          {isViewingOwnProfile ? "No proofs found." : "This user has no proofs yet."}
        </p>
        {isViewingOwnProfile && (
          <p className="text-gray-400 text-xs mt-1">Start contributing to get based.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {proofIdsArray.map((id) => (
        // Pindahkan komponen ProofItem ke file terpisah atau di bawah
        <ProofItem key={id.toString()} tokenId={id} />
      ))}
    </div>
  );
}

// Sub-component ProofItem (UI dipercantik seperti Sertifikat/Kartu)
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
    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${proof.isActive ? 'bg-blue-600' : 'bg-red-500'}`} />

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {proof.projectName}
            </h3>
            <p className="text-blue-600 font-medium text-sm mt-0.5">{proof.role}</p>
          </div>

          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${proof.isActive
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : "bg-red-50 text-red-700 border-red-100"
            }`}>
            {proof.isActive ? "Verified" : "Revoked"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-gray-500 border-t pt-3 border-gray-100">
          <div>
            <p className="uppercase text-[10px] text-gray-400 font-semibold mb-0.5">Issuer</p>
            <p className="font-mono text-gray-700 truncate w-24 sm:w-auto" title={proof.issuer}>
              {proof.issuer.slice(0, 6)}...{proof.issuer.slice(-4)}
            </p>
          </div>
          <div className="text-right">
            <p className="uppercase text-[10px] text-gray-400 font-semibold mb-0.5">Date</p>
            <p className="font-medium text-gray-700">
              {new Date(Number(proof.timestamp) * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/proof/${tokenId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Certificate
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>

          <a
            href={`https://sepolia.basescan.org/token/${BASED_CONTRACT}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            BaseScan ↗
          </a>
        </div>
      </div>
    </div>
  );
}