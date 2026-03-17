/* Talamore Group — Main JS */

// ── Scroll-triggered animations ──────────────────────────────────────────────
const animatedEls = document.querySelectorAll('.animate-fade-in, .animate-fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

animatedEls.forEach((el) => observer.observe(el));

// Trigger hero animation immediately (it's in the viewport on load)
document.querySelectorAll('.hero .animate-fade-up').forEach((el) => {
  setTimeout(() => el.classList.add('visible'), 200);
});

// ── Header scroll effect ──────────────────────────────────────────────────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu toggle ────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Smooth scroll for anchor links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Animated stat counters ────────────────────────────────────────────────────
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.stat-number');
      if (!numEl) return;
      const supEl = numEl.querySelector('sup');
      const suffix = supEl ? supEl.textContent : '';
      const raw = numEl.textContent.replace(suffix, '').trim();
      const target = parseInt(raw, 10);
      if (!isNaN(target)) {
        numEl.textContent = '0';
        if (supEl) {
          const newSup = document.createElement('sup');
          newSup.textContent = suffix;
          numEl.appendChild(newSup);
        }
        animateCounter(numEl, target, suffix);
      }
      statObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-item').forEach((el) => statObserver.observe(el));
