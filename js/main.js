document.addEventListener('DOMContentLoaded', () => {
  // 1. NAVBAR SCROLL (Aşağı Kaydırınca Belirginleşme)
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. DROPDOWN MENÜLERİ (Tıklayınca Açılma)
  const navGroups = document.querySelectorAll('.nav-group');

  navGroups.forEach((group) => {
    const label = group.querySelector('.nav-group-label');
    
    if (label) {
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        // Diğer açık dropdown'ları kapat
        navGroups.forEach((otherGroup) => {
          if (otherGroup !== group) otherGroup.classList.remove('open');
        });
        // Tıklananı aç/kapat
        group.classList.toggle('open');
      });
    }
  });

  // Sayfa dışına tıklandığında dropdown'ı kapat
  document.addEventListener('click', () => {
    navGroups.forEach((group) => group.classList.remove('open'));
  });

  // 3. KEŞFET BUTONU (Pürüzsüz Kaydırma)
  const scrollDownBtn = document.getElementById('scrollDown');
  const targetSection = document.getElementById('ulusal-forum');

  if (scrollDownBtn && targetSection) {
    scrollDownBtn.addEventListener('click', () => {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 4. SCROLL REVEAL ANIMATION (Sayfa Kaydırıldıkça Açılma)
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // 5. MOBİL MENÜ TOGGLE
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
  }
});

