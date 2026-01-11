"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BASED_ABI } from "@/lib/abi";
import { BASED_CONTRACT } from "@/lib/contract";

export default function MintProof() {
  const { address, isConnected } = useAccount();

  const [contributor, setContributor] = useState("");
  const [role, setRole] = useState("Participant");
  const { data: isIssuer } = useReadContract({
    address: BASED_CONTRACT as `0x${string}`,
    abi: BASED_ABI,
    functionName: "authorizedIssuers",
    args: address ? [address] : undefined,
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  if (!isConnected || !isIssuer) return null;

  const handleMint = () => {
    if (!contributor) return alert("Contributor address required");

    writeContract({
      address: BASED_CONTRACT as `0x${string}`,
      abi: BASED_ABI,
      functionName: "mintBased",
      args: [
        contributor,
        "Base Indonesia Hackathon 2025",
        role,
        "ipfs://demo-proof",
      ],
    });
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <h2 className="font-bold">Mint Proof (Issuer Only)</h2>

      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Contributor wallet address"
        value={contributor}
        onChange={(e) => setContributor(e.target.value)}
      />

      <input
        className="w-full border px-2 py-1 rounded"
        placeholder="Role (Participant, Winner, etc)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {isPending
          ? "Confirm in wallet..."
          : isConfirming
          ? "Minting..."
          : "Mint Proof"}
      </button>

      {isSuccess && (
        <p className="text-green-600 text-sm">
          ✅ Proof minted successfully
        </p>
      )}
    </div>
  );
}
