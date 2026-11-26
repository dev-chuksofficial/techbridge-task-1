/* ==========================================================================
   TechBridge Intern Dashboard (Task 6) + Task Management API connection (Task 7)
   Plain JavaScript only. No frameworks.

   Task 7 change: the tasks are no longer written inside this file.
   The dashboard now asks the backend (Node.js + Express) for them with fetch().

   JavaScript concepts used, and where to find them:
   1. API SETTINGS         API_BASE and request(): one function that talks to the backend
   2. ASYNC / PROMISES     fetch().then().catch() for loading, viewing and updating tasks
   3. STATE                tasks, view (loading | ready | error), backend (checking | connected | offline)
   4. LOADING + ERRORS     showView() decides which of the three screens is visible
   5. DOM MANIPULATION     task cards are generated from the data returned by the API
   6. EVENT LISTENERS      click (event delegation), input, keydown
   7. PROGRESS CALCULATIONS  completed / total * 100
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. API SETTINGS ----------
     Where is the backend? The script finds out by asking, in this order:
       1. the same address as this page (when Express serves the dashboard, for example http://localhost:3000/dashboard.html)
       2. http://localhost:3000 (when the page is opened from VS Code Live Server on another port, or from a file)
     The first address that answers GET /api/health is used. You can also set window.TB_API_BASE before this script to force an address. */
  var API_BASE = window.TB_API_BASE ? String(window.TB_API_BASE).replace(/\/$/, '') : null;   // null = not decided yet
  var TIMEOUT_MS = 8000;
  var HEALTH_EVERY_MS = 8000;

  /* One function for every call to the backend. It returns a promise.
     - If the server cannot be reached, the error has err.network = true.
     - If the server answers with an error (400, 404 ...), the error carries the server's message. */
  function send(base, method, path, body, timeout) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeout || TIMEOUT_MS) : null;
    var opts = { method: method, headers: { 'Accept': 'application/json' } };
    if (ctrl) opts.signal = ctrl.signal;
    if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch(base + path, opts).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { /* the answer was not JSON */ }
        if (!res.ok) { var er = new Error((data && data.error) || ('The server answered with status ' + res.status + '.')); er.status = res.status; throw er; }
        if (data === null) { var e2 = new Error('The server did not return JSON.'); e2.status = res.status; throw e2; }
        return data;
      });
    }, function () {
      if (timer) clearTimeout(timer);
      var e = new Error('Cannot reach the backend.'); e.network = true; throw e;
    });
  }
  function request(method, path, body) { return send(API_BASE || '', method, path, body); }

  function resolveApiBase() {
    if (API_BASE !== null) return Promise.resolve();
    var l = window.location, local = l.protocol === 'file:' || l.hostname === 'localhost' || l.hostname === '127.0.0.1';
    var candidates = l.protocol === 'file:' ? ['http://localhost:3000'] : (local ? ['', 'http://localhost:3000'] : ['']);
    var i = 0;
    function probe() {
      return send(candidates[i], 'GET', '/api/health', undefined, 3000).then(function (d) {
        if (!d || d.status !== 'ok') throw new Error('not the task API');
        API_BASE = candidates[i];
      }).catch(function () {
        i++;
        if (i < candidates.length) return probe();
        API_BASE = candidates[0];                    // nothing answered: keep the first choice, the error screen will explain
      });
    }
    return probe();
  }

  /* ---------- the data ----------
     The API uses "completed", "in-progress" and "not-started".
     Inside this file those are shortened to "done", "prog" and "todo" so the cards and filters stay simple. */
  var FROM_API = { 'completed': 'done', 'in-progress': 'prog', 'not-started': 'todo' };
  var TO_API = { done: 'completed', prog: 'in-progress', todo: 'not-started' };
  var LABEL = { done: 'Completed', prog: 'In Progress', todo: 'Not Started' };
  var ICON = { done: 'fa-solid fa-circle-check', prog: 'fa-solid fa-circle-half-stroke', todo: 'fa-regular fa-circle' };

  function normalize(a) {
    return { number: a.id, title: a.title, description: a.description || '', status: FROM_API[a.status] || 'todo',
      what: a.what, timing: a.timing, time: a.estimatedTime, difficulty: a.difficulty, tech: a.technologies,
      buildsOn: a.buildsOn, page: a.page, pageLabel: a.pageLabel, tba: !!a.tba };
  }

  /* ---------- 3. STATE ---------- */
  var tasks = [];             // the tasks received from the API
  var view = 'loading';       // loading | ready | error
  var backend = 'checking';   // checking | connected | offline
  var filter = 'all';         // all | done | prog | todo
  var query = '';             // search text
  var saving = {};            // task numbers that are waiting for the server to answer
  var openNumber = null;      // task shown in the popup
  var lastTrigger = null;

  function taskOf(n) { return tasks.filter(function (t) { return t.number === n; })[0]; }

  /* ---------- 7. PROGRESS CALCULATIONS ---------- */
  function counts() {
    var c = { done: 0, prog: 0, todo: 0 };
    tasks.forEach(function (t) { c[t.status]++; });
    return c;
  }
  function percent(done) { return tasks.length ? done / tasks.length * 100 : 0; }
  function pctText(p) { return (Math.round(p * 10) / 10) + '%'; }         // 37.5 -> "37.5%", 50 -> "50%"
  function currentTask() {                                                 // the task the intern should work on now
    var p = tasks.filter(function (t) { return t.status === 'prog'; })[0];
    return p || tasks.filter(function (t) { return t.status === 'todo'; })[0] || null;
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id); toast.id = setTimeout(function () { t.classList.remove('show'); }, 3600);
  }

  /* ---------- Backend status indicator ---------- */
  var BACKEND_TEXT = { checking: 'Checking...', connected: 'Connected', offline: 'Offline' };
  function setBackend(state) {
    backend = state;
    var pill = $('#apiStatus');
    pill.className = 'api-pill is-' + state;
    $('#apiText').textContent = 'Backend Status: ' + BACKEND_TEXT[state];
    $('#apiWhere').textContent = API_BASE === null ? 'Looking for the backend...' : (API_BASE || location.origin) + '/api';
  }
  function checkHealth() {
    return request('GET', '/api/health').then(function (d) {
      if (!d || d.status !== 'ok') throw new Error('Unexpected health answer.');
      var was = backend;
      setBackend('connected');
      if (was === 'offline') { if (view === 'error') loadTasks(); else toast('The backend is back online.'); }
    }).catch(function () {
      var was = backend;
      setBackend('offline');
      if (was === 'connected' && view === 'ready') toast('The backend went offline.');
    });
  }

  /* ---------- 4. LOADING / READY / ERROR screens ---------- */
  function showView() {
    $('#tLoading').hidden = view !== 'loading';
    $('#tError').hidden = view !== 'error';
    $('#tReady').hidden = view !== 'ready';
    $('#taskGrid').setAttribute('aria-busy', view === 'loading' ? 'true' : 'false');
  }

  /* ---------- Welcome section ---------- */
  function readProfileName() {
    try {
      var p = JSON.parse(localStorage.getItem('tb-portal-v1') || 'null');
      if (p && p.profile && p.profile.name) return String(p.profile.name).trim();
    } catch (e) { /* ignore */ }
    return '';
  }
  function renderWelcome(c) {
    var full = readProfileName(), first = full ? full.split(/\s+/)[0] : 'Alex', total = tasks.length;
    $('#dWelcome').textContent = 'Welcome back, ' + first;
    $('#dAvatar').textContent = (full || 'Alex').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    $('#dSample').hidden = !!full;

    var pill = $('#dStatus'), st, cls;
    if (!total) { st = view === 'loading' ? 'Loading...' : 'Unavailable'; cls = 's-todo'; }
    else if (c.done === total) { st = 'Completed'; cls = 's-done'; }
    else if (c.done === 0 && c.prog === 0) { st = 'Not Started'; cls = 's-todo'; }
    else { st = 'In Progress'; cls = 's-prog'; }
    pill.textContent = 'Internship Status: ' + st;
    pill.className = 'dsh-status ' + cls;

    $('#dMsg').textContent = !total
      ? (view === 'loading' ? 'Getting your tasks from the TechBridge backend...' : 'The dashboard cannot reach the backend right now. Start the server and try again.')
      : c.done === total
        ? 'You have completed all ' + total + ' tasks. Well done, and thank you for the work you put in.'
        : 'Good to see you again. Keep your tasks up to date below and watch your progress grow.';

    var cur = currentTask(), btn = $('#dContinue');
    if (cur) { btn.hidden = false; btn.dataset.n = cur.number; btn.querySelector('span').textContent = (cur.status === 'prog' ? 'Continue Task ' : 'Start Task ') + cur.number; }
    else { btn.hidden = true; }
  }

  /* ---------- Progress section ---------- */
  function renderProgress() {
    var c = counts(), total = tasks.length;
    if (!total) {                                   // nothing loaded yet, or the backend is offline
      var dash = '\u2013';
      $('#pDone').textContent = dash; $('#pTotal').textContent = dash; $('#pPct').textContent = dash;
      $('#pFill').style.width = '0%'; $('#pBar').setAttribute('aria-valuenow', 0);
      ['#sTotal', '#sDone', '#sProg', '#sTodo', '#sRemain'].forEach(function (s) { $(s).textContent = dash; });
      $('#pRemain').textContent = view === 'loading' ? 'Loading progress...' : 'Progress is unavailable until the backend is connected.';
      $('#pRail').innerHTML = ''; $('#cCelebrate').hidden = true;
      $$('#tFilters button').forEach(function (b) { $('em', b).textContent = dash; });
      renderWelcome(c);
      return;
    }
    var p = percent(c.done);
    $('#pDone').textContent = c.done; $('#pTotal').textContent = total;
    $('#pPct').textContent = pctText(p);
    $('#pFill').style.width = p + '%';
    $('#pBar').setAttribute('aria-valuenow', Math.round(p * 10) / 10);
    $('#sTotal').textContent = total; $('#sDone').textContent = c.done; $('#sProg').textContent = c.prog; $('#sTodo').textContent = c.todo;
    $('#sRemain').textContent = total - c.done;
    $('#pRemain').textContent = (total - c.done) + (total - c.done === 1 ? ' Task Remaining' : ' Tasks Remaining');

    $('#pRail').innerHTML = tasks.map(function (t) {
      return '<li class="s-' + t.status + '"><span class="sr">Task ' + t.number + ': ' + LABEL[t.status] + '</span><b aria-hidden="true">' + t.number + '</b></li>';
    }).join('');
    $('#pRail').style.gridTemplateColumns = 'repeat(' + Math.min(total, 12) + ', 1fr)';
    $('#cCelebrate').hidden = c.done !== total;

    var all = { all: total, done: c.done, prog: c.prog, todo: c.todo };
    $$('#tFilters button').forEach(function (b) { $('em', b).textContent = all[b.dataset.f]; });
    renderWelcome(c);
  }

  /* ---------- Task tracker: build cards from the API data ---------- */
  function matches(t) {
    if (filter !== 'all' && t.status !== filter) return false;
    if (query) {
      var hay = ('task ' + t.number + ' ' + t.title + ' ' + t.description).toLowerCase();
      if (hay.indexOf(query) === -1) return false;
    }
    return true;
  }
  function cardHtml(t) {
    var s = t.status, n = t.number, busy = saving[n], dis = busy ? ' disabled' : '';
    var actions = '<button type="button" class="btn btn-navy tt-view" data-act="view" data-n="' + n + '" aria-haspopup="dialog" aria-label="View Task ' + n + ': ' + esc(t.title) + '"' + dis + '>View Task</button>';
    if (s === 'prog') actions += '<button type="button" class="btn btn-gold tt-do" data-act="done" data-n="' + n + '" aria-label="Mark Task ' + n + ' as completed"' + dis + '><i class="fa-solid fa-check" aria-hidden="true"></i> ' + (busy ? 'Saving...' : 'Mark as Completed') + '</button>';
    if (s === 'todo') actions += '<button type="button" class="btn btn-ghost-dark tt-do" data-act="start" data-n="' + n + '" aria-label="Start Task ' + n + '"' + dis + '><i class="fa-solid fa-play" aria-hidden="true"></i> ' + (busy ? 'Saving...' : 'Start Task') + '</button>' +
      '<button type="button" class="tt-link" data-act="done" data-n="' + n + '" aria-label="Mark Task ' + n + ' as completed"' + dis + '>Mark as Completed</button>';
    if (s === 'done') actions += '<button type="button" class="tt-link" data-act="reopen" data-n="' + n + '" aria-label="Reopen Task ' + n + '"' + dis + '>' + (busy ? 'Saving...' : 'Undo') + '</button>';
    return '<article class="tt-card s-' + s + (busy ? ' is-saving' : '') + '" id="task-' + n + '" data-n="' + n + '">' +
      '<header><span class="tt-no">TASK ' + n + '</span><span class="tt-st s-' + s + '"><i class="' + ICON[s] + '" aria-hidden="true"></i> ' + LABEL[s] + '</span></header>' +
      '<h3>' + esc(t.title) + '</h3><p>' + esc(t.description) + '</p>' +
      '<div class="tt-actions">' + actions + '</div></article>';
  }
  function renderTasks(popNumber) {
    var rows = tasks.filter(matches);
    $('#taskGrid').innerHTML = rows.map(cardHtml).join('');
    $('#tEmpty').hidden = rows.length !== 0;
    $('#tCount').textContent = 'Showing ' + rows.length + ' of ' + tasks.length + ' tasks';
    if (popNumber && !reduce) { var el = $('#task-' + popNumber); if (el) el.classList.add('tt-pop'); }
  }
  function renderAll() { renderProgress(); renderTasks(); showView(); }

  /* ---------- 2. Loading the tasks: GET /api/tasks ---------- */
  function loadTasks() {
    view = 'loading'; tasks = []; showView(); renderProgress();
    return request('GET', '/api/tasks').then(function (data) {
      if (!Array.isArray(data)) throw new Error('The server sent data in an unexpected shape.');
      tasks = data.map(normalize);
      view = 'ready'; setBackend('connected');
      renderAll();
    }).catch(function (err) {
      tasks = []; view = 'error';
      if (err.network || err.status >= 404 || !err.status) setBackend('offline');
      $('#tErrDetail').textContent = 'Details: ' + err.message;
      showView(); renderProgress();
    });
  }

  /* ---------- Updating a task: PUT /api/tasks/:id ---------- */
  function setStatus(n, s) {
    var t = taskOf(n); if (!t || t.status === s || saving[n]) return;
    saving[n] = true; renderTasks(); if (openNumber === n) renderModal(t);
    request('PUT', '/api/tasks/' + n, { status: TO_API[s] }).then(function (updated) {
      var u = normalize(updated); t.status = u.status;               // the server's answer is the truth
      delete saving[n]; setBackend('connected');
      renderProgress(); renderTasks(n);
      if (openNumber === n) renderModal(t);
      var c = counts();
      if (u.status === 'done') { toast('Task ' + n + ' marked as completed. ' + c.done + ' of ' + tasks.length + ' done.'); if (c.done === tasks.length) celebrate(); }
      else if (u.status === 'prog') toast('Task ' + n + ' is now in progress.');
      else toast('Task ' + n + ' moved back to Not Started.');
    }).catch(function (err) {
      delete saving[n]; if (err.network) setBackend('offline');
      renderTasks(); if (openNumber === n) renderModal(t);
      toast('Could not update Task ' + n + '. ' + (err.network ? 'The backend cannot be reached.' : err.message));
    });
  }

  /* ---------- Filters (conditional logic) ---------- */
  function setFilter(f) {
    filter = f;
    $$('#tFilters button').forEach(function (b) { var on = b.dataset.f === f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    renderTasks();
  }

  /* ---------- Task details popup: GET /api/tasks/:id ---------- */
  var dlg = $('#taskModal'), mBody = $('#tmBody');
  function field(label, value) { return value ? '<div><dt>' + label + '</dt><dd>' + esc(value) + '</dd></div>' : ''; }
  function renderModal(t) {
    var s = t.status, n = t.number, busy = saving[n], dis = busy ? ' disabled' : '', c = '';
    c += '<div class="tm-top"><span class="tt-no">TASK ' + n + '</span><span class="tt-st s-' + s + '"><i class="' + ICON[s] + '" aria-hidden="true"></i> ' + LABEL[s] + '</span></div>';
    c += '<h3 id="tmTitle">' + esc(t.title) + '</h3><p class="tm-desc">' + esc(t.description) + '</p>';
    c += '<dl class="tm-facts">' + field('What you build', t.what) + field('Timing', t.timing) + field('Estimated time', t.time) + field('Difficulty', t.difficulty) + field('Technologies', t.tech) + field('Builds on', t.buildsOn) + '</dl>';
    if (t.tba) c += '<p class="tm-note"><span class="pill">Confirm with TechBridge</span> Check the official TechBridge task brief and the WhatsApp Community for this task.</p>';
    c += '<p class="tm-src"><i class="fa-solid fa-server" aria-hidden="true"></i> Loaded from <code>GET /api/tasks/' + n + '</code></p>';
    c += '<div class="tm-actions">';
    if (s === 'todo') c += '<button type="button" class="btn btn-ghost-dark" data-act="start" data-n="' + n + '"' + dis + '><i class="fa-solid fa-play" aria-hidden="true"></i> ' + (busy ? 'Saving...' : 'Start Task') + '</button>';
    if (s !== 'done') c += '<button type="button" class="btn btn-gold" data-act="done" data-n="' + n + '"' + dis + '><i class="fa-solid fa-check" aria-hidden="true"></i> ' + (busy ? 'Saving...' : 'Mark as Completed') + '</button>';
    if (s === 'done') c += '<button type="button" class="btn btn-ghost-dark" data-act="reopen" data-n="' + n + '"' + dis + '>' + (busy ? 'Saving...' : 'Undo completion') + '</button>';
    if (t.page) c += '<a class="btn btn-navy" href="' + esc(t.page) + '"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ' + esc(t.pageLabel || 'Open the page') + '</a>';
    c += '<button type="button" class="btn btn-ghost-dark" data-close>Close</button></div>';
    mBody.innerHTML = c;
  }
  function renderModalLoading(n) {
    mBody.innerHTML = '<div class="tm-top"><span class="tt-no">TASK ' + n + '</span></div><h3 id="tmTitle">Loading task...</h3>' +
      '<div class="tt-state" role="status"><span class="spin" aria-hidden="true"></span><p>Asking the backend for Task ' + n + '...</p></div>';
  }
  function renderModalError(n, err) {
    mBody.innerHTML = '<div class="tm-top"><span class="tt-no">TASK ' + n + '</span></div><h3 id="tmTitle">Unable to load this task.</h3>' +
      '<p class="tm-desc">' + (err.network ? 'The backend cannot be reached. Please check your connection or try again.' : esc(err.message)) + '</p>' +
      '<div class="tm-actions"><button type="button" class="btn btn-navy" data-act="retry" data-n="' + n + '"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Try again</button><button type="button" class="btn btn-ghost-dark" data-close>Close</button></div>';
  }
  function openTask(n, trigger) {
    openNumber = n; lastTrigger = trigger || lastTrigger;
    renderModalLoading(n); dlg.scrollTop = 0;
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    request('GET', '/api/tasks/' + n).then(function (a) {
      if (openNumber !== n) return;                                  // the popup was closed or changed meanwhile
      var fresh = normalize(a), t = taskOf(n);
      if (t) { Object.keys(fresh).forEach(function (k) { t[k] = fresh[k]; }); fresh = t; }
      setBackend('connected'); renderModal(fresh); renderProgress(); renderTasks();
    }).catch(function (err) {
      if (openNumber !== n) return;
      if (err.network) setBackend('offline');
      renderModalError(n, err);
    });
  }
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    var link = e.target.closest('a[href^="#"]'); if (link) { dlg.close(); return; }   // in-page link: close the popup, then scroll
    var b = e.target.closest('[data-act]'); if (b) act(b.dataset.act, +b.dataset.n);
  });
  dlg.addEventListener('close', function () {
    openNumber = null;
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  });

  /* ---------- one place that reacts to every button ---------- */
  function act(a, n) {
    if (a === 'done') setStatus(n, 'done');
    else if (a === 'start' || a === 'reopen') setStatus(n, 'prog');
    else if (a === 'retry') openTask(n);
  }
  $('#taskGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    var n = +b.dataset.n;
    if (b.dataset.act === 'view') openTask(n, b); else act(b.dataset.act, n);
  });
  $('#tFilters').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
  $('#tSearch').addEventListener('input', function () { query = this.value.trim().toLowerCase(); renderTasks(); });
  $('#tEmptyReset').addEventListener('click', function () { $('#tSearch').value = ''; query = ''; setFilter('all'); });
  $('#dContinue').addEventListener('click', function () { openTask(+this.dataset.n, this); });
  $('#tRetry').addEventListener('click', function () { checkHealth(); loadTasks(); });
  $('#apiCheck').addEventListener('click', function () { setBackend('checking'); checkHealth().then(function () { toast('Backend Status: ' + BACKEND_TEXT[backend] + '.'); }); });
  $('#tReset').addEventListener('click', function () {
    if (!confirm('Reset all tasks to the original data on the server?')) return;
    request('POST', '/api/tasks/reset').then(function () { toast('Tasks reset to the original data.'); return loadTasks(); })
      .catch(function (err) { toast('Could not reset the tasks. ' + (err.network ? 'The backend cannot be reached.' : err.message)); });
  });

  /* ---------- Completion celebration ---------- */
  function celebrate() {
    if (reduce) return;
    var box = document.createElement('div'); box.className = 'dsh-confetti'; box.setAttribute('aria-hidden', 'true');
    var colors = ['#39B80A', '#7EE05A', '#0D004D', '#1E1275', '#FFFFFF'];
    for (var i = 0; i < 46; i++) {
      var s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (Math.random() * 0.8) + 's';
      s.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 4800);
  }

  /* ---------- Challenge Hub preview (connects to Task 5) ---------- */
  function renderHub() {
    var list = Array.isArray(window.TB_CHALLENGES) ? window.TB_CHALLENGES : [];
    var total = list.length || 12;
    var da = list.filter(function (c) { return c.track === 'data-analytics'; }).length;
    var wd = list.filter(function (c) { return c.track === 'web-development'; }).length;
    var done = 0;
    try { var v = JSON.parse(localStorage.getItem('tb-challenges-v1') || '{}'); done = v && v.done ? Object.keys(v.done).length : 0; } catch (e) { /* ignore */ }
    $('#hubCount').textContent = total + ' Challenges Available';
    $('#hubSplit').textContent = list.length ? da + ' Data Analytics \u00b7 ' + wd + ' Web Development' : 'Data Analytics and Web Development';
    $('#hubDone').textContent = done + ' of ' + total + ' completed by you';
    var starters = list.filter(function (c) { return c.level === 'Beginner'; }).slice(0, 3);
    $('#hubList').innerHTML = starters.map(function (c) {
      return '<li><a href="challenges.html#' + esc(c.id) + '"><span>' + esc(c.title) + '</span><small>' + esc(c.track === 'data-analytics' ? 'Data Analytics' : 'Web Development') + ' \u00b7 ' + esc(c.level) + '</small></a></li>';
    }).join('');
    $('#hubStart').hidden = !starters.length;
  }

  /* ---------- Technology Explorer ---------- */
  var TECHS = {
    next: { name: 'Next.js', tag: 'A React framework for building complete web applications.', icon: 'fa-solid fa-n',
      what: 'Next.js is a framework built on top of React. It adds routing, server-side rendering and other features that help developers build fast, production-ready websites and applications.',
      used: 'Marketing sites, online stores, blogs, dashboards and web apps that need good speed and good visibility in search engines.',
      base: 'JavaScript or TypeScript, with React', note: 'Pages can be prepared on the server before they reach the browser, which helps loading speed and SEO.',
      url: 'https://nextjs.org' },
    vue: { name: 'Vue.js', tag: 'A friendly JavaScript framework for building user interfaces.', icon: 'fa-brands fa-vuejs',
      what: 'Vue.js is a progressive framework for building interactive interfaces. You can add it to one part of a page, or build a whole single-page application with it.',
      used: 'Interactive dashboards, forms, single-page applications, and adding interactivity to existing websites.',
      base: 'JavaScript or TypeScript', note: 'Many beginners find Vue approachable because of its clear documentation and components that keep markup, styles and logic together.',
      url: 'https://vuejs.org' },
    angular: { name: 'Angular', tag: 'A complete framework for large, well-structured web applications.', icon: 'fa-brands fa-angular',
      what: 'Angular is a TypeScript-based framework maintained by Google. Routing, forms and testing tools come built in, so a team follows one consistent structure.',
      used: 'Large business applications, enterprise dashboards, internal company tools and projects with many developers.',
      base: 'TypeScript', note: 'It takes longer to learn at the start, but its strict structure helps big teams keep a large codebase organised.',
      url: 'https://angular.dev' },
    backend: { name: 'Backend Development', tag: 'The part of a web platform that runs on the server.', icon: 'fa-solid fa-server',
      what: 'The backend stores data in databases, handles logins, applies business rules and sends information to the frontend, usually through an API. The frontend is what the user sees and clicks. The backend does the work behind it.',
      used: 'User accounts, saving and loading data, payments, sending emails, and any feature that must be kept safe on a server.',
      base: 'Many languages: JavaScript, Python, PHP, C# and more', note: 'Frontend and backend developers work together through APIs, and many developers learn a little of both so they can see the whole platform.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side',
      flow: [['fa-solid fa-display', 'Frontend', 'What the user sees and clicks'], ['fa-solid fa-paper-plane', 'Request', 'The browser asks for data through an API'], ['fa-solid fa-gears', 'Backend', 'Runs the logic on a server'], ['fa-solid fa-database', 'Database', 'Stores and returns the data']],
      stack: [
        { name: 'Node.js', lang: 'JavaScript', desc: 'Runs JavaScript on the server, so one language can power both frontend and backend.', url: 'https://nodejs.org' },
        { name: 'Express.js', lang: 'JavaScript', desc: 'A small, popular framework on top of Node.js for building web servers and APIs.', url: 'https://expressjs.com' },
        { name: 'Django', lang: 'Python', desc: 'A full-featured Python framework with many tools included, such as an admin area and user accounts.', url: 'https://www.djangoproject.com' },
        { name: 'Flask', lang: 'Python', desc: 'A lightweight Python framework that gives you the basics and lets you add what you need.', url: 'https://flask.palletsprojects.com' },
        { name: 'Laravel', lang: 'PHP', desc: 'A PHP framework known for clean syntax and built-in features for common web tasks.', url: 'https://laravel.com' },
        { name: '.NET', lang: 'C#', desc: "Microsoft's platform for building web APIs and applications, often used in business software.", url: 'https://dotnet.microsoft.com' }
      ] }
  };
  var ORDER = ['next', 'vue', 'angular', 'backend'];
  var tabs = $$('#txTabs [role="tab"]'), panel = $('#txPanel');

  function showTech(key, focus) {
    var t = TECHS[key]; if (!t) return;
    tabs.forEach(function (b) {
      var on = b.dataset.t === key;
      b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', b.id); if (focus) b.focus(); }
    });
    var h = '<div class="tx-head"><span class="tx-ico" aria-hidden="true"><i class="' + t.icon + '"></i></span><div><h3>' + esc(t.name) + '</h3><p class="tx-tag">' + esc(t.tag) + '</p></div></div>' +
      '<div class="tx-grid"><div><h4>What it is</h4><p>' + esc(t.what) + '</p></div><div><h4>Commonly used for</h4><p>' + esc(t.used) + '</p></div></div>' +
      '<dl class="tx-facts"><div><dt>Built with</dt><dd>' + esc(t.base) + '</dd></div><div><dt>Good to know</dt><dd>' + esc(t.note) + '</dd></div></dl>';
    if (t.flow) {
      h += '<h4 class="tx-sub">How the frontend and backend connect</h4><ol class="tx-flow">' + t.flow.map(function (f) {
        return '<li><i class="' + f[0] + '" aria-hidden="true"></i><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></li>';
      }).join('') + '</ol>';
      h += '<h4 class="tx-sub">Backend technologies to know</h4><ul class="tx-stack">' + t.stack.map(function (s) {
        return '<li><div><b>' + esc(s.name) + '</b><span>' + esc(s.lang) + '</span></div><p>' + esc(s.desc) + '</p><a class="link" href="' + esc(s.url) + '" target="_blank" rel="noopener">Visit ' + esc(s.name) + ' <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></li>';
      }).join('') + '</ul>';
    }
    h += '<p class="tx-more"><a class="btn btn-navy" href="' + esc(t.url) + '" target="_blank" rel="noopener">Learn More <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>';
    panel.innerHTML = h;
    panel.classList.remove('tx-in'); void panel.offsetWidth; panel.classList.add('tx-in');
  }
  $('#txTabs').addEventListener('click', function (e) { var b = e.target.closest('[role="tab"]'); if (b) showTech(b.dataset.t); });
  $('#txTabs').addEventListener('keydown', function (e) {          // arrow keys move between the tabs
    var i = ORDER.indexOf(document.activeElement.dataset.t); if (i < 0) return;
    var j = e.key === 'ArrowRight' ? (i + 1) % ORDER.length : e.key === 'ArrowLeft' ? (i + ORDER.length - 1) % ORDER.length : e.key === 'Home' ? 0 : e.key === 'End' ? ORDER.length - 1 : -1;
    if (j < 0) return; e.preventDefault(); showTech(ORDER[j], true);
  });

  /* ---------- Start ---------- */
  setBackend('checking');
  renderProgress();
  showView();
  renderHub();
  showTech('next');
  resolveApiBase().then(function () {           // 1. find the backend
    setBackend(backend);
    loadTasks();                                 // 2. ask it for the tasks
    setInterval(checkHealth, HEALTH_EVERY_MS);   // 3. keep checking that the backend is still there
  });
})();
