import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/LandingPage/Sidebar';
import Navbar from "../components/Navbar"

const notifications = [
  {
    id: 1,  // replace this id with wallet address
    username: 'example1',
    type: 'liked',
    message: 'liked your post',
    time: '2h ago',
  },
  {
    id: 2,
    username: 'example2',
    type: 'shared',
    message: 'shared your post',
    time: '5h ago',
  },
  {
    id: 3,
    username: 'example3',
    type: 'liked',
    message: 'liked your post',
    time: '1d ago',
  },
];

export default function NotificationsPage() {
  return (
    <>
    <Navbar/>
    <Sidebar />
    <Container>
      <Feed>
        <Header>Notifications (placeholder, needs to be integrated with backend)</Header>
        {notifications.map((notif) => (
            <NotificationCard key={notif.id}>
            <Username>{notif.username}</Username> {notif.message} <Time>{notif.time}</Time>
          </NotificationCard>
        ))}
      </Feed>
    </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color:rgb(245, 245, 245);
  font-family: "Inter", serif;
`;

const Feed = styled.div`
  flex: 1;
  /* top needs to have most margin */
  padding: 100px 40px 40px 40px;
  margin-left: 220px;

  @media (max-width: 1200px) {
    margin-left: 70px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 80px 20px;
  }
`;

const Header = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const NotificationCard = styled.div`
  background: white;
  border: 1px solid rgb(239, 239, 239);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 16px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const Time = styled.span`
  color: gray;
  font-size: 14px;
  margin-left: 8px;
`;
