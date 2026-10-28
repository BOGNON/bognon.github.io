# Installer le site comme une application et le consulter hors connexion

Le site est une application web progressive (PWA). Après une première visite **en ligne**, toutes ses pages, images et
polices sont enregistrées sur l'appareil (environ 1 Mo) : on peut ensuite le relire sans réseau.

## Installer

| Appareil | Navigateur | Étapes |
| --- | --- | --- |
| Android | Chrome | Ouvrir le site → menu **⋮** → **Installer l'application** (ou **Ajouter à l'écran d'accueil**) |
| Android | Samsung Internet, Edge | Menu → **Ajouter la page à** → **Écran d'accueil** |
| iPhone / iPad (iOS 16.4 ou plus) | Safari | Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter** |
| Ordinateur | Chrome, Edge | Icône d'installation à droite de la barre d'adresse → **Installer** |
| Ordinateur | Firefox, Safari macOS | Pas d'installation sous forme d'application ; le mode hors connexion fonctionne quand même dans le navigateur (Safari macOS 17 : **Fichier → Ajouter au Dock**) |

L'icône « IB » apparaît alors parmi les applications ; le site s'ouvre en plein écran, sans barre d'adresse.

## Ce qui fonctionne hors connexion

- Toutes les pages du site, en français et en anglais, avec leurs images et leurs polices.
- Une adresse jamais enregistrée affiche la page « Vous êtes hors connexion ».

## Ce qui ne fonctionne pas hors connexion

- **L'envoi des messages** : les formulaires ouvrent la messagerie ou WhatsApp, qui ont besoin du réseau. Le site le
  signale ; un e-mail préparé hors connexion part depuis la boîte d'envoi quand le réseau revient.
- Les liens externes (WhatsApp, GitHub, documentation).

## Mises à jour

À chaque publication, le site télécharge la nouvelle version en arrière-plan et affiche
« Une nouvelle version du site est disponible » avec un bouton **Actualiser**. Sans clic, la nouvelle version
s'applique à la prochaine ouverture du site après fermeture de tous ses onglets.

## Effacer les données enregistrées

Réglages du navigateur → **Confidentialité** → **Données des sites** → `bognon.github.io` → **Effacer**.
Sur une application installée : la désinstaller supprime aussi ses données.
