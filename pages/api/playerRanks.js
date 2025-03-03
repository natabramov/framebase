// pages/api/[usertag].js

const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {
  const { puuid } = req.query;

  try {
    const summonerUrl = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
    const responseSummoner = await fetch(summonerUrl, {
      method: "GET",
      headers: { "X-Riot-Token": API_KEY },
    });

    if (!responseSummoner.ok) {
      const errorText = await responseSummoner.text();
      throw new Error(
        `Summoner API error: ${responseSummoner.status} - ${errorText}`
      );
    }

    const summonerData = await responseSummoner.json();
    const summonerId = summonerData.id;

    const leagueUrl = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
    const responseLeague = await fetch(leagueUrl, {
      method: "GET",
      headers: { "X-Riot-Token": API_KEY },
    });

    if (!responseLeague.ok) {
      const errorText = await responseLeague.text();
      throw new Error(
        `League API error: ${responseLeague.status} - ${errorText}`
      );
    }

    const ranks = await responseLeague.json();

    res.status(200).json(ranks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


