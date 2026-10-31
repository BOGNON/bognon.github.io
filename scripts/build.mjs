// Générateur du site statique : node scripts/build.mjs
// Lit src/ et écrit le site complet dans docs/ (dossier publié par GitHub Pages).
// Aucune dépendance externe.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content/site.mjs';
import { profile, skills, softSkills, services, book, projects, catalogue, posts, commitments, faq } from '../src/content/content.mjs';
import { esc, text, plain, rel, pick, waLink, mailLink, formatDate, todoLog, hasTodo } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, process.env.OUT_DIR || 'docs');
const SITE_URL = site.url.replace(/\/+$/, '');
const BASE_PATH = new URL(SITE_URL + '/').pathname; // '/' ou '/depot/'
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const LANGS = ['fr', 'en'];

// ---------------------------------------------------------------- routes
const routes = {
  home: { fr: '', en: 'en/' },
  about: { fr: 'a-propos/', en: 'en/about/' },
  skills: { fr: 'competences/', en: 'en/skills/' },
  portfolio: { fr: 'portfolio/', en: 'en/portfolio/' },
  catalogue: { fr: 'catalogue/', en: 'en/catalogue/' },
  services: { fr: 'services/', en: 'en/services/' },
  blog: { fr: 'blog/', en: 'en/blog/' },
  contact: { fr: 'contact/', en: 'en/contact/' },
  legal: { fr: 'mentions-legales/', en: 'en/legal-notice/' },
  privacy: { fr: 'confidentialite/', en: 'en/privacy/' },
};
const projectPath = (slug, lang) => `${routes.portfolio[lang]}${slug}/`;
const postPath = (slug, lang) => `${routes.blog[lang]}${slug}/`;
const abs = (p) => `${SITE_URL}/${p}`;

// ---------------------------------------------------------------- interface
const ui = {
  fr: {
    locale: 'fr_FR', skip: 'Aller au contenu', menu: 'Menu', mainNav: 'Navigation principale',
    nav: { home: 'Accueil', about: 'À propos', skills: 'Compétences', portfolio: 'Portfolio', catalogue: 'Catalogue', services: 'Services', blog: 'Blog', contact: 'Contact', legal: 'Mentions légales', privacy: 'Confidentialité' },
    switchTo: 'English', switchLabel: 'Read this page in English',
    onQuote: 'Sur devis', quote: 'Demander un devis', orderWa: 'Commander sur WhatsApp', orderMail: 'Commander par e-mail',
    askWa: 'Écrire sur WhatsApp', askMail: 'Écrire par e-mail', details: 'Voir le détail', readMore: 'Lire l’article',
    breadcrumb: "Fil d'Ariane", footerTag: 'Développeur web & entrepreneur à Porto-Novo, Bénin.',
    footerTech: 'Site rapide et sécurisé (HTTPS), consultable hors connexion et installable comme une application.',
    rights: 'Tous droits réservés.', navTitle: 'Navigation', contactTitle: 'Contact', legalTitle: 'Informations',
    location: 'Porto-Novo, Bénin', updateReady: 'Une nouvelle version du site est disponible.', reload: 'Actualiser',
    offlineNow: 'Vous êtes hors connexion. Les pages déjà visitées restent consultables.',
    waGreeting: 'Bonjour Isaac, ', orderSubject: 'Commande', quoteSubject: 'Demande de devis',
    noJs: "Le formulaire a besoin de JavaScript. Écrivez-moi directement :",
  },
  en: {
    locale: 'en_US', skip: 'Skip to content', menu: 'Menu', mainNav: 'Main navigation',
    nav: { home: 'Home', about: 'About', skills: 'Skills', portfolio: 'Portfolio', catalogue: 'Catalogue', services: 'Services', blog: 'Blog', contact: 'Contact', legal: 'Legal notice', privacy: 'Privacy' },
    switchTo: 'Français', switchLabel: 'Lire cette page en français',
    onQuote: 'On quotation', quote: 'Request a quote', orderWa: 'Order on WhatsApp', orderMail: 'Order by email',
    askWa: 'Message on WhatsApp', askMail: 'Send an email', details: 'View details', readMore: 'Read the post',
    breadcrumb: 'Breadcrumb', footerTag: 'Web developer & entrepreneur in Porto-Novo, Benin.',
    footerTech: 'Fast, secure (HTTPS) website, readable offline and installable as an app.',
    rights: 'All rights reserved.', navTitle: 'Navigation', contactTitle: 'Contact', legalTitle: 'Information',
    location: 'Porto-Novo, Benin', updateReady: 'A new version of this site is available.', reload: 'Refresh',
    offlineNow: 'You are offline. Pages you already visited are still available.',
    waGreeting: 'Hello Isaac, ', orderSubject: 'Order', quoteSubject: 'Quote request',
    noJs: 'This form needs JavaScript. Contact me directly:',
  },
};
const navKeys = ['home', 'about', 'skills', 'portfolio', 'catalogue', 'services', 'blog', 'contact'];

// ---------------------------------------------------------------- assets
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}
const hashOf = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

fs.rmSync(OUT, { recursive: true, force: true });
copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
const cssHash = hashOf(fs.readFileSync(path.join(SRC, 'assets/css/styles.css')));
const jsHash = hashOf(fs.readFileSync(path.join(SRC, 'assets/js/main.js')));

const C = site.contact;
const hasWa = Boolean(C.whatsapp);
const hasMail = Boolean(C.email);

// <picture> responsive
function picture(name, { alt, widths, ext, w, h, sizes, cls = '', eager = false, from }) {
  const r = (p) => rel(from, p);
  const srcset = (e) => widths.map((x) => `${r(`assets/img/${name}-${x}.${e}`)} ${x}w`).join(', ');
  const largest = widths[widths.length - 1];
  return `<picture class="${cls}">` +
    `<source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">` +
    `<img src="${r(`assets/img/${name}-${largest}.${ext}`)}" srcset="${srcset(ext)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}
const portrait = (lang, from, opts = {}) => picture('isaac-bognon-portrait', {
  alt: lang === 'fr' ? 'Portrait souriant de BOGNON ISAAC en tenue traditionnelle brodée' : 'Smiling portrait of BOGNON ISAAC wearing an embroidered traditional outfit',
  widths: [240, 480], ext: 'jpg', w: 480, h: 480, sizes: '(min-width: 900px) 380px, 70vw', from, ...opts,
});
// Image décrite dans content.mjs : { name, widths, ext, width, height } + texte alternatif bilingue.
const contentImg = (img, alt, lang, from, opts = {}) => picture(img.name, {
  alt: alt[lang], widths: img.widths, ext: img.ext, w: img.width, h: img.height, sizes: '(min-width: 900px) 520px, 92vw', from, ...opts,
});
const bookImg = (lang, from, opts = {}) => contentImg(book.image, book.imageAlt, lang, from, opts);

// ---------------------------------------------------------------- liens de contact
const waMsg = (lang, what) => `${ui[lang].waGreeting}${what}`;
function orderButtons(lang, label, { primaryQuote = null, from }) {
  const t = ui[lang];
  const ask = lang === 'fr' ? `je souhaite commander : ${label}.` : `I would like to order: ${label}.`;
  const out = [];
  if (primaryQuote) out.push(`<a class="btn btn--primary" href="${rel(from, routes.services[lang])}?service=${primaryQuote}#devis">${t.quote}</a>`);
  if (hasWa) out.push(`<a class="btn btn--ghost" href="${esc(waLink(C.whatsapp, waMsg(lang, ask)))}" target="_blank" rel="noopener">${icon('wa')}<span>${t.orderWa}</span></a>`);
  if (hasMail) out.push(`<a class="btn btn--ghost" href="${esc(mailLink(C.email, `${t.orderSubject} : ${label}`, `${t.waGreeting}\n\n${ask}\n\n`))}">${icon('mail')}<span>${t.orderMail}</span></a>`);
  return out.join('');
}

function icon(name) {
  const p = {
    wa: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" fill="currentColor"/>',
    mail: '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  }[name];
  return `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">${p}</svg>`;
}

