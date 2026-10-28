// Fonctions utilitaires du générateur.

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const TODO_RE = /\{\{TODO:\s*([^}]*)\}\}/g;
export const hasTodo = (s) => typeof s === 'string' && /\{\{TODO:/.test(s);

// Liste des champs « À COMPLÉTER » rencontrés pendant le build.
export const todoLog = [];

// Texte -> HTML échappé, avec les {{TODO: ...}} rendus en encadré visible.
export function text(s, lang, where = '') {
  if (s == null) return '';
  const label = lang === 'en' ? 'TO COMPLETE' : 'À COMPLÉTER';
  return esc(s).replace(TODO_RE, (_, what) => {
    todoLog.push({ where, lang, what: what.trim() });
    return `<mark class="todo"><span class="todo__label">${label}</span> ${what.trim()}</mark>`;
  });
}

// Texte brut sans les marqueurs (pour les métadonnées).
export const plain = (s) => (s == null ? '' : String(s).replace(TODO_RE, '').replace(/\s+/g, ' ').trim());

// Chemin relatif entre deux pages exprimées comme dossiers ('' = racine, 'a-propos/', 'en/about/').
export function rel(from, to) {
  const depth = from.split('/').filter(Boolean).length;
  const up = '../'.repeat(depth);
  const res = up + to;
  return res === '' ? './' : res;
}

export const pick = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) && ('fr' in v || 'en' in v) ? v[lang] : v);

export const waLink = (number, message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const mailLink = (email, subject, body = '') =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

export function formatDate(iso, lang) {
  const d = new Date(iso + 'T12:00:00Z');
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}
