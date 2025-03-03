import { usePlayerStats } from "../hooks/usePlayerStats";
import SignedInHeader from "@components/Dashboard/SignedInHeader";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStateContext } from '/context/StateContext';
import { useRouter } from 'next/router';
import { signOutUser } from '/backend/Auth';
import { fetchPlayerMatchData } from "../backend/fetchPlayerMatchData";
import { fetchPlayerRankIcons } from "../backend/fetchPlayerRankedIcons"; 
import { FaStar } from "react-icons/fa6";


const CombatIcon = '/Combat_Icon.png';

const Dashboard = () => {

  const { user, setUser } = useStateContext();
  const router = useRouter();
  const [playerMatchData, setPlayerMatchData] = useState([]);
  const { playerData, fetchPlayerStats } = usePlayerStats();
  const [loading, setLoading] = useState(true);
  const [rankedData, setRankedData] = useState([]);

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
    } 
    catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchAndSetRankedData = async () => {
      if (playerData && playerData.puuid) {
        try {
          const res = await fetch(`/api/playerRanks?puuid=${playerData.puuid}`);
          const data = await res.json();
          if (data) {
            const icons = await fetchPlayerRankIcons(data);
            const order = {
              "RANKED_TFT": 1,
              "RANKED_TFT_DOUBLE_UP": 2, 
              "RANKED_TFT_TURBO": 3 
            }
            icons.sort((a,b) => order[a.queueType] - order[b.queueType]);
            setRankedData(icons);
          } 
          else {
            setRankedData(data);
          }
        } catch (error) {
          console.error("Error fetching rank data:", error);
        }
      }
    };
    console.log("ranked data", rankedData)
    fetchAndSetRankedData();
  }, [playerData]);
  
    
  useEffect(() => {
    const loadMatchData = async () => {
      setLoading(true);
      let matchDataArray = [];
      if (playerData) {
        for (let i = 0; i < playerData.allMatchData.length; i++) {
          const match = playerData.allMatchData[i];
        try {
          const matchData = await fetchPlayerMatchData(match);
          matchDataArray.push(matchData);
        }
        catch (error) {
          console.log("error:", error);
        }
      }
        
        // sort the match data by placement -- 1st place, 2nd place, etc.
        const sortedMatchData = matchDataArray.map(match => match.sort((a, b) => a.placement - b.placement));
        setPlayerMatchData(sortedMatchData);
      }
      setLoading(false);
    };

    loadMatchData();
  }, [playerData]);

  const renderStars = (tier) => {
    let stars = [];
    for (let i = 0; i < tier; i++) {
      stars.push(<StarIcon key={i} tier={tier}><FaStar /></StarIcon>);
    }
    return stars;
  };

  function getQueueLabel(queueType) {
    switch (queueType) {
      case "RANKED_TFT_TURBO":
        return "Hyperroll";
      case "RANKED_TFT_DOUBLE_UP":
        return "Double Up";
      case "RANKED_TFT":
        return "Ranked";
      default:
        return queueType;
    }
  }
  
  return (
    <>
    <PageContainer>

    <SignedInHeader>
        <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
    </SignedInHeader>
    <Header>
      {user ? (<GreetingContainer>Welcome, {user.riotUsername}#{user.riotUsertag}!</GreetingContainer>) : (<GreetingContainer>You are signed out.</GreetingContainer>)}
      <InfoContainer>Here's your current ranked data: </InfoContainer>
    </Header>
    <PlayerInfo>
    {rankedData.map((entry) => (
              <PlayerRankCard key={entry.queueType}>
                <RankedInfo>
                  {getQueueLabel(entry.queueType)}
                </RankedInfo>
                <RankedImage src={entry.rankedIconUrl} alt="Rank Icon" />
                <RankedInfo>
                  {entry.ratedTier || entry.tier}{" "}
                  {entry.ratedRating ? `${entry.ratedRating} LP` : `${entry.leaguePoints} LP`}
                </RankedInfo>
              </PlayerRankCard>))}
    </PlayerInfo>

    <InnerPageContainer>
      <MiddleContainer>
      {loading ? (<SpinnerContainer><Spinner /><p>Loading match history...</p></SpinnerContainer>) : (
        playerMatchData?.map((match, matchIndex) => (
          <MatchContainer key={matchIndex}>
            <MatchTimeHeader>MATCH {matchIndex + 1} - {match[matchIndex].matchTime}</MatchTimeHeader>
            {match.map((participant) => (
              <ImageWrapper key={participant.puuid}>
              <MatchDataContainer>
              <MatchDataHeader>

                <LeftSide>
                  <PlacementText placement={participant.placement}>{participant.placement}</PlacementText>
                    
                  <ImageLevelWrapper>
                    <StyledImage src={participant.imageUrl} alt="Tactician" />
                    <Level>{participant.finalLevel}</Level>
                  </ImageLevelWrapper>
                  <RiotName>{participant.riotIdGameName}#{participant.riotIdTagline}</RiotName>
                  
                  {/* damage done to players section indicated by a combat icon*/}
                  <StyledDiv>
                    <StyledIcon src={CombatIcon}></StyledIcon>
                      <StyledText>
                      {participant.dmgToPlayers}
                      </StyledText>
                  </StyledDiv>
                </LeftSide>

                {/* I separated the header into the left and right side so I could align the traits on the right part of the div */}
                  <TraitImageContainer>
                    {participant.traitImages.map((traitUrl, index) => (
                      <TraitImage key={index} src={traitUrl} alt="Trait" />
                    ))}
                  </TraitImageContainer>

              </MatchDataHeader>
              <UnitDataDiv>
                <UnitImageContainer>
                {participant.units.map((unit, index) => (
                  <UnitWrapper key={index}>
                    <StyledUnitImage src={unit.imageUrl} alt="Unit" />
                    {unit.tier > 1 && (<StarOverlay>{renderStars(unit.tier)}</StarOverlay>)}
                  </UnitWrapper>  
                ))}
                </UnitImageContainer>
              </UnitDataDiv>
              </MatchDataContainer>
              </ImageWrapper>
            ))}
          </MatchContainer>
        )))}
      </MiddleContainer>
    </InnerPageContainer>
    </PageContainer>

    </>
  );
};

const getPlacementColor = (placement) => {
  switch (placement) {
    case 1: return "#facf43"; // gold
    case 2: return "#f57fd9"; // pink
    case 3: return "#6fd9fc"; // blue
    case 4: return "#6ffc82"; // green
    default: return "#8a8484"; // grey for 5-8
  }
};

const getStarColor = (tier) => {
  if (tier === 2) {
    return "#cee9fc"; // silver
  }
  else if (tier === 3) {
    return "#facf43"; // gold
  }
  else {
    return "#65B891"; // green for 4*
  }
}

const GreetingContainer = styled.div`
  color: white;
  padding: 20px 10px;
  `
const InfoContainer = styled.div`
  color: rgb(223, 255, 219);
  padding: 20px 0px;
  `

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

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;       /* Light gray */
  border-top: 4px solid #004346;/* Accent color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MatchTimeHeader = styled.div`
  display: flex;
  align-items: left;
  font-size: 2em;
  font-weight: bold;
  padding: 20px;
  `

const MatchContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem; // spacing between matches
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const TraitImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const PageContainer = styled.div`
  font-family: var(--font-inter);
  width: 100%;
  height: 100vh;
  background-color: rgb(12, 44, 5);
  `;

const InnerPageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: black;
  background-color: rgb(12, 44, 5);
  `;
  
const Header = styled.div`
  display: flex;
  align-items: left;
  justify-content: left;
  padding: 0 15px;
  font-family: var(--font-inter);
  font-weight: bold;
  font-size: 1.25em;
  `;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  `

const RankedImage = styled.img`
    width: 10em;
    height: 10em;
  `

const RankedInfo = styled.div`
  font-weight: bold;
  color: white;
  border-radius: 8px;
  font-size: 1em;
  padding: 10px 20px;
  box-shadow: 0px 4px 12px rgba(255, 255, 255, 0.1);
  background-color: rgba(1, 65, 22, 0.26);
  `

const PlayerRankCard = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: auto;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 97, 32, 0.77);
  border-radius: 8px;
  `

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: rgb(253, 255, 251);
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 1000px;
  `

// contains both parts of the match data info -- header and unit pictures
const MatchDataContainer = styled.div`
  background-color: #B8E1FF;
  width: 100%;
  max-width: 58rem; 
  border-radius: 8px;
`;

//should contain profile picture, name, and traits
const MatchDataHeader = styled.div`
  background-color: rgb(12, 71, 32);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  `
const UnitDataDiv = styled.div`
  display:flex;
  justify-content: space-around;
  align-items:center;
  width: 100%;
  background-color:  rgb(0, 97, 32);
  padding: 10px 0px;
  `;

  const UnitImageContainer = styled.div`
    display: flex;
    gap: 5px;
    justify-content: center;
  `;

  const StyledUnitImage = styled.img`
    display: flex;
    width: 4.5em;
    height: 4.5em;
    object-fit: cover;
    object-position: 90% 10%; // shifts the image to the right, as riot's full champion image is wide
    border-radius: 8px;
    border: 4px solid #004346;
  `;

const StyledImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
`;

const PlacementText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 2.5em;
  font-size: 1.5em;
  font-weight: bold;
  border-radius: 8px;
  color: ${({ placement }) => getPlacementColor(placement)};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  border: 5px solid ${({ placement }) => getPlacementColor(placement)};
  box-shadow: 0px 0px 10px ${({ placement }) => getPlacementColor(placement)};
`;

const ImageLevelWrapper = styled.div`
  position: relative;
  margin-top: 20px;
  `

//styles the player's ending level of the match, puts it in the bottom right corner of the profile picture image
const Level = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  bottom: 20px;
  left: 40px;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  border: 2px solid white;
  `
const RiotName = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: rgb(255, 208, 208);
  `

const TraitImageContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const StyledIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 0px;
  ` 
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledText = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: white;
`

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UnitWrapper = styled.div`
  position: relative; 
  display: inline-block; 
`;

const StarOverlay = styled.div`
  position: absolute;
  top: -5px; 
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
`;

const StarIcon = styled.div`
  color: ${({ tier }) => getStarColor(tier)};
  font-size: 1rem;
`;


export default Dashboard;
