const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {
  const { puuid } = req.query;

  try {
    // fetches the summonerID to be used in the next API req
    const summonerUrl = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
    const responseSummoner = await fetch(summonerUrl, {
      method: "GET",
      headers: { "X-Riot-Token": API_KEY },
    });

    if (!responseSummoner.ok) {
      console.error("Error with fetching player summonerID with Riot API: ", responseSummoner.status);
    }

    const summonerData = await responseSummoner.json();
    const summonerId = summonerData.id;

    // gets the player rank, called "league" in riot API
    const leagueUrl = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
    const responseLeague = await fetch(leagueUrl, {
      method: "GET",
      headers: { "X-Riot-Token": API_KEY },
    });

    if (!responseLeague.ok) {
      console.error("Error with fetching player rank with Riot API: ", responseLeague.status);
    }

    const ranks = await responseLeague.json();
    res.status(200).json(ranks);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}


