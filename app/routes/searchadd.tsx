import { useState } from 'react';
import wretch from 'wretch';
import { useLoaderData } from "@remix-run/react";

export function SearchAdd({ songData, setSongData }) {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songadded, setAdded] = useState(false);
  
  const [songRemoved, setRemoved] = useState(false);

  const handleSearch = async (event: any) => {
    event.preventDefault();
    try {
      const response: any = await wretch(`http://127.0.0.1:5003/search/${query}`, { mode: "cors" }).get().json();

      let json_array = JSON.parse(response);
      setSongs(json_array);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleSongClick = async (song: any) => {
    let currentSong;
    let currentSongData: any;
    let nextSong;
    let nextSongData: any;
    setLoading(true);
    try {
      const response = await wretch(`http://127.0.0.1:5002/add/${song}`, { mode: "cors" }).get().json();
      console.log(response);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setSongs([]);
    setLoading(false);
    setAdded(true);
    setQuery('');
    setTimeout(() => {
      setAdded(false);
    }, 5000);

    // // update the playlist
    // try {
    //   const response = await wretch('http://127.0.0.1:5002/current_song', { mode: "cors" }).get();
    //   console.log("THE NEW CURRENT SONG");
    //   currentSong = await response.text();
    //   console.log(currentSong);

    //   const response2 = await wretch('http://127.0.0.1:5002/next_songs').get();
    //   nextSong = await response2.text();
    //   console.log("THE NEW NEXT SONG");
    //   console.log(nextSong);
    // } catch (error) {
    //   console.error("An error occurred:", error);
    // };
    // try {
    //   const response3 = await wretch('http://127.0.0.1:5003/song_info/'+ currentSong).get();
    //   const current_song_data = await response3.json();
    //   console.log(current_song_data);
    //   currentSongData = current_song_data;

    //   const response4 = await wretch('http://127.0.0.1:5003/song_info/'+ nextSong).get();
    //   const next_song_data = await response4.json();
    //   console.log(next_song_data);
    //   nextSongData = next_song_data;
    // }
    // catch (error) {
    //   console.error("An error occurred:", error);
    // };
    // setTimeout(() => {
    //   setRemoved(true);
    //   //console.log(nextSongData);
    //   setSongData({
    //     current_song_data: currentSongData, 
    //     next_song_data: nextSongData 
    //   });
    //   setRemoved(true);
    // }, 1000);
    // setTimeout(() => {
    //   setRemoved(false);
    // }, 3000);
    
  };
  

  return (
    <div style={{ marginTop: '25px'}}>
    <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song"
      />
      <button type="submit" className="button">Search</button>
    </form>
    {songadded ? (<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><p>Song added to the playlist</p></div>) : (<span></span>)}
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        {songs.length > 0 && <p>Found results:</p>}
        {songs.map((song: any, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.20)', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => handleSongClick(song.videoId)} >
            <img src={song.thumbnail} alt={song.title} height='75px' width='75px' style={{ marginLeft: '10px', border: '1px solid white', boxShadow: '0 1px 0 rgba(0, 0, 0, 0.75)' }} />
            <div style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '18px' }}>
                {song.title}<br />{song.artist}
            </div>
            <div style={{ flex: 1, alignItems: 'right', textAlign:'right', marginRight: '10px', cursor: 'pointer'}} >➕</div>
          </div>
        ))}
      </>
    )}
  </div>
  );
}
