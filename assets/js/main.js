/* Kingship Collective — shared interaction layer
   Progressive enhancement: every animated element already works (in its
   final visible state) with JS disabled; GSAP/ScrollTrigger only enhance
   the transition when available and the user hasn't asked for reduced motion. */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  /* ---------- Sticky header shrink ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var navClose = document.querySelector('.mobile-nav-close');
  function openNav() {
    mobileNav.classList.add('is-open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    var firstLink = mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.contains('is-open') ? closeNav() : openNav();
    });
    if (navClose) navClose.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeNav();
    });
  }

  /* ---------- Scroll reveal (IO fallback + GSAP enhancement) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (hasGSAP && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.utils.toArray('[data-stagger]').forEach(function (group) {
      var items = group.children;
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    var hero = document.querySelector('.hero, .page-hero');
    if (hero) {
      var heroAnimEls = hero.querySelectorAll('.hero-anim');
      gsap.from(heroAnimEls, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.15
      });
      /* Safety net: guarantee visibility even if the tween stalls
         (e.g. backgrounded tab throttling requestAnimationFrame) so
         hero text can never get stuck invisible. */
      setTimeout(function () {
        gsap.set(heroAnimEls, { clearProps: 'opacity,transform' });
      }, 2000);
    }
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count-to]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.className = 'form-status';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = "Thank you — we've received your message and will be in touch shortly.";
            statusEl.classList.add('is-success');
            form.reset();
          } else {
            throw new Error(data.message || 'Submission failed');
          }
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong sending your message. Please email us directly at lorne@kingshipcollective.com.';
          statusEl.classList.add('is-error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
