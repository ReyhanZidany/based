"use client";

import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import { useAccount, useReadContract } from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";

export default function Navbar() {
    const { address } = useAccount();

    // Check if user is issuer to show Mint link
    const { data: isIssuer } = useReadContract({
        address: BASED_CONTRACT as `0x${string}`,
        abi: BASED_ABI,
        functionName: "authorizedIssuers",
        args: address ? [address] : undefined,
    });

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                            <Image
                                src="/basednobg.png"
                                alt="Based Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">

                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {!!isIssuer && (
                            <Link
                                href="/mint"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                <span className="hidden md:inline">Mint Proof</span>
                                <span className="md:hidden">Mint</span>
                            </Link>
                        )}

                        <ConnectWallet />
                    </div>
                </div>
            </div>
        </nav>
    );
}
