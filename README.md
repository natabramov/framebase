# Framebase

Framebase is a decentralized social media application that enables users to share and own their content as NFTs on the blockchain. Users are able to:

- Create posts that are minted as NFTs
- Own their content through blockchain verification
- Browse content from other users

The application has core features:

- Home feed
- Create new posts
- User profiles
- Like and comment on posts

## Image Storage

Framebase uses both Firebase and Pinata:

1. **Image Upload**: When a user creates a post, the image is first uploaded to IPFS -- Pinata cloud

2. **Metadata Creation**: The application generates metadata for the post, including:
   - Image IPFS hash (cid)
   - Post caption
   - Timestamp
   - The wallet address of the original creator

3. **Metadata Storage**: The complete metadata is stored on IPFS, resulting in another IPFS hash that represents the entire post metadata.

4. **Blockchain Integration**: The IPFS metadata hash is stored on the blockchain through the PostNFT smart contract when the NFT is minted.

5. **Firebase Integration**: Event data from the blockchain is captured by Firebase for efficient querying and frontend rendering

This approach means that:
- Content is permanently stored on IPFS
- Ownership is verifiably tracked on the blockchain
- Only essential information is stored on the blockchain
  - User data and basic post information stored on Firebase

## PostNFT Smart Contract

The `PostNFT.sol` smart contract extends OpenZeppelin's ERC721URIStorage and Ownable contracts to provide:

- **NFT Minting**: Users can mint posts as NFTs with the `mintPost` function
- **Metadata Tracking**: Post creator, timestamp, and IPFS metadata hash are stored on-chain
- **Creator Verification**: The `isCreator` function enables verification of a post's original creator

### Contract Structure

- **PostMetadata Struct**: Stores essential metadata about each post
  - `creator` - Original creator's address
  - `timestamp` - Creation time
  - `ipfsHash` - IPFS hash pointing to the complete post metadata

- **Events**:
  - `Minted`: Triggered when a new post is created
  - `PostOwnershipTransferred`: Triggered when a post changes ownership

### Smart Contract Operations

The PostNFT contract has multiple blockchain read and write operations:

#### Reads:
- **getPostDetails**: Reads creator address, timestamp, and IPFS hash from the blockchain
- **isCreator**: Verifies if an address is the original creator of a post
- **ownerOf**: Check current ownership of posts

#### Writes:
- **mintPost**: Writes multiple values including ownership assignment, metadata storage, and token counter
- **transferPost**: Changes ownership state by transferring a post to another address
- **_setTokenURI**: Sets the metadata URI for each token

## Blockchain-Firebase Integration

The `ContractListeners.js` file serves as the bridge between the blockchain and the Firebase database:

### Functions:

- **setupPostNFTListeners**: Creates event listeners for the PostNFT smart contract
- **initializeContractListeners**: Initializes the listeners with the Web3 provider

### Event Listeners and Handling

When a user mints a new post as an NFT:

1. The smart contract emits a `Minted` event with data (creator address, tokenId, IPFS hash, caption)
2. ContractListeners.js captures this event in real-time
3. The listener calls `createPost()` from PostServices to write the post data to Firebase
4. This makes the new post immediately available in the application UI


