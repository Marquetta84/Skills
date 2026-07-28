// Prominent Roofing — shared site behavior
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Current year in footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Contact form handling */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusBox = document.getElementById('form-status');

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
      phone: function (v) { return /^[0-9()+\-.\s]{7,}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Please tell us a bit about your roofing need (10+ characters).'; }
    };

    function showFieldError(field, message) {
      var wrap = field.closest('.field');
      var errorEl = wrap.querySelector('.field-error');
      if (message) {
        wrap.classList.add('has-error');
        if (errorEl) errorEl.textContent = message;
        field.setAttribute('aria-invalid', 'true');
      } else {
        wrap.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
        field.removeAttribute('aria-invalid');
      }
    }

    function validateField(field) {
      var validate = validators[field.name];
      if (!validate) return true;
      var message = validate(field.value);
      showFieldError(field, message);
      return !message;
    }

    ['name', 'email', 'phone', 'message'].forEach(function (name) {
      var field = form.elements[name];
      if (field) field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      ['name', 'email', 'phone', 'message'].forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field)) valid = false;
      });

      if (!valid) {
        if (statusBox) {
          statusBox.textContent = 'Please fix the highlighted fields and try again.';
          statusBox.className = 'form-status show error';
        }
        var firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        message: form.elements.message.value.trim()
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
        .then(function () {
          statusBox.textContent = 'Thanks, ' + payload.name.split(' ')[0] + '! Your message is in — we\'ll call you back shortly.';
          statusBox.className = 'form-status show success';
          form.reset();
        })
        .catch(function () {
          // No backend reachable (e.g. static preview) — be honest that it wasn't sent.
          statusBox.textContent = 'We couldn\'t send this automatically right now. Please call 901-857-5181 or email info@prominentroofingmemphis.com and we\'ll help right away.';
          statusBox.className = 'form-status show error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          if (statusBox) statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
  }
})();
