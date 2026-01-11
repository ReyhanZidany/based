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
                <div className="max-w-md w-full bg-red-600 brutal-border brutal-shadow p-8 text-center text-white">
                    <div className="font-mono text-6xl font-bold mb-4">403</div>
                    <h1 className="text-2xl font-black uppercase mb-2">ACCESS_DENIED</h1>
                    <p className="mb-6 font-mono text-sm opacity-90">
                        Address <span className="bg-black px-1">{address?.slice(0, 6)}...</span> is not authorized to execute this command.
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-white text-black font-bold brutal-border hover:bg-gray-200 transition-all uppercase text-sm">
                        {'<'} RETURN_TO_BASE
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="w-10 h-10 flex items-center justify-center bg-white brutal-border hover:bg-black hover:text-white transition-all font-bold"
                        >
                            {'<'}
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Minting Console</h1>
                            <p className="text-xs font-mono bg-black text-white inline-block px-2 py-0.5">V1.0.2 // AUTHORIZED_MODE</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse border border-black"></span>
                        SYSTEM_ONLINE
                    </div>
                </div>

                <div className="bg-white brutal-border brutal-shadow p-6 md:p-10 relative">
                    <div className="absolute top-0 right-0 p-2 font-mono text-[10px] text-gray-400">
                        ID: {address?.slice(0, 8)}
                    </div>
                    <MintProof />
                </div>
            </div>
        </main>
    );
}
