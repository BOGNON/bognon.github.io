// Comportements du site : menu mobile, animations, formulaires e-mail / WhatsApp,
// filtres du catalogue, service worker. Le site reste utilisable sans JavaScript.
(() => {
  'use strict';
  const doc = document.documentElement;
  const root = doc.dataset.root || './';
  const i18n = document.querySelector('template[data-i18n]')?.dataset || {};

  // ------------------------------------------------ Menu mobile
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  }

  // ------------------------------------------------ Apparition au défilement
  const reveals = document.querySelectorAll('.reveal');
  // Variantes : médias qui glissent, cartes qui s'agrandissent légèrement.
  document.querySelectorAll('.feature__media, .about__media').forEach((el) => { el.dataset.reveal = el.dataset.reveal || 'left'; });
  document.querySelectorAll('.feature__text, .about__text').forEach((el) => { el.dataset.reveal = el.dataset.reveal || 'right'; });
  document.querySelectorAll('.card.reveal, .project-card.reveal').forEach((el) => { el.dataset.reveal = el.dataset.reveal || 'zoom'; });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    doc.classList.add('can-reveal');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  }

  // ------------------------------------------------ Barre de progression et retour en haut
  const toTop = document.querySelector('[data-to-top]');
  if (toTop) toTop.hidden = false;
  let ticking = false;
  const onScroll = () => {
    const max = doc.scrollHeight - window.innerHeight;
    doc.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    if (toTop) toTop.classList.toggle('is-shown', window.scrollY > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ------------------------------------------------ Halo des cartes qui suit le pointeur
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  // ------------------------------------------------ Filtres du catalogue
  const filters = document.querySelector('[data-filters]');
  const list = document.querySelector('[data-filter-list]');
  if (filters && list) {
    filters.hidden = false;
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const value = btn.dataset.filter;
      filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      list.querySelectorAll('[data-cat]').forEach((card) => {
        card.hidden = value !== 'all' && card.dataset.cat !== value;
      });
    });
  }

  // ------------------------------------------------ Formulaires : e-mail ou WhatsApp prérempli
  const forms = document.querySelectorAll('form[data-compose]');
  const params = new URLSearchParams(location.search);

  forms.forEach((form) => {
    const select = form.querySelector('select[name="service"]');
    const pre = params.get('service');
    if (select && pre && [...select.options].some((o) => o.value === pre)) select.value = pre;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const channel = (e.submitter && e.submitter.value) || 'email';
      const status = form.querySelector('[data-form-status]');
      const lines = [];
      for (const el of form.elements) {
        if (!el.name || el.name === 'channel' || !el.value.trim()) continue;
        const label = form.querySelector(`label[for="${el.id}"]`);
        const name = label ? label.childNodes[0].textContent.trim() : el.name;
        const value = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value.trim();
        lines.push(el.name === 'message' ? `\n${name} :\n${value}` : `${name} : ${value}`);
      }
      const intro = `${form.dataset.greeting}${form.dataset.intro}`;
      const body = `${intro}\n\n${lines.join('\n')}\n`;
      const nameField = form.elements.namedItem('nom');
      const subject = `${form.dataset.subject}${nameField && nameField.value ? ' : ' + nameField.value.trim() : ''}`;
      let url;
      if (channel === 'whatsapp') {
        url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(body)}`;
        const win = window.open(url, '_blank', 'noopener');
        if (!win) location.href = url;
      } else {
        url = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;
        location.href = url;
      }
      form.dataset.lastUrl = url;
      if (status) {
        const fr = doc.lang === 'fr';
        status.textContent = channel === 'whatsapp'
          ? (fr ? 'WhatsApp s’ouvre avec votre message. Vérifiez-le puis appuyez sur Envoyer.' : 'WhatsApp is opening with your message. Check it, then tap Send.')
          : (fr ? 'Votre messagerie s’ouvre avec votre message. Vérifiez-le puis envoyez-le.' : 'Your email app is opening with your message. Check it, then send it.');
        if (!navigator.onLine) status.textContent += fr ? ' Vous êtes hors connexion : l’envoi se fera quand le réseau reviendra.' : ' You are offline: the message will go out once you are back online.';
      }
    });
  });

  // Les liens « Demander un devis » de la page Services présélectionnent le service sans recharger.
  document.querySelectorAll('[data-pick-service]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const select = document.querySelector('form[data-compose] select[name="service"]');
      if (!select) return;
      e.preventDefault();
      select.value = a.dataset.pickService;
      history.replaceState(null, '', `?service=${a.dataset.pickService}#devis`);
      document.getElementById('devis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      select.focus({ preventScroll: true });
    });
  });

  // ------------------------------------------------ Messages (mise à jour, hors connexion)
  const toast = document.querySelector('[data-toast]');
  const toastText = toast && toast.querySelector('[data-toast-text]');
  const toastAction = toast && toast.querySelector('[data-toast-action]');
  let hideTimer;
  function showToast(message, action) {
    if (!toast) return;
    toastText.textContent = message;
    toastAction.hidden = !action;
    toastAction.onclick = action || null;
    toast.hidden = false;
    clearTimeout(hideTimer);
    if (!action) hideTimer = setTimeout(() => { toast.hidden = true; }, 6000);
  }
  window.addEventListener('offline', () => showToast(i18n.offline));

  // ------------------------------------------------ Service worker (PWA)
  // Ne recharger que si une ancienne version contrôlait déjà la page (pas au tout premier chargement).
  const hadController = 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register(`${root}sw.js`);
        const offerUpdate = (worker) => showToast(i18n.update, () => worker.postMessage({ type: 'SKIP_WAITING' }));
        if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker && worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(worker);
          });
        });
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (reloading || !hadController) return;
          reloading = true;
          location.reload();
        });
      } catch (err) {
        console.warn('Service worker non enregistré :', err);
      }
    });
  }
})();
