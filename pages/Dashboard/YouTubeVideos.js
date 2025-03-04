import React, { useState, useEffect } from "react";
import { useStateContext } from "/context/StateContext"; 
import { useRouter } from "next/router";
import { usePlayerStats } from "../../hooks/usePlayerStats";
import styled from 'styled-components';
import SignedInHeader from "@components/Dashboard/SignedInHeader";
import { signOutUser } from '/backend/Auth';
import Link from 'next/link';

const YouTubeVideos = () => {
  const { user, setUser } = useStateContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { playerData, fetchPlayerStats } = usePlayerStats();
  const [rankedData, setRankedData] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user.riotUsername && user.riotUsertag) {
      fetchPlayerStats(user.riotUsername, user.riotUsertag);
    }
  }, [user]);

  const handleSignOut = async () => {
      try {
        await signOutUser(setUser);
        router.push('/');
      } 
      catch (error) {
        console.error("Error signing out:", error);
      }
    };

  // gets ranked data from user which is used for youtube query
  useEffect(() => {
    const fetchRankedData = async () => {
      if (playerData && playerData.puuid) {
        try {
          const res = await fetch(`/api/playerRanks?puuid=${playerData.puuid}`);
          const data = await res.json();
          if (data) {
            setRankedData(data);
          } 
          else {
            setRankedData(null);
          }
        } 
        catch (error) {
          console.error("Error fetching rank data:", error);
        }
      }
    };
    fetchRankedData();
  }, [playerData]);

  // gets youtube videos based on rank, sets rank as query for api request
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user || !rankedData || rankedData.length === 0) {
        return;
      }

      try {
        const response = await fetch(`/api/fetchYouTubeVideos?rank=${rankedData[2].tier}`);

        if (!response.ok) {
          console.error("Error fetching ranked data from API:", response.status);
        }

        const data = await response.json();
        setVideos(data.videos);
      } 
      
      catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } 
      
      finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, rankedData]);

  return (
    <>
    <SignedInHeader>
    <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
    </SignedInHeader>
    <Header>
      <h1>YouTube Coaching Videos for {user.riotUsername}#{user.riotUsertag}</h1>
      <GoBackLink href="/Dashboard">Back to Dashboard</GoBackLink>
    </Header>
    
      {loading ? (<SpinnerContainer><Spinner /><p>Loading videos...</p></SpinnerContainer>)  : (
    <PageContainer>
      {videos.map((video) => (
        <VideoContainer key={video.videoId}>
          <VideoTitle>{video.title}</VideoTitle>
          {/* I used dangerously set inner HTML here so that React knows the DOM has been modified 
              https://legacy.reactjs.org/docs/dom-elements.html */}
          <VideoCard dangerouslySetInnerHTML={{ __html: video.embedHtml }}></VideoCard> 
        </VideoContainer>
      ))}
    </PageContainer>

      )}
    </>

  );
};

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: "Inter", serif;
  gap: 10px;
  padding: 20px;
  align-items: center;
  justify-content: center;
  background-color: rgb(12, 44, 5);
  min-height: 100vh;
  `

const Header = styled.div`
  display: flex;
  align-items: left;
  justify-content: space-between;
  padding: 0 15px;
  font-family: "Inter", serif;
  font-weight: bold;
  font-size: 1.25em;
  background-color: rgb(12, 44, 5);
  color: rgb(223, 255, 219);
  padding: 20px;
`;

const GoBackLink = styled(Link)`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.5s ease;
  background: rgb(232, 253, 243);
  font-family: "Inter", serif;
  padding: 0.8em 2em;
  color: black;
  border-radius: 100em;
  border-width: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;

&:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
}`;

const VideoCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  flex-grow: 1; // makes sure the embedded video grows with page scaling
`

const VideoTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 20px;
  box-shadow: 0px 4px 12px rgba(2, 73, 0, 0.98);
  border-radius: 8px;
  font-size: 16pt;
  padding: 10px;
  background-color: rgb(223, 255, 219);
  `;

const VideoContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 40em;
  flex-direction: column;
  min-height: 28em;
  `


const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-family: "Inter", serif;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #004346;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

  const SignOutButton = styled.button`
    padding: 10px 20px;
    background-color:rgb(12, 71, 32);
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;
    &:hover {
      background-color:rgb(0, 107, 112);
    }
  `;

export default YouTubeVideos;
