# Guide de maintenance

Tout le contenu se modifie dans deux fichiers, dans un éditeur de texte (Visual Studio Code, gratuit, est conseillé) :

- `src/content/site.mjs` : adresse du site, e-mail, WhatsApp, réseaux, IFU / RCCM, codes Search Console ;
- `src/content/content.mjs` : textes FR/EN du profil, compétences, services, livre, projets et articles.

Après chaque modification : **reconstruire → vérifier → publier**.

```bash
node scripts/build.mjs          # régénère docs/ et A-COMPLETER.md
node scripts/serve.mjs 8080     # vérifier sur http://localhost:8080/
npm test                        # facultatif mais conseillé (après un premier « npm install »)
git add . && git commit -m "Description du changement" && git push
```

Ne modifiez jamais `docs/` à la main : le dossier est entièrement recréé à chaque build.

## Remplir les champs « À COMPLÉTER »

Ouvrez [A-COMPLETER.md](../A-COMPLETER.md) : chaque ligne indique l'information et les pages concernées.
Dans `content.mjs`, cherchez `{{TODO:` et remplacez tout le bloc par le vrai texte, dans les deux langues :

```js
year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' },   // avant
year: { fr: '2021', en: '2021' },                         // après
```

Pour supprimer une ligne qui ne vous concerne pas (par exemple le permis de conduire), supprimez l'objet entier.
Un champ `{{TODO: …}}` n'est jamais affiché sur le site : l'élément est masqué. Un projet dont le résumé est encore à compléter n'est pas publié du tout.

## Changer les coordonnées

Dans `site.mjs` :

```js
contact: {
  email: 'isaacbognon@icloud.com',
  whatsapp: '2290152390436',            // chiffres seulement : indicatif 229 + numéro, sans + ni espaces
  whatsappDisplay: '+229 01 52 39 04 36',
},
social: { linkedin: 'https://www.linkedin.com/in/…', github: 'https://github.com/BOGNON', … },
```

Vérifiez le numéro WhatsApp en ouvrant `https://wa.me/2290152390436` sur votre téléphone : la conversation doit s'ouvrir
avec votre compte. Une valeur vide (`''`) masque l'élément partout sur le site.

## Afficher un tarif

Dans `content.mjs`, remplacez `price: null` (affiché « Sur devis ») par :

```js
price: { fr: 'À partir de 150 000 FCFA', en: 'From 150,000 FCFA' },
```

Pour le livre, la ligne est `price: null` dans l'objet `book`.

## Ajouter un projet au portfolio

1. Mettez l'image dans `src/assets/img/` en deux formats de même nom : `mon-projet-800.webp` et `mon-projet-800.jpg`
   (largeur 800 px ; [squoosh.app](https://squoosh.app) les produit gratuitement dans le navigateur).
2. Ajoutez un objet dans la liste `projects` de `content.mjs` :

```js
{
  slug: 'site-boutique-exemple',                 // adresse : /portfolio/site-boutique-exemple/
  title: 'Nom du projet',
  category: { fr: 'Site e-commerce', en: 'E-commerce website' },
  role: { fr: 'Conception et développement', en: 'Design and development' },
  year: { fr: '2026', en: '2026' },
  summary: { fr: 'Une phrase de résumé.', en: 'One-sentence summary.' },
  body: { fr: ['Paragraphe 1.', 'Paragraphe 2.'], en: ['Paragraph 1.', 'Paragraph 2.'] },
  tags: ['PHP', 'MySQL'],
  image: { name: 'mon-projet', widths: [800], ext: 'jpg', width: 800, height: 500 },  // ou null
  imageAlt: { fr: 'Page d’accueil du site …', en: 'Home page of the … website' },
  links: [{ kind: 'url', url: 'https://exemple.com', label: { fr: 'Voir le site', en: 'Visit the site' } }],
},
```

`width` et `height` sont les dimensions réelles de la plus grande image. Pour plusieurs tailles, ajoutez-les :
`widths: [480, 800]` avec les fichiers `mon-projet-480.webp/.jpg` et `mon-projet-800.webp/.jpg`.
Sans image (`image: null`), la carte affiche le nom du projet sur un fond sombre.

Obtenez l'accord écrit du client avant de publier son nom, son logo ou des captures de son site.

## Ajouter un article de blog

Ajoutez un objet **en tête** de la liste `posts` :

```js
{
  slug: 'prix-site-web-benin',
  date: '2026-11-15',
  title: { fr: 'Combien coûte un site web au Bénin ?', en: 'How much does a website cost in Benin?' },
  excerpt: { fr: 'Résumé de 120 à 160 caractères…', en: 'Summary of 120 to 160 characters…' },
  body: { fr: ['Paragraphe 1.', 'Paragraphe 2.'], en: ['Paragraph 1.', 'Paragraph 2.'] },
},
```

L'article, sa version anglaise, le sitemap et le cache hors ligne sont mis à jour automatiquement au prochain build.

## Remplacer une photo

Remplacez les fichiers de `src/assets/img/` en gardant **exactement les mêmes noms et dimensions** (portrait carré
240 et 480 px ; photo « costume » 480×600 et 800×1000 px), en WebP et en JPEG.

## Changer les couleurs ou les polices

En haut de `src/assets/css/styles.css`, les variables `--ink` (fond sombre), `--paper` (fond clair), `--gold`
(accent) et `--font-display` / `--font-body`. Vérifiez ensuite les contrastes avec `npm test` (axe-core).

## Contrôles réguliers

| Fréquence | À faire |
| --- | --- |
| À chaque modification | `node scripts/build.mjs`, aperçu local, `npm test` si possible |
| Chaque mois | Search Console : pages indexées, erreurs ; un nouvel article ou projet |
| Chaque trimestre | Tester les boutons WhatsApp et e-mail sur le site public ; relire les tarifs |
| Chaque année | Relire mentions légales et confidentialité ; renouveler le nom de domaine s'il y en a un |

## Sécurité

- Le site ne contient aucun mot de passe ni clé secrète, et ne doit jamais en contenir : le dépôt est public.
- L'ancien fichier `config.php` (identifiants MySQL) n'a pas été repris. Changez ce mot de passe chez l'hébergeur
  s'il est encore utilisé.
- Activez l'authentification à deux facteurs sur votre compte GitHub (**Settings → Password and authentication**).

## Revenir en arrière

Chaque `git push` est conservé dans l'historique. Sur GitHub, onglet **Commits**, vous pouvez consulter une ancienne
version ; en ligne de commande, `git revert <identifiant>` annule un changement puis `git push` republie.
