import { db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, arrayUnion, arrayRemove, serverTimestamp, orderBy, limit, deleteDoc, increment } from 'firebase/firestore';
import { getIPFSUrl } from '../utils/ipfs';

// store a new post in Firebase when it's minted as an NFT
export const createPost = async (tokenId, creatorAddress, metadataUri, mediaIpfsHash, caption) => {
  try {
    await setDoc(doc(db, "posts", tokenId.toString()), {
      tokenId: tokenId,
      creator: creatorAddress,
      metadataUri: metadataUri,
      mediaIpfsHash: mediaIpfsHash,
      caption: caption,
      createdAt: serverTimestamp(),
      likeCount: 0,
      commentCount: 0
    });
    
    // add the post to the user's posts collection
    const userPostRef = doc(db, "users", creatorAddress, "posts", tokenId.toString());
    await setDoc(userPostRef, { tokenId: tokenId });
    return true;
  } 
  
  catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// get a post by token ID
export const getPost = async (tokenId) => {
  try {
    const postDoc = await getDoc(doc(db, "posts", tokenId.toString()));
    if (postDoc.exists()) {
      return postDoc.data();
    }
    return null;
  } 
  
  catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};

// get all posts from Firebase
export const getAllPosts = async (limitCount = 20) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    
    // for each post, get the creator's username
    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      
      // try to get creator's username
      let username = "unknown";
      try {
        const creatorDoc = await getDoc(doc(db, "users", postData.creator));
        if (creatorDoc.exists()) {
          username = creatorDoc.data().username;
        }
      } 
      
      catch (error) {
        console.error("Error getting creator info:", error);
      }
      
      // get the appropriate IPFS hash for the image -- may need to be changed to cid
      const ipfsHash = postData.mediaIpfsHash || postData.ipfsHash || postData.metadataUri;
      
      // ensure hash is properly formatted
      const imageUrl = ipfsHash ? getIPFSUrl(ipfsHash) : '';
      
      posts.push({
        id: docSnapshot.id,
        tokenId: postData.tokenId,
        username: username,
        caption: postData.caption,
        image: imageUrl,
        creator: postData.creator,
        likeCount: postData.likeCount || 0,
        commentCount: postData.commentCount || 0,
        createdAt: postData.createdAt,
      });
    }
    
    return posts;
  } 
  
  catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
};

// get all posts for a specific user
export const getUserPosts = async (walletAddress) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("creator", "==", walletAddress), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      const ipfsHash = data.mediaIpfsHash || data.ipfsHash || data.metadataUri;
      
      return { 
        id: docSnapshot.id, 
        ...data,
        ipfsHash: ipfsHash,
        image: getIPFSUrl(ipfsHash)
      };
    });
  } 
  
  catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// like a post
export const likePost = async (tokenId, userWalletAddress) => {
  try {
    // add the like to the post's likes collection
    const likeRef = doc(db, "posts", tokenId.toString(), "likes", userWalletAddress);
    await setDoc(likeRef, {
      user: userWalletAddress,
      timestamp: serverTimestamp()
    });
    
    // update the like count on the post
    const postRef = doc(db, "posts", tokenId.toString());
    await updateDoc(postRef, {
      likeCount: increment(1)
    });
    
    return true;
  } 
  
  catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// unlike a post
export const unlikePost = async (tokenId, userWalletAddress) => {
  try {
    // remove the like from the post's likes collection
    const likeRef = doc(db, "posts", tokenId.toString(), "likes", userWalletAddress);
    await deleteDoc(likeRef);
    
    // update the like count on the post
    const postRef = doc(db, "posts", tokenId.toString());
    await updateDoc(postRef, {
      likeCount: increment(-1)
    });
    
    return true;
  } 
  
  catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

// check if a user has liked a post
export const hasUserLikedPost = async (tokenId, userWalletAddress) => {
  try {
    const likeDoc = await getDoc(doc(db, "posts", tokenId.toString(), "likes", userWalletAddress));
    return likeDoc.exists();
  } 
  
  catch (error) {
    console.error("Error checking if user liked post:", error);
    throw error;
  }
};

// get all likes for a post
export const getPostLikes = async (tokenId) => {
  try {
    const likesRef = collection(db, "posts", tokenId.toString(), "likes");
    const querySnapshot = await getDocs(likesRef);
    
    return querySnapshot.docs.map(docSnapshot => docSnapshot.data());
  } 
  
  catch (error) {
    console.error("Error getting post likes:", error);
    throw error;
  }
};

// add a comment to a post
export const addComment = async (tokenId, userWalletAddress, commentText) => {
  try {
    // add the comment to the post's comments collection
    const commentsRef = collection(db, "posts", tokenId.toString(), "comments");
    const commentDoc = await addDoc(commentsRef, {
      user: userWalletAddress,
      text: commentText,
      timestamp: serverTimestamp()
    });
    
    // update the comment count on the post
    const postRef = doc(db, "posts", tokenId.toString());
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    return commentDoc.id;
  } 
  
  catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// delete a comment
export const deleteComment = async (tokenId, commentId) => {
  try {
    // delete the comment
    await deleteDoc(doc(db, "posts", tokenId.toString(), "comments", commentId));
    
    // update the comment count on the post
    const postRef = doc(db, "posts", tokenId.toString());
    await updateDoc(postRef, {
      commentCount: increment(-1)
    });
    
    return true;
  } 
  
  catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// get all comments for a post
export const getPostComments = async (tokenId) => {
  try {
    const commentsRef = collection(db, "posts", tokenId.toString(), "comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
  } 
  
  catch (error) {
    console.error("Error getting post comments:", error);
    throw error;
  }
};

// update ownership of a post when transferred
export const updatePostOwnership = async (tokenId, newOwnerAddress) => {
  try {
    const postRef = doc(db, "posts", tokenId.toString());
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      // get the current owner
      const currentOwner = postDoc.data().owner || postDoc.data().creator;
      
      // update the post with the new owner
      await updateDoc(postRef, {
        owner: newOwnerAddress,
        transferredAt: serverTimestamp()
      });
      
      // remove from previous owner's posts collection if it exists
      if (currentOwner) {
        try {
          await deleteDoc(doc(db, "users", currentOwner, "posts", tokenId.toString()));
        } 
        
        catch (e) {
          console.warn("Could not delete from previous owner's posts", e);
        }
      }
      
      // add to the new owner's posts collection
      await setDoc(doc(db, "users", newOwnerAddress, "posts", tokenId.toString()), { 
        tokenId: tokenId,
        acquiredAt: serverTimestamp()
      });
      
      return true;
    }
    return false;
  } 
  
  catch (error) {
    console.error("Error updating post ownership:", error);
    throw error;
  }
}; 