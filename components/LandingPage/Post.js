// Post.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { MdAttachMoney } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';

const Post = () => {
  const [liked, setLiked] = useState(false);

  return (
    <PostContainer>
      <PostHeader>
        <ProfileIcon />
        <Username>sunsetgirl_23</Username>
      </PostHeader>

      <PostImage />

      <PostActions>
        <LikeButton liked={liked} onClick={() => setLiked(!liked)}>
          <MdAttachMoney />
        </LikeButton>
        <ShareButton>
          <IoIosSend />
        </ShareButton>
      </PostActions>

      <Caption>
        <strong>sunsetgirl_23</strong> This concert was everything 🌟🎶
      </Caption>
    </PostContainer>
  );
};

export default Post;

const PostContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const ProfileIcon = styled(CgProfile)`
  font-size: 30px;
  margin-right: 10px;
`;

const Username = styled.div`
  font-weight: bold;
  font-size: 15px;
`;

const PostImage = styled.div`
  height: 400px;
  background: #eee;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
`;

const LikeButton = styled.button`
  background-color: ${({ liked }) => (liked ? '#4caf50' : '#fff')};
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background-color: ${({ liked }) => (liked ? '#45a049' : '#f0f0f0')};
  }
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
`;

const Caption = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #333;

  strong {
    margin-right: 5px;
  }
`;
