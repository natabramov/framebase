import { ethers } from 'ethers';
import { createPost } from './PostServices';
import PostNFTArtifact from '../contracts/PostNFT.json';

const BSC_TESTNET_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POST_NFT_CONTRACT_ADDRESS;

// set up event listeners for the PostNFT contract
export const setupPostNFTListeners = (contractAddress, provider) => {
  try {
    // create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      PostNFTArtifact.abi,
      provider
    );


    // listen for Minted events
    contract.on('Minted', async (creator, tokenId, ipfsHash, caption, event) => {
      
      // store the new post in Firebase
      try {
        await createPost(
          tokenId.toString(), 
          creator, 
          ipfsHash, 
          caption
        );
      } 
      
      catch (error) {
        console.error(`Error processing Minted event for ${tokenId}:`, error);
      }
    });

    return {
      removeListeners: () => {
        contract.removeAllListeners('Minted');
        contract.removeAllListeners('PostOwnershipTransferred');
        console.log('PostNFT event listeners removed');
      }
    };
  } 
  
  catch (error) {
    console.error('Error setting up PostNFT listeners:', error);
    throw error;
  }
};

// initialize the contract listeners with the Web3 provider
export const initializeContractListeners = async (web3Provider) => {
  // get the network to determine if we're on BSC Testnet
  const network = await web3Provider.getNetwork();
  const contractAddress = BSC_TESTNET_CONTRACT_ADDRESS;
  // setup the listeners and return the cleanup function
  return setupPostNFTListeners(contractAddress, web3Provider);
}; 