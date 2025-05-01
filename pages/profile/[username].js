import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getUserByUsername } from '../../firebase/UserServices';
import { useStateContext } from '../../context/StateContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/LandingPage/Sidebar';
import Post from '../../components/LandingPage/Post';

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profileData, setProfileData] = useState(null);
  // loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStateContext();
  
  // sample posts - will be replaced with actual NFT data from blockchain IPFS storage
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const userData = await getUserByUsername(username);
        
        if (userData) {
          setProfileData(userData);
          setPosts([
            {
              username: userData.username,
              caption: "My first NFT post",
              image: "/posts/lori1.jpg",
              nftTokenId: "1",
            },
            {
              username: userData.username,
              caption: "Another great NFT post",
              image: "/posts/lori2.jpg",
              nftTokenId: "2",
            }
          ]);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username]);
  
  const isOwnProfile = user && profileData && user === profileData.walletAddress;
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <Container>
        {loading ? (<LoadingMessage>Loading profile...</LoadingMessage>) : error ? (<ErrorMessage>{error}</ErrorMessage>) : !profileData ? (<ErrorMessage>User not found</ErrorMessage>) : (
          <>
            <Header>
              <ProfilePic />
              <Info>
                <Username>@{profileData.username}</Username>
                <Bio>{profileData.bio || ""}</Bio>
                <WalletAddress>
                  Wallet Address: {profileData.walletAddress}
                </WalletAddress>
                {isOwnProfile && (
                  <EditButton onClick={() => router.push(`/profile/edit/${username}`)}>
                    Edit Profile
                  </EditButton>
                )}
              </Info>
            </Header>
            
            <SectionTitle>NFT Posts</SectionTitle>
            
            <Grid>
              {posts.length === 0 ? (
                <EmptyState>No NFTs yet. Mint your first NFT post!</EmptyState>
              ) : (
                posts.map((post, idx) => (
                  <GridItem key={idx}>
                    <Post
                      username={post.username}
                      caption={post.caption}
                      image={post.image}
                    />
                  </GridItem>
                ))
              )}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 80px 40px;
  background-color: rgb(250, 250, 250);
  min-height: 100vh;
  margin-left: 220px;
  font-family: "Inter", serif;

  @media (max-width: 1200px) {
    margin-left: 70px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 80px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfilePic = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgb(187, 187, 187);
  margin-right: 20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Bio = styled.p`
  margin: 4px 0 0;
  color: rgb(102, 102, 102);
`;

const WalletAddress = styled.p`
  font-family: monospace;
  color: rgb(102, 102, 102);
  margin: 4px 0 0;
`;


const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

const GridItem = styled.div`
  flex: 1 1 300px;
  min-width: 300px;
`;

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px;
  background-color:rgb(245, 245, 245);
  border-radius: 8px;
  color: rgb(102, 102, 102);
`;

const EditButton = styled.button`
  background-color: #283618;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-start;
`;

const LoadingMessage = styled.h2`
  text-align: center;
  margin-top: 50px;
`;

const ErrorMessage = styled.h2`
  text-align: center;
  margin-top: 50px;
  color: #c62828;
`;

export default ProfilePage;