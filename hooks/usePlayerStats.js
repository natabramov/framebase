import { useState } from "react";

export function usePlayerStats() {
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPlayerStats = async (username, usertag) => {
    if (!username || !usertag) {
      console.error("Please enter a valid name and tag");
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/player/${username}/${usertag}`);
  
      if (!response.ok) {
        console.error("Failed to fetch data");
      }
  
      const data = await response.json();
      setPlayerData(data);
    } 
    
    catch (error) {
        console.error("Error in fetchPlayerStats:", error);
        setPlayerData(null);
    }
  };

  return { playerData, fetchPlayerStats, error };
}
