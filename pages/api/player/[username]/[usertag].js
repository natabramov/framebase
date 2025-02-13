const API_KEY = process.env.RIOT_API_KEY;

export default async function handler(req, res) {

    const { username, usertag } = req.query;
    
    try {

        const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${usertag}?api_key=${API_KEY};`

        const response = await fetch(url, {
            method:"GET",
            headers: {
                "X-Riot-Token": API_KEY
            },
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Riot API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        res.status(200).json(data);
    }
    
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
}
