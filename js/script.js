/* ============================================================
   LiveStudio — Interacciones y animaciones
   ============================================================ */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const TIKTOK_URL = 'https://www.tiktok.com/@live.studio55?_r=1&_t=ZS-9Ac0NJxIgC5';

  // Escape básico para textos dinámicos
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  /* ============================================================
     DATOS EDITABLES — EQUIPO
     ------------------------------------------------------------
     • photo: ruta de la foto en assets/ (ideal: cuadrada, ~500x500).
              Si el archivo no existe, se muestran las iniciales.
     • tiktok / instagram: URL completa. Si queda '', el icono no
       se muestra.
     ============================================================ */
  const members = [
    {
      name: 'Fernando Barreto',
      role: 'Gerente General',
      handle: '@fernandobarreto_6',
      initials: 'FB',
      grad: 'linear-gradient(135deg,#2ee6ff,#7c5cff)',
      photo: 'assets/fernando.jpg',
      tiktok: 'https://www.tiktok.com/@fernandobarreto_6',
      instagram: 'https://www.instagram.com/fernando.barreto06'
    },
    {
      name: 'Luis Diaz',
      role: 'DJ Profesional',
      handle: '@luissss.6',
      initials: 'LD',
      grad: 'linear-gradient(135deg,#ff2e88,#7c5cff)',
      photo: 'assets/luis.jpg',
      tiktok: 'https://www.tiktok.com/@luissss.6',
      instagram: 'https://www.instagram.com/diazluis.6'
    },
    {
      name: 'Rogger Gonzales',
      role: 'Desarrollador y Diseñador',
      handle: '@lxw.m7x',
      initials: 'RG',
      grad: 'linear-gradient(135deg,#c8ff4d,#2ee6ff)',
      photo: 'assets/rogger.jpg',
      tiktok: 'https://www.tiktok.com/@lxw.m7x',
      instagram: 'https://www.instagram.com/rxgxx.m7x'
    },
    {
      name: 'Robert Cajusol',
      role: 'Animador y Productor',
      handle: '@cajusolrobert',
      initials: 'RC',
      grad: 'linear-gradient(135deg,#ff2e88,#ff8a3d)',
      photo: 'assets/robert.jpg',
      tiktok: 'https://www.tiktok.com/@robert.cajusol?_r=1',
      instagram: 'https://www.instagram.com/cajusolrobert?cplk=Z3p2a2l1OXRpYzVm'
    },
    {
      name: 'Cristhian Chimoy',
      role: 'Animador y Productor',
      handle: '@cristhian19xd',
      initials: 'CC',
      grad: 'linear-gradient(135deg,#7c5cff,#2ee6ff)',
      photo: 'assets/cristhian.jpg',
      tiktok: 'https://www.tiktok.com/@cristhian19xd',
      instagram: 'https://www.instagram.com/cristhian19chx'
    },
    {
      name: 'Daniel Paico',
      role: 'Animador y Productor',
      handle: '',
      initials: 'DP',
      grad: 'linear-gradient(135deg,#2ee6ff,#c8ff4d)',
      photo: '',
      tiktok: '',
      instagram: ''
    }
  ];

  /* ============================================================
     DATOS EDITABLES — GALERÍA
     ============================================================ */
  const galleryItems = [
    { src: 'assets/gallery/live.jpg',   title: 'Live #247 — récord de viewers', tag: 'En vivo',    alt: 'Streamer frente a varios monitores durante un directo en el estudio' },
    { src: 'assets/gallery/bts.jpg',    title: 'Behind the scenes',             tag: 'Backstage',  alt: 'Cámara de cine profesional en el estudio con luces neón' },
    { src: 'assets/gallery/collab.jpg', title: 'Collab con invitados',          tag: 'Collab',     alt: 'Dos micrófonos de estudio enfrentados con iluminación rosa y cian' },
    { src: 'assets/gallery/setup.jpg',  title: 'Setup del estudio',             tag: 'Setup',      alt: 'Escritorio con monitores, teclado y tiras LED cian y magenta' },
    { src: 'assets/gallery/viral.jpg',  title: 'Momento viral',                 tag: 'Viral',      alt: 'Público grabando con celulares bajo luces de escenario' },
    { src: 'assets/gallery/team.jpg',   title: 'Equipo completo',               tag: 'Equipo',     alt: 'Seis creadores de espaldas frente a una pared de pantallas iluminada' }
  ];

  const ICONS = {
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'
  };

  /* ============================================================
     RENDER — EQUIPO
     ============================================================ */
  const membersGrid = $('#membersGrid');

  members.forEach((m, i) => {
    const card = document.createElement('article');
    card.className = 'member-card card spotlight';
    card.style.setProperty('--g', m.grad);
    card.style.setProperty('--d', `${(i % 3) * 90}ms`);

    const socials = [];
    if (m.tiktok) {
      socials.push(
        `<a href="${esc(m.tiktok)}" target="_blank" rel="noopener" data-net="tiktok" aria-label="TikTok de ${esc(m.name)}">${ICONS.tiktok}</a>`
      );
    }
    if (m.instagram) {
      socials.push(
        `<a href="${esc(m.instagram)}" target="_blank" rel="noopener" data-net="instagram" aria-label="Instagram de ${esc(m.name)}">${ICONS.instagram}</a>`
      );
    }

    card.innerHTML = `
      <span class="member-card__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <div class="avatar" aria-hidden="true">
        <span class="avatar__in">
          <span class="avatar__initials">${esc(m.initials)}</span>
          ${m.photo ? `<img src="${esc(m.photo)}" alt="" width="100" height="100" loading="lazy" />` : ''}
        </span>
      </div>
      <h3 class="member-card__name">${esc(m.name)}</h3>
      <p class="member-card__role">${esc(m.role)}</p>
      <p class="member-card__handle${m.handle ? '' : ' is-soon'}">${m.handle ? esc(m.handle) : '✦ Próximamente'}</p>
      <div class="member-socials">${socials.join('')}</div>
    `;

    // Si la foto no existe, se quita y quedan las iniciales
    const img = $('img', card);
    if (img) img.addEventListener('error', () => img.remove(), { once: true });

    membersGrid.appendChild(card);
  });

  /* ============================================================
     RENDER — GALERÍA
     ============================================================ */
  const galleryGrid = $('#galleryGrid');

  galleryItems.forEach((g, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `g-item g-item--${'abcdef'[i] || 'a'}`;
    btn.dataset.index = String(i);
    btn.style.setProperty('--d', `${(i % 2) * 90}ms`);
    btn.setAttribute('aria-label', `Ampliar imagen: ${g.title}`);
    btn.innerHTML = `
      <img src="${esc(g.src)}" alt="${esc(g.alt)}" width="1280" height="715" ${i > 0 ? 'loading="lazy"' : ''} />
      <span class="g-item__shade" aria-hidden="true"></span>
      <span class="g-item__meta">
        <span class="g-item__tag">${esc(g.tag)}</span>
        <span class="g-item__title">${esc(g.title)}</span>
      </span>
      <span class="g-item__zoom" aria-hidden="true">${ICONS.zoom}</span>
    `;
    galleryGrid.appendChild(btn);
  });

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  let revealTargets = $$('[data-reveal], .member-card, .g-item');

  function checkReveals() {
    if (!revealTargets.length) return;
    const trigger = window.innerHeight * 0.98;
    revealTargets = revealTargets.filter((el) => {
      const rect = el.getBoundingClientRect();
      const visible = rect.top < trigger && rect.bottom > 0;
      if (visible) {
        el.classList.add('in');
        return false;
      }
      return true;
    });
  }

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add('in'));
    revealTargets = [];
  } else {
    let revealRaf = null;
    const scheduleReveal = () => {
      if (revealRaf) return;
      revealRaf = requestAnimationFrame(() => {
        checkReveals();
        revealRaf = null;
      });
    };
    window.addEventListener('scroll', scheduleReveal, { passive: true });
    window.addEventListener('resize', scheduleReveal);
    window.addEventListener('load', scheduleReveal);
    checkReveals();
  }

  /* ============================================================
     CONTADORES
     ============================================================ */
  const COUNTER_DURATION = 1800;
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function runCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);

    const format = (value) => {
      const fixed = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');
      return fixed + suffix;
    };

    if (reduceMotion) {
      el.textContent = format(target);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / COUNTER_DURATION);
      el.textContent = format(target * easeOutExpo(progress));
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = format(target);
    };
    requestAnimationFrame(tick);
  }

  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterIO.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ============================================================
     HEADER: estado, progreso y navegación activa
     ============================================================ */
  const header = $('#siteHeader');
  const progressBar = $('#scrollProgress');
  const navLinks = $$('.nav__link');
  const sections = $$('main section[id]');
  const toTop = $('#toTop');

  let scrollTicking = false;

  function onScroll() {
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-scrolled', y > 24);
    if (progressBar) progressBar.style.setProperty('--p', docHeight > 0 ? Math.min(1, y / docHeight) : 0);
    if (toTop) toTop.classList.toggle('is-visible', y > 620);

    // Sección activa
    const probe = y + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 130;
    let current = sections[0] ? sections[0].id : '';
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     MENÚ MÓVIL
     ============================================================ */
  const menuBtn = $('#menuBtn');
  const mobileNav = $('#mobileNav');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.setAttribute('aria-hidden', String(!open));
    if (open) {
      const first = $('.m-link', mobileNav);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 260);
    }
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('a', mobileNav).forEach((a) => a.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ============================================================
     CURSOR: glow + spotlight + tilt + magnético + parallax
     ============================================================ */
  if (finePointer && !reduceMotion) {
    const glow = $('.cursor-glow');
    let glowX = 0, glowY = 0, glowRaf = null;

    window.addEventListener('pointermove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      if (glow && glow.style.opacity !== '1') glow.style.opacity = '1';
      if (!glowRaf) {
        glowRaf = requestAnimationFrame(() => {
          if (glow) glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
          glowRaf = null;
        });
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      if (glow) glow.style.opacity = '0';
    });

    // Spotlight en tarjetas
    $$('.spotlight').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });

    // Tilt 3D en tarjetas del equipo
    $$('.member-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', `${px * 7}deg`);
        card.style.setProperty('--rx', `${-py * 6}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });

    // Botones magnéticos
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.translate = `${x * 7}px ${y * 5}px`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.translate = '0px 0px';
      });
    });

    // Parallax suave del arte del hero
    const hero = $('#hero');
    const heroArt = $('#heroArt');
    if (hero && heroArt) {
      let artRaf = null;
      hero.addEventListener('pointermove', (e) => {
        if (window.innerWidth < 1000) return;
        if (artRaf) return;
        artRaf = requestAnimationFrame(() => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          heroArt.style.setProperty('--ry', `${px * 10}deg`);
          heroArt.style.setProperty('--rx', `${-py * 8}deg`);
          artRaf = null;
        });
      }, { passive: true });
      hero.addEventListener('pointerleave', () => {
        heroArt.style.setProperty('--ry', '0deg');
        heroArt.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ============================================================
     PARTÍCULAS
     ============================================================ */
  const canvas = $('#particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let width = 0, height = 0;
    let particles = [];
    let pointer = { x: null, y: null };
    let running = true;
    let rafId = null;

    function sizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.5 + 0.4,
        hue: Math.random() > 0.55 ? 187 : 330,
        alpha: Math.random() * 0.45 + 0.15
      };
    }

    function initParticles() {
      const count = window.innerWidth < 640
        ? 34
        : Math.min(80, Math.max(42, Math.round((width * height) / 24000)));
      particles = Array.from({ length: count }, makeParticle);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.x !== null) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 0.1) {
            p.x += (dx / dist) * 0.9;
            p.y += (dy / dist) * 0.9;
          }
        }

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
        ctx.fill();
      }

      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(46, 230, 255, ${0.1 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!running) return;
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (reduceMotion) {
        drawFrame();
        return;
      }
      if (!running) { running = true; loop(); }
      else if (rafId === null) loop();
    }

    sizeCanvas();
    initParticles();

    if (reduceMotion) {
      drawFrame();
    } else {
      loop();
    }

    window.addEventListener('resize', () => {
      sizeCanvas();
      initParticles();
      if (reduceMotion) drawFrame();
    });

    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      pointer.x = null;
      pointer.y = null;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      } else {
        start();
      }
    });
  }

  /* ============================================================
     LIGHTBOX DE GALERÍA
     ============================================================ */
  const lightbox = $('#lightbox');
  const lbImage = $('#lbImage');
  const lbCaption = $('#lbCaption');
  const lbCounter = $('#lbCounter');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');
  const galleryButtons = $$('.g-item');
  let lbIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const item = galleryItems[lbIndex];
    if (!item) return;
    lbImage.src = item.src;
    lbImage.alt = item.alt;
    lbCaption.textContent = item.title;
    lbCounter.textContent = `${String(lbIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;

    // Precarga vecinos
    [lbIndex + 1, lbIndex - 1].forEach((i) => {
      const next = galleryItems[(i + galleryItems.length) % galleryItems.length];
      if (next) { const img = new Image(); img.src = next.src; }
    });
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lbIndex = index;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    const closeBtn = $('.lb-btn--close', lightbox);
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  }

  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    renderLightbox();
  }

  galleryButtons.forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(parseInt(btn.dataset.index, 10)));
  });

  if (lightbox) {
    $$('[data-lb-close]', lightbox).forEach((el) => el.addEventListener('click', closeLightbox));
    if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
    if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ============================================================
     NEWSLETTER
     ============================================================ */
  const form = $('.newsletter');
  if (form) {
    const input = $('#newsletterEmail', form);
    const button = $('button', form);
    const label = $('.btn__label', button);
    const status = $('.newsletter-status');
    let resetTimer = null;

    const showStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle('is-error', isError);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        showStatus('Escribe un correo válido para continuar.', true);
        input.focus();
        input.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 320, easing: 'ease-in-out' }
        );
        return;
      }

      try { localStorage.setItem('livestudio_newsletter', value); } catch (_) { /* modo privado */ }

      showStatus('¡Listo! Te avisaremos de cada live.');
      button.classList.add('is-done');
      if (label) label.textContent = 'Suscrito';
      input.value = '';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        button.classList.remove('is-done');
        if (label) label.textContent = 'Suscribirme';
      }, 2800);
    });
  }

  /* ============================================================
     DETALLE: pulso del logo del hero
     ============================================================ */
  const heroCard = $('.hero-art__logo');
  if (heroCard && !reduceMotion) {
    heroCard.addEventListener('click', () => {
      heroCard.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.07) rotate(3deg)' },
          { transform: 'scale(1) rotate(0deg)' }
        ],
        { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    });
  }
})();
