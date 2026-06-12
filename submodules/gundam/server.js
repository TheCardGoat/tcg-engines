import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "simulator-dist");
const indexHtmlPath = path.join(distPath, "index.html");

const port = process.env.PORT || 3000;
const basePath = normalizeBasePath(process.env.VITE_BASE_URL || "/gundam/simulator");

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  const pathname = parseRequestPath(req);
  if (!pathname) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request");
    return;
  }

  // Try to serve the requested file
  const urlPath = stripBasePath(pathname);
  const filePath = path.resolve(distPath, `.${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`);

  // Security: prevent directory traversal
  if (!isPathInside(distPath, filePath)) {
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

function parseRequestPath(req) {
  try {
    return new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;
  } catch (err) {
    console.warn(`Rejecting malformed request URL "${req.url || ""}":`, err);
    return null;
  }
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

  console.warn(`Request path "${pathname}" is outside configured base path "${basePath}"`);
  return "/";
}

function isPathInside(base, candidate) {
  const relativePath = path.relative(base, candidate);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}
