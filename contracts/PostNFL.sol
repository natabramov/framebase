// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract PostNFT is ERC721, Ownable {
    uint64 public tokenCounter;

    // use events for historical data
    event Minted(address indexed to, uint256 tokenId, string uri);

    constructor() ERC721("PostNFT", "POST") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintNFT(address recipient, string calldata tokenURI) external onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        emit Minted(recipient, newTokenId, tokenURI);
        tokenCounter += 1;
        return newTokenId;
    }
}