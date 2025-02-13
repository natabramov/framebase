import { useState } from "react";

export function usePlayerStats() {
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPlayerStats = async (username, usertag) => {
    if (!username || !usertag) {
      setError("Please enter a valid name and tag");
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/player/${username}/${usertag}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
      setPlayerData(data);
    } 
    
    catch (error) {
        console.error("Error in fetchPlayerStats:", error);
        setPlayerData(null);
        setError(error.message);
        throw new Error(error.message);
    }
  };

  return { playerData, fetchPlayerStats, error };
}
