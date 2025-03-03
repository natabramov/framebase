const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {

    const { username, usertag } = req.query;
    
    try {

        const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${usertag}?api_key=${API_KEY}`;

        const response1 = await fetch(url, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!response1.ok) {
            const errorText = await response1.text();
            throw new Error(`Riot API error: ${response1.status} - ${errorText}`);
        }
        
        const userData = await response1.json();
        const puuid = userData.puuid;

        const url2 = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${API_KEY}`;

        const response2 = await fetch(url2, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!response2.ok) {
            const errorText = await response2.text();
            throw new Error(`Second API error: ${response2.status} - ${errorText}`);
          }
          const matchIDsData = await response2.json();

          const allMatchData = await fetchAllMatches(matchIDsData, API_KEY);

          res.status(200).json({ ...userData, matchIDsData, allMatchData });
    }
    
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllMatches(matchIDsData, API_KEY) {
    let allMatchData = [];

    for (const matchID of matchIDsData) {
        const url = `https://americas.api.riotgames.com/tft/match/v1/matches/${matchID}?api_key=${API_KEY}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "X-Riot-Token": API_KEY },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching match ${matchID}: ${errorText}`);
                continue; // Skip failed requests but continue fetching
            }

            const matchData = await response.json();
            allMatchData.push(matchData);
        } catch (error) {
            console.error(`Error fetching match ${matchID}:`, error);
        }

        await sleep(5);
    }

    return allMatchData;
}
