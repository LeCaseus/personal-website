require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");
const app = express();
const PORT = 3000;

const sql = neon(process.env.DATABASE_URL);

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.static("."));
app.use(express.json());

// ── PAGE ROUTES ──
const path = require("path");

app.get("/about", (req, res) => res.sendFile(path.resolve("about.html")));
app.get("/portfolio/em-brace", (req, res) =>
  res.sendFile(path.resolve("portfolio/em-brace.html")),
);
app.get("/portfolio/ch3sh1re", (req, res) =>
  res.sendFile(path.resolve("portfolio/ch3sh1re.html")),
);
app.get("/portfolio/personal-website", (req, res) =>
  res.sendFile(path.resolve("portfolio/personal-website.html")),
);

// ── CREATE TABLES ON STARTUP ──
async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id         SERIAL PRIMARY KEY,
      type       TEXT NOT NULL,
      title      TEXT DEFAULT '',
      body       TEXT NOT NULL,
      date       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id         SERIAL PRIMARY KEY,
      category   TEXT NOT NULL,
      emoji      TEXT DEFAULT '✦',
      title      TEXT NOT NULL,
      excerpt    TEXT DEFAULT '',
      body       TEXT NOT NULL,
      date       TEXT NOT NULL,
      read_time  TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    ALTER TABLE posts 
    ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT ''
  `;
  console.log("Database ready");
}

// ── ENTRIES ──
app.get("/api/entries", async (req, res) => {
  const { type } = req.query;
  const rows = type
    ? await sql`SELECT * FROM entries WHERE type = ${type} ORDER BY created_at DESC`
    : await sql`SELECT * FROM entries ORDER BY created_at DESC`;
  res.json(rows);
});

app.get("/api/entries/:id", async (req, res) => {
  const rows = await sql`SELECT * FROM entries WHERE id = ${req.params.id}`;
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.post("/api/entries", async (req, res) => {
  const { type, title, body, date } = req.body;
  if (!type || !body)
    return res.status(400).json({ error: "type and body required" });
  const rows = await sql`
    INSERT INTO entries (type, title, body, date)
    VALUES (${type}, ${title || ""}, ${body}, ${date})
    RETURNING id
  `;
  res.json({ id: rows[0].id });
});

app.delete("/api/entries/:id", async (req, res) => {
  await sql`DELETE FROM entries WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

// ── POSTS ──
app.get("/api/posts", async (req, res) => {
  const { category } = req.query;
  const rows = category
    ? await sql`SELECT * FROM posts WHERE category = ${category} ORDER BY created_at DESC`
    : await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  res.json(rows);
});

app.get("/api/posts/:id", async (req, res) => {
  const rows = await sql`SELECT * FROM posts WHERE id = ${req.params.id}`;
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.post("/api/posts", async (req, res) => {
  const { category, emoji, title, excerpt, body, date, read_time, cover_url } =
    req.body;
  if (!category || !title || !body)
    return res.status(400).json({ error: "category, title and body required" });
  const rows = await sql`
    INSERT INTO posts (category, emoji, title, excerpt, body, date, read_time, cover_url)
    VALUES (${category}, ${emoji || "✦"}, ${title}, ${excerpt || ""}, ${body}, ${date}, ${read_time || ""}, ${cover_url || ""})
    RETURNING id
  `;
  res.json({ id: rows[0].id });
});

app.delete("/api/posts/:id", async (req, res) => {
  await sql`DELETE FROM posts WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

// ── IMAGE UPLOAD ──
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const b64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "blog_covers",
      transformation: [
        { width: 1200, height: 600, crop: "fill", quality: "auto" },
      ],
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

initDb().then(() => {
  app.listen(PORT, () =>
    console.log(`server running at http://localhost:${PORT}`),
  );
});
