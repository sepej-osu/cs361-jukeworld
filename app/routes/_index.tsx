import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request);

  return json({ user });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
      <div className="container">
        <div className="content">
          <h1>
            Juke <span>World</span>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
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
          <div>
            <h2>About</h2>
            <p>JukeWorld is a new online space where music lovers can come together to share and enjoy music globally</p>
            <h2>Upcoming Features</h2>
            <p>We are currently in the early stages of the website. We currently have a way to register an account and log in. There are many cool features coming such as:</p>
            <ul>
              <li>
                <b>Listening to music:</b> This will allow users to discover new music from around the world.
              </li>
              <li>
                <b>Adding songs to the global playlist for everyone to hear:</b> Share your favorite music with everyone on the platform and contribute to a diverse and global music experience.
              </li>
              <li>
                <b>Liking songs so they show up in your profile:</b> Curate your music preferences and revisit your liked songs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
