// Contrôle statique du site généré (docs/) : liens, métadonnées SEO, hreflang, sitemap,
// données structurées, images, manifeste et service worker. Sans dépendance.
// Usage : node tests/check-site.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, process.env.OUT_DIR || 'docs');
const { site } = await import('../src/content/site.mjs');
const SITE_URL = site.url.replace(/\/+$/, '');

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) htmlFiles.push(f);
  }
})(OUT);

const relName = (f) => '/' + path.relative(OUT, f).split(path.sep).join('/');
const urlToFile = (u) => {
  if (!u.startsWith(SITE_URL + '/')) return null;
  const p = u.slice(SITE_URL.length + 1);
  return path.join(OUT, p.endsWith('/') || p === '' ? p + 'index.html' : p);
};
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const pageIds = new Map();
const external = new Set();

for (const file of htmlFiles) {
  const name = relName(file);
  const html = fs.readFileSync(file, 'utf8');
  const isSpecial = /\/(404|offline)\.html$/.test(name);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pageIds.set(path.resolve(file), ids);

  if (!/<html lang="(fr|en)"/.test(html)) err(name, 'attribut lang manquant');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(name, `${h1} balises <h1> (1 attendue)`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const alt = attr(m[0], 'alt');
    if (alt === undefined) err(name, `image sans alt : ${m[0].slice(0, 80)}`);
    if (!attr(m[0], 'width') || !attr(m[0], 'height')) warn(name, 'image sans dimensions');
  }

  if (!isSpecial) {
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    const desc = attr((html.match(/<meta name="description"[^>]*>/) || [''])[0], 'content');
    const canonical = attr((html.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href');
    if (!title) err(name, 'titre manquant');
    if (!desc) err(name, 'description manquante');
    if (title && /TODO|COMPLÉTER/.test(title)) err(name, 'champ à compléter dans le titre');
    if (desc && /TODO|COMPLÉTER/.test(desc)) err(name, 'champ à compléter dans la description');
    if (desc && (desc.length < 70 || desc.length > 170)) warn(name, `description de ${desc.length} caractères (idéal 70–160)`);
    if (title && decode(title).length > 70) warn(name, `titre de ${decode(title).length} caractères (idéal ≤ 65)`);
    titles.has(title) ? err(name, `titre en double avec ${titles.get(title)}`) : titles.set(title, name);
    descriptions.has(desc) ? err(name, `description en double avec ${descriptions.get(desc)}`) : descriptions.set(desc, name);
    if (!canonical) err(name, 'balise canonique manquante');
    else {
      canonicals.set(canonical, name);
      const target = urlToFile(canonical);
      if (!target || path.resolve(target) !== path.resolve(file)) err(name, `canonique incohérente : ${canonical}`);
    }
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
      if (!html.includes(`property="${prop}"`)) err(name, `Open Graph ${prop} manquant`);
    }
    // hreflang réciproques
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => ({ lang: m[1], href: m[2] }));
    if (alts.length !== 3) err(name, `hreflang : ${alts.length} liens (3 attendus : fr, en, x-default)`);
    for (const a of alts) {
      const f = urlToFile(a.href);
      if (!f || !fs.existsSync(f)) { err(name, `hreflang vers une page absente : ${a.href}`); continue; }
      if (a.lang !== 'x-default') {
        const other = fs.readFileSync(f, 'utf8');
        if (!other.includes(`href="${canonical}"`)) err(name, `hreflang non réciproque avec ${a.href}`);
        if (!other.includes(`<html lang="${a.lang}"`)) err(name, `hreflang ${a.lang} vers une page d'une autre langue`);
      }
    }
    // JSON-LD
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const data = JSON.parse(m[1]);
        if (data['@context'] !== 'https://schema.org') err(name, 'JSON-LD sans @context schema.org');
        if (/TODO/.test(m[1])) err(name, 'champ à compléter dans les données structurées');
      } catch (e) { err(name, `JSON-LD invalide : ${e.message}`); }
    }
  }

  // Liens et ressources internes
  for (const m of html.matchAll(/\s(href|src|srcset)="([^"]*)"/g)) {
    const [, kind, raw] = m;
    const values = kind === 'srcset' ? raw.split(',').map((s) => s.trim().split(/\s+/)[0]) : [decode(raw)];
    for (const v of values) {
      if (!v) { err(name, `${kind} vide`); continue; }
      if (/^(mailto:|tel:)/.test(v)) {
        if (v.startsWith('mailto:') && !/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?|$)/i.test(v)) err(name, `mailto invalide : ${v}`);
        external.add(v.split('?')[0]);
        continue;
      }
      if (/^https?:\/\//.test(v)) {
        if (v.startsWith(SITE_URL)) continue; // canoniques, hreflang, og : contrôlés plus haut
        if (v.startsWith('https://wa.me/') && !/^https:\/\/wa\.me\/\d{8,15}(\?text=.*)?$/.test(v)) err(name, `lien WhatsApp invalide : ${v}`);
        external.add(v.replace(/\?.*$/, ''));
        continue;
      }
      if (v.startsWith('#')) {
        if (v.length > 1 && !pageIds.get(path.resolve(file)).has(v.slice(1))) err(name, `ancre absente : ${v}`);
        continue;
      }
      const [pathPart, hash] = v.split('#');
      const clean = pathPart.split('?')[0];
      let target = clean.startsWith('/') ? path.join(OUT, clean.slice(1)) : path.resolve(path.dirname(file), clean || '.');
      if (clean === '' ) target = file;
      else if (clean.endsWith('/') || fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) { err(name, `lien interne cassé : ${v}`); continue; }
      if (hash && target.endsWith('.html')) {
        const tHtml = fs.readFileSync(target, 'utf8');
        if (!new RegExp(`\\sid="${hash}"`).test(tHtml)) err(name, `ancre absente dans la cible : ${v}`);
      }
    }
  }
}

