import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '/backend/Firebase'; // Adjust path as needed

// in the JSON structure for player ranks, it is all caps. to search up the image we need regular casing
  function fixTierName(tierName) {
    // hyperroll uses different ranks than ranked and double up
    const hyperRollMap = {
      BLUE: "Blue",
      GREEN: "Green",
      GREY: "Grey", 
      PURPLE: "Purple",
      HYPER: "Hyper",
    };
  
    if (hyperRollMap[tierName]) {
      return hyperRollMap[tierName];
    }
  
    const standardMap = {
      IRON: "Iron",
      BRONZE: "Bronze",
      SILVER: "Silver",
      GOLD: "Gold",
      PLATINUM: "Platinum",
      DIAMOND: "Diamond",
      MASTER: "Master",
      GRANDMASTER: "GrandMaster",
      CHALLENGER: "Challenger"
    };
  
    if (standardMap[tierName]) {
      return standardMap[tierName];
    }
  
    return;
  }

export const fetchPlayerRankIcons = async (rankData) => {
  const rankEntriesWithIcons = [];

  for (const entry of rankData) {
    const isHyperRoll = (entry.queueType === "RANKED_TFT_TURBO");

    // tier name differs between hyperroll and ranked/double up
    const tierName = isHyperRoll ? entry.ratedTier : entry.tier;
    const fixedTierName = fixTierName(tierName);
    
    let iconFilename = "";
    if (isHyperRoll) {
      iconFilename = `PostGameScene_RatedIcon_${fixedTierName}.png`;
    } 
    else {
      iconFilename = `TFT_Regalia_${fixedTierName}.png`;
    }

    const rankedIconRef = ref(storage, `dragontail-15.4.1/15.4.1/img/tft-regalia/${iconFilename}`);
    

    try {
      const rankedIconUrl = await getDownloadURL(rankedIconRef);
        // preserve all original fields from entry and add rankedIconsUrl
      rankEntriesWithIcons.push({...entry, rankedIconUrl,});
    } 
    
    catch (error) {
      console.error(`Error fetching rank icon for ${entry.queueType}`, error);
    }
  }
  return rankEntriesWithIcons;
};
