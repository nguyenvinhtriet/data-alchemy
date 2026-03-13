import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const db = new Database("blog.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS likes (
    slug TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT,
    author TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/likes/:slug", (req, res) => {
    const { slug } = req.params;
    const row = db.prepare("SELECT count FROM likes WHERE slug = ?").get(slug) as { count: number } | undefined;
    res.json({ count: row?.count || 0 });
  });

  app.post("/api/likes/:slug", (req, res) => {
    const { slug } = req.params;
    const { action } = req.body; // 'like' or 'dislike'
    
    const row = db.prepare("SELECT count FROM likes WHERE slug = ?").get(slug) as { count: number } | undefined;
    const currentCount = row?.count || 0;
    const newCount = action === 'like' ? currentCount + 1 : Math.max(0, currentCount - 1);

    db.prepare("INSERT OR REPLACE INTO likes (slug, count) VALUES (?, ?)").run(slug, newCount);
    res.json({ count: newCount });
  });

  app.get("/api/comments/:slug", (req, res) => {
    const { slug } = req.params;
    const comments = db.prepare("SELECT * FROM comments WHERE slug = ? ORDER BY created_at DESC").all(slug);
    res.json(comments);
  });

  app.post("/api/comments/:slug", (req, res) => {
    const { slug } = req.params;
    const { author, content } = req.body;
    if (!author || !content) return res.status(400).json({ error: "Missing fields" });

    db.prepare("INSERT INTO comments (slug, author, content) VALUES (?, ?, ?)").run(slug, author, content);
    res.json({ success: true });
  });

  // Global discussion (home page)
  app.get("/api/comments-global", (req, res) => {
    const comments = db.prepare("SELECT * FROM comments WHERE slug = 'global' ORDER BY created_at DESC").all();
    res.json(comments);
  });

  app.post("/api/comments-global", (req, res) => {
    const { author, content } = req.body;
    db.prepare("INSERT INTO comments (slug, author, content) VALUES ('global', ?, ?)").run(author, content);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
