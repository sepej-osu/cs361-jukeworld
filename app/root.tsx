import type {
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css?url";
import globalMediumStylesUrl from "~/styles/global-medium.css?url";
import globalStylesUrl from "~/styles/global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

export const meta: MetaFunction = () => {
  const description =
    "Listen to music with the world";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Listen to music!" },
  ];
};

function Document({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="keywords" content="Remix,music" />
        <meta
          name="twitter:image"
          content="https://remix-jokes.lol/social.png"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:creator" content="@remix_run" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="Remix Jokes" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unknown error";
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
