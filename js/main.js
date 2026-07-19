/* =====================================================
   GIUF — Genç İstanbullular Ulusal Forumu
   main.js — Etkileşim, Dropdown, Animasyonlar
   ===================================================== */

'use strict';

// ── DOM Ready ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDropdowns();
  initMobileMenu();
  initScrollReveal();
  initHeroBg();
  initScrollDown();
  closeDropdownsOnOutsideClick();
});

// =====================================================
// NAVBAR — scroll state
// =====================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

// =====================================================
// DROPDOWN MENUS — click to open/close
// =====================================================
function initDropdowns() {
  const groups = document.querySelectorAll('.nav-group');

  groups.forEach(group => {
    const label = group.querySelector('.nav-group-label');
    if (!label) return;

    // Toggle on click
    label.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = group.classList.contains('open');

      // Close all dropdowns first
      closeAllDropdowns();

      // Then open/close this one
      if (!isOpen) {
        openDropdown(group, label);
      }
    });

    // Keyboard accessibility: Enter / Space / Escape
    label.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        label.click();
      }
      if (e.key === 'Escape') {
        closeAllDropdowns();
        label.blur();
      }
    });

    // Close when a dropdown link is clicked
    const links = group.querySelectorAll('.nav-dropdown a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeAllDropdowns();
      });
    });
  });
}

function openDropdown(group, label) {
  group.classList.add('open');
  if (label) label.setAttribute('aria-expanded', 'true');
}

function closeDropdown(group) {
  const label = group.querySelector('.nav-group-label');
  group.classList.remove('open');
  if (label) label.setAttribute('aria-expanded', 'false');
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav-group.open').forEach(g => closeDropdown(g));
}

function closeDropdownsOnOutsideClick() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-group')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

// =====================================================
// MOBILE MENU — hamburger toggle
// =====================================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');

    if (isOpen) {
      closeMobileMenu(hamburger, mobileNav);
    } else {
      openMobileMenu(hamburger, mobileNav);
    }
  });

  // Close on nav link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(hamburger, mobileNav));
  });
}

function openMobileMenu(hamburger, mobileNav) {
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu(hamburger, mobileNav) {
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// =====================================================
// SCROLL REVEAL — Intersection Observer
// =====================================================
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
}

// =====================================================
// HERO BG — parallax & load animation
// =====================================================
function initHeroBg() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  // Trigger scale animation
  requestAnimationFrame(() => {
    setTimeout(() => bg.classList.add('loaded'), 100);
  });

  // Subtle parallax on scroll
  const onScroll = () => {
    const scrolled = window.pageYOffset;
    const limit = window.innerHeight;
    if (scrolled < limit) {
      bg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// =====================================================
// SCROLL DOWN BUTTON
// =====================================================
function initScrollDown() {
  const btn = document.getElementById('scrollDown');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const target = document.getElementById('ulusal-forum');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// =====================================================
// SMOOTH SCROLL — all internal anchor links
// =====================================================
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();

  const navHeight = document.getElementById('navbar')?.offsetHeight ?? 72;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

  window.scrollTo({ top, behavior: 'smooth' });

  // Update URL without jump
  history.pushState(null, '', `#${targetId}`);
});

// =====================================================
// ACTIVE NAV HIGHLIGHT — highlight link based on scroll
// =====================================================
(function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-dropdown a[href^="#"]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();
