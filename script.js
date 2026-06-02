(() => {
  'use strict';

  // PRELOADER
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader')?.classList.add('is-done'), 700);
  });

  // NAV scroll state + burger
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
    document.getElementById('toTop').classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  burger?.addEventListener('click', () => navLinks.classList.toggle('is-open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

  // TO TOP
  document.getElementById('toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // REVEAL on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // COUNTERS
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600, start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  // CATALOG FILTER
  const filters = document.getElementById('filters');
  const prods = document.querySelectorAll('.prod');
  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn'); if (!btn) return;
    filters.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    prods.forEach(p => p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f));
  });

  // SLIDER
  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('dots');
  const slides = track ? track.children.length : 0;
  let idx = 0;
  const go = (i) => {
    idx = (i + slides) % slides;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('is-active', k === idx));
  };
  if (track) {
    for (let i = 0; i < slides; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' is-active' : '');
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    }
    document.getElementById('prevSlide').addEventListener('click', () => go(idx - 1));
    document.getElementById('nextSlide').addEventListener('click', () => go(idx + 1));
    let auto = setInterval(() => go(idx + 1), 6000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => auto = setInterval(() => go(idx + 1), 6000));
    // touch
    let sx = 0;
    track.addEventListener('touchstart', (e) => sx = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    });
  }

  // FORM
  const form = document.getElementById('form');
  const setErr = (field, msg) => {
    field.classList.toggle('is-error', !!msg);
    field.querySelector('.err').textContent = msg || '';
  };
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const f = form.elements;
    const fields = form.querySelectorAll('.field');
    fields.forEach(fl => setErr(fl, ''));
    if (f.name.value.trim().length < 2) { setErr(f.name.closest('.field'), 'Введите имя'); ok = false; }
    if (!/^[\d\s\-\+\(\)]{10,}$/.test(f.phone.value)) { setErr(f.phone.closest('.field'), 'Некорректный телефон'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) { setErr(f.email.closest('.field'), 'Некорректный email'); ok = false; }
    if (!ok) return;
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Отправляем…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Заявка отправлена';
      form.reset();
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2400);
    }, 800);
  });

  // FAQ — close others when one opens
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) document.querySelectorAll('.faq details').forEach(o => { if (o !== d) o.open = false; });
    });
  });
})();