const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {

    const { username, usertag } = req.query;
    
    try {
        // gets the user data which contains PUUID. PUUID is needed for the second call
        const userDataURL = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${usertag}?api_key=${API_KEY}`;
        
        // riot requires headers for their API requests
        const userDataResponse = await fetch(userDataURL, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!userDataResponse.ok) {
            console.error("Error with Riot API: ", userDataResponse.status)
        }
        
        const userData = await userDataResponse.json();
        const puuid = userData.puuid;

        // uses PUUID to get match history
        const matchDataURL = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${API_KEY}`;

        const matchDataResponse = await fetch(matchDataURL, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!matchDataResponse.ok) {
            console.error("Error with Riot API: ", matchDataResponse.status)
          }
          const matchIDsData = await matchDataResponse.json();
          // for loop that goes through all matches in matchIDsData to get the detailed information for each match
          const allMatchData = await fetchAllMatches(matchIDsData, API_KEY);

          // send all API fetches as a JSON altogether pertaining to user match data
          res.status(200).json({ ...userData, matchIDsData, allMatchData });
    }
    
    catch (error) {
        res.status(500).json({error: "Failed to fetch Riot user data"});
    }
}

async function fetchAllMatches(matchIDsData, API_KEY) {
    let allMatchData = [];

    // iterate over all matches in matchIDsData
    for (const matchID of matchIDsData) {
        // this api call gets detailed match data for a specific match
        const url = `https://americas.api.riotgames.com/tft/match/v1/matches/${matchID}?api_key=${API_KEY}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "X-Riot-Token": API_KEY },
            });

            if (!response.ok) {
                console.error("Error fetching match", matchID);
                // continue fetching even if one match fails
                continue;
            }
            const matchData = await response.json();
            allMatchData.push(matchData);

        } 
        catch (error) {
            console.error("Error fetching match", matchID);
        }
    }

    return allMatchData;
}
