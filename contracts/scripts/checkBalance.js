const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(signer.address);
  
  console.log("\n🔵 Your Wallet Info:");
  console.log("Address:", signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  
  const balanceNum = parseFloat(hre.ethers. formatEther(balance));
  
  if (balanceNum >= 0.005) {
    console.log("\n✅ You have enough ETH!  Ready to deploy!\n");
  } else if (balanceNum > 0) {
    console.log("\n⚠️  You have some ETH but might not be enough.");
    console.log("Need at least 0.005 ETH to deploy safely.\n");
  } else {
    console.log("\n❌ No ETH yet. Check faucet or wait a bit.\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });