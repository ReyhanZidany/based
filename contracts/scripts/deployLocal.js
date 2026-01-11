const hre = require("hardhat");

async function main() {
  console.log("\n🔵 Deploying based to Local Network.. .\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers. provider.getBalance(deployer. address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy BasedNFT
  console.log("Deploying BasedNFT.. .");
  const BasedNFT = await hre.ethers.getContractFactory("BasedNFT");
  const basedNFT = await BasedNFT.deploy();
  await basedNFT.waitForDeployment();

  const address = await basedNFT. getAddress();
  console.log("✅ BasedNFT deployed to:", address);

  // Test basic functionality
  console.log("\n📝 Testing basic functionality...");
  
  const owner = await basedNFT. owner();
  console.log("✅ Owner:", owner);
  
  const name = await basedNFT. name();
  const symbol = await basedNFT.symbol();
  console.log("✅ Name:", name);
  console.log("✅ Symbol:", symbol);

  // Test minting
  console.log("\n🎨 Minting test proof...");
  const tx = await basedNFT.mintBased(
    deployer.address,
    "Base Indonesia Hackathon 2025",
    "Builder",
    "ipfs://QmTestMetadata123"
  );
  await tx.wait();
  console.log("✅ Proof minted!  Tx:", tx.hash);

  const tokenBalance = await basedNFT. balanceOf(deployer.address);
  console.log("✅ Token balance:", tokenBalance.toString());

  const proofs = await basedNFT.getContributorProofs(deployer.address);
  console.log("✅ Total proofs:", proofs.length);

  console.log("\n🔵 Deployment complete!   Stay based.   💙\n");
  console.log("📝 Save this info:");
  console.log("Contract Address:", address);
  console.log("Network:  Hardhat Local");
  console.log("Owner:", deployer.address);
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });