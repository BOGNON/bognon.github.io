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
    slug: 'preparer-son-projet-de-site-web',
    date: '2026-10-28',
    title: { fr: 'Préparer son projet de site web en 6 questions', en: 'Preparing your website project in 6 questions' },
    excerpt: {
      fr: 'Avant de demander un devis, six questions simples pour clarifier votre projet de site web et obtenir une proposition précise.',
      en: 'Before requesting a quote, six simple questions to clarify your website project and get an accurate proposal.',
    },
    body: {
      fr: [
        'Un projet de site web bien préparé avance plus vite, coûte moins cher en allers-retours et donne un meilleur résultat. Voici les six questions que je pose à chaque client avant d’établir un devis.',
        '## 1. À quoi doit servir le site ?',
        'Présenter votre activité, recevoir des demandes de devis, vendre des produits, prendre des réservations : un objectif principal clair guide toutes les autres décisions, du nombre de pages au choix des fonctionnalités.',
        '## 2. Qui sont vos visiteurs ?',
        'Des particuliers près de chez vous, des entreprises, des clients à l’étranger ? La réponse influence la langue du site, le ton des textes et les moyens de contact à mettre en avant.',
        '## 3. Quelles pages sont indispensables ?',
        'Pour la plupart des activités, un accueil, une page de services ou de produits, une page « à propos » et une page de contact suffisent pour démarrer. Mieux vaut un petit site complet qu’un grand site à moitié rempli.',
        '## 4. Avez-vous vos contenus ?',
        'Logo, textes, photos de vos produits ou de votre équipe, coordonnées : rassembler ces éléments avant de commencer est souvent ce qui accélère le plus un projet.',
        '## 5. Comment vos clients vont-ils vous contacter ?',
        'Formulaire, e-mail, WhatsApp, téléphone : choisissez les canaux que vous consultez vraiment et sur lesquels vous pouvez répondre rapidement.',
        '## 6. Qui fera vivre le site ?',
        'Un site qui n’évolue jamais perd de son intérêt. Décidez dès le départ si vous mettrez à jour les contenus vous-même ou si vous préférez confier cette tâche dans le cadre d’une maintenance.',
        'Vous avez vos réponses ? Envoyez-les avec le formulaire de devis de la page Services : je vous réponds avec une proposition adaptée.',
      ],
      en: [
        'A well-prepared website project moves faster, needs fewer back-and-forths and delivers a better result. Here are the six questions I ask every client before writing a quote.',
        '## 1. What is the site for?',
        'Presenting your business, receiving quote requests, selling products, taking bookings: one clear main goal guides every other decision, from the number of pages to the choice of features.',
        '## 2. Who are your visitors?',
        'Local customers, businesses, clients abroad? The answer shapes the site’s language, the tone of the copy and the contact options to highlight.',
        '## 3. Which pages are essential?',
        'For most businesses, a home page, a services or products page, an about page and a contact page are enough to start. A small, complete site beats a large, half-empty one.',
        '## 4. Do you have your content?',
        'Logo, copy, photos of your products or team, contact details: gathering these before starting is often what speeds a project up the most.',
        '## 5. How will customers contact you?',
        'Form, email, WhatsApp, phone: pick the channels you actually check and can reply to quickly.',
        '## 6. Who will keep the site alive?',
        'A site that never changes loses its appeal. Decide from the start whether you will update the content yourself or prefer to hand it over as part of a maintenance plan.',
        'Got your answers? Send them with the quote form on the Services page and I will reply with a tailored proposal.',
      ],
    },
  },
  {
    slug: 'site-vitrine-ou-boutique-en-ligne',
    date: '2026-10-28',
    title: { fr: 'Site vitrine ou boutique en ligne : que choisir ?', en: 'Business website or online shop: which one?' },
    excerpt: {
      fr: 'Présenter votre activité ou vendre en ligne ? Les différences entre site vitrine et boutique en ligne pour faire le bon choix.',
      en: 'Present your business or sell online? The differences between a business website and an online shop to make the right choice.',
    },
    body: {
      fr: [
        'C’est l’une des premières questions d’un projet web : faut-il un site vitrine ou une boutique en ligne ? Les deux ont leur place, mais ils ne répondent pas au même besoin.',
        '## Le site vitrine : présenter et convaincre',
        'Un site vitrine présente votre activité, vos services, vos réalisations et vos coordonnées. Son rôle est de rassurer un visiteur et de l’amener à vous contacter. Il convient bien aux prestataires de services, aux artisans, aux consultants, aux associations et à toute activité où la vente se conclut lors d’un échange.',
        '## La boutique en ligne : présenter et faire commander',
        'Une boutique en ligne ajoute un catalogue de produits, avec fiches détaillées, prix, disponibilité et prise de commande. Elle demande davantage de travail au quotidien : photos et descriptions de chaque produit, mise à jour des stocks, suivi des commandes et des livraisons.',
        '## Les questions pour trancher',
        'Combien de produits proposez-vous ? Vos prix sont-ils fixes ou établis au cas par cas ? Avez-vous le temps de mettre à jour un catalogue ? Si vos offres sont peu nombreuses ou sur mesure, un site vitrine avec un bon formulaire de contact est souvent le meilleur point de départ.',
        '## Commencer simple, évoluer ensuite',
        'Un site vitrine bien construit peut accueillir plus tard un catalogue. Commencer par l’essentiel permet d’être en ligne rapidement, d’observer ce que demandent vos clients, puis d’investir dans les fonctionnalités vraiment utiles.',
        'Vous hésitez encore ? Décrivez votre activité dans une demande de devis : je vous conseille la formule la plus adaptée.',
      ],
      en: [
        'It is one of the first questions in any web project: do you need a business website or an online shop? Both have their place, but they meet different needs.',
        '## The business website: present and convince',
        'A business website presents your activity, services, work and contact details. Its job is to reassure visitors and get them to contact you. It suits service providers, craftspeople, consultants, associations and any business where the sale is closed in a conversation.',
        '## The online shop: present and take orders',
        'An online shop adds a product catalogue with detailed product pages, prices, availability and ordering. It takes more day-to-day work: photos and descriptions for every product, stock updates, order and delivery follow-up.',
        '## Questions to help you decide',
        'How many products do you sell? Are your prices fixed or set case by case? Do you have time to keep a catalogue up to date? If your offers are few or made to measure, a business website with a good contact form is often the best place to start.',
        '## Start simple, grow later',
        'A well-built business website can take a catalogue later on. Starting with the essentials gets you online quickly, lets you see what your customers ask for, and then invest in the features that really matter.',
        'Still unsure? Describe your business in a quote request and I will recommend the best fit.',
      ],
    },
  },
  {
    slug: 'vendre-avec-whatsapp-et-un-site-web',
    date: '2026-10-28',
    title: { fr: 'Vendre avec WhatsApp et un site web, sans paiement en ligne', en: 'Selling with WhatsApp and a website, no online payment' },
    excerpt: {
      fr: 'Un site web relié à WhatsApp permet de recevoir des commandes et des demandes de devis sans installer de paiement en ligne.',
      en: 'A website linked to WhatsApp lets you receive orders and quote requests without setting up online payment.',
    },
    body: {
      fr: [
        'Beaucoup d’entrepreneurs vendent déjà sur WhatsApp. Un site web ne remplace pas cette relation directe : il la rend plus professionnelle et plus facile à trouver.',
        '## Le principe',
        'Le site présente vos produits ou services de façon claire et durable. Sur chaque offre, un bouton ouvre WhatsApp ou la messagerie du client avec un message déjà rédigé : le nom du produit, la quantité, la demande. Le client vérifie le message, l’envoie, et la discussion continue comme d’habitude.',
        '## Pourquoi c’est efficace',
        'Le client garde un canal qu’il connaît et en qui il a confiance. Vous recevez des demandes complètes, sans avoir à reposer les mêmes questions. Et votre site, lui, travaille pour vous sur Google et sur les réseaux sociaux, même quand vous n’êtes pas disponible.',
        '## Pas de paiement en ligne : un choix assumé',
        'Installer un paiement en ligne a un coût et demande des démarches. Pour de nombreuses activités, il est plus simple de convenir du paiement directement avec le client, au moment de la commande. Le site reste léger, rapide et sans frais de transaction.',
        '## Les bonnes pratiques',
        'Affichez un numéro WhatsApp au format international, vérifiez que le lien ouvre bien votre compte, répondez rapidement, et gardez vos offres à jour sur le site. C’est exactement ainsi que fonctionnent les boutons « Commander » et le formulaire de devis de ce portfolio.',
      ],
      en: [
        'Many entrepreneurs already sell on WhatsApp. A website does not replace that direct relationship: it makes it more professional and easier to find.',
        '## How it works',
        'The site presents your products or services clearly and permanently. Each offer has a button that opens WhatsApp or the customer’s email app with a pre-written message: product name, quantity, request. The customer checks the message, sends it, and the conversation continues as usual.',
        '## Why it works',
        'Customers keep a channel they know and trust. You receive complete requests without asking the same questions again. And your website keeps working for you on Google and social media, even when you are busy.',
        '## No online payment: a deliberate choice',
        'Online payment has a cost and requires paperwork. For many businesses, it is simpler to agree on payment directly with the customer when they order. The site stays light, fast and free of transaction fees.',
        '## Good practice',
        'Show your WhatsApp number in international format, check that the link opens your own account, reply quickly, and keep your offers up to date on the site. That is exactly how the “Order” buttons and the quote form on this portfolio work.',
      ],
    },
  },
  {
    slug: 'etre-trouve-sur-google',
    date: '2026-10-28',
    title: { fr: '5 bases pour que votre entreprise soit trouvée sur Google', en: '5 basics to get your business found on Google' },
    excerpt: {
      fr: 'Titres, contenus utiles, vitesse, Search Console et fiche d’établissement : cinq bases du référencement à mettre en place dès le départ.',
      en: 'Titles, useful content, speed, Search Console and a business profile: five SEO basics to put in place from the start.',
    },
    body: {
      fr: [
        'Être en ligne ne suffit pas : encore faut-il que vos futurs clients vous trouvent. Le référencement naturel demande du temps, mais quelques bases bien posées font une vraie différence.',
        '## 1. Un titre et une description par page',
        'Chaque page doit avoir un titre unique qui dit clairement ce qu’elle propose, et une courte description qui donne envie de cliquer. Ce sont souvent les premiers mots que l’on voit dans les résultats de recherche.',
        '## 2. Des contenus qui répondent aux questions',
        'Décrivez précisément vos services, votre zone d’intervention et les questions que vos clients vous posent. Un texte utile, écrit avec les mots de vos clients, vaut mieux qu’un slogan vague.',
        '## 3. Un site rapide et lisible sur mobile',
        'Des images optimisées, un code léger et une mise en page adaptée aux téléphones améliorent l’expérience des visiteurs, et les moteurs de recherche en tiennent compte.',
        '## 4. Google Search Console',
        'Cet outil gratuit indique quelles pages sont indexées, sur quelles recherches votre site apparaît et quelles erreurs corriger. Envoyez-y votre plan du site (sitemap) dès la mise en ligne.',
        '## 5. Une fiche d’établissement et des liens cohérents',
        'Une fiche Google Business Profile, des réseaux sociaux qui renvoient vers votre site et des coordonnées identiques partout renforcent la confiance des moteurs de recherche comme celle des clients.',
        'Tous les sites que je réalise intègrent ces bases dès le départ : titres, descriptions, plan du site, données structurées et performances.',
      ],
      en: [
        'Being online is not enough: your future customers still need to find you. Search engine optimisation takes time, but a few well-laid basics make a real difference.',
        '## 1. A title and description for every page',
        'Each page needs a unique title that says clearly what it offers, and a short description that makes people want to click. They are often the first words people see in search results.',
        '## 2. Content that answers questions',
        'Describe your services, your service area and the questions customers ask you, precisely. Useful text written in your customers’ words beats a vague slogan.',
        '## 3. A fast site that reads well on mobile',
        'Optimised images, lightweight code and a phone-friendly layout improve the visitor experience, and search engines take that into account.',
        '## 4. Google Search Console',
        'This free tool shows which pages are indexed, which searches your site appears for and which errors to fix. Submit your sitemap as soon as the site goes live.',
        '## 5. A business profile and consistent links',
        'A Google Business Profile, social media accounts that link back to your site, and identical contact details everywhere build trust with search engines and customers alike.',
        'Every site I build includes these basics from the start: titles, descriptions, sitemap, structured data and performance.',
      ],
    },
  },
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

