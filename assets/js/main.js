/* שילינגר תכנון פיננסי — סקריפטים */
(function () {
  'use strict';

  /* תפריט מובייל */
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* אנימציית כניסה לסקשנים */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* טופס צור קשר — אין עדיין אנדפוינט, מציגים אישור מקומי */
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      if (msg) {
        msg.textContent = 'תודה! הפנייה נקלטה. אלעד יחזור אליך בהקדם.';
        msg.classList.add('is-visible');
      }
      form.reset();
    });
  });

  /* סקשן העץ — גדילה, החלפת טקסט וניווט נקודות לפי הגלילה */
  (function tree() {
    var scroller = document.querySelector('.tree__scroll');
    if (!scroller) return;

    var stage  = scroller.querySelector('.tree__stage');
    var panels = [].slice.call(scroller.querySelectorAll('.tree__panel'));
    var dots   = [].slice.call(scroller.querySelectorAll('.tree__dot'));
    var marks  = [].slice.call(scroller.querySelectorAll('.tree__mark'));
    if (!stage || !panels.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var compact = window.matchMedia('(max-width: 980px)');
    var ticking = false;
    var active = -1;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function setActive(i) {
      if (i === active) return;
      active = i;
      panels.forEach(function (el, n) { el.classList.toggle('is-on', n === i); });
      dots.forEach(function (el, n) { el.classList.toggle('is-on', n === i); });
      marks.forEach(function (el, n) { el.classList.toggle('is-on', n === i); });
    }

    function update() {
      ticking = false;
      if (compact.matches || reduced.matches) return;

      var rect = scroller.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      var p = travel > 0 ? clamp(-rect.top / travel) : 0;

      stage.style.setProperty('--grow', (0.08 + 0.92 * ease(clamp(p / 0.55))).toFixed(3));
      stage.style.setProperty('--ring', ease(clamp((p - 0.1) / 0.7)).toFixed(3));

      setActive(Math.min(panels.length - 1, Math.floor(p * panels.length * 0.999)));
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    /* לחיצה על נקודה או על שם שלב — גלילה רכה לאותו קטע */
    function goTo(i) {
      var rect = scroller.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      var target = window.scrollY + rect.top + travel * ((i + 0.5) / panels.length);
      window.scrollTo({ top: target, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
    dots.concat(marks).forEach(function (el) {
      el.addEventListener('click', function () { goTo(+el.dataset.go); });
    });

    function reset() {
      if (compact.matches || reduced.matches) {
        stage.style.removeProperty('--grow');
        stage.style.removeProperty('--ring');
        panels.forEach(function (el) { el.classList.remove('is-on'); });
        active = -1;
      } else {
        active = -1;
        update();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', reset);
    compact.addEventListener('change', reset);
    reset();
  })();

  /* וטרמארק העץ — תזוזה עדינה בגלילה */
  (function watermark() {
    var el = document.querySelector('.section--wm');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    function update() {
      ticking = false;
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      // מרכז הסקשן ביחס למרכז המסך, ממופה לתזוזה של עד 70px
      var mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      var shift = Math.max(-70, Math.min(70, -mid * 0.09));
      el.style.setProperty('--wm', shift.toFixed(1) + 'px');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();
})();
