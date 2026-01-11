"use client";

import MintProof from "@/components/MintProof";
import { useAccount, useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MintPage() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: isIssuer } = useReadContract({
        address: BASED_CONTRACT as `0x${string}`,
        abi: BASED_ABI,
        functionName: "authorizedIssuers",
        args: address ? [address] : undefined,
    });

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
                    <p className="text-gray-500 mb-4">Please connect your wallet to access the Minting Dashboard.</p>
                </div>
            </main>
        );
    }

    if (!isIssuer) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h1 className="text-xl font-bold text-red-900 mb-2">Access Denied</h1>
                    <p className="text-red-700 mb-6">
                        Your address <span className="font-mono bg-red-100 px-1 rounded text-red-800">{address?.slice(0, 6)}...</span> is not authorized to mint proofs.
                    </p>
                    <Link href="/" className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mint Proof</h1>
                    <p className="text-gray-500">Issue a new proof of contribution.</p>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                    <MintProof />
                </div>
            </div>
        </main>
    );
}