// Engagements affichés sur l'accueil : la manière de travailler, sans chiffres ni références clients.
export const commitments = [
  {
    title: { fr: 'Pensé pour le mobile', en: 'Built for mobile' },
    text: { fr: 'Vos clients vous découvrent d’abord sur leur téléphone : chaque page est conçue pour s’afficher vite et bien sur petit écran.', en: 'Your customers find you on their phone first: every page is designed to load fast and read well on a small screen.' },
  },
  {
    title: { fr: 'Visible sur Google', en: 'Visible on Google' },
    text: { fr: 'Titres, descriptions, plan du site et données structurées sont prévus dès le départ pour faciliter votre référencement.', en: 'Titles, descriptions, sitemap and structured data are planned from day one to help your search ranking.' },
  },
  {
    title: { fr: 'Un seul interlocuteur', en: 'One point of contact' },
    text: { fr: 'De l’analyse du besoin à la mise en ligne, vous échangez avec la même personne, par e-mail ou sur WhatsApp.', en: 'From needs analysis to going live, you deal with the same person, by email or on WhatsApp.' },
  },
  {
    title: { fr: 'Autonome après la livraison', en: 'Independent after delivery' },
    text: { fr: 'Je vous explique comment faire vivre votre site, et je reste disponible pour la maintenance et les évolutions.', en: 'I show you how to keep your site up to date, and remain available for maintenance and improvements.' },
  },
];

