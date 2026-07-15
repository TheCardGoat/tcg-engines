import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "apps", "simulator", "dist");
const indexHtmlPath = path.join(distPath, "index.html");

const port = process.env.PORT || 3000;
const basePath = normalizeBasePath(process.env.VITE_BASE_URL);

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  // Normalize URL and remove query strings
  const urlPath = stripBasePath(new URL(req.url, `http://${req.headers.host}`).pathname);

  // Try to serve the requested file
  const filePath = path.join(distPath, urlPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(distPath)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  // Check if it's a real file (not a directory)
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      serveFile(filePath, res);
      return;
    }
  } catch {
    // File doesn't exist, fall through to SPA routing
  }

  // SPA routing: serve index.html for all non-file routes
  serveFile(indexHtmlPath, res);
});

function serveFile(filePath, res) {
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    const cacheControl = ext === ".html" ? "no-cache" : "public, max-age=31536000";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
    console.error(`Error serving file ${filePath}:`, err);
  }
}

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Serving static files from ${distPath}`);
});

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

function stripBasePath(pathname) {
  if (basePath === "/") {
    return pathname;
  }

  if (pathname === basePath) {
    return "/";
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length);
  }

  return pathname;
}
