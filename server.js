const http = require("http");
const fs   = require("fs");
const path = require("path");

// Parse .env
try {
  fs.readFileSync(".env", "utf8").split("\n").forEach((line) => {
    const eq = line.indexOf("=");
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key) process.env[key] = val;
    }
  });
} catch {}

const chatHandler = require("./api/chat");

const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".ico":  "image/x-icon",
  ".png":  "image/png",
};

// Add Express-style helpers to raw Node res object
function wrapRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(obj));
    return res;
  };
  res.end = res.end.bind(res);
  return res;
}

const server = http.createServer((req, res) => {
  wrapRes(res);

  // API route
  if (req.url.startsWith("/api/chat")) {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try { req.body = JSON.parse(body); } catch { req.body = {}; }
      chatHandler(req, res);
    });
    return;
  }

  // Static files
  const pathname = req.url.split("?")[0];
  let filePath = path.join(__dirname, "public", pathname === "/" ? "index.html" : pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(__dirname, "public", "index.html"), (e, d) => {
        if (e) { res.statusCode = 404; res.end("404 Not Found"); return; }
        res.setHeader("Content-Type", "text/html");
        res.end(d);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.setHeader("Content-Type", MIME[ext] || "text/plain");
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("\n╔════════════════════════════════════════╗");
  console.log(`║  VibeCoder AI  →  http://localhost:${PORT}  ║`);
  console.log("╚════════════════════════════════════════╝\n");
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY not found — create a .env file!\n");
  } else {
    console.log("✅ GROQ_API_KEY loaded\n");
  }
});