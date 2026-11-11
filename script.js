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
    layers();
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
  function start() { try { initReveal(); } catch (err) { d.documentElement.classList.remove('js'); } }
  if (pre) {
    if (reduce || sessionStorage.getItem('tb-seen')) { pre.remove(); start(); }
    else {
      sessionStorage.setItem('tb-seen', '1');
      setTimeout(function () { pre.classList.add('done'); setTimeout(function () { pre.remove(); }, 800); start(); }, 1400);
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
    window.__tbReady = true;
  }
  var plankIv;
  function setPlanks(n) {
    $$('#planks span').forEach(function (sp, k) { sp.classList.toggle('on', k < n); });
    var l = $('#plankDay'); if (l) l.textContent = n;
    var rg = $('#plankRange'); if (rg) rg.value = n;
  }
  function buildBridge() {
    var n = 0;
    if (reduce) { setPlanks(30); return; }
    plankIv = setInterval(function () { if (n >= 30) { clearInterval(plankIv); return; } n++; setPlanks(n); }, 70);
  }
  var rgEl = $('#plankRange');
  if (rgEl) rgEl.addEventListener('input', function () { clearInterval(plankIv); setPlanks(+rgEl.value); });

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
    e.preventDefault(); if (cf.elements.website && cf.elements.website.value) return; var ok = true;
    $$('[required]', cf).forEach(function (el) {
      var good = el.checkValidity(); el.closest('.field').classList.toggle('bad', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    var fd = new FormData(cf);
    location.href = 'mailto:techbridgebaslink@gmail.com?subject=' + encodeURIComponent('Enquiry from ' + fd.get('cn')) +
      '&body=' + encodeURIComponent(fd.get('cm') + '\n\nFrom: ' + fd.get('cn') + ' (' + fd.get('ce') + ')');
    toast('Opening your email app...'); var cst = $('#cStatus'); if (cst) cst.textContent = 'Thank you. Your email app should open with your message ready to send. If it does not, email techbridgebaslink@gmail.com directly.';
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

  /* Layered hero: foreground and background bridges move at different speeds */
  var heroBg = $('.hero-bg'), mx = 0, my = 0;
  function layers() {
    var y = d.documentElement.scrollTop;
    if (reduce || y > 1100) return;
    if (art) art.style.transform = 'translate3d(' + (mx * -24) + 'px,' + (y * 0.12 + my * -16) + 'px,0)';
    if (heroBg) heroBg.style.transform = 'translate3d(' + (mx * 38) + 'px,' + (y * -0.05 + my * 24) + 'px,0)';
  }
  if (hero && !reduce) hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; layers();
  });

  /* Learn / Practise / Prove: the bridge builds as you scroll */
  var story = $('#story');
  if (story) {
    var seg = function (p, a, b) { return Math.min(1, Math.max(0, (p - a) / (b - a))); };
    var sps = $$('.sp', story), steps = $$('.story-step', story), sh = $('.sh', story), sn = $('.sn', story), pulse = $('.pulse-p', story);
    var l1 = $('.lbl1', story), l2 = $$('.lbl2', story), sbar = $('#storyBar');
    var setAll = function (p) {
      /* The bridge is always fully drawn; only the text and progress bar follow the scroll. */
      var i = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      steps.forEach(function (st, k) { st.classList.toggle('act', k === i); });
      sbar.style.width = (p * 100) + '%';
    };
    if (reduce) { story.classList.add('static'); setAll(1); }
    else {
      var upd = function () {
        var r = story.getBoundingClientRect(), total = story.offsetHeight - innerHeight;
        setAll(Math.min(1, Math.max(0, -r.top / total)));
      };
      addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    }
  }

  /* Time-aware greeting */
  var gr = $('#greet');
  if (gr) { var hr = new Date().getHours(); gr.textContent = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; }

  /* Message counter on the contact form */
  var cm = $('#cm'), cc = $('#cmCount');
  if (cm && cc) cm.addEventListener('input', function () { cc.textContent = cm.value.length + ' / 1000'; });

  /* Application form: keep details on this device until submitted or cleared */
  var af = $('#applyForm');
  if (af) {
    var KEY = 'tb-apply', fields = ['name', 'email', 'level', 'why'], note = $('#savedNote');
    var has = function (o) { return !!(o && (o.name || o.email || o.why || o.program || o.level)); };
    var save = function () {
      var o = {}; fields.forEach(function (k) { o[k] = af.elements[k].value; });
      var pr = af.querySelector('input[name=program]:checked'); o.program = pr ? pr.value : '';
      try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
      if (note) note.hidden = !has(o);
    };
    var saved = null; try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (saved) {
      fields.forEach(function (k) { if (saved[k]) af.elements[k].value = saved[k]; });
      if (saved.program && !new URLSearchParams(location.search).get('program')) {
        var rr = af.querySelector('input[name=program][value="' + saved.program + '"]'); if (rr) rr.checked = true;
      }
      if (note) note.hidden = !has(saved);
    }
    af.addEventListener('input', save); af.addEventListener('change', save);
    var clr = $('#clearForm');
    if (clr) clr.addEventListener('click', function () {
      af.reset(); try { localStorage.removeItem(KEY); } catch (e) {} if (note) note.hidden = true; toast('Your saved details were cleared');
    });
    af.addEventListener('submit', function () { setTimeout(function () { if (!$('#done').hidden) { try { localStorage.removeItem(KEY); } catch (e) {} } }, 0); });
  }

  /* Quick jump (Ctrl+K) */
  var F = 'https://forms.gle/8EbdSy5ttGfLZfjv5', WA = 'https://chat.whatsapp.com/FqpBvYS4oaK32cXDxc8JIS';
  var QJ = [
    ['Home', 'index.html#top', 'hero start', 'Page'], ['About TechBridge', 'index.html#about', 'learning experience bridge', 'Section'],
    ['Intern Portal', 'portal.html', 'platform dashboard register tracker submit', 'Page'], ['Task tracker', 'tracker.html', 'progress todo done', 'Page'], ['Intern registration', 'register.html', 'sign up profile onboarding', 'Page'], ['Submit task work', 'submit.html', 'submission github upload', 'Page'], ['Intern dashboard', 'dashboard.html', 'profile progress submissions', 'Page'], ['Internship tasks page', 'tasks.html', 'eight tasks roadmap days journey', 'Page'], ['Programs page', 'programs.html', 'data analytics web development skills compare', 'Page'], ['Programs overview on the homepage', 'index.html#programs', 'data analytics web development', 'Section'], ['The 30-day internship', 'index.html#internship', 'practical recommendation letter', 'Section'],
    ['Key facts', 'index.html#facts', 'duration start dates eligibility', 'Section'], ['Why join TechBridge', 'index.html#why', 'benefits reasons', 'Section'],
    ['How to apply', 'index.html#apply', 'steps', 'Section'], ['Frequently asked questions', 'index.html#faq', 'faq help', 'Section'],
    ['Application preparation page', 'apply.html', 'apply details', 'Page'], ['Community page', 'community.html', 'whatsapp', 'Page'],
    ['Contact page', 'contact.html', 'email message', 'Page'], ['Open the official application form', F, 'apply form internship', 'Opens new tab'],
    ['Join the WhatsApp Community', WA, 'join community chat', 'Opens new tab'], ['Download the info sheet (PDF)', 'techbridge-info-sheet.pdf', 'pdf fact sheet', 'Download'],
    ['Email TechBridge', 'mailto:techbridgebaslink@gmail.com', 'contact email', 'Email']
  ];
  function openQJ() {
    if ($('.qj')) return;
    var prev = d.activeElement, idx = 0, shown = QJ.slice();
    var o = d.createElement('div'); o.className = 'qj';
    o.innerHTML = '<div class="qj-box" role="dialog" aria-modal="true" aria-label="Quick jump"><div class="qj-in"><i class="fa-solid fa-magnifying-glass"></i><input type="text" id="qjIn" placeholder="Where would you like to go?" autocomplete="off" aria-controls="qjList"><kbd>Esc</kbd></div><ul id="qjList" role="listbox"></ul></div>';
    d.body.appendChild(o);
    var inp = $('#qjIn', o), list = $('#qjList', o);
    function close() { o.remove(); removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); }
    function go(it) {
      close();
      if (it[3] === 'Opens new tab') open(it[1], '_blank', 'noopener');
      else if (it[3] === 'Download') { var a = d.createElement('a'); a.href = it[1]; a.download = ''; d.body.appendChild(a); a.click(); a.remove(); }
      else location.href = it[1];
    }
    function render() {
      list.innerHTML = shown.length ? shown.map(function (it, k) {
        return '<li role="option" class="' + (k === idx ? 'act' : '') + '" data-k="' + k + '"><a href="' + esc(it[1]) + '"><b>' + esc(it[0]) + '</b><span>' + esc(it[3]) + '</span></a></li>';
      }).join('') : '<li class="qj-empty">Nothing found. Try "apply" or "contact".</li>';
      var a = $('.act', list); if (a && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (shown.length) { idx = (idx + 1) % shown.length; render(); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) { idx = (idx - 1 + shown.length) % shown.length; render(); } }
      else if (e.key === 'Enter' && shown[idx]) { e.preventDefault(); go(shown[idx]); }
    }
    inp.addEventListener('input', function () {
      var q = inp.value.trim().toLowerCase(); idx = 0;
      shown = QJ.filter(function (it) { return !q || (it[0] + ' ' + it[2]).toLowerCase().indexOf(q) > -1; }); render();
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('li[data-k]'); if (!li) return; e.preventDefault(); go(shown[+li.dataset.k]);
    });
    o.addEventListener('mousedown', function (e) { if (e.target === o) close(); });
    addEventListener('keydown', onKey, true); render(); inp.focus();
  }
  addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openQJ(); } });
  var qb = $('#qjBtn'); if (qb) qb.addEventListener('click', openQJ);

  /* Install-as-app and offline support (works on https hosting such as GitHub Pages or Vercel) */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  /* Programs page: filter the program sections */
  var ptabs = $$('.ptab');
  if (ptabs.length) {
    ptabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var f = t.dataset.filter;
        ptabs.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        var first = null;
        $$('.pgm').forEach(function (sec) {
          var show = f === 'all' || sec.dataset.p === f;
          sec.hidden = !show;
          if (show) { $$('.reveal', sec).forEach(function (r) { r.classList.add('in'); }); if (!first) first = sec; }
        });
        if (first) first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* Internship tasks page: live status, day indicator, filter and expand all */
  var road = $('.road');
  if (road) {
    var stops = $$('.stop', road), trk = $('#track');
    var setSt = function (el, cls, txt) { var s = $('[data-st]', el); s.className = 'st ' + cls; s.textContent = txt; };
    var t0 = new Date(trk.dataset.start + 'T00:00:00'), nw = new Date();
    var dayN = Math.floor((new Date(nw.getFullYear(), nw.getMonth(), nw.getDate()) - t0) / 86400000) + 1;
    if (dayN >= 1) {
      var cur = null;
      stops.forEach(function (s) { if (dayN >= +s.dataset.day) cur = s; });
      stops.forEach(function (s) {
        s.classList.remove('current');
        if (dayN < +s.dataset.day) setSt(s, 'upcoming', 'Upcoming');
        else if (s === cur && dayN <= 30) { s.classList.add('current'); setSt(s, 'current', 'Current task'); }
        else setSt(s, 'available', 'Available');
      });
      var pct = Math.min(1, (dayN - 1) / 29) * 100, dn = $('#dayNow');
      setTimeout(function () { $('#trackFill').style.width = pct + '%'; }, 400);
      if (dayN <= 30) { var hr2 = $('#here'); hr2.style.left = pct + '%'; $('#hereDay').textContent = dayN; hr2.hidden = false; if (dn) dn.textContent = 'Today is Day ' + dayN + ' of 30.'; }
      else if (dn) dn.textContent = 'The 30 days are complete.';
    }
    /* Task 4: the roadmap itself is interactive and tracks progress (shared with the tracker page) */
    var PK = 'tb-portal-v1';
    var rdp = function () { var o = {}; try { o = JSON.parse(localStorage.getItem(PK)) || {}; } catch (e) {} o.progress = o.progress || {}; return o; };
    var base = {};
    stops.forEach(function (s) { var st = $('[data-st]', s); base[s.id] = { c: st.className, t: st.textContent }; });
    var tw = $('.track-wrap');
    if (tw) { var mp = d.createElement('div'); mp.className = 'myprog'; mp.id = 'myProg'; mp.innerHTML = '<p><b>0</b> of 8 tasks completed</p><div class="pbar"><span></span></div>'; tw.appendChild(mp); }
    stops.forEach(function (s) {
      var seg = d.createElement('div'); seg.className = 'seg'; seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Your progress on ' + s.id.replace('task-', 'task '));
      seg.innerHTML = '<button type="button" data-s="todo">To do</button><button type="button" data-s="prog">In progress</button><button type="button" data-s="done">Done</button>';
      var det = $('details', s); det.parentNode.insertBefore(seg, det);
    });
    var paint = function () {
      var pr = rdp().progress, done = 0;
      stops.forEach(function (s) {
        var n = s.id.replace('task-', ''), v = pr[n], st = $('[data-st]', s), b = base[s.id];
        if (v === 'done') { done++; setSt(s, 'done', 'Completed'); }
        else if (v === 'prog') setSt(s, 'inprog', 'In progress');
        else { st.className = b.c; st.textContent = b.t; }
        $$('.seg button', s).forEach(function (btn) {
          var on = btn.dataset.s === (v || 'todo');
          btn.classList.remove('todo', 'prog', 'done'); btn.classList.toggle('on', on); if (on) btn.classList.add(btn.dataset.s); btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var node = $('.tn[href="#task-' + n + '"]');
        if (node) { node.classList.toggle('n-done', v === 'done'); node.classList.toggle('n-prog', v === 'prog'); }
      });
      var mpe = $('#myProg'); if (mpe) { $('b', mpe).textContent = done; $('.pbar span', mpe).style.width = (done / 8 * 100) + '%'; }
      return done;
    };
    road.addEventListener('click', function (e) {
      var bt = e.target.closest('.seg button'); if (!bt) return;
      var o = rdp(), n = bt.closest('.stop').id.replace('task-', ''), before = Object.keys(o.progress).filter(function (k) { return o.progress[k] === 'done'; }).length;
      if (bt.dataset.s === 'todo') delete o.progress[n]; else o.progress[n] = bt.dataset.s;
      try { localStorage.setItem(PK, JSON.stringify(o)); } catch (er) {}
      var done = paint(); if (done === 8 && before < 8 && window.tbConfetti) window.tbConfetti();
    });
    paint();
    var ltabs = $$('.ltab[data-level]');
    ltabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var f = t.dataset.level;
        ltabs.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        stops.forEach(function (s) { var show = f === 'all' || s.dataset.level === f; s.hidden = !show; if (show) $$('.reveal', s).forEach(function (r) { r.classList.add('in'); }); });
      });
    });
    var exb = $('#expandAll');
    if (exb) exb.addEventListener('click', function () {
      var open = exb.dataset.open !== '1';
      $$('details', road).forEach(function (dt) { dt.open = open; });
      exb.dataset.open = open ? '1' : '0'; exb.textContent = open ? 'Collapse all' : 'Expand all';
    });
  }
  window.tbConfetti = confetti;
})();
