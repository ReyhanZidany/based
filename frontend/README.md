# Based 🔵
**Onchain Reputation Platform for Builders**

Built for **Base Indonesia Hackathon 2026**.

![Based Platform](https://github.com/user-attachments/assets/placeholder)

## 💡 Overview
**Based** is a decentralized platform that issues verifiable **Proofs of Contribution** (SBTs) to community members, hackathon participants, and builders. Unlike traditional PDF certificates, Based Proofs are:
- **Onchain**: Permanently stored on Base Sepolia.
- **Verifiable**: Anyone can verify the issuer and recipient.
- **Non-transferable**: Soulbound Tokens (SBTs) that strictly belong to the earner.

## 🚀 Key Features
- **Minting Authority**: Authorized issuers can mint proofs to contributors.
- **Verifiable Proofs**: Each proof is an ERC-721 Soulbound Token.
- **Basenames Integration**: Native support for `.base.eth` names.
- **Dynamic Certificates**: Beautiful, shareable certificate pages for every proof.
- **Social Sharing**: One-click sharing to Farcaster and X.

## ⛓️ Smart Contracts (Base Sepolia)
| Contract | Address |
|----------|---------|
| **BasedNFT** | [`0x639c4DeB80473729437072449910633347520904`](https://sepolia.basescan.org/address/0x639c4DeB80473729437072449910633347520904) |

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS + Vanilla CSS
- **Blockchain**:
    - [Wagmi](https://wagmi.sh/) (Hooks)
    - [Viem](https://viem.sh/) (Low-level interaction)
    - [OnchainKit](https://onchainkit.xyz/) (Identity)
- **Network**: Base Sepolia Testnet

## 🏃‍♂️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/based.git
cd based/frontend
npm install
```

### 2. Configure Environment
Create a `.env.local` file (optional, for WalletConnect):
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---
*Built with 💙 on Base.*
