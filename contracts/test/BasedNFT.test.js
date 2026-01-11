const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasedNFT", function () {
  let basedNFT;
  let owner;
  let issuer;
  let contributor1;
  let contributor2;
  
  beforeEach(async function () {
    [owner, issuer, contributor1, contributor2] = await ethers.getSigners();
    
    const BasedNFT = await ethers.getContractFactory("BasedNFT");
    basedNFT = await BasedNFT.deploy();
    await basedNFT.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await basedNFT.owner()).to.equal(owner.address);
    });
    
    it("Should have correct name and symbol", async function () {
      expect(await basedNFT.name()).to.equal("based");
      expect(await basedNFT.symbol()).to.equal("BASED");
    });
    
    it("Should authorize owner as issuer", async function () {
      expect(await basedNFT.authorizedIssuers(owner.address)).to.be.true;
    });
  });
  
  describe("Issuer Management", function () {
    it("Should allow owner to authorize issuer", async function () {
      await basedNFT.authorizeIssuer(issuer.address);
      expect(await basedNFT.authorizedIssuers(issuer.address)).to.be.true;
    });
    
    it("Should emit IssuerAuthorized event", async function () {
      await expect(basedNFT.authorizeIssuer(issuer.address))
        .to.emit(basedNFT, "IssuerAuthorized")
        .withArgs(issuer.address);
    });
  });
  
  describe("Minting Proofs", function () {
    beforeEach(async function () {
      await basedNFT.authorizeIssuer(issuer.address);
    });
    
    it("Should mint a proof successfully", async function () {
      await basedNFT.connect(issuer).mintBased(
        contributor1.address,
        "Base Hackathon 2025",
        "Participant",
        "ipfs://test"
      );
      
      expect(await basedNFT.balanceOf(contributor1.address)).to.equal(1);
    });
    
    it("Should emit ProofMinted event", async function () {
      await expect(
        basedNFT.connect(issuer).mintBased(
          contributor1.address,
          "Base Hackathon 2025",
          "Participant",
          "ipfs://test"
        )
      ).to.emit(basedNFT, "ProofMinted");
    });
    
    it("Should store proof details correctly", async function () {
      await basedNFT.connect(issuer).mintBased(
        contributor1.address,
        "Base Hackathon 2025",
        "Winner",
        "ipfs://test"
      );
      
      const proof = await basedNFT.getProofDetails(0);
      expect(proof.projectName).to.equal("Base Hackathon 2025");
      expect(proof.role).to.equal("Winner");
      expect(proof.issuer).to.equal(issuer.address);
    });
    
    it("Should reject minting from unauthorized issuer", async function () {
      await expect(
        basedNFT.connect(contributor1).mintBased(
          contributor2.address,
          "Test",
          "Role",
          "ipfs://test"
        )
      ).to.be.revertedWith("Not authorized to mint");
    });
  });
  
  describe("Batch Minting", function () {
    beforeEach(async function () {
      await basedNFT.authorizeIssuer(issuer.address);
    });
    
    it("Should batch mint to multiple contributors", async function () {
      const contributors = [contributor1.address, contributor2.address];
      
      await basedNFT.connect(issuer).batchMintBased(
        contributors,
        "Base Hackathon 2025",
        "Participant",
        "ipfs://test"
      );
      
      expect(await basedNFT.balanceOf(contributor1.address)).to.equal(1);
      expect(await basedNFT.balanceOf(contributor2.address)).to.equal(1);
    });
  });
  
  describe("Soulbound (Non-Transferable)", function () {
    beforeEach(async function () {
      await basedNFT.authorizeIssuer(issuer.address);
      await basedNFT.connect(issuer).mintBased(
        contributor1.address,
        "Base Hackathon 2025",
        "Participant",
        "ipfs://test"
      );
    });
    
    it("Should prevent transfers", async function () {
      await expect(
        basedNFT.connect(contributor1).transferFrom(
          contributor1.address,
          contributor2.address,
          0
        )
      ).to.be.revertedWith("based: token is soulbound and non-transferable");
    });
    
    it("Should prevent safeTransferFrom", async function () {
      await expect(
        basedNFT.connect(contributor1)["safeTransferFrom(address,address,uint256)"](
          contributor1.address,
          contributor2.address,
          0
        )
      ).to.be.revertedWith("based: token is soulbound and non-transferable");
    });
  });
  
  describe("Contributor Proofs", function () {
    beforeEach(async function () {
      await basedNFT.authorizeIssuer(issuer.address);
    });
    
    it("Should track all proofs for a contributor", async function () {
      await basedNFT.connect(issuer).mintBased(
        contributor1.address,
        "Hackathon 1",
        "Participant",
        ""
      );
      
      await basedNFT.connect(issuer).mintBased(
        contributor1.address,
        "Hackathon 2",
        "Winner",
        ""
      );
      
      const proofs = await basedNFT.getContributorProofs(contributor1.address);
      expect(proofs.length).to.equal(2);
    });
  });
});