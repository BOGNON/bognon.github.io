# Référencement : Google Search Console, sitemap et suivi

Aucun outil et aucun prestataire ne peut garantir une position dans Google. Ce site est construit pour être
correctement compris et indexé ; sa position dépendra ensuite de la concurrence, de la qualité et de la
fréquence de vos contenus, et des liens qui pointent vers lui.

## Ce qui est déjà en place

| Élément | Où |
| --- | --- |
| Titre et description uniques pour chaque page (FR et EN) | `<head>` de chaque page |
| URL lisibles (`/a-propos/`, `/en/about/`) | toutes les pages |
| Balise canonique sur chaque page | `<link rel="canonical">` |
| Versions linguistiques liées (hreflang `fr`, `en`, `x-default`) | `<head>` + `sitemap.xml` |
| `sitemap.xml` (24 pages indexables) et `robots.txt` | racine du site |
| Open Graph et Twitter Card (aperçu sur WhatsApp, Facebook, LinkedIn) | `<head>` + `assets/img/og-bognon-isaac.jpg` |
| Données structurées Schema.org : `Person`, `WebSite`, `ProfilePage`, `Service`, `Book`, `OfferCatalog`, `BlogPosting`, `BreadcrumbList` | `<script type="application/ld+json">` |
| Textes alternatifs des images, HTML sémantique, une seule balise `<h1>` par page | toutes les pages |
| Pages incomplètes (BOGNON MARKET) exclues de l'indexation (`noindex`) tant qu'elles contiennent des champs à compléter | page projet |
| Performances Lighthouse 99 à 100/100 sur mobile et ordinateur (mesure locale) | [TESTS.md](TESTS.md) |

## 1. Déclarer le site dans Google Search Console (gratuit)

1. Ouvrez [search.google.com/search-console](https://search.google.com/search-console) avec un compte Google.
2. **Ajouter une propriété → Préfixe de l'URL** : `https://bognon.github.io/` (ou votre domaine).
   (Le type « Domaine » demande l'accès DNS, impossible sur une adresse `github.io`.)
3. Méthode de validation **Balise HTML** : copiez seulement la valeur `content="…"`.
4. Collez-la dans `src/content/site.mjs` → `verification.google`, reconstruisez et publiez.
5. Revenez dans Search Console et cliquez sur **Valider**.

## 2. Soumettre le sitemap

Search Console → **Sitemaps** → saisissez `sitemap.xml` → **Envoyer**. L'état doit passer à « Opération effectuée ».
Le sitemap contient les versions française et anglaise, liées entre elles.

## 3. Demander l'indexation des pages principales

Search Console → **Inspection de l'URL** → collez l'adresse de l'accueil → **Demander une indexation**.
Faites de même pour `/en/`, `/a-propos/`, `/services/` et `/catalogue/`. L'indexation prend de quelques jours à quelques
semaines.

## 4. Suivre l'indexation

- **Pages** (Indexation) : nombre de pages indexées et raisons d'exclusion. Les pages « Exclue par la balise noindex »
  sont normales tant que leurs champs ne sont pas complétés.
- **Performances** : requêtes qui affichent votre site, clics, position moyenne. Surveillez « bognon isaac ».
- **Améliorations** : erreurs éventuelles de données structurées (fil d'Ariane).
- Testez une page avec le [test des résultats enrichis](https://search.google.com/test/rich-results).

Bing : [bing.com/webmasters](https://www.bing.com/webmasters) permet d'importer la propriété depuis Search Console
(le code éventuel va dans `verification.bing`).

## 5. Ce qui aidera le plus votre visibilité

1. **Liens vers le site** : ajoutez l'adresse du site sur vos profils LinkedIn, Facebook, WhatsApp Business,
   GitHub, et dans votre signature e-mail. Ajoutez ces profils dans `site.social` : ils deviennent des liens `sameAs`
   qui aident Google à associer le nom « BOGNON ISAAC » au site.
2. **Projets réels détaillés** : une page par projet client, avec captures et résultats. C'est le contenu le plus utile
   pour les clients et pour Google.
3. **Articles réguliers** : un article par mois sur une question que vos clients posent vraiment (prix d'un site au
   Bénin, choisir un hébergement, vendre en ligne sans boutique…).
4. **Cohérence du nom** : utilisez la même forme (« BOGNON ISAAC » ou « Isaac BOGNON ») partout.
5. **Fiche d'établissement Google** (facultatif, gratuit) si vous recevez des clients à Porto-Novo.

Sur l'objectif noté dans l'ancien site (apparaître en premier pour « comment gagner de l'argent ») : ces requêtes
sont parmi les plus concurrencées du Web. Un portfolio neuf ne peut pas promettre de s'y classer. Visez d'abord
votre nom et des requêtes précises (« création site web Porto-Novo », « développeur web Bénin »).