// Questions fréquentes (page Services, balisage FAQPage).
export const faq = [
  {
    q: { fr: 'Combien coûte un site web ?', en: 'How much does a website cost?' },
    a: { fr: 'Chaque projet est chiffré sur devis : le prix dépend du nombre de pages, des fonctionnalités (catalogue, commandes, espace client…) et des contenus à produire. Le devis est gratuit et sans engagement.', en: 'Every project is priced on a quote: the price depends on the number of pages, the features (catalogue, ordering, customer area…) and the content to produce. The quote is free and with no commitment.' },
  },
  {
    q: { fr: 'Combien de temps faut-il pour réaliser mon projet ?', en: 'How long will my project take?' },
    a: { fr: 'Le délai dépend de l’ampleur du projet et de la rapidité avec laquelle les contenus (textes, photos, logo) sont fournis. Il est indiqué clairement dans le devis.', en: 'The timeline depends on the size of the project and on how quickly the content (text, photos, logo) is provided. It is stated clearly in the quote.' },
  },
  {
    q: { fr: 'Travaillez-vous avec des clients hors du Bénin ?', en: 'Do you work with clients outside Benin?' },
    a: { fr: 'Oui. Basé à Porto-Novo, je suis ouvert aux projets de clients et de partenaires du monde entier. Les échanges se font par e-mail et sur WhatsApp.', en: 'Yes. Based in Porto-Novo, I welcome projects from clients and partners worldwide. We communicate by email and on WhatsApp.' },
  },
  {
    q: { fr: 'Mon site sera-t-il adapté aux téléphones ?', en: 'Will my site work on phones?' },
    a: { fr: 'Oui. Les pages sont conçues d’abord pour le mobile, puis adaptées aux tablettes et aux ordinateurs.', en: 'Yes. Pages are designed for mobile first, then adapted to tablets and computers.' },
  },
  {
    q: { fr: 'Pourrai-je modifier mon site moi-même ?', en: 'Will I be able to update my site myself?' },
    a: { fr: 'Selon votre besoin, le site peut inclure un outil de gestion des contenus, avec une prise en main expliquée à la livraison. Sinon, je peux m’occuper des mises à jour dans le cadre de la maintenance.', en: 'Depending on your needs, the site can include a content management tool, with a walkthrough at delivery. Otherwise, I can handle updates as part of maintenance.' },
  },
  {
    q: { fr: 'Qui s’occupe de l’hébergement et du nom de domaine ?', en: 'Who handles hosting and the domain name?' },
    a: { fr: 'Je vous conseille sur le choix de l’hébergement et du nom de domaine, puis je configure et publie le site. Les frais d’hébergement et de domaine sont payés au fournisseur et sont distincts de la réalisation.', en: 'I advise you on hosting and the domain name, then set up and publish the site. Hosting and domain fees are paid to the provider and are separate from the build.' },
  },
  {
    q: { fr: 'Comment se passe le paiement ?', en: 'How does payment work?' },
    a: { fr: 'Ce site n’encaisse aucun paiement en ligne. Les modalités de paiement sont convenues directement avec vous et précisées dans le devis.', en: 'This site does not take any online payment. Payment terms are agreed directly with you and stated in the quote.' },
  },
  {
    q: { fr: 'Comment commander le livre « La Mine d’Or des Entrepreneurs » ?', en: 'How do I order the book “La Mine d’Or des Entrepreneurs”?' },
    a: { fr: 'Depuis le catalogue, choisissez « Commander sur WhatsApp » ou « Commander par e-mail » : un message prérempli s’ouvre, et je vous réponds avec le prix et les modalités.', en: 'From the catalogue, choose “Order on WhatsApp” or “Order by email”: a pre-filled message opens, and I reply with the price and details.' },
  },
];
