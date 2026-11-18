import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const port = Number(process.env.PORT || 4173);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};
http
  .createServer((req, res) => {
    try {
      let name = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (basePath) {
        if (name === basePath) {
          res.writeHead(301, { Location: `${basePath}/` });
          res.end();
          return;
        }
        if (!name.startsWith(`${basePath}/`)) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        name = name.slice(basePath.length);
      }
      let file = path.resolve(root, "." + name);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      const stat = fs.statSync(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Length": stat.size,
        "Cache-Control": "no-cache",
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(file)
        .on("error", () => res.destroy())
        .pipe(res);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(
      `Young Inventors preview: http://127.0.0.1:${port}${basePath}/`,
    ),
  );
