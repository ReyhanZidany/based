"use client";

import { useAccount, useConnect, useDisconnect, useEnsName, useConnectors } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/lib/utils";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [hasInjectedProvider, setHasInjectedProvider] = useState(false);

  // Check for injected provider (e.g., MetaMask, Coinbase Wallet injected)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasInjectedProvider(true);
    }
  }, []);

  console.log("Connectors available:", connectors);
  if (error) console.error("Connection Error:", error);

  const [mounted, setMounted] = useState(false);

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOptions && !(event.target as Element).closest('.connect-wallet-dropdown')) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  const isUserRejected = (err: any) => {
    if (!err) return false;
    // Check for common rejection patterns
    if (err.name === 'UserRejectedRequestError') return true;
    if (err.code === 4001) return true; // EIP-1193 user rejected request
    if (err.message && (
      err.message.includes('User rejected') ||
      err.message.includes('request rejected') ||
      err.message.includes('denied account access')
    )) return true;
    return false;
  };

  const shouldShowError = error && !isUserRejected(error);

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

  // Filter connectors to show relevant options
  const visibleConnectors = connectors.filter(c => {
    // Always show Coinbase Wallet (Smart Wallet)
    if (c.type === 'coinbaseWallet') return true;

    // Hide 'injected' if no provider is detected in the browser
    if (c.id === 'injected' && !hasInjectedProvider) return false;

    return true;
  });

  return (
    <div className="relative connect-wallet-dropdown">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="group relative inline-flex items-center justify-center px-4 py-2 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-xs md:text-sm"
      >
        Connect Wallet
      </button>

      {shouldShowError && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 text-red-600 text-xs p-2 rounded-lg border border-red-100 whitespace-nowrap z-50">
          {error.message.length > 50 ? 'Connection failed' : error.message}
        </div>
      )}

      {showOptions && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 flex justify-between items-center">
            <span>Choose Wallet</span>
            <button
              onClick={() => setShowOptions(false)}
              className="text-gray-300 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          {visibleConnectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setShowOptions(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {connector.name === 'Coinbase Wallet' ? 'Smart Wallet' : connector.name}
                </span>
                {connector.name === 'Coinbase Wallet' && (
                  <span className="text-[10px] text-gray-400 group-hover:text-blue-400">
                    Recommended
                  </span>
                )}
              </div>

              {connector.name === 'Coinbase Wallet' && (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </button>
          ))}

          {visibleConnectors.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No wallets detected.<br />
              <span className="text-xs">Try Coinbase Smart Wallet</span>
            </div>
          )}

          {/* Fallback link if someone really needs 'Injected' but it wasn't filtered correctly or they want to know why */}
          {!hasInjectedProvider && visibleConnectors.some(c => c.name !== 'Injected') && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center leading-tight">
              Open in MetaMask app to see more options
            </div>
          )}
        </div>
      )}
    </div>
  );
}