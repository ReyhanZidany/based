"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";

export default function ProfileSearch() {
    const router = useRouter();
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        if (!isAddress(address)) {
            setError("Invalid Ethereum address");
            return;
        }

        setError("");
        router.push(`/profile/${address}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative">
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search profile by address (0x...)"
                    className={`w-full px-4 py-3 bg-white border ${error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                        } rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all pr-12 text-sm`}
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        setError("");
                    }}
                />
                <button
                    type="submit"
                    disabled={!address}
                    className="absolute right-2 p-1.5 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
            {error && (
                <p className="absolute -bottom-6 left-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </form>
    );
}