// sitemap.xml
const sitemap = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const f = urlToFile(loc);
  if (!f || !fs.existsSync(f)) err('sitemap.xml', `URL sans page : ${loc}`);
  else if (fs.readFileSync(f, 'utf8').includes('content="noindex')) err('sitemap.xml', `page noindex dans le sitemap : ${loc}`);
}
for (const [c] of canonicals) {
  const f = urlToFile(c);
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('content="noindex') && !locs.includes(c)) err('sitemap.xml', `page indexable absente : ${c}`);
}

// robots.txt
const robots = fs.readFileSync(path.join(OUT, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) err('robots.txt', 'ligne Sitemap absente ou incorrecte');

// manifest
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.webmanifest'), 'utf8'));
for (const k of ['name', 'short_name', 'start_url', 'scope', 'display', 'icons', 'theme_color', 'background_color']) if (!manifest[k]) err('manifest', `${k} manquant`);
for (const i of manifest.icons) if (!fs.existsSync(path.join(OUT, i.src))) err('manifest', `icône absente : ${i.src}`);
if (!manifest.icons.some((i) => i.sizes === '512x512') || !manifest.icons.some((i) => i.sizes === '192x192')) err('manifest', 'icônes 192 et 512 requises');
if (!manifest.icons.some((i) => i.purpose === 'maskable')) warn('manifest', 'pas d’icône maskable');

// service worker
const sw = fs.readFileSync(path.join(OUT, 'sw.js'), 'utf8');
const list = JSON.parse(sw.match(/const PRECACHE_URLS = (\[[\s\S]*?\]);/)[1]);
for (const u of list) {
  const p = u.split('?')[0];
  const f = path.join(OUT, p === './' ? 'index.html' : p.endsWith('/') ? p + 'index.html' : p);
  if (!fs.existsSync(f)) err('sw.js', `fichier pré-caché absent : ${u}`);
}
if (!list.includes('offline.html')) err('sw.js', 'offline.html non pré-cachée');
if (/__VERSION__|__PRECACHE__/.test(sw)) err('sw.js', 'gabarit non remplacé');

// Rapport
console.log(`Pages HTML contrôlées : ${htmlFiles.length}`);
console.log(`URL dans le sitemap : ${locs.length}`);
console.log(`Fichiers pré-cachés par le service worker : ${list.length}`);
console.log(`Liens externes distincts : ${[...external].sort().join(', ')}`);
if (warnings.length) console.log(`\n${warnings.length} avertissement(s) :\n  - ${warnings.join('\n  - ')}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} erreur(s) :\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log('\n✔ Aucune erreur.');
