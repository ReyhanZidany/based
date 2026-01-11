"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";

export default function MintProof() {
  const { isConnected } = useAccount();

  const [contributor, setContributor] = useState("");
  const [role, setRole] = useState("Participant");

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
    isError: isReceiptError
  } = useWaitForTransactionReceipt({ hash });

  if (!isConnected) return null;

  const handleMint = () => {
    if (!contributor) return alert("Contributor address required");

    writeContract({
      address: BASED_CONTRACT as `0x${string}`,
      abi: BASED_ABI,
      functionName: "mintBased",
      chainId: 84532, // Force Base Sepolia
      args: [
        contributor,
        "Base Indonesia Hackathon 2025",
        role,
        "ipfs://demo-proof",
      ],
    });
  };

  return (
    <div className="space-y-4">

      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Contributor wallet address"
        value={contributor}
        onChange={(e) => setContributor(e.target.value)}
      />

      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Role (Participant, Winner, etc)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button
        onClick={handleMint}
        disabled={isPending} /* Only disable while waiting for wallet signature */
        className="w-full px-4 py-3 bg-black text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Confirm in Wallet...
          </>
        ) : (
          "Mint Proof"
        )}
      </button>

      {/* Loading Status with Hash */}
      {hash && !isSuccess && (
        <div className="text-center animate-pulse bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700 font-semibold mb-1">Transaction sent! Waiting for confirmation...</p>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1"
          >
            View Status on BaseScan ↗
          </a>
        </div>
      )}

      {/* Error State */}
      {(isWriteError || isReceiptError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <p className="font-bold">Minting Failed</p>
          <p>{writeError?.message || receiptError?.message || "Something went wrong. Please try again."}</p>
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-green-900">Proof Minted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                Based Proof has been issued to <span className="font-mono font-bold">{contributor.slice(0, 6)}...{contributor.slice(-4)}</span>
              </p>

              <div className="mt-3 flex gap-3">
                <a
                  href="/dashboard" // Fallback if we don't parse ID yet, or user just wants to go home
                  className="text-xs font-semibold bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Mint Another
                </a>
                <a
                  href="/"
                  className="text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  View on Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
