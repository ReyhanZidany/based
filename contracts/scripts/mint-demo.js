const hre = require("hardhat");

async function main() {
  const [issuer] = await hre.ethers.getSigners();

  const BASED_ADDRESS =
  "0x639c4DeB80473729437072449910633347520904";

  const contributor =
  "0xc4224e12c784197A90cd5A6D6c706cDd6dA5D96C";

  const BasedNFT = await hre.ethers.getContractAt(
    "BasedNFT",
    BASED_ADDRESS
  );

  console.log("Minting demo proof to:", contributor);

  const tx = await BasedNFT.mintBased(
    contributor,
    "Base Indonesia Hackathon 2025",
    "Participant",
    "ipfs://demo-proof"
  );

  await tx.wait();

  console.log("✅ Proof minted!");
  console.log("🔵 Stay based.");
}

main().catch(console.error);
