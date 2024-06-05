import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "./player.client";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import wretch from 'wretch';


export function VideoPlayer() {
  const loaderData: any = useLoaderData();
  // Initialize state for width
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [url, setUrl] = useState(loaderData.youtubeUrl);
  const [data, setData] = useState(loaderData);
  
  const [songRemoved, setRemoved] = useState(false);

  // Define handleEnd function
  const handleReady = () => {
    setMuted(false)
  };

  const handleProgress = () => {
    setMuted(false)
  };

  const handleBuffered = () => {
    setMuted(false)
    setPlaying(true)
  };

  const handleEnd = async () => {
    //event.preventDefault();
    // add a delay of 1 seconds
    // get next song
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response: any = await wretch(`http://127.0.0.1:5001/get_timestamped_url`, { mode: "cors" }).get().json();
    console.log(response);
    // set url to the next song
    setUrl(response.url);

    // update the playlist
    let currentSong;
    let currentSongData: any;
    let nextSong;
    let nextSongData: any;
    try {
      const response = await wretch('http://127.0.0.1:5002/current_song', { mode: "cors" }).get();
      console.log("THE NEW CURRENT SONG");
      currentSong = await response.text();
      console.log(currentSong);

      const response2 = await wretch('http://127.0.0.1:5002/next_songs').get();
      nextSong = await response2.text();
      console.log("THE NEW NEXT SONG");
      console.log(nextSong);
    } catch (error) {
      console.error("An error occurred:", error);
    };
    try {
      const response3 = await wretch('http://127.0.0.1:5003/song_info/'+ currentSong).get();
      const current_song_data = await response3.json();
      console.log(current_song_data);
      currentSongData = current_song_data;

      const response4 = await wretch('http://127.0.0.1:5003/song_info/'+ nextSong).get();
      const next_song_data = await response4.json();
      console.log(next_song_data);
      nextSongData = next_song_data;
    }
    catch (error) {
      console.error("An error occurred:", error);
    };
    setTimeout(() => {
      setRemoved(true);
      //console.log(nextSongData);
      setData((data: any) => ({ 
        ...data, 
        current_song_data: currentSongData, 
        next_song_data: nextSongData 
      }));
      setRemoved(true);
    }, 1000);
    setTimeout(() => {
      setRemoved(false);
    }, 3000);
  };
  
  
  return (
      <ClientOnly fallback={<div>Video</div>}>
        {() => (<ReactPlayer
                  url={url}
                  playing={playing} // Changed from false to playing
                  muted={muted}
                  width='500px'
                  height='500px'
                  onReady={handleReady} // Added onReady prop
                  onProgress={handleProgress}
                  onBufferEnd={handleBuffered}
                  onEnded={handleEnd}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 0,
                        autoplay: 1, controls: 1, rel: 0, iv_load_policy: 0, disablekb: 1, color: 'white'
                       }
                    }
                  }}
                />)}
      </ClientOnly>
  );
}
