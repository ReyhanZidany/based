const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const BASED_ADDRESS = "0x51F0e6f38a3758b5fBcDffa99C27dA353Ad05FBA";
  const ISSUER = owner.address; 

  const BasedNFT = await hre.ethers.getContractAt(
    "BasedNFT",
    BASED_ADDRESS
  );

  console.log("Authorizing issuer:", ISSUER);

  const tx = await BasedNFT.authorizeIssuer(ISSUER);
  await tx.wait();

  console.log("✅ Issuer authorized!");
}

main().catch(console.error);
