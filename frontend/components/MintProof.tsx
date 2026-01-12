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
  const { address, isConnected } = useAccount();

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
      <div className="mt-8 p-8 bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center font-mono">
        <div className="w-16 h-16 bg-gray-100 border-2 border-black flex items-center justify-center mb-6 brutal-shadow">
          <Wallet className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-bold text-black uppercase tracking-tighter">WALLET_DISCONNECTED</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-xs uppercase">
          Connect your wallet to access the Minting Console.
        </p>
      </div>
    );
  }

  const handleMint = () => {
    if (!contributor) return alert("Contributor address required");

    const tokenURI = generateTokenURI(projectName, role || "Contributor", contributor, address || "0x0000000000000000000000000000000000000000");

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
    <div className="w-full font-mono">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white border-2 border-black p-8 text-center"
          >
            <div className="mb-6 inline-block border-2 border-black p-4 bg-green-400 brutal-shadow">
              <Check className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter">PROOF_MINTED</h3>
            <p className="text-xs uppercase bg-black text-white inline-block px-2 py-1 mb-8">Status: Transaction Confirmed</p>

            <div className="text-left border-2 border-dashed border-black p-4 mb-8 bg-gray-50">
              <div className="text-[10px] uppercase font-bold mb-1 opacity-50">// RECIPIENT_ADDRESS</div>
              <div className="font-bold text-sm text-black break-all">{contributor}</div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.href = "/"}
                className="w-full bg-black text-white font-bold py-4 px-4 border-2 border-black hover:bg-white hover:text-black transition-all text-sm uppercase flex items-center justify-center gap-2 group"
              >
                Return to Dashboard <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white text-black font-bold py-4 px-4 border-2 border-black hover:bg-gray-100 transition-all text-sm uppercase"
              >
                [ MINT_ANOTHER ]
              </button>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center text-[10px] uppercase">
              <span>TX_HASH:</span>
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:bg-blue-600 hover:text-white px-1 transition-colors"
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
            className="select-none"
          >
            <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">ISSUE_NEW<br />PROOF</h2>
              </div>
              <div className="text-right text-[10px]">
                <div>FORM_ID: MINT_01</div>
                <div>SECURE_CONN</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase bg-black text-white inline-block px-1">
                  Target_Coordinates (Address)
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase border border-black px-1">
                  Project_Codename
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm font-bold placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase border border-black px-1">
                  Assigned_Role
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
                      className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm font-bold peer placeholder:text-gray-400"
                      placeholder="SELECT OR TYPE..."
                    />

                    {/* Dropdown for suggestions */}
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute z-10 w-full mt-1 bg-white border-2 border-black opacity-0 invisible peer-focus:opacity-100 peer-focus:visible transition-all duration-75 max-h-60 overflow-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
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
                            className="w-full text-left px-4 py-2 text-sm font-bold uppercase hover:bg-black hover:text-white transition-colors border-b border-black last:border-0"
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
                          className="w-full text-left px-4 py-2 text-sm text-gray-500 font-bold uppercase hover:bg-black hover:text-white transition-colors border-t-2 border-black"
                        >
                          [ CREATE_NEW: "{role}" ]
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(isWriteError || isReceiptError) && (
                <div className="p-4 bg-red-600 border-2 border-black text-white text-xs font-mono break-all brutal-shadow">
                  <div className="font-bold border-b border-white pb-1 mb-2">ERROR_LOG:</div>
                  {(writeError?.message || receiptError?.message)?.slice(0, 150)}
                </div>
              )}

              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || !contributor}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black uppercase text-lg border-2 border-black brutal-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex justify-center items-center gap-2 mt-8"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 text-white" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    EXECUTE_MINT <span className="text-xl">↵</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
