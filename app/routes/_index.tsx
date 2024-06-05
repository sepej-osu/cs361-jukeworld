import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import stylesUrl from "~/styles/index.css?url";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { VideoPlayer } from './video-player'
import { Playlist } from "./playlist";
import { SearchAdd } from "./searchadd";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request);

  const response = await fetch('http://127.0.0.1:5002/current_song');
  const current_song = await response.text();
  const response2 = await fetch('http://127.0.0.1:5001/current_time');
  const current_time = await response2.text();
  
  const youtubeUrl = 'https://youtu.be/'+ current_song +'?t=' + current_time;

  const response3 = await fetch('http://127.0.0.1:5002/next_songs');
  const next_songs = await response3.text();

  const response4 = await fetch('http://127.0.0.1:5003/song_info/'+next_songs);
  const next_song_data = await response4.json();

  const response5 = await fetch('http://127.0.0.1:5003/song_info/'+current_song);
  const current_song_data = await response5.json();
  

  return json({ user, youtubeUrl, next_songs, next_song_data, current_song_data });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  
  return (
      <div className="container">
        <div className="content">
          
          {data.user ? (
            <span></span>
          ) : (
            <h1>
            Juke <span>WORLD</span>
            </h1>
          )}
          
          {data.user ? (
            <div className="user-info">
              <div id="container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div id="user-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', marginBottom: '25px', width: '100%' }}>
                  <div id="jukeworld-inline" style={{ marginBottom: '-10px', cursor: 'default'}}><h2>Juke World</h2></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ alignSelf: 'center', marginRight: '0px', cursor: 'default' }} id="username">{data.user.username}</span>
                    <img src={data.user.profileImage} alt="Profile" height='25px' width='25px' id="profileImage" style={{ marginLeft: '10px', border: '3px solid white', boxShadow: '0 2px 0 rgba(0, 0, 0, 0.75)' }} />
                    <form action="/logout" method="post" style={{ marginLeft: '20px' }}>
                      <button type="submit" className="button" id="logout-button">
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
                </div>
              <div>
              <VideoPlayer />
              </div>
              <Playlist />
              <SearchAdd />
            </div>
          ) : (
            <nav>
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </nav>
          )}
          <br></br>
          
          {data.user ? (
            <div className="user-info">        
            </div>
          ) : (
          <div>
            <h2>About</h2>
            <p>JukeWorld is a new online space where music lovers can come together to share and enjoy music globally</p>
            <h2>Current Features:</h2>
            <ul>
              <li>
                <b>Listen to music:</b> Discover new music from around the world.
              </li>
              <li>
                <b>Adding songs to the global playlist for everyone to hear:</b> Share your favorite music with everyone on the platform and contribute to a diverse and global music experience.
              </li>
            </ul>
            <h2>Upcoming Features</h2>
            <p>We are currently in the early stages of the website. We currently have a way to register an account and log in. There are many cool features coming such as:</p>
            <ul>
              <li>
                <b>Liking songs so they show up in your profile:</b> Curate your music preferences and revisit your liked songs.
              </li>
            </ul>
          </div>
          )}
        </div>
      </div>
    );
}
