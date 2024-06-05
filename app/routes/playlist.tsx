import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import wretch from 'wretch';

export function Playlist() {
  const loaderData = useLoaderData();
  const [data, setData] = useState(loaderData);
  
  const [songRemoved, setRemoved] = useState(false);

  const handleSongRemoveClick = async (videoId: any) => {
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
    <div>
      <div style={{ marginBottom: '15px', marginTop: '15px' }} >Currently Playing:</div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <img src={data.current_song_data.thumbnail} alt={data.current_song_data.title} height='75px' width='75px' id="" style={{ marginLeft: '10px', border: '1px solid white', boxShadow: '0 1px 0 rgba(0, 0, 0, 0.75)' }} />
        <div style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '18px' }}>
          {data.current_song_data.title}<br />{data.current_song_data.artist}
        </div>
      </div>
      
      <div style={{ marginBottom: '10px'}}>Up Next:</div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.20)', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => handleSongRemoveClick(data.next_song_data.videoId)} >
        <img src={data.next_song_data.thumbnail} alt={data.next_song_data.title} height='75px' width='75px' id="" style={{ marginLeft: '10px', border: '1px solid white', boxShadow: '0 1px 0 rgba(0, 0, 0, 0.75)' }} />
        <div style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '18px' }}>
          {data.next_song_data.title}<br />{data.next_song_data.artist}
        </div>
        <div style={{ flex: 1, alignItems: 'right', textAlign:'right', marginRight: '10px', cursor: 'pointer'}} >❌</div>
      </div>
      {songRemoved ? (<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><p>Song removed from the playlist</p></div>) : (<span></span>)}
    </div>
    
  );
}