/**
 * Default Profile Page Template
 * 
 * This is a static template/placeholder for the profile page.
 * In the actual application flow, users are directed to the dynamic
 * profile page at /profile/[username] instead of this page.
 * 
 * This page demonstrates the UI layout and styling of the profile page
 * with example content and placeholder data.
 */

import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/LandingPage/Sidebar';
import Post from '../components/LandingPage/Post';
import Navbar from '../components/Navbar';
import { CgProfile } from 'react-icons/cg';

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Container>
        <Header>
          <ProfileIcon />
          <Info>
            <Username>@username</Username>
            <Bio>example bio</Bio>
          </Info>
        </Header>
        <Grid>
        <GridItem>
          <Post
            username="username"
            caption="tyrol, austria"
            image="/posts/austria.jpg"
          />
        </GridItem>
        <GridItem>
          <Post
            username="username"
            caption="munich, germany"
            image="/posts/munich.jpg"
          />
        </GridItem>
        <GridItem>
          <Post
            username="username"
            caption="casablanca, morocco"
            image="/posts/casablanca.jpg"
          />
        </GridItem>
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

const ProfileIcon = styled(CgProfile)`
  font-size: 80px;
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