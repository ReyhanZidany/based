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
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Navigation */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="w-10 h-10 flex items-center justify-center bg-white brutal-border hover:bg-black hover:text-white transition-all font-bold"
                    >
                        {'<'}
                    </Link>
                    <h1 className="text-3xl font-black uppercase italic">Public Profile</h1>
                </div>

                {/* Profile Dossier */}
                <div className="bg-white brutal-border brutal-shadow p-6 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-xs font-mono font-bold">
                        IDENTITY_DOSSIER // CONFIDENTIAL
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-8 mt-6">
                        {/* Avatar Area */}
                        <div className="w-32 h-32 bg-gray-100 brutal-border flex items-center justify-center shrink-0">
                            <span className="text-6xl grayscale">🐰</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <h2 className="text-4xl font-black uppercase leading-none mb-1 text-black">
                                    {ensName || "ANONYMOUS_USER"}
                                </h2>
                                <div className="inline-block bg-blue-100 px-2 py-0.5 border border-black font-mono text-sm text-blue-800 font-bold">
                                    {address}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Status</p>
                                    <p className="font-mono text-green-600 font-bold">ACTIVE // CITIZEN</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Network</p>
                                    <p className="font-mono text-black font-bold">BASE SEPOLIA</p>
                                </div>
                            </div>

                            <button
                                onClick={copyLink}
                                className="w-full md:w-auto px-6 py-3 bg-white border-2 border-black text-black font-bold text-xs uppercase hover:bg-black hover:text-white transition-all brutal-shadow-sm flex items-center justify-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <span>[LINK_COPIED]</span>
                                    </>
                                ) : (
                                    <>
                                        <span>COPY_PROFILE_URL</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black uppercase">Verified Claims</h2>
                        <span className="bg-black text-white text-xs px-2 py-1 font-mono">
                            IMMUTABLE_RECORDS
                        </span>
                    </div>
                    <ProofList address={address} />
                </div>
            </div>
        </main>
    );
}
