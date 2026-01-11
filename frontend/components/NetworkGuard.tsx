"use client";

import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { BASE_SEPOLIA } from "@/lib/contract";

export default function NetworkGuard() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!isConnected) return null; // Don't block if not connected
    if (chainId === BASE_SEPOLIA.id) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Wrong Network</h2>
                <p className="text-gray-500 mb-6">
                    Please switch to <span className="font-bold text-blue-600">Base Sepolia</span> to use this app.
                </p>
                <button
                    onClick={() => switchChain({ chainId: BASE_SEPOLIA.id })}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95"
                >
                    Switch to Base Sepolia
                </button>
            </div>
        </div>
    );
}
