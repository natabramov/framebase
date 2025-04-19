import styled from 'styled-components';
import SidebarButton from './SidebarButton';
import { IoIosHome, IoIosSearch, IoIosAdd, IoIosNotifications } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import CreatePostPopup from '../CreatePostPopup';
import React, { useState } from 'react';

const Sidebar = () => {
    const [showModal, setShowModal] = useState(false);

  return (
    <>
    <SidebarContainer>
        <SidebarButton icon={IoIosHome} label="Home" href="/" />
        <SidebarButton icon={IoIosSearch} label="Search" href="/search" />
        <SidebarButton icon={IoIosAdd} label="Post" onClick={() => setShowModal(true)}/>
        <SidebarButton icon={IoIosNotifications} label="Notifications" href="/notifications" />
        <SidebarButton icon={CgProfile} label="Profile" href="/profile" />
    </SidebarContainer>
    {showModal && <CreatePostPopup onClose={() => setShowModal(false)} />}
    </>
  );
};

// needs to be always visible and on top of other components
const SidebarContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 56px;
  height: 100vh;
  width: 220px;
  background-color: white;
  border-right: 1px solid lightgray;
  padding: 20px 0;
  gap: 16px;

  // dynamically changes if the side bar icons are collapsed
  @media (max-width: 1200px) {
    width: 70px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export default Sidebar;