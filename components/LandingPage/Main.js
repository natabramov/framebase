import React from 'react';
import styled from 'styled-components';
import { IoIosHome, IoIosSearch, IoIosAdd, IoIosNotifications } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import Post from './Post';
import SidebarButton from './SidebarButton';

const MainPage = () => {
  return (
    <Container>
      <Sidebar>
      <SidebarButton icon={IoIosHome} label="Home" />
        <SidebarButton icon={IoIosSearch} label="Search" />
        <SidebarButton icon={IoIosAdd} label="Post" />
        <SidebarButton icon={IoIosNotifications} label="Notifications" />
        <SidebarButton icon={CgProfile} label="Profile" />
      </Sidebar>

      <Feed>
        <Post />
        <Post />
      </Feed>

      <RightSpace />
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #fafafa;
  position: relative;
  overflow-y: visible;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 56px;
  height: 100vh;
  width: 220px;
  background-color: #fff;
  border-right: 1px solid lightgray;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1200px) {
    width: 70px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Feed = styled.div`
  flex: 1;
  margin-left: 180px; /* keep this for sidebar offset */
  padding: 80px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSpace = styled.div`
  flex: 0.2;
`;
