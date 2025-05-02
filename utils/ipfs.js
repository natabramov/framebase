import axios from 'axios';

/**
 * uploads an image file to IPFS using our server-side API
 * @param {File} file - file to upload
 * @param {Function} progressCallback - callback for upload progress
 * @returns {Promise<string>} - CID of the uploaded file
 */
export const uploadImageToIPFS = async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      formData.append('network', 'public');
  
      const response = await axios.post('/api/upload-to-ipfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // progress bar
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
  
      
      // handle different response structures, weird but works
      let cid = null;
      
      if (response.data.cid) {
        cid = response.data.cid;
      } 
      
      else if (response.data.data && response.data.data.cid) {
        cid = response.data.data.cid;
      } 
      
      else if (response.data.ipfsHash) {
        cid = response.data.ipfsHash;
      }
      
      if (!cid) {
        console.error('No CID in response:', response.data);
        throw new Error('Failed to get CID from response');
      }
      
      return cid;
    } 
    
    catch (error) {
      console.error('Client error uploading to IPFS:', error);
      throw error;
    }
  };
  
/**
 * creates and uploads ERC721 metadata JSON for an NFT
 * @param {string} imageCid - CID of the image
 * @param {string} name - name of the NFT
 * @param {string} description - description of the NFT
 * @returns {Promise<string>} - CID of the metadata JSON
 */
export const createAndUploadMetadata = async (imageCid, name, description) => {
  try {
    // ensure the image CID is in the correct format
    let imageUrl = imageCid;
    
    // ensure properly formatted
    if (imageCid && !imageCid.startsWith('http') && !imageCid.startsWith('ipfs://')) {
      imageUrl = `ipfs://${imageCid}`;
    }
    
    // create metadata JSON object following ERC721 metadata standard
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
      attributes: []
    };
    
    const metadataJSON = JSON.stringify(metadata);
    const blob = new Blob([metadataJSON], { type: 'application/json' });
    const metadataFile = new File([blob], 'metadata.json', { type: 'application/json' });
    const metadataCid = await uploadMetadataToIPFS(metadataFile);
    return metadataCid;
  } 
  
  catch (error) {
    console.error('Error creating and uploading metadata:', error);
    throw error;
  }
};

/**
 * uploads metadata JSON file to IPFS
 * @param {File} metadataFile -  metadata JSON file
 * @returns {Promise<string>} -  CID of the metadata
 */
export const uploadMetadataToIPFS = async (metadataFile) => {
  try {
    const formData = new FormData();
    formData.append('file', metadataFile);
    formData.append('network', 'public');

    const response = await axios.post('/api/upload-to-ipfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    let cid = null;
    
    if (response.data.cid) {
      cid = response.data.cid;
    } else if (response.data.data && response.data.data.cid) {
      cid = response.data.data.cid;
    } else if (response.data.ipfsHash) {
      cid = response.data.ipfsHash;
    }
    
    if (!cid) {
      console.error('No CID in metadata response:', response.data);
      throw new Error('Failed to get CID from metadata response');
    }
    
    return cid;
  } 
  
  catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};

/**
 * gets a URL that can be used to fetch content from IPFS
 * @param {string} cid - The IPFS CID
 * @returns {string} - The gateway URL
 */
export const getIPFSUrl = (cid) => {
    if (!cid) {
        return '';
    }

    const cleanedCid = cid.replace('ipfs://', '').trim();
    return `https://ipfs.io/ipfs/${cleanedCid}`;
  };
  

/**
 * formats an IPFS CID with the proper protocol prefix
 * @param {string} cid - IPFS CID
 * @returns {string} - properly formatted IPFS URI
 */
export const formatIPFSUri = (cid) => {
  if (!cid) {
    return '';
  }
  return `ipfs://${cid}`;
}; 