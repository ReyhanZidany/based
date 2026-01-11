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
        <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">

            <div className="w-full max-w-3xl mb-6">
                <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-white brutal-border hover:bg-black hover:text-white transition-colors font-bold text-xs uppercase"
                >
                    {'<'} Back to Dashboard
                </Link>
            </div>

            {/* Certificate Card */}
            <div ref={cardRef} className="bg-white w-full max-w-3xl brutal-border brutal-shadow relative print:shadow-none overflow-hidden">
                {/* Status Strip */}
                <div className={`h-4 w-full border-b-2 border-black ${proof.isActive ? 'bg-blue-600' : 'bg-red-500'}`} />

                <div className="p-8 md:p-12 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b-2 border-dashed border-gray-300 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase mb-2">
                                Proof<br /><span className="text-blue-600">Of Contribution</span>
                            </h1>
                            <p className="font-mono text-sm text-gray-500">
                                RECORD_ID: #{tokenId}
                            </p>
                        </div>
                        <div className={`px-4 py-2 border-2 border-black font-black uppercase tracking-widest text-sm ${proof.isActive ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}`}>
                            {proof.isActive ? 'VERIFIED' : 'REVOKED'}
                        </div>
                    </div>

                    {/* Core Content */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase mb-2">-- HOLDER_ROLE</p>
                            <p className="text-3xl font-black uppercase text-black bg-gray-100 inline-block px-2">
                                {proof.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase mb-2">-- PROJECT_SCOPE</p>
                            <h2 className="text-4xl font-bold text-blue-600 leading-none">
                                {proof.projectName}
                            </h2>
                        </div>
                    </div>

                    {/* Footer Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t-4 border-black">
                        <div className="font-mono text-xs space-y-2">
                            <div className="flex gap-2">
                                <span className="font-bold w-20">ISSUER:</span>
                                <span>{issuerEns || proof.issuer}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold w-20">DATE:</span>
                                <span>{date}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold w-20">NETWORK:</span>
                                <span>BASE SEPOLIA</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-end">
                            <div className="bg-white p-2 border-2 border-black">
                                <QRCode
                                    value={`https://based-indonesia.vercel.app/proof/${tokenId}`}
                                    size={80}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share & Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 w-full max-w-3xl">
                <button
                    onClick={downloadCertificate}
                    className="flex-1 bg-white text-black border-2 border-black font-bold py-3 px-6 hover:bg-black hover:text-white transition-all uppercase text-sm brutal-shadow-sm"
                >
                    [DOWNLOAD_PNG]
                </button>

                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white border-2 border-black font-bold py-3 px-6 hover:bg-blue-700 transition-all uppercase text-sm brutal-shadow-sm text-center"
                >
                    Share / X
                </a>
                <a
                    href={farcasterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#855DCD] text-white border-2 border-black font-bold py-3 px-6 hover:bg-[#704eb0] transition-all uppercase text-sm brutal-shadow-sm text-center"
                >
                    Warpcast
                </a>
            </div>

            <div className="mt-4">
                <a
                    href={`https://sepolia.basescan.org/token/${BASED_CONTRACT}?a=${tokenId}`}
                    target="_blank"
                    className="font-mono text-xs text-gray-400 hover:text-black hover:underline"
                >
                    View Source on BaseScan ↗
                </a>
            </div>
        </main>
    );
}
