"use client";

import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import { useAccount, useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";

export default function Navbar() {
    const { address } = useAccount();

    const { data: isIssuer } = useReadContract({
        address: BASED_CONTRACT as `0x${string}`,
        abi: BASED_ABI,
        functionName: "authorizedIssuers",
        args: address ? [address] : undefined,
    });

    return (
        <nav className="bg-white border-b-2 border-black sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                            <Image
                                src="/basednobg.png"
                                alt="Based Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-black uppercase italic">
                            BASED<span className="text-blue-600">.ID</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {!!isIssuer && (
                            <Link
                                href="/mint"
                                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black border-2 border-transparent hover:border-black transition-all uppercase"
                            >
                                [ + MINT_PROOF ]
                            </Link>
                        )}

                        <ConnectWallet />
                    </div>
                </div>
            </div>
        </nav>
    );
}
