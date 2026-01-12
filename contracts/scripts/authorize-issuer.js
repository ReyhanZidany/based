const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const BASED_ADDRESS = "0xF381d709b31D439AFcC08bbbc0955c3F02Ff0978";

  const targetAddress = "0x6B1196D9Aa4F6786B469BB6cBDd9f7F82f4FC5A2";

  const BasedNFT = await hre.ethers.getContractAt(
    "BasedNFT",
    BASED_ADDRESS
  );

  console.log("Authorizing issuer:", targetAddress);

  const tx = await BasedNFT.authorizeIssuer(targetAddress);
  console.log("Tx sent:", tx.hash);

  await tx.wait();

  console.log("✅ Issuer authorized!");
}

main().catch(console.error);
