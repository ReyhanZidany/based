// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BasedNFT
 * @dev Soulbound (non-transferable) NFT for proof of contribution
 * Built on Base - stay based 🔵
 */
contract BasedNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    
    struct Proof {
        string projectName;      // e.g., "Base Indonesia Hackathon 2025"
        string role;             // e.g., "Participant", "Winner", "Mentor"
        address issuer;          // Organization that issued the proof
        uint256 timestamp;       // When the proof was minted
        string metadataURI;      // IPFS link to detailed metadata
        bool isActive;           // Can be revoked if needed
    }
    
    // Token ID => Proof details
    mapping(uint256 => Proof) public proofs;
    
    // Contributor address => array of their token IDs
    mapping(address => uint256[]) public contributorProofs;
    
    // Organization => authorized to mint
    mapping(address => bool) public authorizedIssuers;
    
    // Events
    event ProofMinted(
        uint256 indexed tokenId,
        address indexed contributor,
        string projectName,
        string role,
        address issuer
    );
    
    event ProofRevoked(uint256 indexed tokenId);
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    constructor() ERC721("based", "BASED") Ownable(msg.sender) {
        // Owner is automatically authorized
        authorizedIssuers[msg.sender] = true;
    }
    
    /**
     * @dev Authorize an organization to issue proofs
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    
    /**
     * @dev Revoke issuer authorization
     */
    function revokeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Mint a proof NFT to a contributor
     */
    function mintBased(
        address contributor,
        string memory projectName,
        string memory role,
        string memory metadataURI
    ) public returns (uint256) {
        require(authorizedIssuers[msg.sender], "Not authorized to mint");
        require(contributor != address(0), "Invalid contributor address");
        
        uint256 tokenId = ++_tokenIdCounter;
        
        _safeMint(contributor, tokenId);
        
        proofs[tokenId] = Proof({
            projectName: projectName,
            role: role,
            issuer: msg.sender,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            isActive: true
        });
        
        contributorProofs[contributor].push(tokenId);
        
        emit ProofMinted(tokenId, contributor, projectName, role, msg.sender);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint proofs to multiple contributors
     */
    function batchMintBased(
        address[] memory contributors,
        string memory projectName,
        string memory role,
        string memory metadataURI
    ) external returns (uint256[] memory) {
        require(authorizedIssuers[msg.sender], "Not authorized to mint");
        
        uint256[] memory tokenIds = new uint256[](contributors.length);
        
        for (uint256 i = 0; i < contributors.length; i++) {
            tokenIds[i] = mintBased(
                contributors[i],
                projectName,
                role,
                metadataURI
            );
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get all proof token IDs for a contributor
     */
    function getContributorProofs(address contributor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return contributorProofs[contributor];
    }
    
    /**
     * @dev Get detailed proof information
     */
    function getProofDetails(uint256 tokenId) 
        external 
        view 
        returns (Proof memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Proof does not exist");
        return proofs[tokenId];
    }
    
    /**
     * @dev Revoke a proof (mark as inactive)
     * Only issuer can revoke their own proofs
     */
    function revokeProof(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Proof does not exist");
        require(proofs[tokenId].issuer == msg.sender, "Not the issuer");
        
        proofs[tokenId].isActive = false;
        emit ProofRevoked(tokenId);
    }
    
    /**
     * @dev SOULBOUND: Override to prevent transfers
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from = 0x0) and burning (to = 0x0)
        // Disallow transfers (from != 0x0 && to != 0x0)
        if (from != address(0) && to != address(0)) {
            revert("based: token is soulbound and non-transferable");
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Returns total number of proofs minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Override tokenURI to return custom metadata
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Proof does not exist");
        
        string memory uri = proofs[tokenId].metadataURI;
        
        // If custom URI is set, return it
        if (bytes(uri).length > 0) {
            return uri;
        }
        
        // Otherwise return default
        return string(abi.encodePacked("https://based.xyz/proof/", tokenId.toString()));
    }
}