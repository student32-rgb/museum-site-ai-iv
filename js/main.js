/* Software and Computer Museum — page behaviour.
   Works on both language versions: every visible string lives in the HTML.
   Booking is by phone (brief): all «Записатися» buttons are tel: links, no form. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile / tablet menu ---------- */
  var menuBtn = document.querySelector('.scm-menu-btn');
  var mobileNav = document.getElementById('mobile-nav');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () { setMenu(mobileNav.hidden); });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    mobileNav.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- Language switch (header + footer) ----------
     The English page does not exist yet: EN shows a notice. */
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.scm-lang button[data-lang]'));
  var langNote = document.getElementById('lang-note');

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      langButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
      });
      if (langNote) langNote.hidden = lang !== 'en';
    });
  });

  /* ---------- Typing effect in the first-screen title ----------
     Screen readers get the full title from a hidden copy; with reduced motion the text stays as is. */
  var live = document.querySelector('.mus-type__live');
  if (live && !reduceMotion) {
    var text = live.getAttribute('data-text') || live.textContent;
    var typed = document.createTextNode('');
    var cursor = document.createElement('span');
    cursor.className = 'scm-cursor';
    live.textContent = '';
    live.appendChild(typed);
    live.appendChild(cursor);
    var i = 0;
    (function step() {
      i += 1;
      typed.nodeValue = text.slice(0, i);
      if (i < text.length) setTimeout(step, 60);
      else live.classList.add('is-done');
    })();
  }

  /* ---------- Current section in the menu ---------- */
  var sectionIds = ['courses', 'tours', 'exhibits', 'about', 'news', 'contacts'];
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.scm-nav a[href^="#"], .mus-mobile-nav a[href^="#"]')
  );

  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  navLinks.forEach(function (a) {
    a.addEventListener('click', function () { setCurrent(a.getAttribute('href').slice(1)); });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        /* The first screen is not a menu item: reaching it clears the marker */
        if (entry.isIntersecting) setCurrent(entry.target.classList.contains('scm-hero') ? null : entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    var hero = document.querySelector('.scm-hero');
    if (hero) observer.observe(hero);
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
