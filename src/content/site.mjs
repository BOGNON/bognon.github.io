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
    fullName: 'BOGNON ISAAC',
    city: 'Porto-Novo',
    countryCode: 'BJ',
    country: { fr: 'Bénin', en: 'Benin' },
    jobTitle: { fr: 'Développeur web & chef d’entreprise', en: 'Web developer & business owner' },
  },

  contact: {
    // Source : CV fourni (novembre 2025).
    email: 'isaacbognon@icloud.com',
    // Numéro WhatsApp au format international, chiffres uniquement, sans « + » ni espaces.
    // Source : lien WhatsApp fourni par Isaac BOGNON le 28/10/2026 (wa.me/22952390436).
    whatsapp: '22952390436',
    whatsappDisplay: '+229 52 39 04 36',
  },

  // Réseaux professionnels : coller l'URL complète. Vide = non affiché.
  social: {
    linkedin: 'https://www.linkedin.com/in/isaac-bognon-2165aa252',
    facebook: 'https://www.facebook.com/Bognonisaac',
    instagram: 'https://www.instagram.com/isaac.bognon',
    tiktok: 'https://www.tiktok.com/@isaac.bognon',
    x: 'https://x.com/b23x100',
    snapchat: 'https://snapchat.com/t/spnZBRDG',
    // Lien d'invitation : à remplacer s'il expire (Discord > Inviter > « N'expire jamais »).
    discord: 'https://discord.gg/j5jBrZGf',
  },

  // Entreprise fondée par Isaac BOGNON.
  company: {
    name: 'LeCodeTech',
    url: 'https://lecodetech.com',
    foundingDate: '2026',
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

  themeColor: '#0a0f2e',
};
