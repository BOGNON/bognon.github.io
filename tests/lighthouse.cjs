// Audit Lighthouse (performance, accessibilité, bonnes pratiques, SEO) sur le site local.
// Usage : npm run build && node tests/lighthouse.cjs
// Chrome : variable CHROME_PATH, sinon le Chromium installé avec Playwright.

const { spawn } = require('node:child_process');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 4180;
const PAGES = ['', 'a-propos/', 'services/', 'catalogue/', 'en/'];

(async () => {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  const server = spawn('node', ['scripts/serve.mjs', String(PORT)], { cwd: ROOT });
  await new Promise((r) => server.stdout.once('data', r));
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH || chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });
  const rows = [];
  let worst = 100;
  try {
    for (const formFactor of ['mobile', 'desktop']) {
      for (const p of PAGES) {
        const config = formFactor === 'desktop'
          ? (await import('lighthouse/core/config/desktop-config.js')).default
          : undefined;
        const { lhr } = await lighthouse(`http://localhost:${PORT}/${p}`, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, config);
        const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
        worst = Math.min(worst, ...Object.values(s));
        rows.push(`| ${formFactor} | /${p} | ${s.performance} | ${s.accessibility} | ${s['best-practices']} | ${s.seo} | ${lhr.audits['largest-contentful-paint'].displayValue} | ${lhr.audits['cumulative-layout-shift'].displayValue} |`);
      }
    }
  } finally {
    await chrome.kill();
    server.kill();
  }
  console.log('| Appareil | Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
  console.log(rows.join('\n'));
  console.log(`\nScore le plus bas : ${worst}/100 (mesure locale, sans latence réseau réelle)`);
})().catch((e) => { console.error(e); process.exit(1); });
