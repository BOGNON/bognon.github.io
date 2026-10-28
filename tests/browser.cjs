// Tests navigateur (Playwright + Chromium) : affichage mobile/ordinateur, navigation,
// boutons de contact, filtres, accessibilité (axe-core), hors ligne et mise à jour du service worker.
//
// Le site est reconstruit dans un dossier temporaire et servi sous un sous-chemin
// (/portfolio-test/) pour vérifier qu'il fonctionne aussi dans un dépôt GitHub Pages
// qui n'est pas à la racine du domaine.
//
// Usage : node tests/browser.cjs   (SHOTS=dossier pour enregistrer des captures)

const { chromium } = require('playwright');
const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const ROOT = path.resolve(__dirname, '..');
const PORT = 4173;
const BASE = '/portfolio-test/';
const ORIGIN = `http://localhost:${PORT}`;
const SITE = ORIGIN + BASE;
const OUT_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-site-'));
const SHOTS = process.env.SHOTS || '';
const WA = '22952390436';

const results = [];
let failed = 0;
function check(name, ok, detail = '') {
  results.push(`${ok ? '✔' : '✖'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed++;
}

async function main() {
  execFileSync('node', ['scripts/build.mjs'], {
    cwd: ROOT, stdio: 'ignore',
    env: { ...process.env, OUT_DIR: path.relative(ROOT, OUT_DIR), SITE_URL: SITE.slice(0, -1) },
  });
  const server = spawn('node', ['scripts/serve.mjs', String(PORT), BASE], { cwd: ROOT, env: { ...process.env, OUT_DIR: path.relative(ROOT, OUT_DIR) } });
  await new Promise((r) => server.stdout.once('data', r));

  const sitemap = fs.readFileSync(path.join(OUT_DIR, 'sitemap.xml'), 'utf8');
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const noindex = [];
  const all = [...pages, ...noindex];
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await chromium.launch();

  try {
    // ------------------------------------------------ 1. Affichage, erreurs, débordement, accessibilité
    for (const vp of [{ name: 'mobile', width: 360, height: 740 }, { name: 'ordinateur', width: 1366, height: 900 }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, serviceWorkers: 'block', reducedMotion: 'reduce' });
      let overflow = [], consoleErrors = [], badRequests = [], axeIssues = [];
      for (const url of all) {
        const page = await ctx.newPage();
        page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${url}: ${m.text()}`); });
        page.on('response', (r) => { if (r.url().startsWith(ORIGIN) && r.status() >= 400) badRequests.push(`${r.status()} ${r.url()}`); });
        await page.goto(url, { waitUntil: 'networkidle' });
        // Charge toutes les images différées
        await page.evaluate(async () => { for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager'; await new Promise((r) => setTimeout(r, 150)); });
        const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (o > 1) overflow.push(`${url} (+${o}px)`);
        const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
        if (broken.length) badRequests.push(...broken.map((b) => `image cassée ${b}`));
        if (vp.name === 'ordinateur' || url === SITE) {
          await page.addScriptTag({ content: axeSource });
          const res = await page.evaluate(async () => {
            const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
            return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, target: v.nodes[0].target.join(' ') }));
          });
          for (const v of res) axeIssues.push(`${url.replace(SITE, '/')} ${v.impact} ${v.id} ×${v.n} (${v.target})`);
        }
        if (SHOTS && ['', 'a-propos/', 'catalogue/', 'services/', 'contact/', 'en/', 'portfolio/la-mine-d-or-des-entrepreneurs/'].includes(url.replace(SITE, ''))) {
          fs.mkdirSync(SHOTS, { recursive: true });
          await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${url.replace(SITE, '').replace(/\//g, '_') || 'accueil'}.png`), fullPage: true });
        }
        await page.close();
      }
      check(`[${vp.name} ${vp.width}px] ${all.length} pages sans débordement horizontal`, overflow.length === 0, overflow.join(', '));
      check(`[${vp.name}] aucune erreur JavaScript`, consoleErrors.length === 0, consoleErrors.join(' | '));
      check(`[${vp.name}] aucune ressource interne en erreur (404, image cassée)`, badRequests.length === 0, [...new Set(badRequests)].join(' | '));
      const serious = axeIssues.filter((x) => / (serious|critical) /.test(x));
      check(`[${vp.name}] accessibilité axe-core : aucune violation grave ou critique`, serious.length === 0, serious.join(' | '));
      if (axeIssues.length > serious.length) results.push(`  ℹ remarques mineures axe : ${axeIssues.filter((x) => !serious.includes(x)).join(' | ')}`);
      await ctx.close();
    }

    // ------------------------------------------------ 2. Navigation
    {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, serviceWorkers: 'block' });
      const page = await ctx.newPage();
      await page.goto(SITE + 'a-propos/');
      const toggle = page.locator('[data-nav-toggle]');
      check('Menu mobile : bouton visible', await toggle.isVisible());
      check('Menu mobile : liens masqués avant ouverture', !(await page.locator('#site-nav a', { hasText: 'Catalogue' }).isVisible()));
      await toggle.click();
      check('Menu mobile : ouverture', (await toggle.getAttribute('aria-expanded')) === 'true' && await page.locator('#site-nav a', { hasText: 'Catalogue' }).isVisible());
      await page.keyboard.press('Escape');
      check('Menu mobile : fermeture avec Échap', (await toggle.getAttribute('aria-expanded')) === 'false');
      await toggle.click();
      await page.locator('.lang-switch').click();
      await page.waitForURL('**/en/about/');
      check('Sélecteur de langue : /a-propos/ → /en/about/', page.url() === SITE + 'en/about/' && (await page.getAttribute('html', 'lang')) === 'en');
      await page.goto(SITE + 'portfolio/');
      await page.locator('.project-card h2 a').first().click();
      await page.waitForURL('**/portfolio/la-mine-d-or-des-entrepreneurs/');
      check('Portfolio : ouverture de la page détaillée d’un projet', (await page.locator('h1').textContent()).includes('Mine d'));
      await page.goto(SITE + 'a-propos');
      check('URL sans barre finale redirigée', page.url() === SITE + 'a-propos/');
      const r404 = await page.goto(SITE + 'page-inexistante/');
      check('Page 404 personnalisée', r404.status() === 404 && (await page.locator('h1').textContent()).includes('introuvable'));
      await page.locator('.standalone__links a', { hasText: 'Accueil' }).click();
      check('Page 404 : lien vers l’accueil fonctionnel (sous-chemin)', page.url() === SITE);
      await ctx.close();
    }

    // ------------------------------------------------ 3. Boutons de contact et formulaires
    {
      const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
      const page = await ctx.newPage();
      await page.addInitScript(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return {}; }; });

      await page.goto(SITE + 'services/?service=graphisme#devis');
      check('Devis : service présélectionné depuis l’URL', (await page.locator('#quote-service').inputValue()) === 'graphisme');

      await page.locator('form[data-compose] button[value="whatsapp"]').click();
      const lastBefore = await page.locator('form[data-compose]').getAttribute('data-last-url');
      check('Devis : envoi bloqué tant que les champs obligatoires sont vides', lastBefore === null);

      await page.fill('#quote-nom', 'Test Client');
      await page.fill('#quote-email', 'client@example.com');
      await page.fill('#quote-budget', '500 EUR');
      await page.fill('#quote-message', 'Une affiche pour un événement.\nDeux formats.');
      await page.locator('form[data-compose] button[value="whatsapp"]').click();
      const opened = await page.evaluate(() => window.__opened[0] || '');
      const waText = decodeURIComponent((opened.split('?text=')[1] || ''));
      check('Devis → WhatsApp : ouvre wa.me avec le bon numéro', opened.startsWith(`https://wa.me/${WA}?text=`), opened.slice(0, 60));
      check('Devis → WhatsApp : message prérempli complet', /Test Client/.test(waText) && /Création graphique/.test(waText) && /500 EUR/.test(waText) && /Deux formats/.test(waText));
      check('Devis → WhatsApp : message de confirmation affiché', (await page.locator('[data-form-status]').textContent()).includes('WhatsApp'));

      // E-mail : on intercepte l'affectation de location.href en lisant l'URL calculée.
      await page.evaluate(() => { const f = document.querySelector('form[data-compose]'); f.addEventListener('submit', () => {}, { once: true }); });
      const [req] = await Promise.all([
        page.waitForEvent('framenavigated', { timeout: 1500 }).catch(() => null),
        page.locator('form[data-compose] button[value="email"]').click(),
      ]);
      void req;
      const mail = await page.locator('form[data-compose]').getAttribute('data-last-url');
      const params = new URLSearchParams((mail || '').split('?')[1] || '');
      check('Devis → e-mail : lien mailto vers isaacbognon@icloud.com', (mail || '').startsWith('mailto:isaacbognon@icloud.com?subject='), (mail || '').slice(0, 60));
      check('Devis → e-mail : objet et corps préremplis', /Demande de devis : Test Client/.test(params.get('subject') || '') && /Une affiche/.test(params.get('body') || ''));

      await page.goto(SITE + 'en/contact/');
      await page.fill('#contact-nom', 'Jane Doe');
      await page.fill('#contact-message', 'Hello from London');
      await page.locator('form[data-compose] button[value="whatsapp"]').click();
      const openedEn = await page.evaluate(() => window.__opened[0] || '');
      check('Contact (EN) → WhatsApp : message en anglais prérempli', /Hello Isaac, here is my message/.test(decodeURIComponent(openedEn)) && /Hello from London/.test(decodeURIComponent(openedEn)));

      // Liens directs du catalogue (fonctionnent sans JavaScript)
      await page.goto(SITE + 'catalogue/');
      const hrefs = await page.locator('#la-mine-d-or-des-entrepreneurs a').evaluateAll((as) => as.map((a) => a.href));
      const wa = hrefs.find((h) => h.startsWith('https://wa.me/'));
      const ml = hrefs.find((h) => h.startsWith('mailto:'));
      check('Catalogue : bouton « Commander sur WhatsApp » du livre', Boolean(wa) && decodeURIComponent(wa).includes("La Mine d'Or des Entrepreneurs"));
      check('Catalogue : bouton « Commander par e-mail » du livre', Boolean(ml) && decodeURIComponent(ml).includes('Commande : La Mine'));
      const quoteHref = await page.locator('#site-vitrine a', { hasText: 'Demander un devis' }).getAttribute('href');
      await page.locator('#site-vitrine a', { hasText: 'Demander un devis' }).click();
      await page.waitForURL('**/services/?service=site-vitrine#devis');
      check('Catalogue → devis : service transmis au formulaire', (await page.locator('#quote-service').inputValue()) === 'site-vitrine', quoteHref);

      await page.goto(SITE + 'catalogue/');
      await page.locator('[data-filter="livre"]').click();
      const visible = await page.locator('[data-filter-list] > article:visible').count();
      await page.locator('[data-filter="all"]').click();
      const visibleAll = await page.locator('[data-filter-list] > article:visible').count();
      check('Catalogue : filtres par catégorie', visible === 1 && visibleAll > 5, `${visible} puis ${visibleAll}`);
      await ctx.close();
    }

    // ------------------------------------------------ 4. Sans JavaScript
    {
      const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 740 } });
      const page = await ctx.newPage();
      await page.goto(SITE);
      check('Sans JavaScript : menu affiché et contenu visible', await page.locator('#site-nav a', { hasText: 'Contact' }).isVisible() && await page.locator('h1').isVisible());
      await page.goto(SITE + 'services/');
      check('Sans JavaScript : coordonnées directes proposées sous le formulaire', (await page.locator('form noscript').innerHTML()).includes('mailto:'));
      await ctx.close();
    }

    // ------------------------------------------------ 5. PWA : installation, hors ligne, mise à jour
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(SITE);
      const manifest = await page.evaluate(async () => {
        const href = document.querySelector('link[rel=manifest]').href;
        const m = await (await fetch(href)).json();
        const icons = await Promise.all(m.icons.map(async (i) => (await fetch(new URL(i.src, href))).ok));
        return { name: m.name, display: m.display, start: new URL(m.start_url, href).href, icons };
      });
      check('Manifeste : valide, icônes accessibles, start_url dans le site', manifest.display === 'standalone' && manifest.icons.every(Boolean) && manifest.start === SITE, JSON.stringify(manifest));

      const swCount = await page.evaluate(async () => {
        const reg = await navigator.serviceWorker.ready;
        const list = await (await fetch(reg.active.scriptURL)).text();
        const n = JSON.parse(list.match(/const PRECACHE_URLS = (\[[\s\S]*?\]);/)[1]).length;
        for (let i = 0; i < 50; i++) {
          const keys = await caches.keys();
          const pre = keys.find((k) => k.startsWith('bi-precache-'));
          if (pre && (await (await caches.open(pre)).keys()).length === n) return { scope: reg.scope, n };
          await new Promise((r) => setTimeout(r, 100));
        }
        return { scope: reg.scope, n: -1 };
      });
      check('Service worker actif sur tout le site et pré-cache complet', swCount.scope === SITE && swCount.n > 30, JSON.stringify(swCount));

      await page.reload();
      check('Service worker : contrôle la page après rechargement', await page.evaluate(() => Boolean(navigator.serviceWorker.controller)));

      await ctx.setOffline(true);
      const offlineOk = [];
      for (const p of ['a-propos/', 'en/catalogue/', 'portfolio/la-mine-d-or-des-entrepreneurs/', 'services/', 'en/blog/lancement-du-portfolio/']) {
        await page.goto(SITE + p);
        const h1 = await page.locator('h1').textContent();
        const imgs = await page.evaluate(async () => { for (const i of document.images) i.loading = 'eager'; await new Promise((r) => setTimeout(r, 300)); return [...document.images].every((i) => i.naturalWidth > 0); });
        const font = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 20px Fraunces'); });
        offlineOk.push({ p, ok: Boolean(h1) && !/hors connexion/i.test(h1) && imgs && font });
      }
      check('Hors ligne : pages, images et polices servies depuis le cache', offlineOk.every((x) => x.ok), JSON.stringify(offlineOk.filter((x) => !x.ok)));
      await page.goto(SITE + 'page-jamais-visitee/');
      check('Hors ligne : page inconnue → page « hors connexion »', (await page.locator('h1').textContent()).includes('hors connexion'));
      await page.goto(SITE + 'contact/');
      await page.evaluate(() => { window.open = () => ({}); });
      await page.fill('#contact-nom', 'Test');
      await page.fill('#contact-message', 'Test hors ligne');
      await page.locator('form[data-compose] button[value="whatsapp"]').click();
      check('Hors ligne : le formulaire prévient que l’envoi attend le réseau', (await page.locator('[data-form-status]').textContent()).includes('hors connexion'));
      await ctx.setOffline(false);

      // Mise à jour : une nouvelle version du service worker propose « Actualiser ».
      fs.appendFileSync(path.join(OUT_DIR, 'sw.js'), '\n// nouvelle version de test\n');
      await page.goto(SITE);
      await page.evaluate(async () => { const reg = await navigator.serviceWorker.getRegistration(); await reg.update(); });
      const toast = page.locator('[data-toast]');
      await toast.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      const toastOk = await toast.isVisible() && (await toast.textContent()).includes('nouvelle version');
      check('Mise à jour : message « nouvelle version disponible »', toastOk);
      if (toastOk) {
        await Promise.all([page.waitForEvent('load', { timeout: 10000 }).catch(() => null), page.locator('[data-toast-action]').click()]);
        const newVersion = await page.evaluate(async () => {
          const r = await navigator.serviceWorker.getRegistration();
          return Boolean(r.active) && !r.waiting && (await (await fetch(r.active.scriptURL)).text()).includes('nouvelle version de test');
        });
        check('Mise à jour : « Actualiser » active la nouvelle version', newVersion);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }

  console.log(results.join('\n'));
  console.log(failed ? `\n✖ ${failed} test(s) en échec` : `\n✔ ${results.filter((r) => r.startsWith('✔')).length} tests réussis`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
