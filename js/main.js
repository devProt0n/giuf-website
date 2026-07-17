// =====================================================
// GIUF — Genç İstanbullular Ulusal Forumu
// Main JavaScript
// =====================================================

(function () {
  'use strict';

  // ── Navbar scroll behavior ──────────────────────────
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Mobile hamburger menu ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Hero background load animation ──────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.onload = function () {
      heroBg.classList.add('loaded');
    };
    img.src = heroBg.style.backgroundImage
      ? heroBg.style.backgroundImage.replace(/url\(['"]?(.+?)['"]?\)/, '$1')
      : '';

    // Trigger immediately if already loaded
    setTimeout(function () {
      heroBg.classList.add('loaded');
    }, 100);
  }

  // ── Scroll reveal animations ─────────────────────────
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — keep the animation triggered
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Counter animation ────────────────────────────────
  function animateCounter(el, target, suffix, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString('tr-TR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix, 1800);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── Smooth scroll for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  // ── Scroll-to-top on logo click ───────────────────────
  document.querySelectorAll('.nav-logo, .footer-logo').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (el.tagName !== 'A') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // ── Toast notification ───────────────────────────────
  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' +
      '<span>' + message + '</span>';

    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  }

  // ── Başvuru Form ─────────────────────────────────────
  const basvuruForm = document.getElementById('basvuruForm');
  const formSuccessState = document.getElementById('formSuccess');
  const formFields = document.getElementById('formFields');

  if (basvuruForm) {
    basvuruForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const required = basvuruForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          valid = false;
        }
      });

      // Email validation
      const emailField = basvuruForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.style.borderColor = '#E53E3E';
          valid = false;
          showToast('Lütfen geçerli bir e-posta adresi girin.', 'error');
          return;
        }
      }

      if (!valid) {
        showToast('Lütfen zorunlu alanları doldurun.', 'error');
        return;
      }

      const submitBtn = basvuruForm.querySelector('.form-submit');
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;

      // Simulate async — replace with real API call
      setTimeout(function () {
        if (formFields && formSuccessState) {
          formFields.style.display = 'none';
          formSuccessState.style.display = 'block';
        }
        showToast('Başvurunuz başarıyla alındı! En kısa sürede iletişime geçeceğiz.');
      }, 1200);
    });

    // Live validation feedback
    basvuruForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        if (this.value.trim()) {
          this.style.borderColor = '';
        }
      });
    });
  }

  // ── İletişim Form ─────────────────────────────────────
  const iletisimForm = document.getElementById('iletisimForm');

  if (iletisimForm) {
    iletisimForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const required = iletisimForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          valid = false;
        }
      });

      if (!valid) {
        showToast('Lütfen zorunlu alanları doldurun.');
        return;
      }

      const submitBtn = iletisimForm.querySelector('.form-submit');
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;

      setTimeout(function () {
        iletisimForm.reset();
        submitBtn.textContent = 'Mesaj Gönder';
        submitBtn.disabled = false;
        showToast('Mesajınız iletildi. En kısa sürede yanıt vereceğiz.');
      }, 1000);
    });
  }

  // ── Active nav link on scroll ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Scroll-to section button ──────────────────────────
  const scrollBtn = document.getElementById('scrollDown');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      const target = document.getElementById('biz-kimiz');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ── Initialize ────────────────────────────────────────
  console.log('GIUF — Genç İstanbullular Ulusal Forumu sitesi yüklendi.');
})();
