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

  /* סקשן העץ — גדילה והחלפת טקסט לפי מיקום הגלילה */
  (function tree() {
    var scroller = document.querySelector('.tree__scroll');
    if (!scroller) return;

    var stage  = scroller.querySelector('.tree__stage');
    var panels = [].slice.call(scroller.querySelectorAll('.tree__panel'));
    if (!stage || !panels.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mobile  = window.matchMedia('(max-width: 900px)');
    var ticking = false;
    var lastActive = -1;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    // האטה בקצוות — תנועה רגועה, בלי קפיצות
    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function update() {
      ticking = false;
      if (mobile.matches || reduced.matches) return;

      var rect = scroller.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      var p = travel > 0 ? clamp(-rect.top / travel) : 0;

      // העץ גדל לאורך ~55% הראשונים, הטבעת נסגרת אחריו
      // רצפה קטנה כדי שהגזע יהיה נוכח כבר בהתחלה
      stage.style.setProperty('--grow', (0.08 + 0.92 * ease(clamp(p / 0.55))).toFixed(3));
      stage.style.setProperty('--ring', ease(clamp((p - 0.1) / 0.7)).toFixed(3));

      // חלוקת הגלילה בין הפאנלים
      var i = Math.min(panels.length - 1, Math.floor(p * panels.length * 0.999));
      if (i !== lastActive) {
        panels.forEach(function (el, n) { el.classList.toggle('is-on', n === i); });
        lastActive = i;
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    function reset() {
      if (mobile.matches || reduced.matches) {
        stage.style.removeProperty('--grow');
        stage.style.removeProperty('--ring');
        panels.forEach(function (el) { el.classList.remove('is-on'); });
        lastActive = -1;
      } else {
        lastActive = -1;
        update();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', reset);
    mobile.addEventListener('change', reset);
    reset();
  })();
})();
