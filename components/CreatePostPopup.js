import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useStateContext } from '../context/StateContext';
import { uploadImageToIPFS, createAndUploadMetadata } from '../utils/ipfs';
import { ethers } from 'ethers';
import PostNFT from '../contracts/PostNFT.json';
import { createPost } from '../firebase/PostServices';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

const contractAddress = process.env.NEXT_PUBLIC_POST_NFT_CONTRACT_ADDRESS;

const CreatePostPopup = ({ onClose }) => {
  const { user, username, provider } = useStateContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // user can select an image to upload from their device
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
    
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // extracts the tokenId from transaction receipt
  const extractTokenId = async (receipt) => {
    let tokenId;
    
    // Method 1: find the Minted event directly
    console.log('Parsing transaction events...');
    const mintedEvent = receipt.events?.find(event => event.event === 'Minted');
    
    if (mintedEvent?.args?.tokenId) {
      return mintedEvent.args.tokenId.toString();
    }
    
    // Method 2: look through logs for the Minted event signature
    try {
      const contractInterface = new ethers.utils.Interface(PostNFT.abi);
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = contractInterface.parseLog(log);
          if (parsedLog.name === 'Minted') {
            return parsedLog.args.tokenId.toString();
          }
        } catch {
          continue;
        }
      }
      
      // Method 3: look for Transfer event
      const contractLogs = receipt.logs.filter(log => 
        log.address.toLowerCase() === contractAddress.toLowerCase()
      );
      
      if (contractLogs.length > 0) {
        const lastLog = contractLogs[contractLogs.length - 1];
        if (lastLog.topics.length >= 4) {
          const tokenIdHex = lastLog.topics[3];
          if (tokenIdHex) {
            return parseInt(tokenIdHex, 16).toString();
          }
        }
      }
    } catch (error) {
      console.error('Error extracting tokenId from logs:', error);
    }
    
    // Method 4: fallback to Firebase for ID
    try {
      const latestPostsRef = collection(db, "posts");
      const q = query(latestPostsRef, orderBy("tokenId", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestPost = querySnapshot.docs[0].data();
        return (parseInt(latestPost.tokenId) + 1).toString();
      }
    } catch (error) {
      console.error('Error getting latest post ID from Firebase:', error);
    }

    return "0";
  };

  // submission and minting the photo as an NFT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }
    
    if (!caption.trim()) {
      setError('Please write a caption');
      return;
    }
    
    try {
      setIsUploading(true);
      setError('');
      
      // Stage 1: upload image to IPFS
      setUploadProgress(0);
      
      const imageIpfsHash = await uploadImageToIPFS(selectedImage, setUploadProgress);
      
      if (!imageIpfsHash) {
        throw new Error('Failed to upload image to IPFS');
      }
      
      // Stage 2: create and upload metadata JSON
      setUploadProgress(50);
      
      // generate post title from first few words of caption
      const trimmedCaption = caption.trim();
      const title = trimmedCaption.length > 30 ? trimmedCaption.substring(0, 30) + '...' : trimmedCaption;
        
      // create metadata with proper ERC721 format
      const metadataIpfsHash = await createAndUploadMetadata(
        imageIpfsHash,
        `Post by ${username || 'user'}: ${title}`,
        trimmedCaption
      );
      
      if (!metadataIpfsHash) {
        throw new Error('Failed to create metadata');
      }
      
      setUploadProgress(70);
      
      // Stage 3: Mint NFT on blockchain
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PostNFT.abi, signer);
      
      // Use the metadata CID for tokenURI
      const tx = await contract.mintPost(trimmedCaption, metadataIpfsHash, {
        gasLimit: 500000
      });
      
      setUploadProgress(80);
      
      const receipt = await tx.wait();
    
      if (receipt.status === 0) {
        throw new Error('Transaction failed on blockchain');
      }
      
      const tokenId = await extractTokenId(receipt);
      console.log('Final tokenId determined:', tokenId);
      
      // Stage 4: Save to Firebase
      // Store in Firebase with both the metadata URI and the media IPFS hash
      await createPost(
        tokenId, 
        user, 
        metadataIpfsHash, 
        imageIpfsHash,
        trimmedCaption
      );
      
      setUploadProgress(100);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      
      setError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // ensures the form is valid, meaning the caption is not empty and the image is selected
  const isFormValid = caption.trim() && selectedImage && !isUploading;

  return (
    <Overlay>
      <ModalContainer>
        <LeftPane>
          {imagePreview ? (
            <ImageContainer>
              <ImagePreview src={imagePreview} alt="Preview" />
            </ImageContainer>
          ) : (
            <ImageContainer>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageSelect}
              />
              <UploadButton onClick={handleUploadClick}>Upload Photo</UploadButton>
            </ImageContainer>
          )}
        </LeftPane>
        <RightPane>
          <Header>
            <ProfilePic />
            <Username>{username || 'username'}</Username>
          </Header>
          <CaptionArea 
            placeholder="Write a caption..." 
            maxLength={2200} 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          
          {/* progress bar */}
          {isUploading && (
            <StatusContainer>
              <ProgressBar>
                <ProgressFill style={{ width: `${uploadProgress}%` }} />
              </ProgressBar>
            </StatusContainer>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {/* Action buttons */}
          <ActionButtons>
            <CancelButton onClick={onClose} disabled={isUploading}>Cancel</CancelButton>
            <CreateButton onClick={handleSubmit} disabled={!isFormValid}>
              {isUploading ? 'Uploading...' : 'Create Post'}
            </CreateButton>
          </ActionButtons>
        </RightPane>
        <CloseButton onClick={onClose} disabled={isUploading}>×</CloseButton>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  display: flex;
  position: relative;
  width: 80%;
  max-width: 900px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  font-family: "Inter", serif;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPane = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(48, 48, 48);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  /* The & refers to the parent selector (this component). 
     So &:hover means "apply these styles when this button is hovered over" */
  &:hover {
    background-color: rgb(51, 51, 51);
  }
`;

const RightPane = styled.div`
  width: 300px;
  padding: 20px;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePic = styled.div`
  width: 36px;
  height: 36px;
  background-color: gray;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.div`
  font-weight: bold;
`;

const CaptionArea = styled.textarea`
  flex: 1;
  background:rgb(0, 0, 0);
  border: none;
  color: white;
  resize: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;

  &:focus {
    outline: none;
  }
`;

const StatusContainer = styled.div`
  margin-top: 15px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #dda15e;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  
  /* when {disabled} is true*/
  &:disabled {
    opacity: 0.5;
  }
`;

const CreateButton = styled.button`
  padding: 8px 16px;
  background-color: #283618;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
  }
  
  /* button is hovered over and not disabled */
  &:hover:not(:disabled) {
    background-color: #3a4d25;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 24px;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
  }
`;

export default CreatePostPopup;