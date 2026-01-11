const hre = require("hardhat");

async function main() {
  const contractAddress = "PASTE_YOUR_LOCAL_CONTRACT_ADDRESS_HERE"; // Update! 
  
  const [signer] = await hre.ethers.getSigners();
  console.log("Testing with account:", signer.address);
  
  const BasedNFT = await hre.ethers.getContractAt("BasedNFT", contractAddress);
  
  console.log("\n🔵 Minting test proof...");
  const tx = await BasedNFT.mintBased(
    signer.address,
    "Base Indonesia Hackathon 2025",
    "Participant",
    "ipfs://QmTest123"
  );
  
  await tx.wait();
  console.log("✅ Proof minted!  Tx:", tx.hash);
  
  const balance = await BasedNFT.balanceOf(signer. address);
  console.log("✅ Proof balance:", balance.toString());
  
  const proofs = await BasedNFT. getContributorProofs(signer.address);
  console.log("✅ Total proofs:", proofs.length);
  
  console.log("\n🔵 Local deployment fully functional!\n");
}

main().catch(console.error);