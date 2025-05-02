// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract PostNFT is ERC721URIStorage, Ownable {
    uint64 public tokenCounter;

    struct PostMetadata {
        address creator;
        uint64 timestamp;
        string ipfsHash;
    }
    
    // mapping for tokenID to post metadata
    mapping(uint64 => PostMetadata) public postMetadata;
    
    // events for integration with Firebase
    event Minted(address indexed creator, uint64 indexed tokenId, string ipfsHash, string caption);
    event PostOwnershipTransferred(address indexed from, address indexed to, uint64 indexed tokenId);
    
    constructor() ERC721("PostNFT", "POST") Ownable(msg.sender) {
        tokenCounter = 0;
    }
    
    /**
     * @dev creates a new post NFT
     * @param caption the post caption (stored only in event, not on-chain)
     * @param metadataURI IPFS URI pointing to the post metadata in ERC721 format
     * @return tokenId of the newly minted NFT
     */
    function mintPost(string calldata caption, string calldata metadataURI) external returns (uint64) {
        uint64 newTokenId = tokenCounter;
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        
        _safeMint(msg.sender, uint256(newTokenId));
        
        _setTokenURI(uint256(newTokenId), metadataURI);
        
        postMetadata[newTokenId] = PostMetadata({
            creator: msg.sender,
            timestamp: uint64(block.timestamp),
            ipfsHash: metadataURI
        });
        
        // emit event for Firebase
        emit Minted(msg.sender, newTokenId, metadataURI, caption);
        
        tokenCounter += 1;
        return newTokenId;
    }
    
    /**
     * @dev transfers ownership of the post to another address
     * @param to address to transfer the post to
     * @param tokenId ID of the post to transfer
     */
    function transferPost(address to, uint64 tokenId) external {
        require(_isAuthorized(msg.sender, msg.sender, uint256(tokenId)), "Not owner or approved");
        
        address from = ownerOf(uint256(tokenId));
        _transfer(from, to, uint256(tokenId));
        
        // emit event for Firebase
        emit PostOwnershipTransferred(from, to, tokenId);
    }
    
    /**
     * @dev get the post metadata
     * @param tokenId ID of the post
     * @return creator -- timestamp, and metadataURI
     */
    function getPostDetails(uint64 tokenId) 
        external view returns (address, uint64, string memory) 
    {
        require(_ownerOf(uint256(tokenId)) != address(0), "Post does not exist");
        
        PostMetadata memory metadata = postMetadata[tokenId];
        return (
            metadata.creator,
            metadata.timestamp,
            metadata.ipfsHash
        );
    }
    
    /**
     * @dev check if an address is the original creator of the post
     * @param tokenId ID of the post
     * @param addr address to check
     * @return true if the address is the creator
     */
    function isCreator(uint64 tokenId, address addr) external view returns (bool) {
        require(_ownerOf(uint256(tokenId)) != address(0), "Post does not exist");
        return postMetadata[tokenId].creator == addr;
    }
}