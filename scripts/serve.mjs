// Serveur local de prévisualisation : node scripts/serve.mjs [port] [chemin-de-base]
// Exemple : node scripts/serve.mjs 8080         -> http://localhost:8080/
//           node scripts/serve.mjs 8080 /depot/ -> http://localhost:8080/depot/ (imite GitHub Pages d'un dépôt)
// Comme GitHub Pages : /dossier -> /dossier/, index.html par défaut, 404.html sinon.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', process.env.OUT_DIR || 'docs');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const BASE = (process.argv[3] || '/').replace(/\/?$/, '/');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const send = (res, status, file) => {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  if (!p.startsWith(BASE)) {
    if (p === BASE.slice(0, -1)) { res.writeHead(301, { Location: BASE }); return res.end(); }
    return send(res, 404, path.join(ROOT, '404.html'));
  }
  const file = path.join(ROOT, p.slice(BASE.length));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + url.search }); return res.end(); }
      const idx = path.join(file, 'index.html');
      return fs.existsSync(idx) ? send(res, 200, idx) : send(res, 404, path.join(ROOT, '404.html'));
    }
    if (!err && st.isFile()) return send(res, 200, file);
    send(res, 404, path.join(ROOT, '404.html'));
  });
}).listen(PORT, () => console.log(`Aperçu : http://localhost:${PORT}${BASE}`));
