"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Wallet } from "lucide-react";
import { generateTokenURI } from "@/lib/generator";

export default function MintProof() {
  const { isConnected } = useAccount();

  const [contributor, setContributor] = useState("");
  const [projectName, setProjectName] = useState("Base Indonesia Hackathon 2025");
  const [role, setRole] = useState("");

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    isError: isWriteError
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
    isError: isReceiptError
  } = useWaitForTransactionReceipt({ hash });

  if (!isConnected) {
    return (
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-6 h-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          Connect your wallet to issue a new Based Proof.
        </p>
      </div>
    );
  }

  const handleMint = () => {
    if (!contributor) return alert("Contributor address required");

    const tokenURI = generateTokenURI(projectName, role || "Contributor", contributor);

    writeContract({
      address: BASED_CONTRACT as `0x${string}`,
      abi: BASED_ABI,
      functionName: "mintBased",
      chainId: 84532,
      args: [
        contributor,
        projectName,
        role || "Contributor",
        tokenURI,
      ],
    });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Proof Minted</h3>
              <p className="text-gray-500 mt-1">Transaction confirmed successfully</p>

              <div className="mt-6 bg-gray-50 rounded-lg p-3 text-left border border-gray-100">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Recipient</div>
                <div className="font-mono text-sm text-gray-700 break-all">{contributor}</div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Mint Another
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span>Tx Hash</span>
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 font-mono"
              >
                {hash?.slice(0, 10)}...{hash?.slice(-8)}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Issue Proof</h2>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contributor Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </label>
                <div className="relative group">
                  <div className="relative">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (document.activeElement as HTMLElement)?.blur();
                        }
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm peer"
                      placeholder="Select or type to create..."
                    />

                    {/* Dropdown for suggestions */}
                    <div
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking scrollbar/padding
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible peer-focus:opacity-100 peer-focus:visible transition-all duration-200 overflow-hidden"
                    >
                      <div className="py-1 max-h-60 overflow-auto">
                        {["Participant", "Winner", "Judge", "Mentor"]
                          .filter(opt => opt.toLowerCase().includes(role.toLowerCase()))
                          .map((opt) => (
                            <button
                              key={opt}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setRole(opt);
                                (document.activeElement as HTMLElement)?.blur();
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                            >
                              {opt}
                            </button>
                          ))}

                        {role && !["Participant", "Winner", "Judge", "Mentor"].some(opt => opt.toLowerCase() === role.toLowerCase()) && (
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              (document.activeElement as HTMLElement)?.blur();
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-100"
                          >
                            Create "{role}"
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {(isWriteError || isReceiptError) && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-mono break-all">
                  {(writeError?.message || receiptError?.message)?.slice(0, 150)}
                </div>
              )}

              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || !contributor}
                className="w-full py-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex justify-center items-center gap-2 text-sm"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-white" />
                    {isPending ? 'Confirming...' : 'Minting...'}
                  </>
                ) : (
                  'Mint Proof'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
