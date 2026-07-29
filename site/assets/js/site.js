/* Prominent Roofing, Memphis TN
   Everything here degrades to a working page if JS never runs. */
(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------- hero load sequence */
  document.querySelectorAll('[data-seq]').forEach(function (el) {
    el.style.setProperty('--i', el.getAttribute('data-seq'));
  });
  requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });

  /* ------------------------------------------------------ scroll reveal */
  var rise = document.querySelectorAll('[data-rise]');
  if (calm || !('IntersectionObserver' in window)) {
    rise.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // stagger siblings so a grid arrives as a wave, not a slab
        var sibs = Array.prototype.filter.call(e.target.parentNode.children, function (n) {
          return n.hasAttribute && n.hasAttribute('data-rise');
        });
        var i = Math.min(sibs.indexOf(e.target), 5);
        e.target.style.transitionDelay = (i > 0 ? i * 80 : 0) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    rise.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- header state */
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    hdr.classList.toggle('is-solid', window.scrollY > 24);
    railProgress();
    spy();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------------------------------------------------------- mobile menu */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ------------------------------------------------------- nav highlight */
  var secs = ['services', 'standard', 'claims', 'work', 'reviews', 'areas']
    .map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var links = {};
  nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

  function spy() {
    var line = window.scrollY + window.innerHeight * 0.32;
    var here = null;
    secs.forEach(function (s) { if (s.offsetTop <= line) here = s.id; });
    for (var k in links) links[k].classList.toggle('is-here', k === here);
  }

  /* ------------------------------ claims rail, the sequence draws itself */
  var steps = document.querySelector('[data-steps]');
  function railProgress() {
    if (!steps || calm) return;
    var r = steps.getBoundingClientRect();
    var span = r.height + window.innerHeight * 0.45;
    var run = window.innerHeight * 0.72 - r.top;
    var pct = Math.max(0, Math.min(1, run / span));
    steps.style.setProperty('--rail', (pct * 100).toFixed(1) + '%');
  }

  /* ------------------------------------------------------- count up once */
  var counts = document.querySelectorAll('[data-count]');
  if (counts.length && !calm && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var to = parseInt(el.getAttribute('data-count'), 10);
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - t0) / 1100);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  } else {
    counts.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* --------------------------------------------------- lazy hero video --
     The poster carries the hero on its own. Video is a bonus, so it only
     loads when the connection and the device can spare it, and it is never
     fetched at all on a slow link, a small screen, or reduced motion.      */
  var slot = document.querySelector('[data-video]');
  if (slot && !calm && window.innerWidth >= 900) {
    var c = navigator.connection || {};
    var slow = c.saveData || /2g/.test(c.effectiveType || '');
    if (!slow) {
      var start = function () {
        var v = document.createElement('video');
        v.muted = true; v.defaultMuted = true;
        v.loop = true; v.playsInline = true; v.autoplay = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('aria-hidden', 'true');
        v.setAttribute('tabindex', '-1');
        v.preload = 'auto';
        ['webm', 'mp4'].forEach(function (kind) {
          var src = slot.getAttribute('data-src-' + kind);
          if (!src) return;
          var s = document.createElement('source');
          s.src = src; s.type = 'video/' + kind;
          v.appendChild(s);
        });
        // only reveal once there are real frames, so a 404 leaves the poster up
        v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
        slot.appendChild(v);
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.remove(); });
      };
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 1200);
    }
  }

  /* -------------------------------------------------------- form checks */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var bad = null;
      form.querySelectorAll('.err').forEach(function (n) { n.remove(); });

      form.querySelectorAll('[required]').forEach(function (f) {
        var empty = !f.value.trim();
        var phone = f.type === 'tel' && f.value.replace(/\D/g, '').length < 10;
        if (!empty && !phone) { f.removeAttribute('aria-invalid'); return; }
        f.setAttribute('aria-invalid', 'true');
        var m = document.createElement('span');
        m.className = 'err';
        m.textContent = empty
          ? 'Add your ' + f.previousElementSibling.textContent.toLowerCase() + ' so we can reach you.'
          : 'Enter a 10 digit phone number.';
        f.parentNode.appendChild(m);
        if (!bad) bad = f;
      });

      if (bad) { e.preventDefault(); bad.focus(); return; }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
    });
  });

  /* ----------------------------------------------------------- odds, ends */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  onScroll();
})();
