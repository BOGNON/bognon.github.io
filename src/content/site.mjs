// Configuration générale du site.
// C'est le premier fichier à modifier : adresse publique, coordonnées et réseaux.
// Un champ laissé vide ('') est simplement masqué sur le site.

export const site = {
  // Adresse publique du site, sans barre finale.
  // Dépôt « bognon.github.io »      -> 'https://bognon.github.io'
  // Dépôt « portfolio » (autre nom) -> 'https://bognon.github.io/portfolio'
  // Domaine personnalisé           -> 'https://www.bognonisaac.com'
  // La variable d'environnement SITE_URL remplace cette valeur au moment du build.
  url: process.env.SITE_URL || 'https://bognon.github.io',

  // Domaine personnalisé pour GitHub Pages (crée le fichier CNAME). Laisser '' sans domaine.
  customDomain: '',

  brand: 'BOGNON ISAAC',
  person: {
    givenName: 'Isaac',
    familyName: 'BOGNON',
    fullName: 'Isaac BOGNON',
    city: 'Porto-Novo',
    countryCode: 'BJ',
    country: { fr: 'Bénin', en: 'Benin' },
    jobTitle: { fr: 'Développeur web & entrepreneur', en: 'Web developer & entrepreneur' },
  },

  contact: {
    // Source : CV fourni (novembre 2025).
    email: 'isaacbognon@icloud.com',
    // Numéro WhatsApp au format international, chiffres uniquement, sans « + » ni espaces.
    // À CONFIRMER : le CV indique +229 52 39 04 36 ; depuis la migration béninoise
    // vers 10 chiffres, ce numéro s'écrit +229 01 52 39 04 36.
    whatsapp: '2290152390436',
    whatsappDisplay: '+229 01 52 39 04 36',
  },

  // Réseaux professionnels : coller l'URL complète. Vide = non affiché.
  social: {
    linkedin: '',
    github: '',
    facebook: '',
    instagram: '',
    youtube: '',
    x: '',
  },

  // Mentions légales (Bénin) : à remplir si l'activité est déclarée.
  legal: {
    ifu: '',
    rccm: '',
  },

  // Codes de validation des outils pour webmasters (voir guides/REFERENCEMENT.md).
  // Coller uniquement la valeur « content » de la balise fournie. Vide = non ajouté.
  verification: {
    google: '',
    bing: '',
  },

  themeColor: '#0e1116',
};
