# Tests réalisés

Dernière exécution : 28 octobre 2026, dans un environnement de développement Linux avec Chromium (Playwright 1.63).
Commandes : `npm test` (build + contrôles statiques + validation HTML + 39 tests navigateur) et `npm run lighthouse`.

## Résultats

| Contrôle | Résultat |
| --- | --- |
| Contrôle statique (`tests/check-site.mjs`) : liens internes et ancres, titres et descriptions uniques, canoniques, hreflang réciproques, sitemap, robots.txt, JSON-LD, textes alternatifs, un seul H1, manifeste, liste du service worker | 28 pages, **0 erreur** |
| Validation HTML (html-validate, règles recommandées) | **0 erreur** |
| Affichage mobile 360 px et ordinateur 1366 px, 26 pages : débordement horizontal, erreurs JavaScript, ressources en erreur | **Aucun problème** |
| Accessibilité axe-core (WCAG 2.1 A/AA + bonnes pratiques) sur les 26 pages | **0 violation** |
| Navigation : menu mobile (ouverture, Échap), sélecteur FR/EN, pages projet, redirection sans barre finale, page 404 | **Réussi** |
| Formulaire de devis : présélection du service, champs obligatoires, WhatsApp (numéro et message complet), e-mail (destinataire, objet, corps) | **Réussi** |
| Formulaire de contact anglais → WhatsApp en anglais | **Réussi** |
| Catalogue : boutons « Commander sur WhatsApp / par e-mail », lien vers le devis, filtres | **Réussi** |
| Sans JavaScript : menu, contenus et coordonnées directes accessibles | **Réussi** |
| PWA : manifeste et icônes, service worker actif, pré-cache complet (43 fichiers) | **Réussi** |
| Hors ligne : 5 pages FR/EN avec images et polices, page inconnue → page hors connexion, avertissement dans le formulaire | **Réussi** |
| Mise à jour du service worker : message « nouvelle version », bouton « Actualiser » | **Réussi** |
| Site servi sous un sous-chemin (`/portfolio-test/`), comme un dépôt GitHub Pages non racine | **Réussi** |

### Lighthouse (mesure locale, sans latence réseau réelle)

| Appareil | Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mobile | / | 100 | 100 | 100 | 100 | 0.9 s | 0 |
| mobile | /a-propos/ | 99 | 100 | 100 | 100 | 2.0 s | 0 |
| mobile | /services/ | 100 | 100 | 100 | 100 | 1.1 s | 0 |
| mobile | /catalogue/ | 99 | 100 | 100 | 100 | 2.0 s | 0.05 |
| mobile | /en/ | 100 | 100 | 100 | 100 | 1.9 s | 0 |
| desktop | / | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| desktop | /a-propos/ | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| desktop | /services/ | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| desktop | /catalogue/ | 100 | 100 | 100 | 100 | 0.3 s | 0 |
| desktop | /en/ | 100 | 100 | 100 | 100 | 0.4 s | 0 |

## Ce qui n'a pas été testé

- **Le site publié sur GitHub Pages** : le dépôt n'existait pas encore au moment des tests. Suivez la liste de
  vérification de [PUBLICATION.md](PUBLICATION.md) après la mise en ligne.
- **L'envoi réel** d'un message WhatsApp ou d'un e-mail : les tests vérifient que le bon lien est ouvert avec le bon
  contenu, pas la réception. Le numéro WhatsApp `+229 01 52 39 04 36` doit être confirmé.
- **Les liens externes** (wa.me, docs.github.com) : non joignables depuis l'environnement de test.
- **Safari (iPhone, macOS) et Firefox**, et de vrais téléphones : seul Chromium a été utilisé. Le code n'utilise que des
  fonctions standard prises en charge par ces navigateurs, mais un essai sur votre téléphone reste nécessaire.
- **L'aperçu de partage** (Open Graph) sur WhatsApp et Facebook : il ne peut être vérifié qu'une fois le site en ligne.
