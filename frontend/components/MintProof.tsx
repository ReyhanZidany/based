"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Wallet } from "lucide-react";
import { generateTokenURI } from "@/lib/generator";

export default function MintProof() {
  const { address, isConnected } = useAccount();

  // Mode: Single or Batch
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  // Single Mode State
  const [contributor, setContributor] = useState("");

  // Batch Mode State
  const [csvInput, setCsvInput] = useState("");
  const [batchQueue, setBatchQueue] = useState<{ address: string; name?: string; status: 'pending' | 'processing' | 'success' | 'error'; hash?: string }[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isBatchComplete, setIsBatchComplete] = useState(false);

  // Common State
  const [projectName, setProjectName] = useState("Base Indonesia Hackathon 2026");
  const [role, setRole] = useState("");

  const {
    data: hash,
    writeContract,
    writeContractAsync,
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

  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

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

  const checkNetwork = async () => {
    if (chainId !== 84532) {
      try {
        await switchChainAsync({ chainId: 84532 });
        return true;
      } catch (e) {
        console.error("Failed to switch chain:", e);
        return false;
      }
    }
    return true;
  };

  const handleMint = async () => {
    if (!contributor) return alert("Contributor address required");
    if (!(await checkNetwork())) return;

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

  const handleBatchMint = async () => {
    if (!csvInput) return;
    if (!(await checkNetwork())) return;

    // Parse CSV
    const lines = csvInput.trim().split('\n');
    const queue = lines.map(line => {
      // Split by comma, assume first part is address, second part (optional) is name
      const parts = line.split(',');
      const addr = parts[0].trim();
      const name = parts.length > 1 ? parts.slice(1).join(',').trim() : undefined;
      return { address: addr, name: name || addr, status: 'pending' as const };
    });

    if (queue.length === 0) return;

    setBatchQueue(queue);
    setIsBatchProcessing(true);
    setIsBatchComplete(false);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];

      // Skip invalid addresses roughly
      if (!item.address.startsWith("0x") || item.address.length < 42) {
        setBatchQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'error' } : q));
        continue;
      }

      // Update status to processing
      setBatchQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'processing' } : q));

      try {
        const tokenURI = generateTokenURI(projectName, role || "Contributor", item.name || item.address, address || "0x00");

        const txHash = await writeContractAsync({
          address: BASED_CONTRACT as `0x${string}`,
          abi: BASED_ABI,
          functionName: "mintBased",
          chainId: 84532,
          args: [item.address, projectName, role || "Contributor", tokenURI],
        });

        // Update success
        setBatchQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'success', hash: txHash } : q));
      } catch (e) {
        console.error(e);
        setBatchQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'error' } : q));
      }
    }

    setIsBatchProcessing(false);
    setIsBatchComplete(true);
  };

  const resetBatch = () => {
    setBatchQueue([]);
    setIsBatchComplete(false);
    setCsvInput("");
  };

  return (
    <div className="w-full font-mono">
      <AnimatePresence mode="wait">
        {/* SINGLE MINT SUCCESS */}
        {isSuccess && mode === 'single' ? (
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

          /* BATCH MINT SUCCESS */
        ) : isBatchComplete && mode === 'batch' ? (
          <motion.div
            key="batch-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white border-2 border-black p-8 text-center"
          >
            <div className="mb-6 inline-block border-2 border-black p-4 bg-blue-600 brutal-shadow">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter">BATCH_COMPLETE</h3>
            <p className="text-xs uppercase bg-black text-white inline-block px-2 py-1 mb-8">
              Success: {batchQueue.filter(x => x.status === 'success').length} / {batchQueue.length}
            </p>

            <div className="text-left border-2 border-black bg-gray-50 mb-8 max-h-60 overflow-auto custom-scrollbar">
              {batchQueue.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b border-gray-200 text-xs last:border-0">
                  <div className="font-mono truncate w-1/2">
                    {item.address.slice(0, 6)}...{item.address.slice(-4)}
                    {item.name && <span className="text-gray-500 ml-1">({item.name})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === 'success' ? (
                      <span className="text-green-600 font-bold">MINTED</span>
                    ) : (
                      <span className="text-red-600 font-bold">FAILED</span>
                    )}
                    {item.hash && (
                      <a href={`https://sepolia.basescan.org/tx/${item.hash}`} target="_blank" className="font-mono hover:bg-black hover:text-white px-1">TX ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.href = "/"}
                className="w-full bg-black text-white font-bold py-4 px-4 border-2 border-black hover:bg-white hover:text-black transition-all text-sm uppercase flex items-center justify-center gap-2 group"
              >
                Return to Dashboard <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
              </button>
              <button
                onClick={resetBatch}
                className="w-full bg-white text-black font-bold py-4 px-4 border-2 border-black hover:bg-gray-100 transition-all text-sm uppercase"
              >
                [ MINT_NEW_BATCH ]
              </button>
            </div>
          </motion.div>

          /* FORM VIEW */
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
              <div className="text-right flex gap-2">
                <button
                  onClick={() => { setMode('single'); setBatchQueue([]); setIsBatchProcessing(false); setIsBatchComplete(false); }}
                  className={`text-[10px] font-bold px-2 py-1 border border-black ${mode === 'single' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  SINGLE
                </button>
                <button
                  onClick={() => setMode('batch')}
                  className={`text-[10px] font-bold px-2 py-1 border border-black ${mode === 'batch' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  BATCH
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {mode === 'single' ? (
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
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase bg-blue-600 text-white inline-block px-1">
                    Batch_Target_List (CSV)
                  </label>
                  <div className="text-[10px] text-gray-500 mb-1">Format: ADDRESS, NAME (One per line)</div>
                  <textarea
                    placeholder={`0x123...abc, Alice\n0x456...def, Bob`}
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    rows={5}
                    disabled={isBatchProcessing}
                    className="w-full px-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm placeholder:text-gray-400 disabled:opacity-50"
                  />
                </div>
              )}

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

              {/* Batch Progress (Only show while processing, hide if complete to show result screen) */}
              {mode === 'batch' && !isBatchComplete && batchQueue.length > 0 && (
                <div className="border-2 border-black p-4 bg-gray-50 space-y-2 max-h-40 overflow-auto custom-scrollbar">
                  {batchQueue.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div className="truncate w-1/2 font-mono">
                        {item.address}
                        {item.name && item.name !== item.address && <span className="text-gray-500"> ({item.name})</span>}
                      </div>

                      <div className={`font-bold uppercase flex items-center gap-2 ${item.status === 'success' ? 'text-green-600' :
                          item.status === 'processing' ? 'text-blue-600' :
                            item.status === 'error' ? 'text-red-600' : 'text-gray-400'
                        }`}>
                        {item.status}
                        {item.hash && (
                          <a href={`https://sepolia.basescan.org/tx/${item.hash}`} target="_blank" className="hover:underline text-black">↗</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(isWriteError || isReceiptError) && mode === 'single' && (
                <div className="p-4 bg-red-600 border-2 border-black text-white text-xs font-mono break-all brutal-shadow">
                  <div className="font-bold border-b border-white pb-1 mb-2">ERROR_LOG:</div>
                  {(writeError?.message || receiptError?.message)?.slice(0, 150)}
                </div>
              )}

              <button
                onClick={mode === 'single' ? handleMint : handleBatchMint}
                disabled={isPending || isConfirming || (mode === 'single' && !contributor) || (mode === 'batch' && (!csvInput || isBatchProcessing))}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black uppercase text-lg border-2 border-black brutal-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex justify-center items-center gap-2 mt-8"
              >
                {isPending || isConfirming || isBatchProcessing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 text-white" />
                    <span>PROCESSING... {mode === 'batch' ? `(${batchQueue.filter(x => x.status === 'success' || x.status === 'error').length}/${batchQueue.length})` : ''}</span>
                  </>
                ) : (
                  <>
                    {mode === 'single' ? 'EXECUTE_MINT' : 'EXECUTE_BATCH'} <span className="text-xl">↵</span>
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
