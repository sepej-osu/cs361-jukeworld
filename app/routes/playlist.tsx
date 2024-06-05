import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import wretch from 'wretch';

export function Playlist({ songData, setSongData }) {
  const loaderData: any = useLoaderData();
  
  const [songRemoved, setRemoved] = useState(false);

  const handleSongRemoveClick = async (videoId: any) => {
    let currentSong;
    let currentSongData: any;
    let nextSong;
    let nextSongData: any;
    try {
      const response = await wretch('http://127.0.0.1:5002/remove/' + videoId, { mode: "cors" }).get();
      console.log(response.text());
    } catch (error) {
      console.error("An error occurred:", error);
    };

    // update the playlist
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
      setSongData({
        current_song_data: currentSongData, 
        next_song_data: nextSongData
      });
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
        <img src={songData.current_song_data.thumbnail} alt={songData.current_song_data.title} height='75px' width='75px' id="" style={{ marginLeft: '10px', border: '1px solid white', boxShadow: '0 1px 0 rgba(0, 0, 0, 0.75)' }} />
        <div style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '18px' }}>
          {songData.current_song_data.title}<br />{songData.current_song_data.artist}
        </div>
      </div>
      
      <div style={{ marginBottom: '10px'}}>Up Next:</div>
      
      <div className='hoverRemove' style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', cursor: 'pointer', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => handleSongRemoveClick(songData.next_song_data.videoId)} >
        <img src={songData.next_song_data.thumbnail} alt={songData.next_song_data.title} height='75px' width='75px' id="" style={{ marginLeft: '10px', border: '1px solid white', boxShadow: '0 1px 0 rgba(0, 0, 0, 0.75)' }} />
        <div style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '18px' }}>
          {songData.next_song_data.title}<br />{songData.next_song_data.artist}
        </div>
        <div className='hoverRemoveX' style={{ flex: 1, alignItems: 'right', textAlign:'right', marginRight: '10px', cursor: 'pointer'}} >❌</div>
      </div>
      {songRemoved ? (<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><p>Song removed from the playlist</p></div>) : (<span></span>)}
    </div>
    
  );
}