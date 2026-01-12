import { Metadata, ResolvingMetadata } from "next";
import ProofDetailClient from "@/components/ProofDetailClient";

export async function generateMetadata(
    { params }: { params: Promise<{ tokenId: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { tokenId } = await params;

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:image": `https://based-indonesia.vercel.app/api/og/${tokenId}`,
        "fc:frame:button:1": "View Verified Proof \u2934",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": `https://based-indonesia.vercel.app/proof/${tokenId}`,
    };

    return {
        title: `Verified Proof #${tokenId} | Based Reputation`,
        description: "View my professional proof of contribution on Base.",
        openGraph: {
            images: [`/api/og/${tokenId}`],
        },
        other: {
            ...fcMetadata,
        },
    };
}

export default async function ProofDetailPage({
    params,
}: {
    params: Promise<{ tokenId: string }>;
}) {
    const { tokenId } = await params;

    return <ProofDetailClient tokenId={tokenId} />;
}
