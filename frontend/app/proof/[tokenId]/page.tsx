"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import Link from "next/link";
import { useEnsName } from "wagmi";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

export default function ProofDetailPage({
    params,
}: {
    params: Promise<{ tokenId: string }>;
}) {
    const { tokenId } = use(params);
    const [mounted, setMounted] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: proofData, isLoading } = useReadContract({
        address: BASED_CONTRACT as `0x${string}`,
        abi: BASED_ABI,
        functionName: "getProofDetails",
        args: [BigInt(tokenId)],
    });

    const proof = proofData as
        | {
            projectName: string;
            role: string;
            issuer: string;
            isActive: boolean;
            timestamp: bigint;
            ipfsCid: string;
        }
        | undefined;

    // Resolve Issuer ENS
    const { data: issuerEns } = useEnsName({
        address: proof?.issuer as `0x${string}` | undefined,
    });

    const downloadCertificate = useCallback(() => {
        if (cardRef.current === null) return;
        toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `based-proof-${tokenId}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Failed to generate image", err);
            });
    }, [tokenId]);

    if (!mounted) return null;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-64 w-96 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                </div>
            </main>
        );
    }

    if (!proof) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Proof Not Found</h1>
                <Link href="/" className="text-blue-600 hover:align-baseline">
                    Back to Home
                </Link>
            </main>
        );
    }

    const date = new Date(Number(proof.timestamp) * 1000).toLocaleDateString(
        undefined,
        { year: "numeric", month: "long", day: "numeric" }
    );

    const shareText = `Just viewed a Verified Proof for ${proof.role} at ${proof.projectName} on Base! Check it out:`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
            {/* Breadcrumb */}
            <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Certificate Card */}
            <div ref={cardRef} className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border-4 border-double border-blue-100 relative print:shadow-none print:border-4 print:border-black">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent opacity-50 rounded-bl-full pointer-events-none" />

                <div className="p-6 md:p-12 text-center space-y-6 md:space-y-8 relative z-10">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Verified on Base
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
                            Proof of Contribution
                        </h1>
                        <p className="text-gray-500 font-medium">Token ID: #{tokenId}</p>
                    </div>

                    {/* Core Content */}
                    <div className="py-8 border-t border-b border-gray-100 space-y-6">
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Presented To Holder Of</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {proof.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">For Contribution To</p>
                            <h2 className="text-3xl font-bold text-blue-600">
                                {proof.projectName}
                            </h2>
                        </div>
                    </div>

                    {/* Footer Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-center">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Issued By</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {proof.issuer[2].toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-gray-900 text-sm truncate">
                                        {issuerEns || `${proof.issuer.slice(0, 6)}...${proof.issuer.slice(-4)}`}
                                    </p>
                                    <p className="text-xs text-gray-500">Authorized Issuer</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code (Center on Desktop) */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <QRCode
                                    value={`https://based-indonesia.vercel.app/proof/${tokenId}`}
                                    size={64}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Scan to Verify</p>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date Issued</p>
                            <p className="font-bold text-gray-900 text-lg">{date}</p>
                            <a
                                href={`https://sepolia.basescan.org/token/${BASED_CONTRACT}?a=${tokenId}`}
                                target="_blank"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                View on BaseScan ↗
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className={`h-2 w-full ${proof.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Share & Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                    onClick={downloadCertificate}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-0.5 shadow-blue-500/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PNG
                </button>

                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    Share
                </a>
                <a
                    href={farcasterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:-translate-y-0.5 shadow-purple-500/30"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.24.24H5.76A5.52 5.52 0 0 0 .24 5.76v12.48a5.52 5.52 0 0 0 5.52 5.52h12.48a5.52 5.52 0 0 0 5.52-5.52V5.76A5.52 5.52 0 0 0 18.24.24Zm-6.24 16.32a.96.96 0 1 1 0-1.92.96.96 0 0 1 0 1.92Zm2.88-5.28a3.12 3.12 0 0 1-2.88 3.12h-.96v3.12a.24.24 0 0 1-.48 0v-3.12H9.6a3.12 3.12 0 1 1 0-6.24h.24v-4.8a.24.24 0 0 1 .48 0v4.8h.48a3.12 3.12 0 0 1 2.88 3.12Z" /></svg>
                    Warpcast
                </a>
            </div>
        </main>
    );
}
