/* Sky Shortlets — main.js */

(function () {
  'use strict';

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── HAMBURGER ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── EASING ── */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /* ── STATS COUNTER ── */
  function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const pad      = el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0;
    const duration = 1500;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutExpo(progress) * target);
      const display  = pad ? String(value).padStart(pad, '0') : String(value);
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── SCROLL REVEAL + COUNTERS ── */
  const revealEls    = document.querySelectorAll('.reveal');
  const revealRight  = document.querySelectorAll('.reveal-right');
  const counterEls   = document.querySelectorAll('.counter');
  const triggeredCounters = new WeakSet();

  /* Cards inside a grid get a stagger based on their index within the parent */
  function staggerDelay(el, base) {
    const parent = el.parentElement;
    if (!parent) return base;
    const siblings = Array.from(parent.children).filter(c =>
      c.classList.contains('reveal') || c.classList.contains('reveal-right')
    );
    const idx = siblings.indexOf(el);
    return base + (idx > 0 ? idx * 0.1 : 0);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay * 1000);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => {
    /* Assign stagger for grid cards */
    const parent = el.parentElement;
    if (parent && (
      parent.classList.contains('services-grid') ||
      parent.classList.contains('why-grid') ||
      parent.classList.contains('mission-grid') ||
      parent.classList.contains('testimonials-grid')
    )) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.dataset.delay = (idx * 0.1).toFixed(2);
    }
    revealObserver.observe(el);
  });

  /* Process steps — slide from right with 0.15s stagger */
  const processSteps = document.querySelectorAll('.process-step');
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const idx = Array.from(processSteps).indexOf(el);
      setTimeout(() => el.classList.add('revealed'), idx * 150);
      processObserver.unobserve(el);
    });
  }, { threshold: 0.15 });
  processSteps.forEach(el => processObserver.observe(el));

  /* reveal-right (non-process) */
  const revealRightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (!el.classList.contains('process-step')) {
        setTimeout(() => el.classList.add('revealed'), 0);
      }
      revealRightObserver.unobserve(el);
    });
  }, { threshold: 0.15 });
  revealRight.forEach(el => {
    if (!el.classList.contains('process-step')) revealRightObserver.observe(el);
  });

  /* Counter trigger */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (!triggeredCounters.has(el)) {
        triggeredCounters.add(el);
        runCounter(el);
      }
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.3 });
  counterEls.forEach(el => counterObserver.observe(el));

  /* ── SCROLL TO TOP ── */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── FORM VALIDATION ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#E8901A';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ── INTRO CHIP IMAGES ── */
  document.querySelectorAll('.intro-chip').forEach(img => {
    if (img.complete) {
      setTimeout(() => img.classList.add('loaded'), 300);
    } else {
      img.addEventListener('load', () => {
        setTimeout(() => img.classList.add('loaded'), 300);
      });
    }
  });

})();
