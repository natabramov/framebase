import React, { useState } from 'react';
import styled from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { MdAttachMoney } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import Link from 'next/link';

const Post = ({ username, caption, image }) => {
  const [traded, setTraded] = useState(false);

  return (
    <PostContainer>
      <PostHeader>
        <ProfileIcon />
        <UsernameLink href={`/profile`}> 
        {/* will be /profile/username in the future^^^ */}
        <Username>{username}</Username>
        </UsernameLink>
      </PostHeader>
      <PostImage src={image} alt="Post" />
      <PostActions>
        <TradeButton traded={traded} onClick={() => setTraded(!traded)}>
          <MdAttachMoney />
        </TradeButton>
        <ShareButton>
          <IoIosSend />
        </ShareButton>
      </PostActions>

      <Caption>
        <strong>{username}</strong> {caption}
      </Caption>
    </PostContainer>
  );
};

const UsernameLink = styled(Link)`
  text-decoration: none;
  color: black;
  `

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
  object-fit: cover;
  display: block;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
`;

const TradeButton = styled.button`
  background-color: ${({ traded }) => (traded ? '#7df081' : 'white')};
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  font-size: 20px;
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
`;

const Caption = styled.div`
  padding: 16px;
  font-size: 14px;
  color: black;

  strong {
    margin-right: 5px;
  }
`;

export default Post;