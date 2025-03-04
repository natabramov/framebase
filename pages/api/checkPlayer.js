const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {
  const { username, usertag } = req.query;

  try {
    // gets generic player information, this function just checks if the response is okay, meaning the riot user
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${usertag}?api_key=${API_KEY}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Riot-Token": API_KEY },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({error: "Riot ID not found"});
      }
      
      return res.status(response.status).json({error: "Riot API error"});
    }

    const data = await response.json(); 
    return res.status(200).json({data});
  } 
  catch (error) {
    return res.status(500).json({error: "Failed to check player's Riot ID"});
  }
}
