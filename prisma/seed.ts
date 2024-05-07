import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
  await Promise.all(
    getSongs().map((song) => {
      const data = { userId: kody.id, ...song };
      return db.song.create({ data });
    })
  );
}

seed();

function getSongs() {

  return [
    {
      artist: "Ratatat",
      song: "Cherry",
      content: `https://music.youtube.com/watch?v=GNO7jTa--io&si=Y80zymntnaN_U1Gy`,
    },
  ];
}
