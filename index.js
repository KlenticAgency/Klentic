/* ==========================================================================
   KLENTIC — Interaction Engine
   Taste Skill: MOTION_INTENSITY:6 — Fluid CSS transitions + scroll reveals
   Hardware-accelerated: transform + opacity only
   ========================================================================== */

(function () {
  'use strict';

  // ─── Navigation Scroll Effect ─────────────────────────────────────
  const nav = document.getElementById('mainNav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ─── Mobile Navigation ────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  let navOpen = false;

  mobileToggle.addEventListener('click', function () {
    navOpen = !navOpen;
    mobileNav.classList.toggle('mobile-nav--open', navOpen);
    document.body.style.overflow = navOpen ? 'hidden' : '';

    // Animate hamburger to X
    const spans = mobileToggle.querySelectorAll('span');
    if (navOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('[data-close-nav]').forEach(function (link) {
    link.addEventListener('click', function () {
      navOpen = false;
      mobileNav.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ─── Scroll Reveal (IntersectionObserver) ─────────────────────────
  // Single elements: .reveal → .reveal--visible
  // Staggered containers: .reveal-stagger → .reveal-stagger--visible
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal')) {
          entry.target.classList.add('reveal--visible');
        }
        if (entry.target.classList.contains('reveal-stagger')) {
          entry.target.classList.add('reveal-stagger--visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── Typewriter Effect (Perpetual Micro-Interaction) ──────────────
  var typewriterEl = document.getElementById('heroTypewriter');
  var typewriterPhrases = [
    'deploy --production ./klentic-v2',
    'lighthouse score: 98/100',
    'build completed in 1.2s',
    'optimizing assets...',
    'compressing images 94%',
    'deploy finished successfully'
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typewriterSpeed = 65;

  function typewrite() {
    var currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typewriterSpeed = 30;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typewriterSpeed = 65;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typewriterSpeed = 2000; // Pause at full phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typewriterSpeed = 400; // Brief pause before next phrase
    }

    setTimeout(typewrite, typewriterSpeed);
  }

  typewrite();

  // ─── Smooth Scroll for Nav Links ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Testimonials Drag-to-Scroll ──────────────────────────────────
  var track = document.getElementById('testimonialsTrack');
  var isDown = false;
  var startX;
  var scrollLeft;

  track.addEventListener('mousedown', function (e) {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', function () {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', function () {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - track.offsetLeft;
    var walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  // ─── Spotlight Border Effect on Service Cards ─────────────────────
  // Cards illuminate dynamically under the cursor
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(52, 211, 153, 0.04), var(--bg-secondary) 60%)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

  // ─── Process Step Hover: number color ─────────────────────────────
  // Already handled via CSS, but adding spotlight to process steps too
  document.querySelectorAll('.process__step').forEach(function (step) {
    step.addEventListener('mousemove', function (e) {
      var rect = step.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      step.style.background = 'radial-gradient(500px circle at ' + x + 'px ' + y + 'px, rgba(52, 211, 153, 0.025), transparent 60%)';
    });

    step.addEventListener('mouseleave', function () {
      step.style.background = '';
    });
  });

  // ─── Pricing Card Tilt (subtle parallax effect) ───────────────────
  document.querySelectorAll('.pricing-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rotateX = (y - 0.5) * -4;
      var rotateY = (x - 0.5) * 4;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ─── Hero Visual Cards: subtle float animation stagger ────────────
  document.querySelectorAll('.hero__visual-card').forEach(function (card, index) {
    card.style.animationDelay = (index * 150) + 'ms';
  });

  // ─── Counter Animation for Hero Stats ─────────────────────────────
  function animateCounter(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;
    var isFloat = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;

      if (isFloat) {
        el.innerHTML = current.toFixed(1) + '<span class="text-accent">' + suffix + '</span>';
      } else {
        el.innerHTML = Math.round(current) + '<span class="text-accent">' + suffix + '</span>';
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Trigger counters when hero stats are visible
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var statValues = entry.target.querySelectorAll('.hero__stat-value');
        animateCounter(statValues[0], 147, '+', 2000);
        animateCounter(statValues[1], 98.3, '%', 2200);
        animateCounter(statValues[2], 4.2, 'x', 1800);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  var heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

})();
