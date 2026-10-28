// Contenus du site, en français (fr) et en anglais (en).
//
// Règle : aucune information biographique inventée. Source unique à ce jour :
// le CV fourni (novembre 2025). Ce qui reste à fournir est écrit {{TODO: ...}} :
// le site l'affiche dans un encadré « À COMPLÉTER » et le build en fait la liste.
//
// Prix : laisser `price: null` pour afficher « Sur devis ». Sinon, une chaîne
// libre, par exemple { fr: '50 000 FCFA', en: '50,000 FCFA' }.

export const profile = {
  headline: {
    fr: 'Développeur web & entrepreneur',
    en: 'Web developer & entrepreneur',
  },
  intro: {
    fr: "Je conçois et je développe des sites vitrines, des boutiques en ligne et des plateformes web, du design de l'interface jusqu'à la mise en ligne. Basé à Porto-Novo, au Bénin, je suis ouvert aux projets de clients et de partenaires du monde entier.",
    en: 'I design and build business websites, online shops and web platforms, from interface design to deployment. Based in Porto-Novo, Benin, I welcome projects from clients and partners worldwide.',
  },
  // Texte du CV, section « Profil professionnel ».
  bio: {
    fr: "Père de famille, développeur web passionné par la technologie, le design et l'entrepreneuriat, je mets ma créativité et mes compétences au service de projets innovants.",
    en: 'A family man and a web developer with a passion for technology, design and entrepreneurship, I put my creativity and skills to work for innovative projects.',
  },
  bioMore: {
    fr: "Je suis aussi l'auteur du livre « La Mine d'Or des Entrepreneurs », un ouvrage d'idées d'affaires adaptées au marché africain, écrit pour guider et motiver les jeunes entrepreneurs.",
    en: "I am also the author of the book “La Mine d'Or des Entrepreneurs” (The Entrepreneurs' Gold Mine), a collection of business ideas suited to the African market, written to guide and motivate young entrepreneurs.",
  },
  // Section « Expérience » du CV.
  experience: [
    { fr: "Développement et maintenance d'applications web dynamiques : sites vitrines, e-commerces, plateformes en ligne.", en: 'Development and maintenance of dynamic web applications: business websites, online shops, web platforms.' },
    { fr: "Conception d'interfaces utilisateur intuitives et réactives, en collaboration avec les équipes de design.", en: 'Design of intuitive, responsive user interfaces, in collaboration with design teams.' },
    { fr: 'Intégration front-end et back-end (HTML, CSS, JavaScript, PHP, MySQL).', en: 'Front-end and back-end integration (HTML, CSS, JavaScript, PHP, MySQL).' },
    { fr: "Optimisation des performances et correction des bugs pour une meilleure expérience utilisateur.", en: 'Performance optimisation and bug fixing for a better user experience.' },
    { fr: 'Mise en place de tests automatisés pour assurer la qualité et la fiabilité du code.', en: 'Automated testing to keep code reliable and of high quality.' },
    { fr: 'Gestion des hébergements, des domaines et du déploiement de projets web.', en: 'Hosting, domain and deployment management for web projects.' },
    { fr: 'Formation de jeunes aux bases du développement web et des outils numériques.', en: 'Training young people in web development basics and digital tools.' },
  ],
  experienceNote: {
    fr: '{{TODO: dates, employeurs ou clients de ces expériences}}',
    en: '{{TODO: dates, employers or clients for this experience}}',
  },
  // Sections « Formations » et « Diplôme obtenu » du CV, de la plus récente à la plus ancienne supposée.
  education: [
    { title: { fr: 'Développement web', en: 'Web development' }, school: 'Savoir Faire', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
    { title: { fr: 'Graphisme & CMS', en: 'Graphic design & CMS' }, school: 'NTI Académie', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
    { title: { fr: 'Informatique', en: 'Computer skills' }, school: 'ONG IPE Bénin', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
  ],
  diplomas: [
    { title: { fr: 'Baccalauréat série D', en: 'Baccalauréat, series D (science)' }, school: 'CEG Sèmè Kpodji', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
    { title: { fr: 'BEPC', en: 'BEPC (lower secondary certificate)' }, school: 'CEG Tohouè', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
    { title: { fr: 'CEP', en: 'CEP (primary school certificate)' }, school: 'Complexe scolaire Marie la Reine', place: 'Porto-Novo, Bénin', year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
    { title: { fr: 'Permis de conduire, catégorie B', en: 'Driving licence, category B' }, school: '', place: '', year: '' },
  ],
  educationNote: {
    fr: "{{TODO: confirmer ou retirer la « Licence en recherche informatique » citée sur l'ancien site, absente du CV}}",
    en: '{{TODO: confirm or remove the “Licence in computer research” quoted on the old website but missing from the CV}}',
  },
  languages: [
    { name: { fr: 'Français', en: 'French' }, level: { fr: 'Courant', en: 'Fluent' } },
    { name: { fr: 'Goun', en: 'Gun (Goun)' }, level: { fr: 'Langue maternelle', en: 'Native' } },
    { name: { fr: 'Anglais', en: 'English' }, level: { fr: '{{TODO: niveau}}', en: '{{TODO: level}}' } },
  ],
  interests: [
    { fr: 'Nouvelles technologies et innovations numériques', en: 'New technologies and digital innovation' },
    { fr: 'Développement personnel et entrepreneuriat', en: 'Personal development and entrepreneurship' },
    { fr: 'Lecture et recherche sur la finance et les investissements', en: 'Reading and research on finance and investment' },
    { fr: 'Design graphique et création visuelle', en: 'Graphic design and visual creation' },
  ],
};

// Compétences : section « Compétences techniques » et « Compétences personnelles » du CV.
export const skills = [
  {
    id: 'web',
    title: { fr: 'Développement web', en: 'Web development' },
    text: { fr: 'Sites et applications web, de l’intégration de l’interface à la logique serveur.', en: 'Websites and web applications, from interface integration to server logic.' },
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP'],
  },
  {
    id: 'data',
    title: { fr: 'Bases de données', en: 'Databases' },
    text: { fr: 'Conception de bases, écriture et optimisation de requêtes.', en: 'Database design, query writing and optimisation.' },
    tags: ['MySQL'],
  },
  {
    id: 'design',
    title: { fr: 'Graphisme', en: 'Graphic design' },
    text: { fr: 'Visuels, supports de communication et maquettes d’interface.', en: 'Visuals, marketing materials and interface mock-ups.' },
    tags: ['Canva', 'Photoshop', 'Illustrator'],
  },
  {
    id: 'ai',
    title: { fr: 'IA appliquée aux affaires', en: 'AI for business' },
    text: { fr: 'Modèles d’IA, automatisation de tâches et intégration dans les outils de l’entreprise.', en: 'AI models, task automation and integration into business tools.' },
    tags: [{ fr: 'Modèles', en: 'Models' }, { fr: 'Automatisation', en: 'Automation' }, { fr: 'Intégration', en: 'Integration' }],
  },
  {
    id: 'ops',
    title: { fr: 'Mise en ligne et qualité', en: 'Deployment and quality' },
    text: { fr: 'Hébergement, noms de domaine, déploiement, tests automatisés et performances.', en: 'Hosting, domain names, deployment, automated testing and performance.' },
    tags: [{ fr: 'Hébergement', en: 'Hosting' }, { fr: 'Domaines', en: 'Domains' }, { fr: 'Tests', en: 'Testing' }, { fr: 'Performance', en: 'Performance' }],
  },
  {
    id: 'finance',
    title: { fr: 'Trading & cryptomonnaies', en: 'Trading & cryptocurrencies' },
    text: { fr: 'Analyse de marché, gestion de portefeuilles et stratégies de trading.', en: 'Market analysis, portfolio management and trading strategies.' },
    tags: [{ fr: 'Analyse', en: 'Analysis' }, { fr: 'Portefeuilles', en: 'Portfolios' }, { fr: 'Stratégies', en: 'Strategies' }],
  },
];

export const softSkills = [
  { fr: 'Leadership et management', en: 'Leadership and management' },
  { fr: 'Communication et sens du contact', en: 'Communication and people skills' },
  { fr: "Esprit d'analyse et d'innovation", en: 'Analytical and innovative thinking' },
  { fr: 'Gestion du temps et autonomie', en: 'Time management and autonomy' },
];

// Services : tirés de la section « Expérience » du CV. Tarifs : null = sur devis.
export const services = [
  {
    slug: 'site-vitrine',
    title: { fr: 'Site vitrine professionnel', en: 'Business website' },
    text: { fr: 'Un site clair et rapide pour présenter votre activité, vos offres et vos coordonnées, adapté au mobile.', en: 'A clear, fast, mobile-friendly website presenting your business, your offers and your contact details.' },
    includes: { fr: ['Design adapté à votre image', 'Pages responsive', 'Référencement de base', 'Mise en ligne'], en: ['Design matching your brand', 'Responsive pages', 'Basic SEO', 'Deployment'] },
    price: null,
  },
  {
    slug: 'boutique-en-ligne',
    title: { fr: 'Boutique en ligne', en: 'Online shop' },
    text: { fr: 'Un catalogue de produits en ligne avec prise de commande, adapté à votre manière de vendre.', en: 'An online product catalogue with ordering, adapted to the way you sell.' },
    includes: { fr: ['Catalogue produits', 'Commande et suivi', 'Gestion des contenus', 'Formation à l’utilisation'], en: ['Product catalogue', 'Ordering and follow-up', 'Content management', 'Hand-over training'] },
    price: null,
  },
  {
    slug: 'plateforme-web',
    title: { fr: 'Application ou plateforme web', en: 'Web application or platform' },
    text: { fr: 'Une application web sur mesure, avec base de données, pour automatiser votre activité.', en: 'A custom web application with a database to automate your operations.' },
    includes: { fr: ['Analyse du besoin', 'Développement PHP / MySQL', 'Tests', 'Déploiement'], en: ['Needs analysis', 'PHP / MySQL development', 'Testing', 'Deployment'] },
    price: null,
  },
  {
    slug: 'maintenance-performance',
    title: { fr: 'Maintenance et performances', en: 'Maintenance and performance' },
    text: { fr: 'Correction de bugs, optimisation de la vitesse et mises à jour d’un site existant.', en: 'Bug fixing, speed optimisation and updates for an existing website.' },
    includes: { fr: ['Diagnostic', 'Corrections', 'Optimisation de la vitesse', 'Rapport des changements'], en: ['Diagnosis', 'Fixes', 'Speed optimisation', 'Change report'] },
    price: null,
  },
  {
    slug: 'mise-en-ligne',
    title: { fr: 'Hébergement et mise en ligne', en: 'Hosting and deployment' },
    text: { fr: 'Choix de l’hébergement, configuration du nom de domaine et publication de votre projet.', en: 'Hosting selection, domain name set-up and publication of your project.' },
    includes: { fr: ['Conseil d’hébergement', 'Configuration du domaine', 'HTTPS', 'Déploiement'], en: ['Hosting advice', 'Domain set-up', 'HTTPS', 'Deployment'] },
    price: null,
  },
  {
    slug: 'graphisme',
    title: { fr: 'Création graphique', en: 'Graphic design' },
    text: { fr: 'Visuels pour les réseaux sociaux, affiches et supports de communication.', en: 'Social media visuals, posters and marketing materials.' },
    includes: { fr: ['Visuels réseaux sociaux', 'Affiches', 'Maquettes', 'Fichiers sources sur demande'], en: ['Social media visuals', 'Posters', 'Mock-ups', 'Source files on request'] },
    price: null,
  },
  {
    slug: 'automatisation-ia',
    title: { fr: 'Automatisation et IA', en: 'Automation and AI' },
    text: { fr: 'Intégration d’outils d’intelligence artificielle et automatisation de tâches répétitives.', en: 'Integration of AI tools and automation of repetitive tasks.' },
    includes: { fr: ['Étude des tâches à automatiser', 'Choix des outils', 'Intégration', 'Accompagnement'], en: ['Review of tasks to automate', 'Tool selection', 'Integration', 'Support'] },
    price: null,
  },
  {
    slug: 'formation-web',
    title: { fr: 'Formation au web et au numérique', en: 'Web and digital skills training' },
    text: { fr: 'Initiation aux bases du développement web et aux outils numériques, pour débutants.', en: 'Introduction to web development basics and digital tools, for beginners.' },
    includes: { fr: ['Programme adapté au niveau', 'Exercices pratiques', 'Supports de cours'], en: ['Programme matched to your level', 'Hands-on exercises', 'Course materials'] },
    price: null,
  },
];

// Le livre : seul projet confirmé par le CV.
export const book = {
  slug: 'la-mine-d-or-des-entrepreneurs',
  title: "La Mine d'Or des Entrepreneurs",
  subtitle: {
    fr: "Idées d'affaires adaptées au marché africain",
    en: 'Business ideas for the African market',
  },
  text: {
    fr: "Un ouvrage inspirant qui regroupe des idées d'affaires adaptées au marché africain, pour guider et motiver les jeunes entrepreneurs.",
    en: 'An inspiring book that brings together business ideas suited to the African market, to guide and motivate young entrepreneurs.',
  },
  contents: {
    fr: [
      'Un plan de lancement étape par étape',
      "Une sélection d'idées de business, avec pour chacune : pourquoi elle fonctionne, le produit ou service à proposer, le matériel nécessaire, le lieu de lancement, le budget approximatif et le potentiel de croissance",
      'Des conseils pratiques pour passer à l’action',
    ],
    en: [
      'A step-by-step launch plan',
      'A selection of business ideas, each with why it works, the product or service to offer, the equipment needed, where to launch, an approximate budget and growth potential',
      'Practical tips for taking action',
    ],
  },
  details: [
    { label: { fr: 'Auteur', en: 'Author' }, value: { fr: 'Isaac BOGNON', en: 'Isaac BOGNON' } },
    { label: { fr: 'Langue', en: 'Language' }, value: { fr: 'Français', en: 'French' } },
    { label: { fr: 'Formats', en: 'Formats' }, value: { fr: '{{TODO: numérique, papier ou les deux}}', en: '{{TODO: digital, print or both}}' } },
    { label: { fr: 'Année de publication', en: 'Year published' }, value: { fr: '{{TODO: année}}', en: '{{TODO: year}}' } },
  ],
  price: null, // ex. { fr: '12 700 FCFA', en: '12,700 FCFA' } — à confirmer
  // Image : fichiers src/assets/img/<name>-<largeur>.webp et .<ext> pour chaque largeur.
  image: { name: 'livre-mine-d-or-mockup', widths: [642], ext: 'png', width: 642, height: 388 },
  imageAlt: {
    fr: "Maquette du livre « La Mine d'Or des Entrepreneurs » sur tablette, téléphone et en version papier",
    en: "Mock-up of the book “La Mine d'Or des Entrepreneurs” on a tablet, a phone and in print",
  },
};

// Projets du portfolio. Ajouter un objet par projet réel (voir GUIDE-MAINTENANCE.md).
export const projects = [
  {
    slug: 'la-mine-d-or-des-entrepreneurs',
    title: "La Mine d'Or des Entrepreneurs",
    category: { fr: 'Édition · Entrepreneuriat', en: 'Publishing · Entrepreneurship' },
    role: { fr: 'Auteur', en: 'Author' },
    year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' },
    summary: book.text,
    body: {
      fr: [
        "« La Mine d'Or des Entrepreneurs » est un livre que j'ai écrit pour aider les porteurs de projet à trouver une idée et à se lancer avec les moyens dont ils disposent.",
        "Chaque idée d'affaires est présentée de façon concrète : le besoin auquel elle répond, ce qu'il faut pour démarrer, le budget approximatif et les pistes de croissance.",
      ],
      en: [
        "“La Mine d'Or des Entrepreneurs” is a book I wrote to help aspiring entrepreneurs find an idea and get started with the resources they have.",
        'Each business idea is laid out in practical terms: the need it meets, what it takes to start, an approximate budget and growth options.',
      ],
    },
    tags: [{ fr: 'Livre', en: 'Book' }, { fr: 'Entrepreneuriat', en: 'Entrepreneurship' }, { fr: 'Afrique', en: 'Africa' }],
    image: book.image,
    imageAlt: book.imageAlt,
    links: [{ kind: 'catalogue', label: { fr: 'Voir le livre dans le catalogue', en: 'See the book in the catalogue' } }],
  },
  {
    slug: 'bognon-market',
    title: 'BOGNON MARKET',
    category: { fr: 'Entreprise', en: 'Business' },
    role: { fr: '{{TODO: votre rôle (fondateur ?)}}', en: '{{TODO: your role (founder?)}}' },
    year: { fr: '{{TODO: année}}', en: '{{TODO: year}}' },
    summary: {
      fr: '{{TODO: description de BOGNON MARKET, citée sur votre ancien portfolio mais absente du CV}}',
      en: '{{TODO: description of BOGNON MARKET, mentioned on your old portfolio but not in the CV}}',
    },
    body: {
      fr: ['{{TODO: objectif, public, réalisations et résultats vérifiables}}'],
      en: ['{{TODO: goal, audience, achievements and verifiable results}}'],
    },
    tags: [],
    image: null,
    links: [],
  },
];

// Catalogue : livre + services. `kind: 'product'` pour un produit, 'service' pour un service.
export const catalogue = {
  categories: [
    { id: 'livre', label: { fr: 'Livre', en: 'Book' } },
    { id: 'web', label: { fr: 'Services web', en: 'Web services' } },
    { id: 'design', label: { fr: 'Graphisme', en: 'Design' } },
    { id: 'formation', label: { fr: 'Formation', en: 'Training' } },
  ],
  serviceCategory: {
    'site-vitrine': 'web', 'boutique-en-ligne': 'web', 'plateforme-web': 'web', 'maintenance-performance': 'web',
    'mise-en-ligne': 'web', 'automatisation-ia': 'web', graphisme: 'design', 'formation-web': 'formation',
  },
  documents: {
    fr: 'Démonstrations, extraits du livre et CV complet : envoyés sur demande, après échange.',
    en: 'Demos, book excerpts and full CV: sent on request, after a first conversation.',
  },
};

// Articles du blog : du plus récent au plus ancien.
export const posts = [
  {
    slug: 'lancement-du-portfolio',
    date: '2026-10-28',
    title: { fr: 'Lancement de mon portfolio', en: 'My portfolio is live' },
    excerpt: {
      fr: 'Ce site réunit mon parcours, mes services et mon livre, avec un moyen simple de me demander un devis.',
      en: 'This site brings together my background, my services and my book, with a simple way to request a quote.',
    },
    body: {
      fr: [
        'Bienvenue sur mon portfolio. Vous y trouverez mon parcours, mes compétences, les services que je propose et mon livre « La Mine d’Or des Entrepreneurs ».',
        'Pour un projet, la page Services contient un formulaire de demande de devis. Il ouvre votre messagerie ou WhatsApp avec un message prérempli : rien n’est enregistré sur un serveur.',
        'Le site fonctionne aussi hors connexion : après une première visite, vous pouvez relire les pages même sans réseau, et l’installer sur votre téléphone comme une application.',
      ],
      en: [
        'Welcome to my portfolio. Here you will find my background, my skills, the services I offer and my book “La Mine d’Or des Entrepreneurs”.',
        'For a project, the Services page has a quote request form. It opens your email app or WhatsApp with a pre-filled message: nothing is stored on a server.',
        'The site also works offline: after a first visit you can read the pages again without a connection, and install it on your phone like an app.',
      ],
    },
  },
];
