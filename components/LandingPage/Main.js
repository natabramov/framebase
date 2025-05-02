import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Post from './Post';
import Sidebar from './Sidebar';
import { getAllPosts } from '../../firebase/PostServices';

// helper function to get IPFS URL from CID or path
const getIPFSUrl = (imageSrc) => {
  if (!imageSrc) {
    return '';
  }
  
  if (imageSrc.startsWith('bafy')) {
    return `https://gateway.pinata.cloud/ipfs/${imageSrc}`;
  }

  return imageSrc;
};

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts || []);
      } 
      
      catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } 
      
      finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container>
        <Sidebar />
        <Feed>
          <Text>Loading posts...</Text>
        </Feed>
        <RightSpace />
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar/>

      <Feed>
        {posts.length > 0 ? (
          posts.map(post => (
            <Post
              key={post.id}
              username={post.username}
              caption={post.caption}
              image={getIPFSUrl(post.image)}
              tokenId={post.tokenId || post.id}
            />
          ))
        ) : (
          <Text>No posts yet. Create one!</Text>
        )}
      </Feed>

      <RightSpace />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color:rgb(239, 239, 239);
  position: relative;
  overflow-y: visible;
`;

const Feed = styled.div`
  flex: 1;
  margin-left: 180px;
  padding: 80px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSpace = styled.div`
  flex: 0.2;
`;

const Text = styled.div`
  font-size: 1.2rem;
  color: rgb(102, 102, 102);
  margin-top: 2rem;
`;

export default MainPage;