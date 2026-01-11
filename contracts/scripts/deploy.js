const hre = require("hardhat");

async function main() {
  console.log("🔵 Deploying based to Base Sepolia...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");
  
  // Deploy
  const BasedNFT = await hre.ethers.getContractFactory("BasedNFT");
  console.log("Deploying BasedNFT...");
  
  const basedNFT = await BasedNFT.deploy();
  await basedNFT.waitForDeployment();
  
  const address = await basedNFT.getAddress();
  
  console.log("✅ BasedNFT deployed to:", address);
  console.log("🔗 View on BaseScan:", `https://sepolia.basescan.org/address/${address}\n`);
  
  // Wait for confirmations
  console.log("⏳ Waiting for 5 block confirmations...");
  await basedNFT.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!\n");
  
  // Verify
  console.log("📝 Verifying contract on BaseScan...");
  try {
    await hre.run("verify:verify", {
      address:address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("❌ Verification failed:", error.message);
    console.log("You can verify manually later with:");
    console.log(`npx hardhat verify --network baseSepolia ${address}`);
  }
  
  console.log("\n🔵 Deployment complete!  Stay based. 💙");
  console.log("\n📋 Update your README with:");
  console.log(`Contract Address: ${address}`);
  console.log(`BaseScan: https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });