/* ═══════════════════════════════════════════════════════
   ARUN TOMAR – SEO PORTFOLIO  |  script.js
   - Nav scroll behaviour
   - Mobile menu toggle
   - Intersection Observer animations
   - Counter animation
   - Chart.js traffic graphs
   - Contact form handling
   - FAB visibility
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV SCROLL ─────────────────────────────── */
  const nav = document.getElementById('nav');
  const fab = document.querySelector('.fab-cta');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (fab) fab.classList.toggle('visible', y > 400);
  }, { passive: true });


  /* ── HAMBURGER MENU ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ── REVEAL ON SCROLL ───────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .portfolio-card, .testi-card, .blog-card, ' +
    '.case-card, .about-inner, .pricing-card, .section-header'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  /* ── COUNTER ANIMATION ──────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1600;
      const start  = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));


  /* ── CHARTS ─────────────────────────────────── */

  // Shared chart defaults
  function chartDefaults() {
    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0e1530',
          borderColor: '#2b7fff',
          borderWidth: 1,
          titleColor: '#e8edf8',
          bodyColor: '#8fa3cc',
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} visitors`
          }
        }
      },
      scales: {
        x: {
          grid:  { color: 'rgba(30,45,85,0.6)' },
          ticks: { color: '#5a72a0', font: { size: 11, family: 'DM Sans' } }
        },
        y: {
          grid:  { color: 'rgba(30,45,85,0.6)' },
          ticks: { color: '#5a72a0', font: { size: 11, family: 'DM Sans' } }
        }
      },
      animation: { duration: 1200, easing: 'easeOutCubic' }
    };
  }

  // Gradient helper
  function makeGradient(ctx, colorTop, colorBot) {
    const grad = ctx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, colorTop);
    grad.addColorStop(1, colorBot);
    return grad;
  }

  // ── Chart 1: Dental Clinic ────────────────────
  const c1 = document.getElementById('chart1');
  if (c1 && window.Chart) {
    const ctx1 = c1.getContext('2d');
    const grad1 = makeGradient(ctx1, 'rgba(43,127,255,0.35)', 'rgba(43,127,255,0.02)');

    new window.Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Organic Traffic',
          data: [190, 220, 310, 480, 640, 820, 960, 1080, 1230, 1380, 1510, 1640],
          borderColor: '#2b7fff',
          backgroundColor: grad1,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#2b7fff',
          pointBorderColor: '#05091a',
          pointBorderWidth: 2,
          tension: 0.45,
          fill: true
        }]
      },
      options: chartDefaults()
    });
  }

  // ── Chart 2: Home Decor ───────────────────────
  const c2 = document.getElementById('chart2');
  if (c2 && window.Chart) {
    const ctx2 = c2.getContext('2d');
    const grad2 = makeGradient(ctx2, 'rgba(13,242,200,0.3)', 'rgba(13,242,200,0.02)');

    new window.Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Organic Traffic',
          data: [320, 410, 560, 780, 1020, 1280, 1490, 1650],
          borderColor: '#0df2c8',
          backgroundColor: grad2,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#0df2c8',
          pointBorderColor: '#05091a',
          pointBorderWidth: 2,
          tension: 0.45,
          fill: true
        }]
      },
      options: chartDefaults()
    });
  }

  /* ── LOAD CHART.JS IF NOT PRESENT ───────────── */
  function loadChartJs() {
    if (typeof window.Chart !== 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = () => {
      // Re-initialise charts after Chart.js loads
      const loadEvent = new Event('chartjsLoaded');
      window.dispatchEvent(loadEvent);
    };
    document.head.appendChild(script);
  }

  // Try loading Chart.js
  if (typeof window.Chart === 'undefined') {
    loadChartJs();
    window.addEventListener('chartjsLoaded', () => {
      // Trigger chart init
      const c1 = document.getElementById('chart1');
      const c2 = document.getElementById('chart2');
      if (c1) initChart1(c1);
      if (c2) initChart2(c2);
    });
  }

  function initChart1(c) {
    const ctx = c.getContext('2d');
    const grad = makeGradient(ctx, 'rgba(43,127,255,0.35)', 'rgba(43,127,255,0.02)');
    new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{ label:'Organic Traffic', data:[190,220,310,480,640,820,960,1080,1230,1380,1510,1640], borderColor:'#2b7fff', backgroundColor:grad, borderWidth:2.5, pointRadius:4, pointBackgroundColor:'#2b7fff', pointBorderColor:'#05091a', pointBorderWidth:2, tension:0.45, fill:true }]
      },
      options: chartDefaults()
    });
  }

  function initChart2(c) {
    const ctx = c.getContext('2d');
    const grad = makeGradient(ctx, 'rgba(13,242,200,0.3)', 'rgba(13,242,200,0.02)');
    new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
        datasets: [{ label:'Organic Traffic', data:[320,410,560,780,1020,1280,1490,1650], borderColor:'#0df2c8', backgroundColor:grad, borderWidth:2.5, pointRadius:4, pointBackgroundColor:'#0df2c8', pointBorderColor:'#05091a', pointBorderWidth:2, tension:0.45, fill:true }]
      },
      options: chartDefaults()
    });
  }


  /* ── CONTACT FORM ───────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.btn-submit');
      const name      = form.querySelector('#name').value.trim();
      const email     = form.querySelector('#email').value.trim();
      const message   = form.querySelector('#message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        shakeForm(form);
        return;
      }
      if (!isValidEmail(email)) {
        shakeForm(form);
        return;
      }

      // Simulate async send
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      await delay(1800);

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();
      success.classList.add('visible');

      setTimeout(() => success.classList.remove('visible'), 6000);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' }
    ], { duration: 400, easing: 'ease-out' });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  /* ── SMOOTH ACTIVE NAV LINK HIGHLIGHT ───────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const target = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObs.observe(s));

})();
