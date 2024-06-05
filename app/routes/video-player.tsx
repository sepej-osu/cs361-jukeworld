import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "./player.client";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import wretch from 'wretch';


export function VideoPlayer() {
  const loaderData = useLoaderData();
  // Initialize state for width
  const [playing, setPlaying] = useState(false);
  const [inline, setInline] = useState(false);
  const [muted, setMuted] = useState(true);
  const [url, setUrl] = useState(useLoaderData().youtubeUrl);
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
    event.preventDefault();
    // Add a delay of 2 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await wretch(`http://127.0.0.1:5001/get_timestamped_url`, { mode: "cors" }).get().json();
    console.log(response);
    setUrl(response.url);
    let nextSong = '';
    let nextSongData: unknown;
    try {
      const response = await wretch('http://127.0.0.1:5002/remove/' + videoId, { mode: "cors" }).get();
      console.log(response.text());
      const response3 = await wretch('http://127.0.0.1:5002/next_songs').get();
      nextSong = await response3.text();
      console.log("THE NEXT SONG");
      console.log(nextSong);
    } catch (error) {
      console.error("An error occurred:", error);
    };
    try {
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
      console.log(nextSongData);
      setData((prevData: any) => ({ ...prevData, next_song_data: nextSongData }));
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
                  playsinline={inline}
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
