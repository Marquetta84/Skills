/* Prominent Roofing — interactions */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- mobile drawer ---------------------------------------------------- */
  var burger = $('.burger');
  var drawer = $('#drawer');
  var scrim = $('[data-scrim]');
  var closeBtn = $('.drawer__x');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute('data-open', String(open));
    scrim.hidden = false;
    scrim.setAttribute('data-open', String(open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = $('a', drawer);
      if (first) first.focus();
    } else {
      burger.focus();
    }
  }

  if (burger) burger.addEventListener('click', function () {
    setDrawer(drawer.getAttribute('data-open') !== 'true');
  });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
  $$('#drawer a').forEach(function (a) {
    a.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('data-open') === 'true') setDrawer(false);
  });

  /* ---- FAQ: one panel open at a time ------------------------------------ */
  var faqs = $$('.faq__item');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---- scroll reveal ---------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var risers = $$('.rise');

  if (reduced || !('IntersectionObserver' in window)) {
    risers.forEach(function (el) { el.setAttribute('data-in', 'true'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings so grids cascade rather than pop as one block
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('rise');
        });
        var i = Math.min(sibs.indexOf(el), 5);
        el.style.transitionDelay = (i * 70) + 'ms';
        el.setAttribute('data-in', 'true');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    risers.forEach(function (el) { io.observe(el); });
  }

  /* ---- nav: highlight the section you're looking at --------------------- */
  var links = $$('.nav a[href^="#"]');
  var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          if (on) { a.setAttribute('aria-current', 'page'); }
          else { a.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { navIo.observe(t); });
  }

  /* ---- estimate form ----------------------------------------------------
     No backend is connected. Point the <form> at Formspree / Netlify Forms /
     your CRM (see README.md) and delete this handler.
     ---------------------------------------------------------------------- */
  var form = $('#estimate-form');
  var msg = $('#form-msg');

  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = $$('[required]', form).filter(function (f) { return !f.value.trim(); });
      if (missing.length) {
        missing[0].focus();
        msg.innerHTML = 'Please fill in every field so we can get back to you.';
        msg.setAttribute('data-show', 'true');
        return;
      }

      msg.innerHTML = 'This form isn’t connected to an inbox yet — ' +
        'call <a href="tel:+19018575181">(901) 857-5181</a> and we’ll get you on the schedule today.';
      msg.setAttribute('data-show', 'true');
    });
  }

  /* ---- footer year ------------------------------------------------------ */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
