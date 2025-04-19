import React from 'react';
import styled from 'styled-components';
import Post from './Post';
import Sidebar from './Sidebar';

const MainPage = () => {
  return (
    <Container>
      <Sidebar/>

      <Feed>
        <Post
          username="username"
          caption="tyrol, austria"
          image="/posts/austria.jpg"
        />

        <Post
          username="username"
          caption="munich, germany"
          image="/posts/munich.jpg"
        />

        <Post
          username="username"
          caption="casablanca, morocco"
          image="/posts/casablanca.jpg"
        />
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

export default MainPage;