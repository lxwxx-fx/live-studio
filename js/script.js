/* ============================================================
   LiveStudio — Interactions & Animations
   ============================================================ */

// ---------- Particle system ----------
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.8 + 0.4;
    this.hue = Math.random() > 0.5 ? 180 : 300; // cyan / magenta
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 120 && d > 0.1) {
        this.x += dx / d * 1.2;
        this.y += dy / d * 1.2;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
    ctx.fill();
  }
}

const isMobile = window.innerWidth < 640;
const baseCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);
const PARTICLE_COUNT = Math.min(isMobile ? 50 : 110, Math.max(25, baseCount));
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 110) {
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.12 * (1 - d / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let particlesRunning = true;

function animateParticles() {
  if (!particlesRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
if (prefersReducedMotion) {
  // Dibuja un frame estático, sin animación
  particles.forEach(p => { p.draw(); });
  drawConnections();
} else {
  animateParticles();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    particlesRunning = false;
  } else if (!prefersReducedMotion && !particlesRunning) {
    particlesRunning = true;
    animateParticles();
  }
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  }
});
window.addEventListener('mouseleave', () => {
  mouse.x = null; mouse.y = null;
  const glow = document.querySelector('.cursor-glow');
  if (glow) glow.style.opacity = '0';
});

// ---------- Navbar scroll ----------
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ---------- Mobile menu ----------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));
// Expuesto para el script inline que crea cards dinámicas (members/gallery)
window.__livestudioRevealObserver = io;

// ---------- Counter animation ----------
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const isFloat = String(target).includes('.');
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target * eased;
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-target]');
const counterIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counterEls.forEach(el => counterIo.observe(el));

// ---------- Tilt effect on cards ----------
document.querySelectorAll('.member-card, .stat-card, .gallery-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---------- Newsletter form ----------
const form = document.querySelector('.newsletter');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    const status = form.parentElement.querySelector('.newsletter-status');
    if (!input.value || !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    try { localStorage.setItem('livestudio_newsletter', input.value); } catch (_) {}
    const original = btn.textContent;
    btn.textContent = '✓ Suscrito';
    btn.style.background = 'linear-gradient(135deg, #39ff14, #00f5ff)';
    if (status) status.textContent = '¡Listo! Revisa tu correo para confirmar.';
    input.value = '';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2500);
  });
}

// ---------- Smooth active nav highlight ----------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ---------- Typing effect for hero subtitle (optional enhancement) ----------
// (kept simple: static)

// ---------- Easter egg: konami-ish glow burst on logo click ----------
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
  heroLogo.addEventListener('click', () => {
    heroLogo.animate(
      [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.15) rotate(8deg)' }, { transform: 'scale(1) rotate(0deg)' }],
      { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  });
}
