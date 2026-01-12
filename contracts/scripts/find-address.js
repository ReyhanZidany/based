const hre = require("hardhat");
const { getCreateAddress } = require("ethers");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const address = deployer.address;
    const nonce = await hre.ethers.provider.getTransactionCount(address);

    // The deployment was the LAST transaction, so the nonce used was nonce - 1
    const contractAddress = getCreateAddress({ from: address, nonce: nonce - 1 });
    console.log("Calculated Address (nonce-1):", contractAddress);

    const contractAddress2 = getCreateAddress({ from: address, nonce: nonce - 2 });
    console.log("Calculated Address (nonce-2):", contractAddress2);
}

main().catch(console.error);
