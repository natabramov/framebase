import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/LandingPage/Sidebar';
import Post from '../../components/LandingPage/Post';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

// eventually will be on web3 storage
const posts = [
    {
      username: "natabr",
      caption: "my silly dog",
      image: "/posts/lori1.jpg",
      nftTokenId: "1",
    },
    {
      username: "natabr",
      caption: "i love my dog",
      image: "/posts/lori2.jpg",
      nftTokenId: "2",
    }
  ];

export default function ProfilePage() {
    const router = useRouter();
    const { username } = router.query;
    return (
        <>
            <Navbar />
            <Sidebar />
            <Container>
                <Header>
                    <ProfilePic />
                    <Info>
                        <Username>@{username}</Username>
                        <Bio>This is {username}'s bio</Bio>
                    </Info>
                </Header>
                <Grid>
                {posts.length === 0 ? (<p>No posts yet.</p>) : (
                    posts.map((post, idx) => (
                    <GridItem key={idx}>
                        <Post
                        username={username}
                        caption={post.caption}
                        image={post.image}
                        />
                    </GridItem>
                    ))
                )}
                </Grid>
            </Container>
        </>
    );
}

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
  background-color:rgb(187, 187, 187);
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
  color:rgb(102, 102, 102);
`;


const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

// puts correct whitespace on different photosizes
const GridItem = styled.div`
  flex: 1 1 300px;
  min-width: 300px;
`;