import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { MdAttachMoney } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { FaRegHeart, FaHeart, FaRegComment, FaRegPaperPlane } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import Link from 'next/link';
import { useStateContext } from '../../context/StateContext';
import { likePost, unlikePost, hasUserLikedPost, getPostLikes, addComment, getPostComments, getPost } from '../../firebase/PostServices';
import { getUserByWalletAddress } from '../../firebase/UserServices';
import { ethers } from 'ethers';
import PostNFT from "../../contracts/PostNFT.json";

const contractAddress = process.env.NEXT_PUBLIC_POST_NFT_CONTRACT_ADDRESS;

const Post = ({ username, caption, image, tokenId }) => {
  const { user, provider } = useStateContext();
  // probably will get rid of this
  const [traded, setTraded] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameCache, setUsernameCache] = useState({});
  
  // post details containing information about the NFT
  const [showDetails, setShowDetails] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!tokenId) {
      return;
    }
    // load initial social data like likes and comments
    const loadSocialData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          const hasLiked = await hasUserLikedPost(tokenId, user);
          setLiked(hasLiked);
        }
        
        const likes = await getPostLikes(tokenId);
        setLikeCount(likes.length);
        
        const postComments = await getPostComments(tokenId);
        setComments(postComments);
        
        // set for existing comments
        const userAddresses = [...new Set(postComments.map(comment => comment.user))];
        const usernameMap = {};
        
        for (const address of userAddresses) {
          const userData = await getUserByWalletAddress(address);
          if (userData) {
            usernameMap[address] = userData.username;
          }
        }
        
        setUsernameCache(usernameMap);
      } 
      
      catch (error) {
        console.error("Error loading post social data:", error);
      } 
      
      finally {
        setLoading(false);
      }
    };
    
    loadSocialData();
  }, [tokenId, user]);

  // like/unlike toggles
  const handleLikeToggle = async () => {
    if (!user || !tokenId) {
      return;
    }
    
    try {
      if (liked) {
        await unlikePost(tokenId, user);
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } 
      
      else {
        await likePost(tokenId, user);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like/unlike:", error);
    }
  };

  // comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim() || !tokenId) return;
    
    try {
      // add comment to Firebase, ties it to the post by tokenId
      const commentId = await addComment(tokenId, user, commentText.trim());
      
      // Get or use cached username for the current user
      let username = usernameCache[user];
      if (!username) {
        const userData = await getUserByWalletAddress(user);
        username = userData?.username || 'Unknown';
        setUsernameCache(prev => ({ ...prev, [user]: username }));
      }
      
      // Add comment to local state
      const newComment = {
        id: commentId,
        user,
        text: commentText.trim(),
        timestamp: new Date()
      };
      
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  // post details like tokenId, creator, owner, created timestamp
  const handleShowDetails = async () => {
    if (!tokenId) return;
    
    try {
      setLoading(true);
      
      // post details from Firebase
      const postData = await getPost(tokenId);
      
      // post details from blockchain
      if (provider) {
        const contract = new ethers.Contract(contractAddress, PostNFT.abi, provider);
        const onChainDetails = await contract.getPostDetails(tokenId);
        
        const owner = await contract.ownerOf(tokenId);
        
        postData.owner = owner;
        postData.createdTimestamp = new Date(Number(onChainDetails[1]) * 1000).toLocaleString();
      }
      
      setPostDetails(postData);
      setShowDetails(!showDetails);
    } 
    
    catch (error) {
      console.error("Error getting post details:", error);
    } 
    
    finally {
      setLoading(false);
    }
  };

  // images are not loading
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <PostContainer>
      <PostHeader>
        <ProfileIcon />
        <UsernameLink href={`/profile/${username}`}> 
          <Username>{username}</Username>
        </UsernameLink>
        <MoreButton onClick={handleShowDetails}>
          <FiMoreHorizontal />
        </MoreButton>
      </PostHeader>
      {imageError ? (
        <PostImageFallback><div>Image could not be loaded</div></PostImageFallback>) : (
        <PostImage 
          src={image} 
          alt={`Post by ${username}`} 
          onError={handleImageError}
        />
      )}
      <PostActions>
        <ActionGroup>
          <ActionButton onClick={handleLikeToggle} active={liked} disabled={!user}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </ActionButton>
          <ActionButton onClick={toggleComments}>
            <FaRegComment />
          </ActionButton>
          {/* will most likely remove this */}
          <TradeButton traded={traded} onClick={() => setTraded(!traded)}>
            <MdAttachMoney />
          </TradeButton>
        </ActionGroup>
      </PostActions>

      {/* show 1 like or 2+ likes */}
      {likeCount > 0 && (<LikesCount>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</LikesCount>)}

      <Caption>
        <strong>{username}</strong> {caption}
      </Caption>
      
      {/* NFT details */}
      {showDetails && postDetails && (
        <DetailsSection>
          <DetailsHeader>NFT Details</DetailsHeader>
          <DetailRow>
            <DetailLabel>Token ID:</DetailLabel>
            <DetailValue>{tokenId}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Creator:</DetailLabel>
            <DetailValue>{postDetails.creator}</DetailValue>
          </DetailRow>
          {postDetails.owner && (
            <DetailRow>
              <DetailLabel>Owner:</DetailLabel>
              <DetailValue>{postDetails.owner}</DetailValue>
            </DetailRow>
          )}
          {postDetails.createdTimestamp && (
            <DetailRow>
              <DetailLabel>Created:</DetailLabel>
              <DetailValue>{postDetails.createdTimestamp}</DetailValue>
            </DetailRow>
          )}
          <CloseDetailsButton onClick={() => setShowDetails(false)}>
            Close
          </CloseDetailsButton>
        </DetailsSection>
      )}
      
      {/* comments */}
      {showComments && (
        <CommentsSection>
          {comments.length > 0 ? (
            <CommentsList>
              {comments.map(comment => (
                <Comment key={comment.id}>
                  <CommentUsername href={`/profile/${usernameCache[comment.user] || 'unknown'}`}>
                    {usernameCache[comment.user] || 'Unknown'}
                  </CommentUsername>
                  {comment.text}
                </Comment>
              ))}
            </CommentsList>
          ) : (
            <NoComments>No comments yet</NoComments>
          )}
          
          {user && (
            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInput
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <CommentButton type="submit" disabled={!commentText.trim()}>
                <FaRegPaperPlane />
              </CommentButton>
            </CommentForm>
          )}
        </CommentsSection>
      )}
    </PostContainer>
  );
};

const UsernameLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const PostContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border: 1px solid rgb(219, 219, 219);
  border-radius: 10px;
  margin-bottom: 20px;
  font-family: "Inter", serif;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
`;

const ProfileIcon = styled(CgProfile)`
  font-size: 30px;
  margin-right: 10px;
`;

const Username = styled.div`
  font-weight: bold;
  font-size: 15px;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  display: block;
`;

const PostImageFallback = styled.div`
  width: 100%;
  height: 300px;
  background-color: rgb(240, 240, 240);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgb(102, 102, 102);
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  color: ${props => props.active ? 'rgb(231, 76, 60)' : 'rgb(51, 51, 51)'};
  
  &:hover {
    opacity: 0.7;
  }
`;

const TradeButton = styled.button`
  background-color: ${({ traded }) => (traded ? 'rgb(125, 240, 129)' : 'white')};
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
`;

const LikesCount = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0 16px;
`;

const Caption = styled.div`
  padding: 8px 16px 16px;
  font-size: 14px;
  color: black;

  strong {
    margin-right: 5px;
  }
`;

const CommentsSection = styled.div`
  border-top: 1px solid rgb(239, 239, 239);
  padding: 8px 16px;
`;

const CommentsList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  margin-bottom: 8px;
`;

const Comment = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
`;

const CommentUsername = styled(Link)`
  font-weight: bold;
  color: rgb(51, 51, 51);
  text-decoration: none;
  margin-right: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NoComments = styled.div`
  color: rgb(142, 142, 142);
  font-size: 14px;
  margin: 8px 0;
`;

const CommentForm = styled.form`
  display: flex;
  border-top: 1px solid rgb(239, 239, 239);
  padding-top: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  
  &::placeholder {
    color: rgb(142, 142, 142);
  }
`;

const CommentButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: rgb(0, 149, 246);
  display: flex;
  align-items: center;
  opacity: ${props => props.disabled ? 0.3 : 1};
  
  &:disabled {
    cursor: default;
  }
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: rgb(51, 51, 51);
  margin-left: auto;
  padding: 5px;
  display: flex;
  align-items: center;
`;

const DetailsSection = styled.div`
  border-top: 1px solid rgb(239, 239, 239);
  padding: 10px 16px;
  font-size: 14px;
  background-color: rgb(250, 250, 250);
`;

const DetailsHeader = styled.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 6px;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  margin-right: 10px;
  min-width: 80px;
`;

const DetailValue = styled.span`
  word-break: break-all;
  font-family: monospace;
  font-size: 12px;
`;

const CloseDetailsButton = styled.button`
  background-color: rgb(40, 54, 24);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 12px;
`;

export default Post;