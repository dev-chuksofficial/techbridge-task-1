(function () {
  'use strict';
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var toast = function (msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id); toast.id = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  /* Scroll effects: progress bar, sticky header, back to top, hero parallax */
  var bar = $('#scrollBar'), hdr = $('#siteHeader'), topBtn = $('#toTop'), art = $('.hero-art');
  function onScroll() {
    var h = d.documentElement, y = h.scrollTop, max = (h.scrollHeight - h.clientHeight) || 1;
    if (bar) bar.style.transform = 'scaleX(' + (y / max) + ')';
    if (hdr) hdr.classList.toggle('scrolled', y > 40);
    if (topBtn) topBtn.classList.toggle('show', y > 600);
    if (art && !reduce && y < 900) art.style.transform = 'translateY(' + (y * 0.12) + 'px)';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Current page link in the navigation */
  var file = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a:not(.btn)').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href.indexOf('#') === -1 && href === file) a.setAttribute('aria-current', 'page');
  });
  if (file === 'apply.html') { var ab = $('.nav .btn'); if (ab) ab.setAttribute('aria-current', 'page'); }

  /* Highlight section links while scrolling (home page) */
  if (file === 'index.html' || file === '') {
    var links = $$('.nav a[href^="index.html#"]');
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === 'index.html#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { so.observe(s); });
  }

  /* Close mobile menu after choosing a link */
  var tgl = $('#nav-toggle');
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { if (tgl) tgl.checked = false; }); });

  /* Preloader (first visit of the session only), then start reveals */
  var pre = $('#preloader');
  function start() { initReveal(); }
  if (pre) {
    if (reduce || sessionStorage.getItem('tb-seen')) { pre.remove(); start(); }
    else {
      sessionStorage.setItem('tb-seen', '1');
      setTimeout(function () { pre.classList.add('done'); start(); setTimeout(function () { pre.remove(); }, 800); }, 1700);
    }
  } else start();

  function animateCount(el, to, ms, cb) {
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / ms, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (cb) cb(p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Reveal on scroll, plus counters and the 30-plank bridge */
  function initReveal() {
    var pl = $('#planks');
    if (pl) { for (var i = 0; i < 30; i++) pl.appendChild(d.createElement('span')); }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.add('in'); io.unobserve(el);
        var big = $('[data-count]', el);
        if (big && !reduce) animateCount(big, +big.dataset.count, 1600);
        if ($('#planks', el)) buildBridge();
      });
    }, { threshold: 0.18 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
    if (reduce) $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
  function buildBridge() {
    var spans = $$('#planks span'), label = $('#plankDay'), n = 0;
    if (reduce) { spans.forEach(function (s) { s.classList.add('on'); }); label.textContent = 30; return; }
    var iv = setInterval(function () {
      if (n >= spans.length) { clearInterval(iv); return; }
      spans[n].classList.add('on'); n++; label.textContent = n;
    }, 70);
  }

  /* Pointer effects: hero spotlight and 3D card tilt */
  var hero = $('.hero');
  if (hero && !reduce) hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  });
  if (!reduce && matchMedia('(hover: hover)').matches) $$('.tilt').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 7) + 'deg) rotateY(' + ((x - 0.5) * 9) + 'deg) translateY(-4px)';
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
    });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  /* Official links not yet connected */
  $$('[data-link]').forEach(function (a) {
    if (a.getAttribute('href') === '#') a.addEventListener('click', function (e) {
      e.preventDefault(); toast('The official TechBridge link will be connected here.');
    });
  });

  /* Smooth page transitions between the site's own pages */
  $$('a[href$=".html"], a[href*=".html?"], a[href*=".html#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var u = new URL(a.href, location.href);
      if (e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || u.origin !== location.origin) return;
      if (u.pathname === location.pathname) return;
      e.preventDefault(); d.body.classList.add('leaving');
      setTimeout(function () { location.href = a.href; }, 250);
    });
  });
  addEventListener('pageshow', function () { d.body.classList.remove('leaving'); });

  /* Application form: 3-step wizard (demo, nothing is sent) */
  var f = $('#applyForm');
  if (f) {
    var steps = $$('.fstep', f), dots = $$('.stp li'), cur = 0;
    var pre2 = new URLSearchParams(location.search).get('program');
    if (pre2) { var r = $('input[name=program][value="' + pre2 + '"]', f); if (r) r.checked = true; }
    var show = function (n) {
      cur = n;
      steps.forEach(function (s, k) { s.hidden = k !== n; });
      dots.forEach(function (x, k) { x.classList.toggle('on', k <= n); x.classList.toggle('ok', k < n); });
      $('#fillbar').style.width = (n / (steps.length - 1) * 100) + '%';
      if (n === steps.length - 1) summary();
      $('#formCard').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    var valid = function () {
      var ok = true;
      $$('[required]', steps[cur]).forEach(function (el) {
        var good = el.checkValidity(), fld = el.closest('.field');
        if (fld) fld.classList.toggle('bad', !good);
        if (!good && ok) { el.focus({ preventScroll: true }); ok = false; }
      });
      return ok;
    };
    var summary = function () {
      var fd = new FormData(f);
      $('#summary').innerHTML = [['Full name', 'name'], ['Email', 'email'], ['Program', 'program'], ['Experience level', 'level'], ['Why you want to join', 'why']]
        .map(function (p) { return '<div><dt>' + p[0] + '</dt><dd>' + esc(fd.get(p[1]) || '-') + '</dd></div>'; }).join('');
    };
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-next],[data-prev]'); if (!b) return;
      if (b.hasAttribute('data-next')) { if (valid()) show(cur + 1); } else show(cur - 1);
    });
    f.addEventListener('input', function (e) { var fl = e.target.closest('.field'); if (fl && e.target.checkValidity()) fl.classList.remove('bad'); });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!valid()) return;
      $('#doneName').textContent = new FormData(f).get('name');
      f.hidden = true; $('.stp').hidden = true; $('#done').hidden = false; confetti();
      $('#formCard').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* Contact form opens the visitor's email app, addressed to the official email */
  var cf = $('#contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); var ok = true;
    $$('[required]', cf).forEach(function (el) {
      var good = el.checkValidity(); el.closest('.field').classList.toggle('bad', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    var fd = new FormData(cf);
    location.href = 'mailto:techbridgebaslink@gmail.com?subject=' + encodeURIComponent('Enquiry from ' + fd.get('cn')) +
      '&body=' + encodeURIComponent(fd.get('cm') + '\n\nFrom: ' + fd.get('cn') + ' (' + fd.get('ce') + ')');
    toast('Opening your email app...');
  });

  /* FAQ accordion */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentNode, open = !item.classList.contains('open');
      $$('.faq-item').forEach(function (i) { i.classList.remove('open'); $('.faq-q', i).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* Copy email */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
        .then(function () { toast('Email copied'); }).catch(function () { toast(t); });
    });
  });

  /* Magnetic buttons */
  if (!reduce && matchMedia('(hover: hover)').matches) $$('.hero .btn, .cta .btn').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  /* Confetti burst when the details check is confirmed */
  function confetti() {
    if (reduce) return;
    var c = d.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:200';
    d.body.appendChild(c);
    var x = c.getContext('2d'), w = c.width = innerWidth, h = c.height = innerHeight, t0 = 0;
    var cols = ['#39B80A', '#7EE05A', '#0D004D', '#1E1275', '#ffffff'], ps = [];
    for (var i = 0; i < 140; i++) ps.push({ x: w / 2, y: h * 0.4, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 14 - 3, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: cols[i % 5] });
    requestAnimationFrame(function f(t) {
      if (!t0) t0 = t;
      x.clearRect(0, 0, w, h);
      ps.forEach(function (p) {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
      });
      if (t - t0 < 2600) requestAnimationFrame(f); else c.remove();
    });
  }

  /* Announcement bar */
  var ann = $('#ann');
  if (ann) {
    if (sessionStorage.getItem('tb-ann')) ann.remove();
    else $('#annX').addEventListener('click', function () { sessionStorage.setItem('tb-ann', '1'); ann.remove(); });
  }

  /* Mobile apply bar */
  var mA = $('#mApply');
  if (mA) addEventListener('scroll', function () { mA.classList.toggle('show', d.documentElement.scrollTop > 500); }, { passive: true });

  /* Program detail dialogs */
  $$('[data-modal]').forEach(function (b) {
    b.addEventListener('click', function () { var m = $('#' + b.dataset.modal); if (m && m.showModal) m.showModal(); });
  });
  $$('dialog.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) m.close(); });
  });

  /* Testimonials and partners: only approved items from data.js are shown */
  var data = window.TB_DATA || {};
  var tests = (data.testimonials || []).filter(function (t) { return t && t.approved === true && t.quote && t.name; });
  var parts = (data.partners || []).filter(function (p) { return p && p.approved === true && p.name; });
  if (tests.length && $('#voices')) {
    $('#voicesList').innerHTML = tests.map(function (t) {
      return '<figure class="voice reveal"><blockquote>&ldquo;' + esc(t.quote) + '&rdquo;</blockquote><figcaption><strong>' + esc(t.name) + '</strong>' + (t.role ? '<span>' + esc(t.role) + '</span>' : '') + '</figcaption></figure>';
    }).join('');
    $('#voices').hidden = false;
  }
  if (parts.length && $('#partners')) {
    $('#partnersList').innerHTML = parts.map(function (p) {
      var inner = p.logo ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '">' : '<span>' + esc(p.name) + '</span>';
      return p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<div>' + inner + '</div>';
    }).join('');
    $('#partners').hidden = false;
  }
})();