// ---------------------------------------------------------------- données structurées
const personId = `${SITE_URL}/#person`;
const orgId = `${SITE_URL}/#lecodetech`;
const CO = site.company;
const brandMark = (r) => `<img class="brand__mark" src="${r('assets/img/monogramme-bi-96.webp')}" width="38" height="38" alt="">`;
const socialLabel = { linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', x: 'X (Twitter)', snapchat: 'Snapchat', discord: 'Discord', github: 'GitHub', youtube: 'YouTube' };
const socialLinks = () => Object.entries(site.social).filter(([, v]) => v).map(([k, v]) => [socialLabel[k] || k, v]);
const orgLd = () => ({
  '@type': 'Organization', '@id': orgId, name: CO.name, url: CO.url, foundingDate: CO.foundingDate,
  logo: abs('assets/img/logo-lecodetech-512.png'), founder: { '@id': personId },
  address: { '@type': 'PostalAddress', addressLocality: site.person.city, addressCountry: site.person.countryCode },
});
function personLd(lang) {
  const sameAs = Object.entries(site.social).filter(([k, v]) => v && k !== 'discord').map(([, v]) => v);
  return {
    '@type': 'Person', '@id': personId, name: site.person.fullName, alternateName: ['Isaac BOGNON', 'Bognon Isaac', 'Isaac Bognon'],
    description: plain(profile.bio[lang]),
    hasOccupation: { '@type': 'Occupation', name: site.person.jobTitle[lang], occupationLocation: { '@type': 'City', name: site.person.city } },
    homeLocation: { '@type': 'Place', name: `${site.person.city}, ${site.person.country[lang]}` },
    givenName: site.person.givenName, familyName: site.person.familyName,
    jobTitle: site.person.jobTitle[lang], url: abs(routes.home[lang]),
    image: abs('assets/img/isaac-bognon-portrait-480.jpg'),
    ...(hasMail ? { email: `mailto:${C.email}` } : {}),
    address: { '@type': 'PostalAddress', addressLocality: site.person.city, addressCountry: site.person.countryCode },
    knowsLanguage: ['fr', 'guw'],
    knowsAbout: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'SEO', 'Canva', 'Photoshop', 'Illustrator', lang === 'fr' ? 'Intelligence artificielle' : 'Artificial intelligence', lang === 'fr' ? 'Création de sites web' : 'Website creation', lang === 'fr' ? 'E-commerce' : 'E-commerce', lang === 'fr' ? 'Développement web' : 'Web development', lang === 'fr' ? 'Graphisme' : 'Graphic design', lang === 'fr' ? 'Entrepreneuriat' : 'Entrepreneurship'],
    ...(CO ? { worksFor: { '@id': orgId } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
// Questions-réponses factuelles sur BOGNON ISAAC (page À propos) : utiles aux moteurs de recherche et aux assistants IA.
function whoIs(lang) {
  const fr = lang === 'fr';
  const net = socialLinks().filter(([k]) => k !== 'Discord').map(([k]) => k).join(', ');
  return [
    [fr ? 'Qui est BOGNON ISAAC ?' : 'Who is BOGNON ISAAC?',
      fr ? `BOGNON ISAAC (BOGNON ISAAC) est un développeur web et chef d’entreprise basé à Porto-Novo, au Bénin, fondateur de ${CO.name} en ${CO.foundingDate}. BOGNON ISAAC conçoit des sites vitrines, des boutiques en ligne et des plateformes web.`
        : `BOGNON ISAAC (BOGNON ISAAC) is a web developer and business owner based in Porto-Novo, Benin, who founded ${CO.name} in ${CO.foundingDate}. BOGNON ISAAC builds business websites, online shops and web platforms.`],
    [fr ? 'Que propose BOGNON ISAAC ?' : 'What does BOGNON ISAAC offer?',
      fr ? `Création de sites web et de boutiques en ligne, applications web, maintenance, mise en ligne, création graphique, automatisation avec l’IA et formation au numérique. Chaque projet fait l’objet d’un devis gratuit.`
        : `Websites and online shops, web applications, maintenance, deployment, graphic design, AI automation and digital skills training. Every project starts with a free quote.`],
    [fr ? 'Quelles sont les compétences techniques de BOGNON ISAAC ?' : 'What are BOGNON ISAAC’s technical skills?',
      fr ? 'HTML, CSS, JavaScript, PHP et MySQL pour le développement web ; Canva, Photoshop et Illustrator pour le graphisme ; intégration d’outils d’intelligence artificielle, hébergement, déploiement et tests.'
        : 'HTML, CSS, JavaScript, PHP and MySQL for web development; Canva, Photoshop and Illustrator for design; AI tool integration, hosting, deployment and testing.'],
    [fr ? `Qu’est-ce que ${CO.name} ?` : `What is ${CO.name}?`,
      fr ? `${CO.name} est l’entreprise fondée par BOGNON ISAAC en ${CO.foundingDate}. Site officiel : ${CO.url.replace('https://', '')}.`
        : `${CO.name} is the company BOGNON ISAAC founded in ${CO.foundingDate}. Official website: ${CO.url.replace('https://', '')}.`],
    [fr ? 'Quel livre a écrit BOGNON ISAAC ?' : 'What book has BOGNON ISAAC written?',
      fr ? `« ${book.title} », un recueil d’idées d’affaires adaptées au marché africain, écrit pour guider et motiver les jeunes entrepreneurs.`
        : `“${book.title}” (The Entrepreneurs’ Gold Mine), a collection of business ideas suited to the African market, written to guide and motivate young entrepreneurs.`],
    [fr ? 'Comment contacter BOGNON ISAAC ?' : 'How can I contact BOGNON ISAAC?',
      fr ? `Par e-mail à ${C.email}, sur WhatsApp au ${C.whatsappDisplay}, ou sur les réseaux sociaux : ${net}.`
        : `By email at ${C.email}, on WhatsApp at ${C.whatsappDisplay}, or on social media: ${net}.`],
  ];
}
const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

// ---------------------------------------------------------------- gabarit
function layout(p) {
  const { lang, path: here } = p;
  const t = ui[lang];
  const other = lang === 'fr' ? 'en' : 'fr';
  const r = (to) => rel(here, to);
  const alt = p.alternates; // { fr: path, en: path }
  const title = p.key === 'home' ? p.title : `${p.title} | ${site.brand}`;
  const crumbs = p.crumbs || [];
  const webPage = {
    '@type': 'WebPage', '@id': `${abs(here)}#webpage`, url: abs(here), name: title, description: p.description, inLanguage: lang,
    isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': personId }, dateModified: BUILD_DATE,
    primaryImageOfPage: abs(p.ogImage || 'assets/img/og-bognon-isaac.jpg'),
    ...(crumbs.length > 1 ? { breadcrumb: { '@id': `${abs(here)}#breadcrumb` } } : {}),
  };
  const ld = { '@context': 'https://schema.org', '@graph': [webPage, ...(p.ld || []), ...(crumbs.length > 1 ? [{ '@id': `${abs(here)}#breadcrumb`, ...breadcrumbLd(crumbs) }] : [])] };
  const navItems = navKeys.map((k) => {
    const cur = p.section === k;
    return `<li><a href="${r(routes[k][lang])}"${cur ? ' aria-current="page"' : ''}>${t.nav[k]}</a></li>`;
  }).join('');
  const social = socialLinks();
  const ogImage = abs(p.ogImage || 'assets/img/og-bognon-isaac.jpg');

  return `<!doctype html>
<html lang="${lang}" data-root="${r('')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${abs(here)}">
${alt ? `<link rel="alternate" hreflang="fr" href="${abs(alt.fr)}">
<link rel="alternate" hreflang="en" href="${abs(alt.en)}">
<link rel="alternate" hreflang="x-default" href="${abs(alt.fr)}">` : ''}
<meta name="author" content="${site.person.fullName}">
${site.verification.google ? `<meta name="google-site-verification" content="${esc(site.verification.google)}">` : ''}
${site.verification.bing ? `<meta name="msvalidate.01" content="${esc(site.verification.bing)}">` : ''}
<meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${site.brand}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${abs(here)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${lang === 'fr' ? 'BOGNON ISAAC, développeur web et entrepreneur' : 'BOGNON ISAAC, web developer and entrepreneur'}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${ui[other].locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${site.themeColor}">
<link rel="manifest" href="${r('manifest.webmanifest')}">
<link rel="alternate" type="application/rss+xml" title="${lang === 'fr' ? 'Blog de BOGNON ISAAC' : 'BOGNON ISAAC blog'}" href="${r(routes.blog[lang] + 'feed.xml')}">
<link rel="icon" href="${r('assets/icons/favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${r('assets/icons/favicon-48.png')}" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="${r('assets/icons/apple-touch-icon.png')}">
<link rel="preload" href="${r('assets/fonts/fraunces.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r('assets/fonts/inter.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r('assets/css/styles.css')}?v=${cssHash}">
<script>document.documentElement.classList.add('js')</script>
<script src="${r('assets/js/main.js')}?v=${jsHash}" defer></script>
${ld['@graph'].length ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body class="page-${p.key}">
<a class="skip-link" href="#contenu">${t.skip}</a>
<div class="scroll-progress" aria-hidden="true"></div>
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="${r(routes.home[lang])}">
      ${brandMark(r)}
      <span class="brand__name">BOGNON <span>ISAAC</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle hidden>${icon('menu')}<span>${t.menu}</span></button>
    <nav id="site-nav" class="site-nav" aria-label="${t.mainNav}">
      <ul>${navItems}</ul>
      ${alt ? `<a class="lang-switch" href="${r(alt[other])}" hreflang="${other}" lang="${other}" title="${t.switchLabel}"><span aria-hidden="true">${other.toUpperCase()}</span><span class="sr-only">${t.switchLabel}</span></a>` : ''}
    </nav>
  </div>
</header>
<main id="contenu" tabindex="-1">
${crumbs.length > 1 ? `<nav class="breadcrumb container" aria-label="${t.breadcrumb}"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${r(c.path)}">${esc(c.name)}</a></li>`).join('')}</ol></nav>` : ''}
${p.body}
</main>
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div>
      <a class="brand brand--light" href="${r(routes.home[lang])}">${brandMark(r)}<span class="brand__name">BOGNON <span>ISAAC</span></span></a>
      <p class="site-footer__tag">${esc(t.footerTag)}</p>
      ${CO ? `<p class="site-footer__company">${lang === 'fr' ? 'Fondateur de' : 'Founder of'} <a href="${CO.url}" target="_blank" rel="noopener">${CO.name}</a></p>` : ''}
    </div>
    <div>
      <h2 class="site-footer__title">${t.navTitle}</h2>
      <ul>${navKeys.slice(1).map((k) => `<li><a href="${r(routes[k][lang])}">${t.nav[k]}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="site-footer__title">${t.contactTitle}</h2>
      <ul>
        ${hasMail ? `<li><a href="mailto:${C.email}">${C.email}</a></li>` : ''}
        ${hasWa ? `<li><a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.whatsappDisplay}</a></li>` : ''}
        <li>${t.location}</li>
        </ul>
      ${social.length ? `<ul class="socials">${social.map(([k, v]) => `<li><a href="${esc(v)}" rel="me noopener" target="_blank">${k}</a></li>`).join('')}</ul>` : ''}
    </div>
    <div>
      <h2 class="site-footer__title">${t.legalTitle}</h2>
      <ul>
        <li><a href="${r(routes.legal[lang])}">${t.nav.legal}</a></li>
        <li><a href="${r(routes.privacy[lang])}">${t.nav.privacy}</a></li>
      </ul>
    </div>
  </div>
  <div class="container site-footer__bottom">
    <p>© <span data-year>${BUILD_DATE.slice(0, 4)}</span> ${site.brand}. ${t.rights}</p>
    <p>${t.footerTech}</p>
  </div>
  <a class="to-top" href="#contenu" data-to-top hidden><span class="sr-only">${lang === 'fr' ? 'Haut de page' : 'Back to top'}</span><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
</footer>
<div class="toast" role="status" aria-live="polite" hidden data-toast>
  <p data-toast-text></p>
  <button type="button" class="btn btn--small btn--primary" data-toast-action hidden>${t.reload}</button>
</div>
<template data-i18n data-update="${esc(t.updateReady)}" data-offline="${esc(t.offlineNow)}"></template>
</body>
</html>
`;
}

// ---------------------------------------------------------------- blocs réutilisables
// Fond animé (dégradés en mouvement), purement décoratif.
const aurora = '<div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div>';

const sectionHead = (num, kicker, title, intro = '') => `
<div class="section-head reveal">
  <p class="kicker"><span class="kicker__num">${num}</span>${kicker}</p>
  <h2>${title}</h2>
  ${intro ? `<p class="section-head__intro">${intro}</p>` : ''}
</div>`;

const pageHero = (kicker, title, lead) => `
<section class="page-hero">
  ${aurora}
  <div class="container">
    <p class="kicker intro-anim" style="--i:0">${kicker}</p>
    <h1 class="intro-anim" style="--i:1">${title}</h1>
    ${lead ? `<p class="lead intro-anim" style="--i:2">${lead}</p>` : ''}
  </div>
</section>`;


function ctaBand(lang, from) {
  const t = ui[lang];
  const fr = lang === 'fr';
  return `
<section class="cta-band">
  <div class="container cta-band__inner reveal">
    <div>
      <h2>${fr ? 'Un projet en tête ?' : 'Have a project in mind?'}</h2>
      <p>${fr ? 'Décrivez votre besoin : je vous réponds avec une proposition et un devis.' : 'Tell me what you need: I will reply with a proposal and a quote.'}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary" href="${rel(from, routes.services[lang])}#devis">${t.quote}</a>
      ${hasWa ? `<a class="btn btn--light" href="${esc(waLink(C.whatsapp, waMsg(lang, fr ? 'je vous contacte depuis votre site.' : 'I am contacting you from your website.')))}" target="_blank" rel="noopener">${icon('wa')}<span>WhatsApp</span></a>` : ''}
    </div>
  </div>
</section>`;
}

function serviceOptions(lang, selected = '') {
  const fr = lang === 'fr';
  return [
    `<option value="">${fr ? 'Choisissez…' : 'Choose…'}</option>`,
    ...services.map((s) => `<option value="${s.slug}"${s.slug === selected ? ' selected' : ''}>${esc(s.title[lang])}</option>`),
    `<option value="${book.slug}">${fr ? 'Livre' : 'Book'} : ${esc(book.title)}</option>`,
    `<option value="autre">${fr ? 'Autre demande' : 'Other request'}</option>`,
  ].join('');
}

function composeForm(lang, kind) {
  const fr = lang === 'fr';
  const t = ui[lang];
  const id = (n) => `${kind}-${n}`;
  const field = (name, label, { type = 'text', required = false, auto = '', hint = '', textarea = false, select = '' } = {}) => {
    const req = required ? ' required' : '';
    const opt = required ? '' : ` <span class="field__opt">${fr ? '(facultatif)' : '(optional)'}</span>`;
    const control = select
      ? `<select id="${id(name)}" name="${name}"${req}>${select}</select>`
      : textarea
        ? `<textarea id="${id(name)}" name="${name}" rows="6"${req}></textarea>`
        : `<input id="${id(name)}" name="${name}" type="${type}"${auto ? ` autocomplete="${auto}"` : ''}${req}>`;
    return `<div class="field${textarea ? ' field--full' : ''}"><label for="${id(name)}">${label}${opt}</label>${control}${hint ? `<p class="field__hint">${hint}</p>` : ''}</div>`;
  };
  const fields = kind === 'quote'
    ? [
      field('nom', fr ? 'Votre nom' : 'Your name', { required: true, auto: 'name' }),
      field('email', fr ? 'Votre e-mail' : 'Your email', { type: 'email', auto: 'email' }),
      field('entreprise', fr ? 'Entreprise ou organisation' : 'Company or organisation', { auto: 'organization' }),
      field('pays', fr ? 'Pays' : 'Country', { auto: 'country-name' }),
      field('service', fr ? 'Service souhaité' : 'Service needed', { required: true, select: serviceOptions(lang) }),
      field('budget', fr ? 'Budget indicatif' : 'Indicative budget', { hint: fr ? 'Montant et devise, par exemple 300 000 FCFA ou 500 EUR.' : 'Amount and currency, e.g. 300,000 FCFA or 500 EUR.' }),
      field('delai', fr ? 'Délai souhaité' : 'Desired deadline'),
      field('message', fr ? 'Décrivez votre projet' : 'Describe your project', { required: true, textarea: true }),
    ]
    : [
      field('nom', fr ? 'Votre nom' : 'Your name', { required: true, auto: 'name' }),
      field('email', fr ? 'Votre e-mail' : 'Your email', { type: 'email', auto: 'email' }),
      field('sujet', fr ? 'Sujet' : 'Subject'),
      field('message', fr ? 'Votre message' : 'Your message', { required: true, textarea: true }),
    ];
  const subject = kind === 'quote' ? t.quoteSubject : (fr ? 'Message depuis le site' : 'Message from the website');
  return `
<form class="compose-form" data-compose data-kind="${kind}" data-email="${esc(C.email)}" data-wa="${esc(C.whatsapp)}" data-subject="${esc(subject)}" data-greeting="${esc(t.waGreeting)}" data-intro="${esc(kind === 'quote' ? (fr ? 'voici ma demande de devis :' : 'here is my quote request:') : (fr ? 'voici mon message :' : 'here is my message:'))}">
  <div class="form-grid">${fields.join('')}</div>
  <p class="form-note">${fr
    ? 'Ce formulaire n’envoie rien à un serveur : il ouvre votre messagerie ou WhatsApp avec votre message prérempli, que vous vérifiez puis envoyez vous-même. Une connexion Internet est nécessaire pour l’envoi.'
    : 'This form does not send anything to a server: it opens your email app or WhatsApp with your message pre-filled, which you check and send yourself. An internet connection is needed to send it.'}</p>
  <p class="form-status" data-form-status role="status" aria-live="polite"></p>
  <div class="btn-row">
    ${hasMail ? `<button class="btn btn--primary" type="submit" name="channel" value="email">${icon('mail')}<span>${fr ? 'Envoyer par e-mail' : 'Send by email'}</span></button>` : ''}
    ${hasWa ? `<button class="btn btn--ghost" type="submit" name="channel" value="whatsapp">${icon('wa')}<span>${fr ? 'Envoyer sur WhatsApp' : 'Send on WhatsApp'}</span></button>` : ''}
  </div>
  <noscript><p class="form-note">${t.noJs} ${hasMail ? `<a href="mailto:${C.email}">${C.email}</a>` : ''} ${hasWa ? `· <a href="https://wa.me/${C.whatsapp}">WhatsApp ${C.whatsappDisplay}</a>` : ''}</p></noscript>
</form>`;
}

// Paragraphe ou ligne de faits affichés seulement si l'information existe.
const para = (s, lang, where, cls = '') => { const h = text(s, lang, where); return h ? `<p${cls ? ` class="${cls}"` : ''}>${h}</p>` : ''; };
const fact = (label, value, lang, where) => { const h = text(value, lang, where); return h ? `<div><dt>${esc(label)}</dt><dd>${h}</dd></div>` : ''; };

const priceLabel = (price, lang) => (price ? esc(pick(price, lang)) : ui[lang].onQuote);

// Projets publiés : ceux dont la description est connue. Les autres sont signalés dans A-COMPLETER.md.
const shownProjects = projects.filter((p) => !hasTodo(p.summary.fr));
for (const p of projects.filter((x) => hasTodo(x.summary.fr))) todoLog.push({ where: `portfolio/${p.slug}/ (projet masqué)`, lang: 'fr', what: `informations sur le projet ${p.title}` });

// ---------------------------------------------------------------- pages
const pages = [];
const add = (p) => pages.push(p);
const crumbHome = (lang) => ({ name: ui[lang].nav.home, path: routes.home[lang] });

for (const lang of LANGS) {
  const fr = lang === 'fr';
  const t = ui[lang];
  const alts = (k) => ({ fr: routes[k].fr, en: routes[k].en });

  // ------------------------------------------------ Accueil
  {
    const here = routes.home[lang];
    const top = services.slice(0, 3);
    add({
      key: 'home', section: 'home', lang, path: here, alternates: alts('home'),
      title: fr ? 'BOGNON ISAAC | Développeur web et chef d’entreprise au Bénin' : 'BOGNON ISAAC | Web developer and business owner in Benin',
      description: fr
        ? 'BOGNON ISAAC, développeur web et entrepreneur à Porto-Novo (Bénin) : sites vitrines, e-commerce, plateformes web, graphisme et livre pour entrepreneurs.'
        : 'BOGNON ISAAC, web developer and entrepreneur in Porto-Novo, Benin: business websites, online shops, web platforms, graphic design and a book for entrepreneurs.',
      ld: [
        personLd(lang),
        { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: abs(''), name: site.brand, inLanguage: ['fr', 'en'], publisher: { '@id': personId } },
        ...(CO ? [orgLd()] : []),
      ],
      body: `
<section class="hero">
  ${aurora}
  <div class="container hero__inner">
    <div class="hero__text">
      <p class="kicker kicker--light intro-anim" style="--i:0">${esc(profile.headline[lang])} · ${t.location}</p>
      <h1 class="hero__title intro-anim" style="--i:1">BOGNON <span class="text-grad">ISAAC</span></h1>
      <p class="hero__roles intro-anim" style="--i:2"><span class="sr-only">${profile.roles[lang].join(', ')}</span><span class="roles" aria-hidden="true" data-roles="${esc(JSON.stringify(profile.roles[lang]))}">${esc(profile.roles[lang][0])}</span></p>
      ${CO ? `<p class="hero__company intro-anim" style="--i:2"><img src="${rel(here, 'assets/img/logo-lecodetech-96.webp')}" width="28" height="28" alt="">${fr ? 'Fondateur de' : 'Founder of'} <a href="${CO.url}" target="_blank" rel="noopener">${CO.name}</a></p>` : ''}
      <p class="hero__lead intro-anim" style="--i:2">${text(profile.intro[lang], lang, here)}</p>
      <div class="btn-row intro-anim" style="--i:3">
        <a class="btn btn--primary" href="${rel(here, routes.services[lang])}#devis">${t.quote}</a>
        <a class="btn btn--light" href="${rel(here, routes.portfolio[lang])}">${fr ? 'Voir mes réalisations' : 'See my work'}</a>
      </div>
    </div>
    <div class="hero__media intro-anim" style="--i:2">
      <div class="hero__frame"><span class="hero__ring" aria-hidden="true"></span>${portrait(lang, here, { eager: true })}</div>
    </div>
  </div>
</section>

<section class="figures" aria-label="${fr ? 'Chiffres clés' : 'Key figures'}">
  <div class="container"><div class="figures__grid">
    ${[[services.length, fr ? 'services proposés' : 'services offered'], [skills.length, fr ? 'domaines d’expertise' : 'areas of expertise'], [1, fr ? 'livre publié' : 'book published'], [Number(CO ? CO.foundingDate : 2026), CO ? (fr ? `création de ${CO.name}` : `${CO.name} founded`) : '']].filter(([, l]) => l).map(([n, l], i) => `<div class="figure reveal" style="--d:${i}"><p class="figure__num" data-count="${n}">${n}</p><p class="figure__label">${l}</p></div>`).join('')}
  </div></div>
</section>

<section class="section">
  <div class="container about">
    <div class="about__media reveal">
      ${picture('isaac-bognon-costume', { alt: fr ? 'BOGNON ISAAC en costume bordeaux, souriant, en train d’écrire' : 'BOGNON ISAAC in a burgundy suit, smiling while writing', widths: [480, 800], ext: 'jpg', w: 800, h: 1000, sizes: '(min-width: 900px) 420px, 92vw', from: here })}
    </div>
    <div class="about__text reveal">
      <p class="kicker"><span class="kicker__num">00</span>${fr ? 'Portrait' : 'Profile'}</p>
      <h2>${fr ? 'Qui est BOGNON ISAAC ?' : 'Who is BOGNON ISAAC?'}</h2>
      <p class="lead">${text(profile.bio[lang], lang, here)}</p>
      <ul class="check-list">${(() => { const w = whoIs(lang); return [[fr ? 'Services' : 'Services', w[1][1]], [fr ? 'Compétences' : 'Skills', w[2][1]], [fr ? 'Auteur' : 'Author', w[4][1]]].map(([k, v]) => `<li><strong>${k}${fr ? " :" : ":"}</strong> ${esc(v)}</li>`).join(''); })()}</ul>
      <div class="btn-row">
        <a class="btn btn--primary" href="${rel(here, routes.about[lang])}">${fr ? 'Découvrir mon parcours' : 'Discover my background'}</a>
        <a class="btn btn--ghost" href="${rel(here, routes.contact[lang])}">${fr ? 'Me contacter' : 'Contact me'}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('01', fr ? 'Services' : 'Services', fr ? 'Ce que je réalise pour vous' : 'What I build for you', fr ? 'Du premier échange à la mise en ligne, un seul interlocuteur pour votre projet web.' : 'From the first conversation to going live, one point of contact for your web project.')}
    <div class="card-grid card-grid--3">
      ${top.map((s, i) => `
      <article class="card reveal" style="--d:${i}">
        <p class="card__num" aria-hidden="true">0${i + 1}</p>
        <h3>${esc(s.title[lang])}</h3>
        <p>${esc(s.text[lang])}</p>
        <a class="link-arrow" href="${rel(here, routes.services[lang])}#${s.slug}">${fr ? 'En savoir plus' : 'Learn more'}<span class="sr-only"> : ${esc(s.title[lang])}</span> ${icon('arrow')}</a>
      </article>`).join('')}
    </div>
    <p class="section__more reveal"><a class="link-arrow" href="${rel(here, routes.services[lang])}">${fr ? 'Tous les services' : 'All services'} ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section--alt">
  <div class="container feature">
    <div class="feature__media reveal">${bookImg(lang, here)}</div>
    <div class="feature__text reveal">
      <p class="kicker"><span class="kicker__num">02</span>${fr ? 'Réalisation à la une' : 'Featured work'}</p>
      <h2>${esc(book.title)}</h2>
      <p class="feature__sub">${esc(book.subtitle[lang])}</p>
      <p>${esc(book.text[lang])}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${rel(here, projectPath(book.slug, lang))}">${t.details}</a>
        <a class="btn btn--ghost" href="${rel(here, routes.catalogue[lang])}#${book.slug}">${fr ? 'Commander le livre' : 'Order the book'}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('03', fr ? 'Compétences' : 'Skills', fr ? 'Les outils que j’utilise' : 'The tools I use')}
    <div class="marquee reveal">
      <ul class="marquee__track">
        ${(() => { const tags = skills.flatMap((s) => s.tags).map((tag) => esc(pick(tag, lang))); return tags.map((x) => `<li>${x}</li>`).join('') + tags.map((x) => `<li aria-hidden="true">${x}</li>`).join(''); })()}
      </ul>
    </div>
    <p class="section__more reveal"><a class="link-arrow" href="${rel(here, routes.skills[lang])}">${fr ? 'Voir toutes les compétences' : 'See all skills'} ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    ${sectionHead('04', fr ? 'Engagements' : 'Commitments', fr ? 'Ma façon de travailler' : 'How I work')}
    <div class="card-grid card-grid--4">
      ${commitments.map((c, i) => `<article class="card reveal" style="--d:${i}"><p class="card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p><h3 class="card__title">${esc(c.title[lang])}</h3><p>${esc(c.text[lang])}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('05', 'Blog', fr ? 'Conseils et actualités' : 'Advice and news')}
    <div class="card-grid card-grid--3">
      ${posts.slice(0, 3).map((po, i) => `<article class="card reveal" style="--d:${i}"><p class="post-item__date"><time datetime="${po.date}">${formatDate(po.date, lang)}</time></p><h3 class="card__title"><a href="${rel(here, postPath(po.slug, lang))}">${esc(po.title[lang])}</a></h3><p>${esc(po.excerpt[lang])}</p></article>`).join('')}
    </div>
    <p class="section__more reveal"><a class="link-arrow" href="${rel(here, routes.blog[lang])}">${fr ? 'Tous les articles' : 'All posts'} ${icon('arrow')}</a></p>
  </div>
</section>
${ctaBand(lang, here)}`,
    });
  }

  // ------------------------------------------------ À propos
  {
    const here = routes.about[lang];
    const timeline = (items) => items.map((e) => `
      <li class="timeline__item">
        <p class="timeline__year">${text(pick(e.year, lang) || '', lang, here)}</p>
        <div>
          <h3>${esc(e.title[lang])}</h3>
          ${e.school ? `<p>${esc(e.school)}${e.place ? ` · ${esc(e.place)}` : ''}</p>` : ''}
        </div>
      </li>`).join('');
    add({
      key: 'about', section: 'about', lang, path: here, alternates: alts('about'),
      title: fr ? 'À propos de BOGNON ISAAC' : 'About BOGNON ISAAC',
      description: fr
        ? 'Parcours de BOGNON ISAAC, développeur web et entrepreneur à Porto-Novo : expérience, formations, diplômes, langues et centres d’intérêt.'
        : 'Background of BOGNON ISAAC, web developer and entrepreneur in Porto-Novo: experience, training, qualifications, languages and interests.',
      crumbs: [crumbHome(lang), { name: t.nav.about, path: here }],
      ogType: 'profile',
      ld: [{ '@type': 'ProfilePage', url: abs(here), inLanguage: lang, mainEntity: personLd(lang) },
        { '@type': 'FAQPage', '@id': `${abs(here)}#qui`, mainEntity: whoIs(lang).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
      body: `
${pageHero(fr ? 'À propos' : 'About', fr ? 'BOGNON ISAAC, développeur web et entrepreneur' : 'BOGNON ISAAC, web developer and entrepreneur', '')}
<section class="section section--tight">
  <div class="container about">
    <div class="about__media reveal">
      ${picture('isaac-bognon-costume', { alt: fr ? 'BOGNON ISAAC en costume bordeaux, souriant, en train d’écrire' : 'BOGNON ISAAC in a burgundy suit, smiling while writing', widths: [480, 800], ext: 'jpg', w: 800, h: 1000, sizes: '(min-width: 900px) 420px, 92vw', from: here })}
    </div>
    <div class="about__text reveal">
      <p class="lead">${text(profile.bio[lang], lang, here)}</p>
      <p>${text(profile.intro[lang], lang, here)}</p>
      <p>${text(profile.bioMore[lang], lang, here)}</p>
      <dl class="facts">
        <div><dt>${fr ? 'Basé à' : 'Based in'}</dt><dd>${t.location}</dd></div>
        ${CO ? `<div><dt>${fr ? 'Entreprise' : 'Company'}</dt><dd><a href="${CO.url}" target="_blank" rel="noopener">${CO.name}</a>${fr ? `, fondée en ${CO.foundingDate}` : `, founded in ${CO.foundingDate}`}</dd></div>` : ''}
        <div><dt>${fr ? 'Langues' : 'Languages'}</dt><dd>${profile.languages.map((l) => [esc(l.name[lang]), text(l.level[lang], lang, here)]).filter(([, lv]) => lv).map(([n, lv]) => `${n}${fr ? ' : ' : ': '}${lv}`).join('<br>')}</dd></div>
      </dl>
      <div class="btn-row">
        <a class="btn btn--primary" href="${rel(here, routes.contact[lang])}">${fr ? 'Me contacter' : 'Contact me'}</a>
        <a class="btn btn--ghost" href="${rel(here, routes.contact[lang])}">${fr ? 'CV complet sur demande' : 'Full CV on request'}</a>
      </div>
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('01', fr ? 'Expérience' : 'Experience', fr ? 'Ce que je fais au quotidien' : 'What I do day to day')}
    <ul class="check-list reveal">${profile.experience.map((e) => `<li>${esc(e[lang])}</li>`).join('')}</ul>
    ${para(profile.experienceNote[lang], lang, here, 'reveal')}
  </div>
</section>
<section class="section">
  <div class="container two-col">
    <div>
      ${sectionHead('02', fr ? 'Formations' : 'Training', fr ? 'Formations professionnelles' : 'Professional training')}
      <ol class="timeline reveal">${timeline(profile.education)}</ol>
    </div>
    <div>
      ${sectionHead('03', fr ? 'Diplômes' : 'Qualifications', fr ? 'Diplômes obtenus' : 'Qualifications')}
      <ol class="timeline reveal">${timeline(profile.diplomas)}</ol>
      ${para(profile.educationNote[lang], lang, here, 'reveal')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('04', fr ? 'Centres d’intérêt' : 'Interests', fr ? 'Ce qui me fait avancer' : 'What drives me')}
    <ul class="tag-cloud reveal">${profile.interests.map((i) => `<li>${esc(i[lang])}</li>`).join('')}</ul>
  </div>
</section>
<section class="section" id="qui">
  <div class="container narrow">
    ${sectionHead('05', fr ? 'En bref' : 'In short', fr ? 'Qui est BOGNON ISAAC ?' : 'Who is BOGNON ISAAC?')}
    <div class="faq">
      ${whoIs(lang).map(([q, a], i) => `<details class="faq__item reveal"${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
    </div>
  </div>
</section>
${ctaBand(lang, here)}`,
    });
  }

  // ------------------------------------------------ Compétences
  {
    const here = routes.skills[lang];
    add({
      key: 'skills', section: 'skills', lang, path: here, alternates: alts('skills'),
      title: fr ? 'Compétences et domaines d’expertise' : 'Skills and areas of expertise',
      description: fr
        ? 'Compétences de BOGNON ISAAC : HTML, CSS, JavaScript, PHP, MySQL, graphisme (Canva, Photoshop, Illustrator), IA appliquée aux affaires, mise en ligne et qualité.'
        : 'Skills of BOGNON ISAAC: HTML, CSS, JavaScript, PHP, MySQL, graphic design (Canva, Photoshop, Illustrator), AI for business, deployment and quality.',
      crumbs: [crumbHome(lang), { name: t.nav.skills, path: here }],
      body: `
${pageHero(fr ? 'Compétences' : 'Skills', fr ? 'Compétences et domaines d’expertise' : 'Skills and areas of expertise', fr ? 'Des compétences techniques pour construire votre projet, et des compétences humaines pour le mener à bien.' : 'Technical skills to build your project, and people skills to see it through.')}
<section class="section section--tight">
  <div class="container">
    <div class="card-grid card-grid--3">
      ${skills.map((s, i) => `
      <article class="card reveal" style="--d:${i % 3}" id="${s.id}">
        <h2 class="card__title">${esc(s.title[lang])}</h2>
        <p>${esc(s.text[lang])}</p>
        ${s.benefit ? `<p class="benefit"><strong>${fr ? 'Pour vous' : 'For you'}</strong> ${esc(s.benefit[lang])}</p>` : ''}
        <ul class="tags">${s.tags.map((tag) => `<li>${esc(pick(tag, lang))}</li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('02', fr ? 'Savoir-être' : 'Soft skills', fr ? 'Compétences personnelles' : 'Personal skills')}
    <ul class="check-list check-list--2 reveal">${softSkills.map((s) => `<li>${esc(s[lang])}</li>`).join('')}</ul>
  </div>
</section>
${ctaBand(lang, here)}`,
    });
  }

  // ------------------------------------------------ Portfolio
  {
    const here = routes.portfolio[lang];
    const card = (pr, i) => {
      const href = rel(here, projectPath(pr.slug, lang));
      return `
      <article class="project-card reveal" style="--d:${i % 3}">
        <a class="project-card__media" href="${href}" tabindex="-1" aria-hidden="true">
          ${pr.image ? contentImg(pr.image, pr.imageAlt, lang, here) : `<span class="placeholder-art"><span>${esc(pr.title)}</span></span>`}
        </a>
        <div class="project-card__body">
          <p class="project-card__cat">${esc(pr.category[lang])}</p>
          <h2 class="card__title"><a href="${href}">${esc(pr.title)}</a></h2>
          <p>${text(pr.summary[lang], lang, here)}</p>
          <a class="link-arrow" href="${href}">${t.details} <span class="sr-only">: ${esc(pr.title)}</span>${icon('arrow')}</a>
        </div>
      </article>`;
    };
    add({
      key: 'portfolio', section: 'portfolio', lang, path: here, alternates: alts('portfolio'),
      title: fr ? 'Portfolio et réalisations' : 'Portfolio and work',
      description: fr
        ? 'Réalisations de BOGNON ISAAC, développeur web et auteur : projets, livre « La Mine d’Or des Entrepreneurs » et entreprises.'
        : 'Work by BOGNON ISAAC, web developer and author: projects, the book “La Mine d’Or des Entrepreneurs” and businesses.',
      crumbs: [crumbHome(lang), { name: t.nav.portfolio, path: here }],
      ld: [{ '@type': 'CollectionPage', url: abs(here), inLanguage: lang, name: fr ? 'Portfolio' : 'Portfolio', author: { '@id': personId } }],
      body: `
${pageHero('Portfolio', fr ? 'Réalisations' : 'Work', fr ? 'Chaque projet a sa page détaillée : contexte, rôle et résultats.' : 'Each project has its own page: context, role and results.')}
<section class="section section--tight">
  <div class="container">
    <div class="card-grid card-grid--3">
      ${shownProjects.map(card).join('')}
${(text(fr ? '{{TODO: ajoutez vos projets clients réels : nom, contexte, année, technologies, lien, captures d’écran et accord du client}}' : '{{TODO: add your real client projects: name, context, year, technologies, link, screenshots and client consent}}', lang, here), '')}
    </div>
  </div>
</section>
${ctaBand(lang, here)}`,
    });

    for (const pr of shownProjects) {
      const pHere = projectPath(pr.slug, lang);
      const isBook = pr.slug === book.slug;
      const desc = plain(pr.summary[lang]) || (fr ? `Projet ${pr.title} présenté par BOGNON ISAAC.` : `${pr.title}, a project by BOGNON ISAAC.`);
      add({
        key: 'project', section: 'portfolio', lang, path: pHere, alternates: { fr: projectPath(pr.slug, 'fr'), en: projectPath(pr.slug, 'en') },
        title: `${pr.title} · ${fr ? 'Réalisation' : 'Project'}`,
        description: desc.length > 60 ? desc : `${desc} ${fr ? 'Projet présenté par BOGNON ISAAC, développeur web et entrepreneur.' : 'Presented by BOGNON ISAAC, web developer and entrepreneur.'}`,
        crumbs: [crumbHome(lang), { name: t.nav.portfolio, path: here }, { name: pr.title, path: pHere }],
        noindex: [pr.title, ...Object.values(pr.summary)].some(hasTodo) && !isBook,
        ogImage: isBook ? 'assets/img/og-livre-mine-d-or.jpg' : undefined,
        ld: isBook ? [{
          '@type': 'Book', name: book.title, author: { '@id': personId }, inLanguage: 'fr', url: abs(pHere),
          image: abs(`assets/img/${book.image.name}-${book.image.widths.at(-1)}.${book.image.ext}`), description: book.text[lang],
        }] : [],
        body: `
${pageHero(text(pr.category[lang], lang, pHere), esc(pr.title), text(pr.summary[lang], lang, pHere))}
<section class="section section--tight">
  <div class="container project">
    <div class="project__main reveal">
      ${pr.image ? `<div class="project__media">${contentImg(pr.image, pr.imageAlt, lang, pHere, { eager: true })}</div>` : ''}
      ${pr.body[lang].map((b) => para(b, lang, pHere)).join('')}
      ${isBook ? `<h2>${fr ? 'Ce que contient le livre' : 'What the book contains'}</h2><ul class="check-list">${book.contents[lang].map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    </div>
    <aside class="project__side reveal">
      <dl class="facts">
        ${fact(fr ? 'Rôle' : 'Role', pr.role[lang], lang, pHere)}
        ${fact(fr ? 'Année' : 'Year', pick(pr.year, lang), lang, pHere)}
        ${isBook ? book.details.slice(1).map((d) => fact(d.label[lang], d.value[lang], lang, pHere)).join('') : ''}
      </dl>
      ${pr.tags.length ? `<ul class="tags">${pr.tags.map((tag) => `<li>${esc(pick(tag, lang))}</li>`).join('')}</ul>` : ''}
      <div class="btn-col">
        ${pr.links.map((l) => l.kind === 'catalogue'
          ? `<a class="btn btn--primary" href="${rel(pHere, routes.catalogue[lang])}#${book.slug}">${esc(l.label[lang])}</a>`
          : `<a class="btn btn--ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label[lang])}</a>`).join('')}
        <a class="btn btn--ghost" href="${rel(pHere, routes.portfolio[lang])}">${fr ? 'Retour au portfolio' : 'Back to portfolio'}</a>
      </div>
    </aside>
  </div>
</section>
${ctaBand(lang, pHere)}`,
      });
    }
  }

  // ------------------------------------------------ Catalogue
  {
    const here = routes.catalogue[lang];
    const cat = (id) => catalogue.categories.find((c) => c.id === id).label[lang];
    const items = [
      { id: book.slug, catId: 'livre', title: book.title, text: book.text[lang], price: book.price, quote: null, details: projectPath(book.slug, lang), img: true },
      ...services.map((s) => ({ id: s.slug, catId: catalogue.serviceCategory[s.slug] || 'web', title: s.title[lang], text: s.text[lang], price: s.price, quote: s.slug, details: `${routes.services[lang]}#${s.slug}` })),
    ];
    add({
      key: 'catalogue', section: 'catalogue', lang, path: here, alternates: alts('catalogue'),
      title: fr ? 'Catalogue des réalisations et services' : 'Catalogue of work and services',
      description: fr
        ? 'Catalogue de BOGNON ISAAC : livre pour entrepreneurs, création de sites, boutiques en ligne, graphisme et formation. Commande par e-mail ou WhatsApp.'
        : 'Catalogue of BOGNON ISAAC: the book “La Mine d’Or des Entrepreneurs”, websites, online shops, graphic design and training. Orders and quotes by email or WhatsApp.',
      crumbs: [crumbHome(lang), { name: t.nav.catalogue, path: here }],
      ld: [{
        '@type': 'OfferCatalog', name: fr ? 'Catalogue BOGNON ISAAC' : 'BOGNON ISAAC catalogue', url: abs(here),
        itemListElement: items.map((it) => ({ '@type': 'Offer', itemOffered: { '@type': it.catId === 'livre' ? 'Book' : 'Service', name: it.title, description: it.text }, seller: { '@id': personId } })),
      }],
      body: `
${pageHero(fr ? 'Catalogue' : 'Catalogue', fr ? 'Réalisations et services' : 'Work and services', fr ? 'Pas de paiement en ligne : chaque commande se fait par échange direct, par e-mail ou WhatsApp. Je vous confirme le prix, le délai et le mode de paiement avant tout engagement.' : 'No online payment: every order goes through a direct exchange by email or WhatsApp. I confirm the price, timing and payment method before any commitment.')}
<section class="section section--tight">
  <div class="container">
    <div class="filters" data-filters hidden role="group" aria-label="${fr ? 'Filtrer le catalogue' : 'Filter the catalogue'}">
      <button type="button" class="chip" aria-pressed="true" data-filter="all">${fr ? 'Tout' : 'All'}</button>
      ${catalogue.categories.map((c) => `<button type="button" class="chip" aria-pressed="false" data-filter="${c.id}">${esc(c.label[lang])}</button>`).join('')}
    </div>
    <div class="card-grid card-grid--3" data-filter-list>
      ${items.map((it, i) => `
      <article class="card card--offer reveal${it.img ? ' card--feature' : ''}" id="${it.id}" data-cat="${it.catId}" style="--d:${i % 3}">
        ${it.img ? `<div class="card__media">${bookImg(lang, here)}</div>` : ''}
        <p class="card__cat">${esc(cat(it.catId))}</p>
        <h2 class="card__title">${esc(it.title)}</h2>
        <p>${esc(it.text)}</p>
        <p class="price"><span>${fr ? 'Tarif' : 'Price'}</span> ${priceLabel(it.price, lang)}</p>
        <div class="btn-col">
          ${orderButtons(lang, it.title, { primaryQuote: it.quote, from: here })}
          <a class="link-arrow" href="${rel(here, it.details.split('#')[0])}${it.details.includes('#') ? '#' + it.details.split('#')[1] : ''}">${t.details} <span class="sr-only">: ${esc(it.title)}</span>${icon('arrow')}</a>
        </div>
      </article>`).join('')}
    </div>
    <div class="notice reveal">
      <h2>${fr ? 'Démonstrations et documents' : 'Demos and documents'}</h2>
      <p>${esc(catalogue.documents[lang])}</p>
    </div>
  </div>
</section>`,
    });
  }

  // ------------------------------------------------ Services + devis
  {
    const here = routes.services[lang];
    const steps = fr
      ? [['Votre besoin', 'Vous décrivez votre projet avec le formulaire, par e-mail ou sur WhatsApp.'], ['Le devis', 'Je vous envoie une proposition : contenu, délai et prix.'], ['La réalisation', 'Je réalise le projet et vous le présente pour validation.'], ['La mise en ligne', 'Je publie le projet et vous explique comment le faire vivre.']]
      : [['Your needs', 'You describe your project with the form, by email or on WhatsApp.'], ['The quote', 'I send you a proposal: scope, timing and price.'], ['The build', 'I build the project and present it to you for approval.'], ['Going live', 'I publish the project and show you how to keep it up to date.']];
    add({
      key: 'services', section: 'services', lang, path: here, alternates: alts('services'),
      title: fr ? 'Services professionnels et demande de devis' : 'Professional services and quote request',
      description: fr
        ? 'Services de BOGNON ISAAC : site vitrine, boutique en ligne, plateforme web, maintenance, mise en ligne, graphisme, automatisation et formation. Demandez un devis gratuit.'
        : 'Services by BOGNON ISAAC: business websites, online shops, web platforms, maintenance, deployment, graphic design, automation and training. Request a free quote.',
      crumbs: [crumbHome(lang), { name: t.nav.services, path: here }],
      ld: [...services.map((s) => ({ '@type': 'Service', name: s.title[lang], description: s.text[lang], provider: { '@id': personId }, areaServed: 'Worldwide', url: `${abs(here)}#${s.slug}` })),
        { '@type': 'FAQPage', '@id': `${abs(here)}#faq`, mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })) }],
      body: `
${pageHero('Services', fr ? 'Services professionnels' : 'Professional services', fr ? 'Des solutions web sur mesure, pour les entreprises, les indépendants et les porteurs de projet, au Bénin comme à l’international.' : 'Custom web solutions for businesses, freelancers and project owners, in Benin and abroad.')}
<section class="section section--tight">
  <div class="container">
    <div class="card-grid card-grid--2">
      ${services.map((s, i) => `
      <article class="card service reveal" id="${s.slug}" style="--d:${i % 2}">
        <h2 class="card__title">${esc(s.title[lang])}</h2>
        <p>${esc(s.text[lang])}</p>
        <ul class="check-list check-list--compact">${s.includes[lang].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="service__foot">
          <p class="price"><span>${fr ? 'Tarif' : 'Price'}</span> ${priceLabel(s.price, lang)}</p>
          <a class="btn btn--small btn--ghost" href="?service=${s.slug}#devis" data-pick-service="${s.slug}">${t.quote}<span class="sr-only"> : ${esc(s.title[lang])}</span></a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('02', fr ? 'Méthode' : 'Process', fr ? 'Comment se déroule un projet' : 'How a project works')}
    <ol class="steps reveal">${steps.map(([a, b], i) => `<li><span class="steps__num">${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="section" id="devis">
  <div class="container narrow">
    ${sectionHead('03', fr ? 'Devis' : 'Quote', fr ? 'Demander un devis' : 'Request a quote', fr ? 'Gratuit et sans engagement. Les champs marqués comme facultatifs peuvent rester vides.' : 'Free and with no commitment. Fields marked optional can be left blank.')}
    ${composeForm(lang, 'quote')}
  </div>
</section>
<section class="section section--alt" id="faq">
  <div class="container narrow">
    ${sectionHead('04', 'FAQ', fr ? 'Questions fréquentes' : 'Frequently asked questions')}
    <div class="faq">
      ${faq.map((f, i) => `<details class="faq__item reveal"${i === 0 ? ' open' : ''}><summary>${esc(f.q[lang])}</summary><p>${esc(f.a[lang])}</p></details>`).join('')}
    </div>
  </div>
</section>`,
    });
  }

  // ------------------------------------------------ Blog
  {
    const here = routes.blog[lang];
    add({
      key: 'blog', section: 'blog', lang, path: here, alternates: alts('blog'),
      title: fr ? 'Blog et actualités professionnelles' : 'Blog and professional news',
      description: fr ? 'Actualités professionnelles de BOGNON ISAAC : projets, conseils web et entrepreneuriat.' : 'Professional news from BOGNON ISAAC: projects, web advice and entrepreneurship.',
      crumbs: [crumbHome(lang), { name: t.nav.blog, path: here }],
      ld: [{ '@type': 'Blog', url: abs(here), inLanguage: lang, author: { '@id': personId }, name: fr ? 'Blog de BOGNON ISAAC' : 'BOGNON ISAAC blog' }],
      body: `
${pageHero('Blog', fr ? 'Actualités' : 'News', fr ? 'Projets en cours, conseils web et entrepreneuriat.' : 'Current projects, web advice and entrepreneurship.')}
<section class="section section--tight">
  <div class="container narrow">
    <ul class="post-list">
      ${posts.map((po) => `
      <li class="post-item reveal">
        <p class="post-item__date"><time datetime="${po.date}">${formatDate(po.date, lang)}</time></p>
        <h2><a href="${rel(here, postPath(po.slug, lang))}">${esc(po.title[lang])}</a></h2>
        <p>${esc(po.excerpt[lang])}</p>
        <a class="link-arrow" href="${rel(here, postPath(po.slug, lang))}">${t.readMore} <span class="sr-only">: ${esc(po.title[lang])}</span>${icon('arrow')}</a>
      </li>`).join('')}
    </ul>
  </div>
</section>`,
    });
    for (const po of posts) {
      const pHere = postPath(po.slug, lang);
      add({
        key: 'post', section: 'blog', lang, path: pHere, alternates: { fr: postPath(po.slug, 'fr'), en: postPath(po.slug, 'en') },
        title: po.title[lang], description: po.excerpt[lang], ogType: 'article',
        crumbs: [crumbHome(lang), { name: t.nav.blog, path: here }, { name: po.title[lang], path: pHere }],
        ld: [{ '@type': 'BlogPosting', headline: po.title[lang], description: po.excerpt[lang], wordCount: po.body[lang].join(' ').split(/\s+/).length, publisher: { '@id': personId }, datePublished: po.date, dateModified: po.date, inLanguage: lang, author: { '@id': personId }, mainEntityOfPage: abs(pHere), image: abs('assets/img/og-bognon-isaac.jpg') }],
        body: `
<article class="article">
  ${pageHero(`<time datetime="${po.date}">${formatDate(po.date, lang)}</time>`, esc(po.title[lang]), esc(po.excerpt[lang]))}
  <div class="section section--tight">
    <div class="container narrow prose">
      ${po.body[lang].map((b) => b.startsWith('## ') ? `<h2>${text(b.slice(3), lang, pHere)}</h2>` : `<p>${text(b, lang, pHere)}</p>`).join('')}
      <aside class="article__cta">
        <p><strong>${fr ? 'Un projet en tête ?' : 'Got a project in mind?'}</strong> ${fr ? 'Décrivez-le en quelques lignes : je vous réponds avec un devis gratuit.' : 'Describe it in a few lines and I will reply with a free quote.'}</p>
        <a class="btn btn--primary btn--small" href="${rel(pHere, routes.services[lang])}#devis">${t.quote}</a>
      </aside>
      ${(() => { const others = posts.filter((x) => x.slug !== po.slug).slice(0, 3); return others.length ? `<h2 class="related__title">${fr ? 'À lire aussi' : 'Read next'}</h2><ul class="related">${others.map((x) => `<li><a href="${rel(pHere, postPath(x.slug, lang))}">${esc(x.title[lang])}</a></li>`).join('')}</ul>` : ''; })()}
      <p><a class="link-arrow" href="${rel(pHere, here)}">${fr ? 'Tous les articles' : 'All posts'} ${icon('arrow')}</a></p>
    </div>
  </div>
</article>`,
      });
    }
  }

  // ------------------------------------------------ Contact
  {
    const here = routes.contact[lang];
    const social = socialLinks();
    add({
      key: 'contact', section: 'contact', lang, path: here, alternates: alts('contact'),
      title: fr ? 'Contacter BOGNON ISAAC' : 'Contact BOGNON ISAAC',
      description: fr ? 'Contacter BOGNON ISAAC, développeur web à Porto-Novo (Bénin), par e-mail, WhatsApp ou formulaire.' : 'Contact BOGNON ISAAC, web developer in Porto-Novo, Benin, by email, WhatsApp or the contact form.',
      crumbs: [crumbHome(lang), { name: t.nav.contact, path: here }],
      ld: [{ '@type': 'ContactPage', url: abs(here), inLanguage: lang, mainEntity: { '@id': personId } }],
      body: `
${pageHero('Contact', fr ? 'Parlons de votre projet' : 'Let’s talk about your project', text(fr ? 'Écrivez-moi pour un devis, une commande ou un partenariat.' : 'Write to me for a quote, an order or a partnership.', lang, routes.contact[lang]))}
<section class="section section--tight">
  <div class="container contact">
    <div class="contact__channels reveal">
      ${hasMail ? `<a class="channel" href="mailto:${C.email}">${icon('mail')}<span><strong>E-mail</strong>${C.email}</span></a>` : ''}
      ${hasWa ? `<a class="channel" href="${esc(waLink(C.whatsapp, waMsg(lang, fr ? 'je vous contacte depuis votre site.' : 'I am contacting you from your website.')))}" target="_blank" rel="noopener">${icon('wa')}<span><strong>WhatsApp</strong>${C.whatsappDisplay}</span></a>` : ''}
      <p class="channel channel--static">${icon('pin')}<span><strong>${fr ? 'Localisation' : 'Location'}</strong>${t.location}</span></p>
      ${social.length ? `<div class="channel channel--static"><div><strong>${fr ? 'Réseaux sociaux' : 'Social media'}</strong>
        <ul class="socials socials--dark">${social.map(([k, v]) => `<li><a href="${esc(v)}" rel="me noopener" target="_blank">${k}</a></li>`).join('')}</ul>
      </div></div>` : text(fr ? '{{TODO: liens des réseaux sociaux à ajouter dans src/content/site.mjs}}' : '{{TODO: social media links to add in src/content/site.mjs}}', lang, here)}
    </div>
    <div class="contact__form reveal">
      <h2>${fr ? 'Écrire un message' : 'Write a message'}</h2>
      ${composeForm(lang, 'contact')}
    </div>
  </div>
</section>`.replace(/\{\{TODO:[^}]*\}\}/g, (m) => text(m, lang, here)),
    });
  }

  // ------------------------------------------------ Mentions légales
  {
    const here = routes.legal[lang];
    const L = site.legal;
    add({
      key: 'legal', section: '', lang, path: here, alternates: alts('legal'),
      title: fr ? 'Mentions légales' : 'Legal notice',
      description: fr ? 'Mentions légales du site de BOGNON ISAAC : éditeur, hébergeur, propriété intellectuelle et responsabilité.' : 'Legal notice of the BOGNON ISAAC website: publisher, host, intellectual property and liability.',
      crumbs: [crumbHome(lang), { name: t.nav.legal, path: here }],
      body: `
${pageHero(fr ? 'Informations' : 'Information', t.nav.legal, '')}
<section class="section section--tight">
  <div class="container narrow prose">
    <h2>${fr ? 'Éditeur du site' : 'Publisher'}</h2>
    <p>${site.person.fullName}, ${esc(pick(site.person.jobTitle, lang).toLowerCase())}, ${t.location}.<br>
    ${fr ? 'Contact' : 'Contact'} : ${hasMail ? `<a href="mailto:${C.email}">${C.email}</a>` : ''}${hasWa ? ` · WhatsApp ${C.whatsappDisplay}` : ''}<br>
    ${fr ? 'Directeur de la publication' : 'Publication director'} : ${site.person.fullName}.</p>
    ${L.ifu || L.rccm ? `<p>${L.ifu ? `IFU : ${esc(L.ifu)}` : ''}${L.ifu && L.rccm ? '<br>' : ''}${L.rccm ? `RCCM : ${esc(L.rccm)}` : ''}</p>` : text(fr ? '{{TODO: numéros IFU et RCCM, si l’activité est déclarée}}' : '{{TODO: IFU and RCCM numbers, if the business is registered}}', lang, here)}
    <h2>${fr ? 'Propriété intellectuelle' : 'Intellectual property'}</h2>
    <p>${fr
      ? 'Les textes, photographies, le livre « La Mine d’Or des Entrepreneurs » et les visuels de ce site appartiennent à BOGNON ISAAC, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite. Les polices Fraunces et Inter sont utilisées sous licence SIL Open Font License 1.1.'
      : 'The texts, photographs, the book “La Mine d’Or des Entrepreneurs” and the visuals on this site belong to BOGNON ISAAC unless stated otherwise. Reproduction without written permission is prohibited. The Fraunces and Inter fonts are used under the SIL Open Font License 1.1.'}</p>
    <h2>${fr ? 'Responsabilité' : 'Liability'}</h2>
    <p>${fr
      ? 'Les informations de ce site sont fournies à titre indicatif. Les tarifs, délais et conditions d’une prestation sont confirmés par écrit avant toute commande. Aucun paiement n’est effectué sur ce site.'
      : 'Information on this site is provided for guidance. Prices, timing and terms of a service are confirmed in writing before any order. No payment is made on this site.'}</p>
    <h2>${fr ? 'Droit applicable' : 'Applicable law'}</h2>
    <p>${fr
      ? 'Ce site est édité depuis le Bénin et relève du droit béninois, notamment de la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin.'
      : 'This site is published from Benin and is governed by Beninese law, in particular Law No. 2017-20 of 20 April 2018 on the Digital Code of the Republic of Benin.'}</p>
  </div>
</section>`,
    });
  }

  // ------------------------------------------------ Confidentialité
  {
    const here = routes.privacy[lang];
    add({
      key: 'privacy', section: '', lang, path: here, alternates: alts('privacy'),
      title: fr ? 'Politique de confidentialité' : 'Privacy policy',
      description: fr ? 'Politique de confidentialité du site de BOGNON ISAAC : aucun cookie, aucun suivi, données transmises uniquement par e-mail ou WhatsApp.' : 'Privacy policy of the BOGNON ISAAC website: no cookies, no tracking, data shared only by email or WhatsApp.',
      crumbs: [crumbHome(lang), { name: t.nav.privacy, path: here }],
      body: `
${pageHero(fr ? 'Informations' : 'Information', fr ? 'Politique de confidentialité' : 'Privacy policy', fr ? `Mise à jour le ${formatDate(BUILD_DATE, 'fr')}.` : `Updated on ${formatDate(BUILD_DATE, 'en')}.`)}
<section class="section section--tight">
  <div class="container narrow prose">
    ${fr ? `
    <h2>En résumé</h2>
    <p>Ce site n’utilise ni cookie, ni outil de mesure d’audience, ni publicité. Il ne possède pas de base de données : les formulaires n’enregistrent rien.</p>
    <h2>Responsable du traitement</h2>
    <p>${site.person.fullName}, ${t.location}${hasMail ? `, <a href="mailto:${C.email}">${C.email}</a>` : ''}.</p>
    <h2>Données que vous me transmettez</h2>
    <p>Les formulaires de contact et de devis ouvrent votre messagerie ou WhatsApp avec un message prérempli. Si vous l’envoyez, je reçois les informations que vous avez choisi d’y mettre (nom, e-mail, numéro, description du projet). Je les utilise uniquement pour vous répondre, établir un devis et suivre notre relation commerciale. Je ne les vends ni ne les cède à personne.</p>
    <p>Ces échanges passent par les services que vous utilisez (votre fournisseur de messagerie, Apple iCloud pour ma boîte de réception, WhatsApp pour les messages), qui appliquent leurs propres politiques de confidentialité.</p>
    <h2>Durée de conservation</h2>
    <p>Je conserve vos messages le temps nécessaire au traitement de votre demande et au suivi d’une éventuelle prestation, puis je les supprime sur simple demande.</p>
    <h2>Journaux techniques</h2>
    <p>Comme pour tout site web, le serveur qui délivre les pages peut enregistrer l’adresse IP des visiteurs à des fins de sécurité.</p>
    <h2>Fonctionnement hors connexion</h2>
    <p>Pour permettre la consultation hors connexion, votre navigateur garde une copie des pages et des images du site dans son stockage local. Ces fichiers restent sur votre appareil et ne contiennent aucune donnée personnelle. Vous pouvez les effacer depuis les réglages de votre navigateur.</p>
    <h2>Vos droits</h2>
    <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données en m’écrivant${hasMail ? ` à <a href="mailto:${C.email}">${C.email}</a>` : ''}. Vous pouvez aussi saisir l’Autorité de protection des données à caractère personnel (APDP) du Bénin.</p>
    ` : `
    <h2>In short</h2>
    <p>This site uses no cookies, no analytics and no advertising. It has no database: the forms store nothing.</p>
    <h2>Data controller</h2>
    <p>${site.person.fullName}, ${t.location}${hasMail ? `, <a href="mailto:${C.email}">${C.email}</a>` : ''}.</p>
    <h2>Data you send me</h2>
    <p>The contact and quote forms open your email app or WhatsApp with a pre-filled message. If you send it, I receive the information you chose to include (name, email, phone number, project description). I use it only to reply, prepare a quote and follow up on our business relationship. I never sell or share it.</p>
    <p>These exchanges go through the services you use (your email provider, Apple iCloud for my inbox, WhatsApp for messages), which apply their own privacy policies.</p>
    <h2>Retention</h2>
    <p>I keep your messages for as long as needed to handle your request and follow up on any work, and delete them on request.</p>
    <h2>Technical logs</h2>
    <p>As with any website, the server delivering the pages may log visitors’ IP addresses for security purposes.</p>
    <h2>Offline use</h2>
    <p>To let you read the site offline, your browser keeps a copy of its pages and images in local storage. These files stay on your device and contain no personal data. You can clear them from your browser settings.</p>
    <h2>Your rights</h2>
    <p>You can ask to access, correct or delete your data by writing to me${hasMail ? ` at <a href="mailto:${C.email}">${C.email}</a>` : ''}. You can also contact Benin’s data protection authority (APDP).</p>
    `}
  </div>
</section>`,
    });
  }
}

// ---------------------------------------------------------------- écriture des pages
const written = [];
for (const p of pages) {
  const file = path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(p));
  written.push(p);
}

// Pages spéciales : hors ligne et 404 (bilingues, liens absolus depuis la racine du site).
function standalone(kind) {
  const B = BASE_PATH;
  const isOffline = kind === 'offline';
  const title = isOffline ? 'Hors connexion · Offline' : 'Page introuvable · Page not found';
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | ${site.brand}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="${site.themeColor}">
<link rel="icon" href="${B}assets/icons/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${B}assets/css/styles.css?v=${cssHash}">
</head>
<body class="page-standalone">
<main class="standalone">
  <a class="brand brand--light" href="${B}">${brandMark((p) => B + p)}<span class="brand__name">BOGNON <span>ISAAC</span></span></a>
  <h1>${isOffline ? 'Vous êtes hors connexion' : 'Page introuvable'}</h1>
  <p>${isOffline
    ? 'Cette page n’a pas encore été enregistrée sur votre appareil. Les pages déjà visitées restent consultables. Reconnectez-vous pour voir le reste du site. Les envois par e-mail ou WhatsApp nécessitent une connexion.'
    : 'La page demandée n’existe pas ou a été déplacée.'}</p>
  <p class="standalone__links"><a class="btn btn--primary" href="${B}">Accueil</a> <a class="btn btn--light" href="${B}services/">Services</a> <a class="btn btn--light" href="${B}contact/">Contact</a></p>
  <hr>
  <h2 lang="en">${isOffline ? 'You are offline' : 'Page not found'}</h2>
  <p lang="en">${isOffline
    ? 'This page has not been saved on your device yet. Pages you already visited are still available. Reconnect to see the rest of the site. Sending by email or WhatsApp requires a connection.'
    : 'The page you requested does not exist or has moved.'}</p>
  <p class="standalone__links" lang="en"><a class="btn btn--primary" href="${B}en/">Home</a> <a class="btn btn--light" href="${B}en/services/">Services</a> <a class="btn btn--light" href="${B}en/contact/">Contact</a></p>
  ${isOffline ? '<p><button class="btn btn--light" type="button" onclick="location.reload()">Réessayer · Retry</button></p>' : ''}
</main>
</body>
</html>
`;
}
fs.writeFileSync(path.join(OUT, 'offline.html'), standalone('offline'));
fs.writeFileSync(path.join(OUT, '404.html'), standalone('404'));

// Favicon SVG
fs.writeFileSync(path.join(OUT, 'assets/icons/favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${fs.readFileSync(path.join(SRC, 'assets/img/monogramme-bi-96.png')).toString('base64')}"/></svg>
`);

// Manifest
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  id: './',
  name: `${site.brand} · ${site.person.jobTitle.fr}`,
  short_name: site.brand,
  description: 'Portfolio de BOGNON ISAAC, développeur web et entrepreneur à Porto-Novo (Bénin). Portfolio of a web developer and entrepreneur.',
  lang: 'fr',
  dir: 'ltr',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'any',
  background_color: '#1F3BD1',
  theme_color: site.themeColor,
  categories: ['business', 'productivity'],
  icons: [
    { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'assets/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Demander un devis', short_name: 'Devis', url: './services/#devis' },
    { name: 'Contact', url: './contact/' },
    { name: 'English version', short_name: 'English', url: './en/' },
  ],
}, null, 2));

// llms.txt : résumé lisible par les assistants IA (proposition llmstxt.org).
fs.writeFileSync(path.join(OUT, 'llms.txt'), `# ${site.person.fullName} (${site.brand})

> ${plain(profile.bio.fr)} ${plain(profile.intro.fr)}

- Nom : ${site.person.fullName}, aussi écrit ${site.brand}
- Métier : ${site.person.jobTitle.fr} ; chef d'entreprise, fondateur de ${CO.name} (${CO.foundingDate}, ${CO.url})
- Lieu : ${site.person.city}, ${site.person.country.fr}
- Compétences : ${skills.map((x) => `${x.title.fr} (${x.tags.map((g) => pick(g, 'fr')).join(', ')})`).join(' ; ')}
- Livre : « ${book.title} », ${plain(book.subtitle.fr)}
- Contact : ${C.email} ; WhatsApp ${C.whatsappDisplay}
- Réseaux : ${socialLinks().map(([k, v]) => `${k} ${v}`).join(' ; ')}

## Pages principales

- [À propos](${abs(routes.about.fr)}) : parcours, formations, diplômes
- [Compétences](${abs(routes.skills.fr)})
- [Services et devis](${abs(routes.services.fr)})
- [Portfolio](${abs(routes.portfolio.fr)})
- [Catalogue](${abs(routes.catalogue.fr)})
- [Blog](${abs(routes.blog.fr)})
- [Contact](${abs(routes.contact.fr)})

## English

- [Home](${abs(routes.home.en)}) · [About](${abs(routes.about.en)}) · [Skills](${abs(routes.skills.en)}) · [Services](${abs(routes.services.en)}) · [Contact](${abs(routes.contact.en)})
`);

// robots.txt et sitemap.xml
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const indexable = written.filter((p) => !p.noindex);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexable.map((p) => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
${p.alternates ? `    <xhtml:link rel="alternate" hreflang="fr" href="${abs(p.alternates.fr)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(p.alternates.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.alternates.fr)}"/>
` : ''}  </url>`).join('\n')}
</urlset>
`);

// Flux RSS du blog (un par langue)
for (const lang of LANGS) {
  const fr = lang === 'fr';
  const xmlEsc = (x) => esc(x).replace(/'/g, '&apos;');
  fs.writeFileSync(path.join(OUT, routes.blog[lang], 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${fr ? 'Blog de BOGNON ISAAC' : 'BOGNON ISAAC blog'}</title>
  <link>${abs(routes.blog[lang])}</link>
  <atom:link href="${abs(routes.blog[lang] + 'feed.xml')}" rel="self" type="application/rss+xml"/>
  <description>${fr ? 'Actualités professionnelles de BOGNON ISAAC, développeur web et entrepreneur.' : 'Professional news from BOGNON ISAAC, web developer and entrepreneur.'}</description>
  <language>${lang}</language>
${posts.map((po) => `  <item>
    <title>${xmlEsc(po.title[lang])}</title>
    <link>${abs(postPath(po.slug, lang))}</link>
    <guid>${abs(postPath(po.slug, lang))}</guid>
    <pubDate>${new Date(po.date + 'T08:00:00Z').toUTCString()}</pubDate>
    <description>${xmlEsc(po.excerpt[lang])}</description>
  </item>`).join('\n')}
</channel>
</rss>
`);
}

// GitHub Pages : pas de traitement Jekyll, domaine personnalisé facultatif.
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
if (site.customDomain) fs.writeFileSync(path.join(OUT, 'CNAME'), site.customDomain + '\n');

// Service worker : liste de pré-cache + version calculée sur le contenu.
const precache = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    const relPath = path.relative(OUT, f).split(path.sep).join('/');
    if (/^(sw\.js|404\.html|CNAME|\.nojekyll|robots\.txt|sitemap\.xml)$/.test(relPath)) continue;
    if (/LICENSE|\.(png|jpg)$/.test(relPath) && !/icons\//.test(relPath)) continue; // formats de secours (WebP utilisé) et licences
    precache.push(relPath.replace(/(^|\/)index\.html$/, '$1') || './');
  }
})(OUT);
precache.sort();
const versionHash = hashOf(precache.map((u) => {
  const f = path.join(OUT, u === './' ? 'index.html' : u.endsWith('/') ? u + 'index.html' : u);
  return u + hashOf(fs.readFileSync(f));
}).join('|'));
const swSrc = fs.readFileSync(path.join(SRC, 'sw.js'), 'utf8')
  .replace('__VERSION__', versionHash)
  .replace('__PRECACHE__', JSON.stringify(precache.map((u) => (u === './' ? './' : u)).map((u) => u.replace(/\.(css|js)$/, (m) => `${m}?v=${m === '.css' ? cssHash : jsHash}`)), null, 1));
fs.writeFileSync(path.join(OUT, 'sw.js'), swSrc);

// ---------------------------------------------------------------- rapport
const uniqueTodos = new Map();
for (const td of todoLog) {
  const k = `${td.lang}|${td.what}`;
  if (!uniqueTodos.has(k)) uniqueTodos.set(k, new Set());
  uniqueTodos.get(k).add(td.where || '(global)');
}
const report = ['# Champs « À COMPLÉTER » (généré par le build)', '', `Site : ${SITE_URL}/ · build du ${BUILD_DATE}`, '',
  '| Langue | Information à fournir | Pages |', '| --- | --- | --- |',
  ...[...uniqueTodos].map(([k, where]) => { const [lng, what] = k.split('|'); return `| ${lng} | ${what} | ${[...where].map((w) => '/' + w).join(', ')} |`; }), ''].join('\n');
fs.writeFileSync(path.join(ROOT, 'A-COMPLETER.md'), report);

console.log(`✔ ${written.length} pages + offline.html + 404.html écrites dans ${path.relative(ROOT, OUT)}/`);
console.log(`✔ sitemap.xml (${indexable.length} URL), robots.txt, manifest.webmanifest, sw.js (version ${versionHash}, ${precache.length} fichiers pré-cachés)`);
console.log(`ℹ ${uniqueTodos.size} champs « À COMPLÉTER » distincts : voir A-COMPLETER.md`);
