"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

type Proof = {
    tokenId: string;
    projectName: string;
    role: string;
    timestamp: string;
};

export default function RecentActivity() {
    const [proofs, setProofs] = useState<Proof[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentProofs = async () => {
            try {
                const totalSupply = (await client.readContract({
                    address: BASED_CONTRACT as `0x${string}`,
                    abi: BASED_ABI,
                    functionName: "totalSupply",
                })) as bigint;

                const total = Number(totalSupply);
                if (total === 0) {
                    setProofs([]);
                    setIsLoading(false);
                    return;
                }

                // Fetch last 5 (or fewer if total < 5)
                const startId = Math.max(0, total - 5);
                const endId = total - 1;

                const promises = [];
                for (let i = endId; i >= startId; i--) {
                    promises.push(
                        client.readContract({
                            address: BASED_CONTRACT as `0x${string}`,
                            abi: BASED_ABI,
                            functionName: "getProofDetails",
                            args: [BigInt(i)],
                        }).then((data: any) => ({
                            tokenId: i.toString(),
                            projectName: data.projectName,
                            role: data.role,
                            timestamp: new Date(Number(data.timestamp) * 1000).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short'
                            })
                        }))
                    );
                }

                const stats = await Promise.all(promises);
                setProofs(stats);
            } catch (error) {
                console.error("Failed to fetch activity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentProofs();
        const interval = setInterval(fetchRecentProofs, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 brutal-border brutal-shadow">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                <h3 className="font-bold text-lg uppercase tracking-tight flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live_Feed
                </h3>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                </div>
            ) : proofs.length === 0 ? (
                <div className="text-center py-4 text-gray-500 font-mono text-xs uppercase">
                    [ NO_ACTIVITY ]
                </div>
            ) : (
                <div className="space-y-3">
                    {proofs.map((proof, i) => (
                        <motion.div
                            key={proof.tokenId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="border-b border-dashed border-gray-300 pb-2 last:border-0"
                        >
                            <Link href={`/proof/${proof.tokenId}`} className="block group">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm uppercase truncate text-blue-600 group-hover:text-black transition-colors">
                                            {proof.role}
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-500 truncate uppercase mt-0.5">
                                            {proof.projectName}
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] font-bold text-gray-400 block">{proof.timestamp}</span>
                                        <span className="text-[10px] font-bold text-gray-300 group-hover:text-black">↗</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
