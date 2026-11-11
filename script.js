/* ═══════════════════════════════════════════════════════════════════
   GAMBOA'S CASTLE JOYERÍA — script.js
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR: scroll effect ──────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const links    = document.getElementById('navLinks');

  if (!navbar) return;

  // Scrolled state
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll while menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ── REVEAL ON SCROLL (IntersectionObserver) ───────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for sibling elements
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.reveal')]
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 120;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ── HERO: initial reveal ───────────────────────────────────────── */
(function initHeroReveal() {
  const heroContent = document.querySelector('.hero .reveal');
  if (!heroContent) return;

  // Trigger hero after a short delay
  setTimeout(() => {
    heroContent.classList.add('visible');
  }, 300);
})();

/* ── VIDEO: lazy-load YouTube on click ─────────────────────────── */
(function initVideo() {
  const placeholder = document.getElementById('videoPlaceholder');
  const iframe      = document.getElementById('youtubeIframe');

  if (!placeholder || !iframe) return;

  const activateVideo = () => {
    const src = iframe.getAttribute('data-src');
    if (src) {
      iframe.src = src;
      iframe.classList.remove('hidden');
      placeholder.style.display = 'none';
    }
  };

  placeholder.addEventListener('click', activateVideo);
  placeholder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateVideo();
    }
  });
})();

/* ── BOLETÍN: email validation & subscription ───────────────────── */
(function initBoletin() {
  const input    = document.getElementById('emailInput');
  const btn      = document.getElementById('subscribeBtn');
  const feedback = document.getElementById('emailFeedback');

  if (!input || !btn || !feedback) return;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.className = `boletin-feedback ${type}`;
  };

  const resetFeedback = () => {
    feedback.textContent = '';
    feedback.className = 'boletin-feedback';
  };

  input.addEventListener('input', resetFeedback);

  btn.addEventListener('click', () => {
    const email = input.value.trim();

    // Validation
    if (!email) {
      setFeedback('Por favor ingresa tu correo electrónico.', 'error');
      input.focus();
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setFeedback('Ingresa un correo electrónico válido.', 'error');
      input.focus();
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Simulate API call (replace with real endpoint)
    setTimeout(() => {
      setFeedback(`¡Bienvenida, ${email}! Te hemos enviado una confirmación. 💌`, 'success');
      input.value = '';
      btn.textContent = '¡Suscrito! ✓';
      btn.style.background = '#4CAF50';

      // Reset after 4s
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Suscribirme';
        btn.style.background = '';
        resetFeedback();
      }, 4000);
    }, 1200);
  });

  // Allow Enter key to submit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
})();

/* ── SMOOTH SCROLL for anchor links ─────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── CARD hover: keyboard accessible ──────────────────────────────── */
(function initCards() {
  document.querySelectorAll('.card[tabindex], .service-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();

/* ── WHATSAPP button: show after scroll ─────────────────────────── */
(function initWhatsApp() {
  const btn = document.getElementById('whatsappBtn');
  if (!btn) return;

  // Hide initially
  btn.style.opacity = '0';
  btn.style.transform = 'scale(0.8)';
  btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  const show = () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.8)';
    }
  };

  window.addEventListener('scroll', show, { passive: true });
  show();
})();

/* ── NUMBER counter animation for stats ──────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const animateCounter = (el) => {
    const raw    = el.textContent.trim();
    const number = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');

    if (isNaN(number)) return;

    let start   = 0;
    const end   = number;
    const dur   = 1500;
    const step  = dur / end;
    let current = 0;
    let raf;

    const tick = () => {
      current += end / (dur / 16);
      if (current >= end) {
        el.textContent = end + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
})();

/* ── COLECCIÓN: filtros por categoría ───────────────────────────── */
(function initFiltros() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.producto-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.getAttribute('data-filter');

      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtrar tarjetas con animación suave
      cards.forEach((card, i) => {
        const cat = card.getAttribute('data-categoria');
        const mostrar = filtro === 'all' || cat === filtro;

        if (mostrar) {
          card.classList.remove('hidden');
          // Escalonar aparición
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });

  // Estado inicial: todas visibles
  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
})();

(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Fallback
  if (document.readyState !== 'loading') {
    document.body.style.opacity = '1';
  }
})();
