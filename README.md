# Portfolio professionnel de BOGNON ISAAC

Site bilingue (français / anglais) de **Isaac BOGNON**, développeur web et entrepreneur à Porto-Novo (Bénin).
C'est un site statique : il s'héberge gratuitement sur GitHub Pages, fonctionne hors connexion après une
première visite (PWA) et ne contient aucun paiement en ligne. Les demandes de devis et les commandes
ouvrent l'e-mail ou WhatsApp avec un message prérempli.

## Ce que contient le site

| Page | Français | Anglais |
| --- | --- | --- |
| Accueil | `/` | `/en/` |
| À propos (parcours du CV) | `/a-propos/` | `/en/about/` |
| Compétences | `/competences/` | `/en/skills/` |
| Portfolio + une page par projet | `/portfolio/…` | `/en/portfolio/…` |
| Catalogue (livre et services, tarifs facultatifs) | `/catalogue/` | `/en/catalogue/` |
| Services + formulaire de devis | `/services/#devis` | `/en/services/#devis` |
| Blog + articles | `/blog/…` | `/en/blog/…` |
| Contact | `/contact/` | `/en/contact/` |
| Mentions légales, confidentialité | `/mentions-legales/`, `/confidentialite/` | `/en/legal-notice/`, `/en/privacy/` |
| Hors connexion, page introuvable | `offline.html`, `404.html` | (bilingues) |

Les informations pas encore fournies (marquées `{{TODO: …}}` dans `src/content/content.mjs`) ne sont jamais
affichées : l'élément concerné est simplement masqué. La liste à jour est dans [A-COMPLETER.md](A-COMPLETER.md),
régénérée à chaque build. Les couleurs de marque se changent en haut de `src/assets/css/styles.css`
(`--brand`, `--brand-light`, `--brand-deep`, `--accent-2`, `--accent-3`).

## Lancer le site sur votre ordinateur

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent (gratuit). Aucune autre installation n'est nécessaire pour
construire le site.

```bash
node scripts/build.mjs        # génère le site dans docs/
node scripts/serve.mjs 8080   # aperçu sur http://localhost:8080/
```

Le service worker (hors ligne) ne fonctionne qu'en HTTPS ou sur `localhost` : c'est normal.

## Structure

```
src/content/site.mjs      ← adresse du site, e-mail, WhatsApp, réseaux, IFU/RCCM   (à modifier en premier)
src/content/content.mjs   ← tous les textes FR/EN : profil, compétences, services, livre, projets, articles
src/assets/css/styles.css ← design (couleurs et polices en haut du fichier)
src/assets/js/main.js     ← menu mobile, formulaires e-mail/WhatsApp, filtres, mise à jour hors ligne
src/assets/img/           ← photos optimisées (WebP + JPEG), image de partage
src/assets/icons/         ← icônes de l'application
src/sw.js                 ← modèle du service worker (cache hors ligne)
scripts/build.mjs         ← générateur : pages, sitemap.xml, robots.txt, manifeste, sw.js
scripts/serve.mjs         ← serveur d'aperçu local
tests/                    ← contrôles automatiques
docs/                     ← SITE GÉNÉRÉ, publié par GitHub Pages (ne pas modifier à la main)
guides/                   ← publication, référencement, installation, maintenance, tests, coûts
```

Choix techniques : HTML, CSS et JavaScript natifs, sans framework. Un petit générateur Node (sans dépendance)
évite de recopier l'en-tête, le pied de page et les métadonnées SEO sur 26 pages, et garantit que les versions
française et anglaise restent liées (hreflang). Les polices Fraunces et Inter sont hébergées avec le site
(licence SIL OFL) : aucune requête vers Google ou un autre service.

## Tests

```bash
npm install            # outils de test uniquement (Playwright, axe-core, html-validate, Lighthouse)
npm test               # build + contrôles statiques + validation HTML + tests navigateur
npm run lighthouse     # scores de performance, accessibilité, bonnes pratiques et SEO
```

Résultats de la dernière exécution : [guides/TESTS.md](guides/TESTS.md).

## Guides

- [Publier gratuitement sur GitHub Pages](guides/PUBLICATION.md)
- [Référencement : Google Search Console et sitemap](guides/REFERENCEMENT.md)
- [Installer le site comme une application (PWA)](guides/INSTALLATION-PWA.md)
- [Maintenance : modifier les textes, ajouter un projet ou un article](guides/MAINTENANCE.md)
- [Coûts : ce qui est gratuit et ce qui ne l'est pas](guides/COUTS.md)

## Droits

Textes, photos et livre : © Isaac BOGNON, tous droits réservés. Polices : SIL Open Font License 1.1
(voir `src/assets/fonts/`).
