/* FYPM — shared behaviour. No dependencies. */
(function () {
  var doc = document.documentElement;

  /* ---------- Header: scrolled state + mobile menu ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = header.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close' : 'Menu';
      });
      header.querySelectorAll('.site-nav a').forEach(function (a) {
        a.addEventListener('click', function () {
          header.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = 'Menu';
        });
      });
    }
  }

  /* ---------- Subtle fade/slide on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('is-in');
        io.unobserve(el);
        // Drop the reveal classes once settled so hover transitions run without the stagger delay
        el.addEventListener('transitionend', function done(ev) {
          if (ev.target !== el || ev.propertyName !== 'opacity') return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('reveal', 'is-in');
        });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Contact form (Netlify Forms, AJAX with no-JS fallback to /thanks) ---------- */
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.classList.remove('is-error');
      status.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.classList.add('is-sent');
        status.textContent = 'Thank you — a senior member of our team will be in touch directly.';
      }).catch(function () {
        btn.disabled = false;
        status.classList.add('is-error');
        status.textContent = 'Something went wrong sending that. Please try again in a moment.';
      });
    });
  });

  /* ---------- Dev-only wordmark/type toggle ----------
     Enable with ?dev=1 (remembered), disable with ?dev=0. Always on for localhost and deploy previews. */
  var TYPES = [['serif', 'A · Serif'], ['grotesk', 'B · Grotesque'], ['geometric', 'C · Geometric']];
  var params = new URLSearchParams(location.search);
  try {
    if (params.get('dev') === '1') localStorage.setItem('fypm-dev', '1');
    if (params.get('dev') === '0') localStorage.removeItem('fypm-dev');
    var t = params.get('type');
    if (t && TYPES.some(function (x) { return x[0] === t; })) { localStorage.setItem('fypm-type', t); doc.dataset.type = t; }
  } catch (err) { /* storage unavailable */ }

  var devOn = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.hostname.indexOf('deploy-preview') === 0;
  try { devOn = devOn || localStorage.getItem('fypm-dev') === '1'; } catch (err) {}

  if (devOn) {
    var panel = document.createElement('div');
    panel.className = 'type-toggle';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Wordmark and type treatment (dev only)');
    panel.innerHTML = '<p><span>Type treatment · dev</span><button type="button" aria-label="Hide toggle">×</button></p><div class="opts"></div>';
    var opts = panel.querySelector('.opts');
    TYPES.forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = x[1];
      b.dataset.value = x[0];
      b.setAttribute('aria-pressed', String(doc.dataset.type === x[0]));
      b.addEventListener('click', function () {
        doc.dataset.type = x[0];
        try { localStorage.setItem('fypm-type', x[0]); } catch (err) {}
        opts.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      });
      opts.appendChild(b);
    });
    panel.querySelector('p button').addEventListener('click', function () { panel.hidden = true; });
    document.body.appendChild(panel);
  }

  /* ---------- Solutions: sticky subnav highlight ---------- */
  var subLinks = document.querySelectorAll('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          subLinks.forEach(function (a) { a.classList.remove('is-active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- Solutions: posture dial drives the illustrative sample report ---------- */
  var dial = document.querySelector('[data-posture]');
  if (dial) {
    var POSTURES = {
      conservative: {
        pill: 'pill--hold', label: 'Hold',
        note: 'Conservative: unverified items count against the deal. Best for capital that cannot carry regulatory surprises.',
        why: 'Two open items — the grid connection date and the data-residency reading — carry too much uncertainty at this posture.'
      },
      balanced: {
        pill: 'pill--cond', label: 'Conditional Go',
        note: 'Balanced: proceed if named conditions are met. The default for most strategic and financial investors.',
        why: 'Proceed, subject to two conditions: a confirmed grid connection date and a field check on the data-residency classification.'
      },
      forward: {
        pill: 'pill--go', label: 'Go',
        note: 'Forward-leaning: open items are priced as risk, not blockers. For investors moving ahead of the market.',
        why: 'Fundamentals clear. Open items are manageable and can be resolved post-signing through SPA protections.'
      }
    };
    var pill = document.querySelector('[data-verdict-pill]');
    var why = document.querySelector('[data-verdict-why]');
    var note = document.querySelector('[data-posture-note]');
    var postureOut = document.querySelector('[data-verdict-posture]');
    var apply = function (key) {
      var p = POSTURES[key];
      if (!p) return;
      pill.className = 'pill ' + p.pill;
      pill.textContent = p.label;
      why.textContent = p.why;
      note.textContent = p.note;
      postureOut.textContent = dial.querySelector('input:checked + label').textContent;
    };
    dial.addEventListener('change', function (e) { apply(e.target.value); });
    var checked = dial.querySelector('input:checked');
    if (checked) apply(checked.value);
  }

  /* ---------- Perspective: topic filters ---------- */
  var chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    var items = document.querySelectorAll('[data-topic]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        items.forEach(function (it) { it.hidden = !(f === 'all' || it.dataset.topic === f); });
      });
    });
  }

  /* ---------- Perspective: FYPM pieces open in a reading dialog ---------- */
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    var dlg = document.getElementById(btn.dataset.open);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    btn.addEventListener('click', function (e) { e.preventDefault(); dlg.showModal(); });
  });
  document.querySelectorAll('.reader').forEach(function (dlg) {
    dlg.querySelector('.reader-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });
})();
