import { createCookieSessionStorage, redirect, LoaderFunctionArgs } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  username: string;
  profileImage: string;
};

export async function register({ password, username, profileImage }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { passwordHash, username, profileImage },
  });
  return { id: user.id, username };
}

export async function login({ password, username }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true, profileImage: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await fetch('http://192.168.1.76:5006/random-profile-image');
  const data = await response.json();
  let profile_image = data.image_url;
  console.log(profile_image);
  return profile_image
};

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string, profileImage: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("userProfileImage", profileImage);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}