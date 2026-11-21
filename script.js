(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    }
    [].concat(children).forEach(c => c && node.append(c));
    return node;
  };

  // Image with a styled placeholder if the file is missing.
  const imgOrPlaceholder = (src, alt, label) => {
    const fallback = () => el('div', { class: 'img-placeholder' }, [
      el('span', { class: 'ph-icon', text: '🎓' }),
      el('span', { text: label })
    ]);
    if (!src) return fallback();
    const img = el('img', { src, alt, loading: 'lazy' });
    img.addEventListener('error', () => img.replaceWith(fallback()), { once: true });
    return img;
  };

  /* ---------- Year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  $('.theme-toggle').addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const links = $('#nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Projects ---------- */
  const projectsGrid = $('#projects-grid');
  PROJECTS.forEach(p => {
    const actions = el('div', { class: 'project-links' });
    if (p.live) actions.append(el('a', { href: p.live, target: '_blank', rel: 'noopener', class: 'btn btn-small btn-primary', text: 'Live demo' }));
    if (p.code) actions.append(el('a', { href: p.code, target: '_blank', rel: 'noopener', class: 'btn btn-small btn-ghost', text: 'Code' }));

    const media = p.image ? el('div', { class: 'project-media' }, imgOrPlaceholder(p.image, p.title, p.title)) : null;

    projectsGrid.append(el('article', { class: 'card project' }, [
      media,
      el('div', { class: 'project-body' }, [
        el('h3', { text: p.title }),
        el('p', { text: p.description }),
        el('ul', { class: 'tags' }, (p.tags || []).map(t => el('li', { text: t }))),
        actions.children.length ? actions : null
      ])
    ]));
  });

  /* ---------- Certificates ---------- */
  const certs = CERTIFICATES;
  const certGrid = $('#cert-grid');
  const filterBar = $('#cert-filters');
  $('#cert-count').textContent = certs.length;

  const categories = ['All', ...new Set(certs.map(c => c.category).filter(Boolean))];
  let active = 'All';

  const renderFilters = () => {
    filterBar.replaceChildren(...categories.map(cat => {
      const b = el('button', { class: 'filter' + (cat === active ? ' active' : ''), role: 'tab', 'aria-selected': String(cat === active), text: cat });
      b.addEventListener('click', () => { active = cat; renderFilters(); renderCerts(); });
      return b;
    }));
    filterBar.hidden = categories.length <= 2;
  };

  const renderCerts = () => {
    const list = certs.filter(c => active === 'All' || c.category === active);
    if (!list.length) {
      certGrid.replaceChildren(el('p', { class: 'empty', text: 'No certificates yet. Add some in data.js.' }));
      return;
    }
    certGrid.replaceChildren(...list.map(c => {
      const thumb = el('button', { class: 'cert-thumb', 'aria-label': 'Enlarge ' + c.title },
        imgOrPlaceholder(c.image, c.title + ' certificate', 'Add image: ' + c.image));
      thumb.addEventListener('click', () => openLightbox(c));

      const meta = el('div', { class: 'cert-body' }, [
        el('h3', { text: c.title }),
        el('p', { class: 'cert-meta', text: [c.issuer, c.date].filter(Boolean).join(' · ') }),
        c.verify ? el('a', { class: 'verify', href: c.verify, target: '_blank', rel: 'noopener', text: 'Verify ↗' }) : null
      ]);
      return el('article', { class: 'card cert' }, [thumb, meta]);
    }));
  };

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lightbox-img');
  const lbCap = $('#lightbox-caption');
  let lastFocus = null;

  function openLightbox(c) {
    lastFocus = document.activeElement;
    lbImg.hidden = false;
    lbImg.onerror = () => { lbImg.hidden = true; lbCap.textContent = 'Image not added yet: ' + c.image; };
    lbImg.src = c.image;
    lbImg.alt = c.title + ' certificate';
    lbCap.textContent = [c.title, c.issuer, c.date].filter(Boolean).join(' — ');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lightbox-close').focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lightbox-close')) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });

  renderFilters();
  renderCerts();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section').forEach(s => { s.classList.add('reveal'); io.observe(s); });
  }
})();
