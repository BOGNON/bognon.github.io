# Publier le site gratuitement sur GitHub Pages

GitHub Pages héberge gratuitement un site statique depuis un dépôt **public**, avec un lien HTTPS.
Il ne demande ni carte bancaire ni abonnement. (Pour un dépôt privé, Pages exige un forfait payant.)

## 1. Créer le dépôt

1. Connectez-vous sur [github.com](https://github.com) avec votre compte (`BOGNON`).
2. Cliquez sur **+** en haut à droite, puis **New repository**.
3. Nom du dépôt, au choix :
   - **`bognon.github.io`** (recommandé) : le site sera à **https://bognon.github.io/** ;
   - n'importe quel autre nom, par exemple `portfolio` : le site sera à https://bognon.github.io/portfolio/.
     Dans ce cas, modifiez `url` dans `src/content/site.mjs` (`'https://bognon.github.io/portfolio'`) puis relancez le build.
4. Visibilité : **Public**. Ne cochez pas « Add a README » (le projet en contient déjà un).
5. Cliquez sur **Create repository**.

## 2. Envoyer les fichiers

Avec Git installé sur votre ordinateur, dans le dossier du projet :

```bash
git init -b main            # si ce n'est pas déjà un dépôt Git
git add .
git commit -m "Portfolio BOGNON ISAAC"
git remote add origin https://github.com/BOGNON/bognon.github.io.git
git push -u origin main
```

Sans Git : sur la page du dépôt, **Add file → Upload files**, puis glissez tout le contenu du dossier
(y compris `docs/`), et validez avec **Commit changes**. Le dossier `node_modules/` ne doit pas être envoyé.

## 3. Activer GitHub Pages

1. Dans le dépôt : **Settings → Pages**.
2. **Build and deployment → Source** : *Deploy from a branch*.
3. **Branch** : `main`, dossier **`/docs`**, puis **Save**.
4. Attendez une à dix minutes. L'adresse publique s'affiche en haut de la page **Pages**.
5. Vérifiez que **Enforce HTTPS** est coché.

L'onglet **Actions** du dépôt montre le déploiement (« pages build and deployment ») ; une coche verte signifie
qu'il a réussi.

## 4. Vérifier le lien public

Sur ordinateur **et** sur téléphone :

- [ ] l'adresse s'ouvre en `https://` avec un cadenas ;
- [ ] le menu, le bouton **EN/FR** et toutes les pages du menu s'ouvrent ;
- [ ] `/sitemap.xml`, `/robots.txt` et `/manifest.webmanifest` s'affichent ;
- [ ] une adresse inventée (`/test-404/`) affiche la page « Page introuvable » ;
- [ ] **Demander un devis** → remplir → **Envoyer sur WhatsApp** ouvre WhatsApp avec le message ;
- [ ] **Envoyer par e-mail** ouvre la messagerie avec l'objet et le texte ;
- [ ] dans le catalogue, **Commander sur WhatsApp** et **Commander par e-mail** fonctionnent ;
- [ ] après avoir parcouru le site, passer en mode avion puis rouvrir une page : elle s'affiche ;
- [ ] le partage du lien sur WhatsApp ou Facebook montre l'image et le titre (l'aperçu peut mettre un peu de temps).

Le test le plus important : envoyez-vous une vraie demande par WhatsApp et par e-mail, et vérifiez que vous la recevez.

## 5. Mettre à jour le site

1. Modifiez les fichiers dans `src/` (voir [MAINTENANCE.md](MAINTENANCE.md)).
2. Reconstruisez : `node scripts/build.mjs` (et, si possible, `npm test`).
3. Envoyez : `git add . && git commit -m "Mise à jour" && git push`
   (ou **Upload files** sur GitHub en remplaçant les fichiers modifiés et le dossier `docs/`).

GitHub Pages republie en quelques minutes. Les visiteurs qui ont déjà le site en cache voient le message
« Une nouvelle version du site est disponible » avec un bouton **Actualiser**.

## 6. Nom de domaine personnalisé (facultatif, payant)

1. Achetez ou gardez un domaine (par exemple `bognonisaac.com`) chez un registraire. **Attention** : si ce domaine
   pointe encore vers l'ancien site PHP, ce dernier cessera d'être accessible à cette adresse.
2. Dans `src/content/site.mjs` : `url: 'https://www.bognonisaac.com'` et `customDomain: 'www.bognonisaac.com'`,
   puis reconstruisez (le fichier `docs/CNAME` est créé) et publiez.
3. Chez le registraire, zone DNS :
   - `www` : enregistrement **CNAME** vers `bognon.github.io` ;
   - domaine nu (`@`) : quatre enregistrements **A** vers `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`.
4. GitHub → **Settings → Pages → Custom domain** : saisissez le domaine, attendez la vérification DNS, puis cochez
   **Enforce HTTPS**.
5. Recommandé : vérifiez le domaine dans les paramètres de votre compte GitHub (**Settings → Pages → Add a domain**)
   pour empêcher qu'un tiers ne l'utilise.

## Conditions d'utilisation de GitHub Pages à connaître

- Taille du site : 1 Go maximum ; bande passante indicative : 100 Go par mois. Ce portfolio pèse environ 1 Mo.
- GitHub Pages n'est pas prévu pour un site **principalement** destiné à des transactions commerciales (boutique en
  ligne, service payant). Ce portfolio ne fait aucune transaction : il présente vos services et renvoie vers
  l'e-mail ou WhatsApp. Si un jour le site devient une vraie boutique, prévoyez un autre hébergement
  (Cloudflare Pages ou Netlify ont des offres gratuites, à vérifier au moment du changement).
- Conditions complètes : [docs.github.com/fr/pages](https://docs.github.com/fr/pages/getting-started-with-github-pages/github-pages-limits).
