"use client";

import { useAccount, useConnect, useDisconnect, useEnsName, useConnectors } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/lib/utils";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 bg-white border border-blue-100 pl-4 pr-1 py-1 rounded-full shadow-sm hover:shadow-md transition-all">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
            Connected
          </span>
          <span className="font-mono text-sm font-medium text-gray-800">
            {ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')}
          </span>
        </div>

        <button
          onClick={() => disconnect()}
          className="ml-3 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 text-xs font-semibold rounded-full transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="group relative inline-flex items-center justify-center px-4 py-2 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-xs md:text-sm"
        >
          {connector.name === 'Coinbase Wallet' ? 'Smart Wallet' : 'Connect'}
        </button>
      ))}
    </div>
  );
}