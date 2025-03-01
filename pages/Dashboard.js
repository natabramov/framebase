import { usePlayerStats } from "../hooks/usePlayerStats";
import SignedInHeader from "@components/Dashboard/SignedInHeader";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStateContext } from '/context/StateContext';
import { useRouter } from 'next/router';
import { signOutUser } from '/backend/Auth';
import { fetchPlayerMatchData } from "../backend/fetchPlayerMatchData"; // Updated import name

const Dashboard = () => {

  const { user, setUser } = useStateContext();
  const router = useRouter();
  const [playerMatchData, setPlayerMatchData] = useState([]); // Updated state variable
  const { playerData, fetchPlayerStats, error } = usePlayerStats();
  console.log(user);

  useEffect(() => {
    if (!user){
      router.push('/');
    } 
    else if (user.riotUsername && user.riotUsertag) {
      fetchPlayerStats(user.riotUsername, user.riotUsertag);
    }    
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOutUser(setUser);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching player match data for:", playerData?.matchData.info.participants);
    
    const loadMatchData = async () => {
      if (playerData) {
        const matchData = await fetchPlayerMatchData(playerData);
        // Sort the match data by placement
        const sortedMatchData = matchData.sort((a, b) => a.placement - b.placement);
        console.log("Sorted match data:", sortedMatchData);
        setPlayerMatchData(sortedMatchData);
      }
    };

    loadMatchData();
  }, [playerData]);

  return (
    <>
      <SignedInHeader>
        <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
      </SignedInHeader>
      {user ? (<p>Statistics dashboard page. Welcome, {user.riotUsername}#{user.riotUsertag}</p>) : (<p>You are signed out.</p>)}
      {error && <p>Error: {error}</p>}
      {playerData && (
        <div>
          <h2>{playerData.gameName}#{playerData.tagLine}</h2>
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        </div>
      )}
      <ImageGrid>
        {playerMatchData.map(({ 
          puuid, 
          imageUrl, 
          riotIdGameName,
          riotIdTagline,
          placement,
          finalLevel,
          roundEliminated,
          goldLeft,
          dmgToPlayers,
          traitImages,
          unitImages }) => (
          <ImageWrapper key={puuid}>
            <StyledImage src={imageUrl} alt="Tactician" />
            <UsernameText>{riotIdGameName}#{riotIdTagline}</UsernameText>
            <PlacementText>Placement: {placement}</PlacementText>
            <RandomText>Level: {finalLevel}</RandomText>
            <RandomText>Round eliminated: {roundEliminated}</RandomText>
            <RandomText>Gold left: {goldLeft}</RandomText>
            <RandomText>Total damage to players: {dmgToPlayers}</RandomText>
            <TraitImageContainer>
              {traitImages.map((traitUrl, index) => (
                <TraitImage key={index} src={traitUrl} alt="Trait" />
              ))}
            </TraitImageContainer>
            <TraitImageContainer>
            {unitImages.map((traitUrl, index) => (
              <TraitImage key={index} src={traitUrl} alt="Unit" />
            ))}
          </TraitImageContainer>
          </ImageWrapper>
        ))}
      </ImageGrid>
    </>
  );
};

const SignOutButton = styled.button`
  padding: 10px 20px;
  background-color:#004346;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    background-color:rgb(0, 107, 112);
  }
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  background-color: rgb(255, 103, 65);
`;

const ImageWrapper = styled.div`
  margin: 10px;
`;

const StyledImage = styled.img`
  width: auto;
  height: auto;
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
`;

const PlacementText = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  color: #333;
`;

const UsernameText = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  color: rgb(85, 73, 255);
`;

const RandomText = styled.p`
text-align: center;
font-size: 14px;
font-weight: bold;
margin-top: 5px;
color: rgb(138, 0, 156);
`;

const TraitImageContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 5px;
`;

const TraitImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export default Dashboard;
