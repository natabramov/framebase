export default async function handler(req, res) {
  const { rank } = req.query;

    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({error:"API key is missing"});
      }

      // the query will depend on the user's rank
      const query = `TFT ${rank} Ranked Tips`;
      const maxResults = 10;
  
      const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=video&key=${apiKey}`;
      const searchResponse = await fetch(searchURL);
      
      if (!searchResponse.ok) {
        console.error("Error with YouTube API: ", searchResponse.status);
      }
  
      const searchData = await searchResponse.json();
      // only need the videoIds to embed into the website, this join is the only way the API call will work
      const videoIDs = searchData.items.map(item => item.id.videoId).join(",");
      
      if (!videoIDs) {
        return res.status(404).json({error:"No videos found"});
      }

      const videosURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,player&id=${videoIDs}&key=${apiKey}`;
      const videoResponse = await fetch(videosURL);

      if (!videoResponse.ok) {
        throw new Error(`YouTube Videos API error: ${videoResponse.status}`);
      }

      const videoData = await videoResponse.json();

      // from the videoData.items, extract the necessary information about video for the JSON object
      const formattedVideos = videoData.items.map(video => ({
                                                              title: video.snippet.title,
                                                              videoId: video.id,
                                                              embedHtml: video.player.embedHtml
                                                            }));
                                                          
      // return the necessary info as a JSON
      return res.status(200).json({videos: formattedVideos});
    } 
    
    catch (error) {
      return res.status(500).json({error: "Failed to fetch YouTube videos"});
    }
  }
  