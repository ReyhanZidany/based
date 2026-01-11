"use client";

import { use, useEffect, useState } from "react";
import ProofList from "@/components/ProofList";
import Link from "next/link";
import { isAddress } from "viem";
import { useEnsName } from "wagmi";

export default function ProfilePage({
    params,
}: {
    params: Promise<{ address: string }>;
}) {
    const resolvedParams = use(params);
    const address = resolvedParams.address as `0x${string}`;
    const [copied, setCopied] = useState(false);

    // Resolve Basename
    const { data: ensName } = useEnsName({ address });

    if (!isAddress(address)) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">Invalid Address</h1>
                    <Link href="/" className="text-blue-600 hover:align-baseline">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 selection:bg-blue-100">
            <div className="max-w-lg mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner border border-blue-50">
                            🐰
                        </div>

                        <h1 className="text-xl font-bold text-gray-900 font-mono tracking-tight break-all">
                            {ensName || (
                                <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                            )}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">
                            {ensName ? (
                                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                            ) : (
                                "Based Profile"
                            )}
                        </p>

                        <button
                            onClick={copyLink}
                            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-all active:scale-95"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                    Copy Profile Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                            Verified Proofs
                        </h2>
                        <Link href="/" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                            ← Back
                        </Link>
                    </div>
                    <ProofList address={address} />
                </div>
            </div>
        </main>
    );
}
