// Service worker de BOGNON ISAAC (généré par scripts/build.mjs : ne pas modifier docs/sw.js).
//
// Stratégie :
// - installation : toutes les pages et ressources du site sont mises en cache (pré-cache versionné) ;
// - pages HTML : réseau d'abord (contenu à jour), cache si hors connexion, sinon page offline.html ;
// - CSS, JS, polices, images : cache d'abord, réseau sinon ;
// - mise à jour : à chaque publication, la version change ; le nouveau worker attend que la page
//   propose « Actualiser », puis remplace l'ancien et supprime les anciens caches.
// - les liens externes (WhatsApp, e-mail, GitHub) ne passent jamais par ce cache.

const VERSION = '81b7974832';
const PRECACHE = `bi-precache-${VERSION}`;
const RUNTIME = 'bi-runtime';
const PRECACHE_URLS = [
 "./",
 "a-propos/",
 "assets/css/styles.css?v=e84d56bea6",
 "assets/fonts/fraunces.woff2",
 "assets/fonts/inter.woff2",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/favicon-48.png",
 "assets/icons/favicon.svg",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon-maskable-512.png",
 "assets/img/isaac-bognon-costume-480.webp",
 "assets/img/isaac-bognon-costume-800.webp",
 "assets/img/isaac-bognon-portrait-240.webp",
 "assets/img/isaac-bognon-portrait-480.webp",
 "assets/img/livre-mine-d-or-mockup-642.webp",
 "assets/img/logo-lecodetech-96.webp",
 "assets/js/main.js?v=17fbb97f49",
 "blog/",
 "blog/feed.xml",
 "blog/lancement-du-portfolio/",
 "catalogue/",
 "competences/",
 "confidentialite/",
 "contact/",
 "en/",
 "en/about/",
 "en/blog/",
 "en/blog/feed.xml",
 "en/blog/lancement-du-portfolio/",
 "en/catalogue/",
 "en/contact/",
 "en/legal-notice/",
 "en/portfolio/",
 "en/portfolio/la-mine-d-or-des-entrepreneurs/",
 "en/privacy/",
 "en/services/",
 "en/skills/",
 "manifest.webmanifest",
 "mentions-legales/",
 "offline.html",
 "portfolio/",
 "portfolio/la-mine-d-or-des-entrepreneurs/",
 "services/"
];
const OFFLINE_URL = 'offline.html';
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('bi-') && k !== PRECACHE && k !== RUNTIME).map((k) => caches.delete(k)));
    // Le cache d'exécution est vidé à chaque nouvelle version pour ne pas garder d'anciennes pages.
    if (keys.includes(RUNTIME)) await caches.delete(RUNTIME);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((r) => { clearTimeout(id); resolve(r); }, (e) => { clearTimeout(id); reject(e); });
  });
}

async function fromCache(request) {
  const hit = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
  if (hit) return hit;
  // /a-propos -> /a-propos/
  if (request.mode === 'navigate') {
    const url = new URL(request.url);
    if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      return caches.match(url.origin + url.pathname + '/');
    }
  }
  return undefined;
}

async function handleNavigation(request) {
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
    if (response.ok) {
      const copy = response.clone();
      caches.open(RUNTIME).then((c) => c.put(request, copy));
    }
    return response;
  } catch {
    return (await fromCache(request)) || (await caches.match(OFFLINE_URL));
  }
}

async function handleAsset(request) {
  const cached = await fromCache(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      caches.open(RUNTIME).then((c) => c.put(request, copy));
    }
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleAsset(request));
  }
});
