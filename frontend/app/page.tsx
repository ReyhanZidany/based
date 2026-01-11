import Image from "next/image";
import ConnectWallet from "@/components/ConnectWallet";
import ProofList from "@/components/ProofList";
import MintProof from "@/components/MintProof";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 selection:bg-blue-100">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-36 h-36 md:w-40 md:h-40">
            <Image
              src="/based.png"
              alt="Based Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="text-gray-500 text-sm font-medium tracking-wide mt-2">
            ONCHAIN REPUTATION LAYER
          </p>
        </div>

        <div className="flex justify-center">
          <ConnectWallet />
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Mint Proof</h2>
          <MintProof />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
            Your Proofs
          </h2>
          <ProofList />
        </div>
      </div>
    </main>
  );
}