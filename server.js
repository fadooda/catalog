import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT ?? 3001);

// Fake in-memory catalog (replace with DB later)
const games = [
  { id: "g1", title: "Neon Kart", genre: "Racing", priceUSD: 9.99, desc: "Arcade racing with power-ups." },
  { id: "g2", title: "Dungeon Co-op", genre: "Co-op", priceUSD: 14.99, desc: "Team up and clear procedural dungeons." },
  { id: "g3", title: "Sky Builders", genre: "Simulation", priceUSD: 19.99, desc: "Build floating cities and manage resources." },
  { id: "g4", title: "Aim Trainer Pro", genre: "Shooter", priceUSD: 4.99, desc: "Fast drills to improve aim and reaction time." },
  { id: "g5", title: "Word Clash", genre: "Puzzle", priceUSD: 2.99, desc: "Competitive word puzzles with friends." }
];

app.post("/api/search", (req, res) => {
  const qRaw = String(req.body?.query ?? "").trim().toLowerCase();
  const limit = Number(req.body?.limit ?? 20);

  const isWildcard = qRaw === "" || ["any", "all", "*", "anything", "everything"].includes(qRaw);

  let results = games;

  if (!isWildcard) {
    results = games.filter(g => {
      const title = g.title.toLowerCase();
      const genre = g.genre.toLowerCase();
      const desc  = g.desc.toLowerCase();
      return title.includes(qRaw) || genre.includes(qRaw) || desc.includes(qRaw);
    });
  }

  res.json({
    query: qRaw,
    results: results.slice(0, limit),
    count: results.length
  });
});


app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`catalog listening on http://localhost:${PORT}`));
