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
import Link from "next/link";


const CombatIcon = '/Combat_Icon.png';

const Dashboard = () => {

  // hooks for user and playerData
  const { user, setUser } = useStateContext();
  const { playerData, fetchPlayerStats } = usePlayerStats();

  const [playerMatchData, setPlayerMatchData] = useState([]);
  const [rankedData, setRankedData] = useState([]);

  // initially loading
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // if the user is not detected, push them back to index.js. otherwise, fetch their data
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

  // this use effect fetches the player's rank, ex. Diamond, and uses this rank to fetch the related icons
  useEffect(() => {
    const fetchRankedDataIcons = async () => {
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
            // sort the icons in the order above, standard Ranked comes first
            icons.sort((a,b) => order[a.queueType] - order[b.queueType]);
            setRankedData(icons);
          } 
          else {
            setRankedData(data);
          }
        } 
        catch (error) {
          console.error("Error fetching rank data:", error);
        }
      }
    };
    fetchRankedDataIcons();
  }, [playerData]);
  
  // loads match data images from firebase storage
  useEffect(() => {
    const loadMatchData = async () => {
      
      // this takes a while to load, so i made sure to add a loading symbol
      setLoading(true);

      let matchDataArray = [];

      if (playerData) {
        // if the data exists, iterate through all matches and fetch the match data icons for each match
        for (let i = 0; i < playerData.allMatchData.length; i++) {
          const match = playerData.allMatchData[i];
        try {
          const matchData = await fetchPlayerMatchData(match);
          matchDataArray.push(matchData);
        }
        catch (error) {
          console.log("Error loading match data images:", error);
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

  // renders the stars above unit depending on if the player got the unit to 2*, 3*, or 4*
  const renderStars = (tier) => {
    let stars = [];
    for (let i = 0; i < tier; i++) {
      // create an array of the correct amount of stars
      stars.push(<StarIcon key={i} tier={tier}><FaStar /></StarIcon>);
    }
    return stars;
  };

  // in the API fetch, the gamemode queues are in different names from what they are called in game, so I adjusted the labels
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
        {/* creates cards displaying the different amount of ranks in the game */}
        {rankedData.map((entry) => (
                  <PlayerRankCard key={entry.queueType}>
                    <RankedInfo>
                      {getQueueLabel(entry.queueType)}
                    </RankedInfo>
                    <RankedImage src={entry.rankedIconUrl} alt="Rank Icon" />
                    <RankedInfo>
                      {entry.ratedTier || entry.tier}{" "}
                      {/* hyperroll uses ratedRating instead of leaguePoints */}
                      {entry.ratedRating ? `${entry.ratedRating} LP` : `${entry.rank} ${entry.leaguePoints} LP`}
                    </RankedInfo>
                  </PlayerRankCard>))}
      </PlayerInfo>

      <YouTubeLinkContainer>
          <YouTubeLink href="/Dashboard/YouTubeVideos">Click here for YouTube Coaching Videos</YouTubeLink>
      </YouTubeLinkContainer>
      

      <InnerPageContainer>
        <MiddleContainer>
        {loading ? (<SpinnerContainer><Spinner /><p>Loading match history...</p><p>(This may take up to a minute)</p></SpinnerContainer>) : (
          // if not loading, display the match data. this match data includes all icons that are related to the game, including
          // player profile pictures, final levels, damage dealt to other players, all trait images that were played, and all units including star info
          playerMatchData?.map((match, matchIndex) => (
            <MatchContainer key={matchIndex}>

              <MatchTimeHeader>MATCH {matchIndex + 1} - {match[matchIndex].matchTime}</MatchTimeHeader>
              {match.map((participant) => (
                <ImageWrapper key={participant.puuid}>
              <MatchDataContainer>

                <MatchDataHeader>
                  {/* I separated the header into the left and right side so I could align the traits on the right part of the div */}  
                  <LeftSide>
                    <PlacementText placement={participant.placement}>{participant.placement}</PlacementText>
                      
                    {/* player profile picture (tactician), final level, and full riot name + tag */}
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

                    {/* trait icons that are aligned to right side of div with space-between */}
                    <ImageContainer>
                      {participant.traitImages.map((traitUrl, index) => (
                        <TraitImage key={index} src={traitUrl} alt="Trait" />
                      ))}
                    </ImageContainer>
                </MatchDataHeader>

                {/* all unit icons including the stars to be rendered for each unit. everything above 1* is rendered */}
                <UnitDataDiv>
                  <ImageContainer>
                  {participant.units.map((unit, index) => (
                    <UnitWrapper key={index}>
                      <StyledUnitImage src={unit.imageUrl} alt="Unit" />
                      {unit.tier > 1 && (<StarOverlay>{renderStars(unit.tier)}</StarOverlay>)}
                    </UnitWrapper>  
                  ))}
                  </ImageContainer>
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

// the placement color is dynamic depending on 1st-4th and 5th-8th. 1-4 is a win and 5-8 is a loss
const getPlacementColor = (placement) => {
  switch (placement) {
    case 1: 
      return "#facf43"; // gold
    case 2: 
      return "#f57fd9"; // pink
    case 3: 
      return "#6fd9fc"; // blue
    case 4: 
      return "#6ffc82"; // green
    default: 
      return "#8a8484"; // grey for 5-8
  }
};

// star color is dynamic depending on how many stars the unit has. 2* is silver, 3* is gold, and 4* is green
const getStarColor = (tier) => {
  switch (tier) {
    case 2: 
      return "#cee9fc"; // silver
    case 3: 
      return "#facf43"; // gold
    default: 
      return "#65B891"; // green for 4*
  }
};


const GreetingContainer = styled.div`
  color: white;
  padding: 20px 10px;
`;

const InfoContainer = styled.div`
  color: rgb(223, 255, 219);
  padding: 20px 0px;
`;

const YouTubeLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  `

const YouTubeLink = styled(Link)`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.5s ease;
  display: inline-block; // keeps buttons side by side
  background: rgb(101,184,145);
  background: radial-gradient(circle, rgba(101,184,145,1) 0%, rgba(0,144,150,1) 100%);
  padding: 0.8em 2em;
  color: white;
  border-radius: 100em;
  border-width: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none; // no underline for link

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
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

// https://www.w3schools.com/howto/howto_css_loader.asp
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #004346;
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
  `;

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
  font-family: "Inter", serif;
  width: 100%;
  height: 100vh;
  background-color: rgb(12, 44, 5);
  `;

const InnerPageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: rgb(12, 44, 5);
  `;
  
const Header = styled.div`
  display: flex;
  align-items: left;
  justify-content: left;
  padding: 0 15px;
  font-family: "Inter", serif;
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
  box-shadow: 0px 4px 10px rgba(36, 36, 36, 0.1);
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

  const ImageContainer = styled.div`
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
  // pass placement as a prop to get the placement color
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
`;

const RiotName = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: rgb(255, 208, 208);
`;

const StyledIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 0px;
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: white;
`;

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
// passes tier as a prop, same way as placement from above
  color: ${({ tier }) => getStarColor(tier)};
  font-size: 1rem;
`;


export default Dashboard;
