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

        const url2 = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`;

        const response2 = await fetch(url2, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!response2.ok) {
            const errorText = await response2.text();
            throw new Error(`Second API error: ${response2.status} - ${errorText}`);
          }
          const matchIDsData = await response2.json();

        const firstMatch = matchIDsData[0]

        const url3 = `https://americas.api.riotgames.com/tft/match/v1/matches/${firstMatch}?api_key=${API_KEY}`;

        const response3 = await fetch(url3, {
            method:"GET",
            headers: { "X-Riot-Token": API_KEY },
        })

        if (!response3.ok) {
            const errorText = await response3.text();
            throw new Error(`Riot API error: ${response3.status} - ${errorText}`);
        }
        
        const matchData = await response3.json();

          res.status(200).json({ ...userData, matchIDsData, matchData });
    }
    
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
