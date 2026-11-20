/* ==========================================================================
   TechBridge Intern Dashboard (Task 6)
   Plain JavaScript only. No frameworks.

   JavaScript concepts used, and where to find them:
   1. ARRAYS and OBJECTS     TASKS (8 task objects) and TECHS (the technology explorer content)
   2. STATE                  one `status` object remembers the status of every task
   3. FUNCTIONS              counts, renderProgress, renderTasks, setStatus, openTask, showTech ...
   4. DOM MANIPULATION       task cards are generated from the TASKS array, nothing is typed by hand
   5. EVENT LISTENERS        click (event delegation), input, keydown
   6. CONDITIONAL LOGIC      filters, status text, which buttons a card shows
   7. PROGRESS CALCULATIONS  completed / total * 100
   8. LOCAL STORAGE          progress is saved on this device only
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. DATA: the internship tasks ----------
     Every task is an object inside the TASKS array. The cards on the page are built from this data.
     To change a task (for example when TechBridge shares Task 7 and Task 8), edit it here. */
  var TASKS = [
    { number: 1, title: 'Build the TechBridge Homepage', status: 'done',
      description: 'Create the first version of the TechBridge website using HTML and CSS.',
      what: 'The first version of the TechBridge website, built with HTML and CSS.',
      timing: 'Day 1 of the 30-day internship', difficulty: 'Beginner', tech: 'HTML5 + CSS3',
      page: 'index.html', pageLabel: 'Open the homepage' },
    { number: 2, title: 'Build the TechBridge Programs Experience', status: 'done',
      description: "Create a Programs experience presenting TechBridge's available learning programs.",
      what: "A Programs experience presenting TechBridge's available learning programs.",
      timing: 'Day 4 of the 30-day internship', difficulty: 'Beginner', tech: 'HTML5 + CSS3', buildsOn: 'The website you created in Task 1.',
      page: 'programs.html', pageLabel: 'Open the Programs page' },
    { number: 3, title: 'Build the Internship Tasks Experience', status: 'done',
      description: 'Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.',
      what: 'An interface that presents the TechBridge internship tasks and helps users understand the internship journey.',
      timing: 'Day 8 of the 30-day internship', difficulty: 'Beginner \u2192 Intermediate', tech: 'HTML5 + CSS3', buildsOn: 'The website you created in Tasks 1 and 2.',
      page: 'tasks.html', pageLabel: 'Open the Internship Tasks page' },
    { number: 4, title: 'Build an Interactive Internship Roadmap', status: 'done',
      description: 'Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.',
      what: 'An interactive roadmap that lets visitors switch between the Data Analytics and Web Development internship tracks.',
      timing: 'Day 11 of the 30-day internship', difficulty: 'Beginner \u2192 Intermediate', tech: 'HTML5 + CSS3 + JavaScript', buildsOn: 'The Internship Tasks experience from Task 3.',
      page: 'roadmap.html', pageLabel: 'Open the Internship Roadmap' },
    { number: 5, title: 'Build a TechBridge Challenge Section', status: 'done',
      description: 'Build an interactive Challenge Hub where visitors can browse, filter and explore Data Analytics and Web Development challenges.',
      what: 'An interactive Challenge Hub with track and difficulty filters, and a details view for every challenge.',
      timing: 'Nov 17 to Nov 19, 2026', time: '3\u20134 hours', difficulty: 'Beginner \u2192 Intermediate', tech: 'HTML, CSS & JavaScript', buildsOn: 'The two tracks from Task 4.',
      page: 'challenges.html', pageLabel: 'Open the Challenge Hub' },
    { number: 6, title: 'Build the TechBridge Intern Dashboard', status: 'prog',
      description: 'Build an interactive dashboard where an intern can see progress, track tasks, explore the Challenge Hub and learn about modern web technologies.',
      what: 'An interactive Intern Dashboard with a progress section, a task tracker with filters, task details, a link to the Challenge Hub and a technology explorer.',
      timing: 'Nov 20 to Nov 23, 2026', time: '4\u20136 hours', difficulty: 'Intermediate', tech: 'HTML5, CSS3 & JavaScript', buildsOn: 'The Challenge Hub from Task 5.',
      page: '#progress', pageLabel: 'You are on this page now' },
    { number: 7, title: 'Next task to be announced', status: 'todo', tba: true,
      description: 'TechBridge has not shared this task yet. Its details will appear here once the official brief is published.',
      what: 'To be confirmed by TechBridge in the official task brief.' },
    { number: 8, title: 'Final task to be announced', status: 'todo', tba: true,
      description: 'TechBridge has not shared this task yet. Its details will appear here once the official brief is published.',
      what: 'To be confirmed by TechBridge in the official task brief.' }
  ];
  var TOTAL = TASKS.length;
  var LABEL = { done: 'Completed', prog: 'In Progress', todo: 'Not Started' };
  var ICON = { done: 'fa-solid fa-circle-check', prog: 'fa-solid fa-circle-half-stroke', todo: 'fa-regular fa-circle' };
  var STORE = 'tb-dashboard-v1';

  /* ---------- 2. STATE ---------- */
  var status = {};            // { 1: 'done', 2: 'done', ... }
  var filter = 'all';         // all | done | prog | todo
  var query = '';             // search text
  var openNumber = null;      // task shown in the popup
  var lastTrigger = null;

  function defaults() { var s = {}; TASKS.forEach(function (t) { s[t.number] = t.status; }); return s; }
  function load() {
    var s = defaults();
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved && saved.status) Object.keys(s).forEach(function (k) { if (LABEL[saved.status[k]]) s[k] = saved.status[k]; });
    } catch (e) { /* storage may be blocked: the defaults are used */ }
    return s;
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify({ status: status })); } catch (e) { /* ignore */ } }
  status = load();

  function taskOf(n) { return TASKS.filter(function (t) { return t.number === n; })[0]; }

  /* ---------- 7. PROGRESS CALCULATIONS ---------- */
  function counts() {
    var c = { done: 0, prog: 0, todo: 0 };
    TASKS.forEach(function (t) { c[status[t.number]]++; });
    return c;
  }
  function percent(done) { return done / TOTAL * 100; }
  function pctText(p) { return (Math.round(p * 10) / 10) + '%'; }         // 37.5 -> "37.5%", 50 -> "50%"
  function currentTask() {                                                 // the task the intern should work on now
    var p = TASKS.filter(function (t) { return status[t.number] === 'prog'; })[0];
    return p || TASKS.filter(function (t) { return status[t.number] === 'todo'; })[0] || null;
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id); toast.id = setTimeout(function () { t.classList.remove('show'); }, 3200);
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
    var full = readProfileName(), first = full ? full.split(/\s+/)[0] : 'Alex';
    $('#dWelcome').textContent = 'Welcome back, ' + first;
    $('#dAvatar').textContent = (full || 'Alex').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    $('#dSample').hidden = !!full;                                         // only show the sample note when no profile exists

    var st = c.done === TOTAL ? 'Completed' : (c.done === 0 && c.prog === 0 ? 'Not Started' : 'In Progress');
    var pill = $('#dStatus');
    pill.textContent = 'Internship Status: ' + st;
    pill.className = 'dsh-status ' + (st === 'Completed' ? 's-done' : st === 'Not Started' ? 's-todo' : 's-prog');

    $('#dMsg').textContent = c.done === TOTAL
      ? 'You have completed all ' + TOTAL + ' tasks. Well done, and thank you for the work you put in.'
      : 'Good to see you again. Keep your tasks up to date below and watch your progress grow.';

    var cur = currentTask(), btn = $('#dContinue');
    if (cur) { btn.hidden = false; btn.dataset.n = cur.number; btn.querySelector('span').textContent = (status[cur.number] === 'prog' ? 'Continue Task ' : 'Start Task ') + cur.number; }
    else { btn.hidden = true; }
  }

  /* ---------- Progress section ---------- */
  function renderProgress() {
    var c = counts(), p = percent(c.done);
    $('#pDone').textContent = c.done;
    $('#pPct').textContent = pctText(p);
    $('#pFill').style.width = p + '%';
    $('#pBar').setAttribute('aria-valuenow', Math.round(p * 10) / 10);
    $('#sTotal').textContent = TOTAL;
    $('#sDone').textContent = c.done;
    $('#sProg').textContent = c.prog;
    $('#sTodo').textContent = c.todo;
    $('#sRemain').textContent = TOTAL - c.done;
    $('#pRemain').textContent = (TOTAL - c.done) + (TOTAL - c.done === 1 ? ' Task Remaining' : ' Tasks Remaining');

    $('#pRail').innerHTML = TASKS.map(function (t) {
      var s = status[t.number];
      return '<li class="' + 's-' + s + '"><span class="sr">Task ' + t.number + ': ' + LABEL[s] + '</span><b aria-hidden="true">' + t.number + '</b></li>';
    }).join('');

    $('#cCelebrate').hidden = c.done !== TOTAL;

    /* counts on the filter buttons */
    var all = { all: TOTAL, done: c.done, prog: c.prog, todo: c.todo };
    $$('#tFilters button').forEach(function (b) { $('em', b).textContent = all[b.dataset.f]; });
    renderWelcome(c);
  }

  /* ---------- Task tracker: build cards from the data ---------- */
  function matches(t) {
    if (filter !== 'all' && status[t.number] !== filter) return false;
    if (query) {
      var hay = ('task ' + t.number + ' ' + t.title + ' ' + t.description).toLowerCase();
      if (hay.indexOf(query) === -1) return false;
    }
    return true;
  }
  function cardHtml(t) {
    var s = status[t.number], n = t.number;
    var actions = '<button type="button" class="btn btn-navy tt-view" data-act="view" data-n="' + n + '" aria-haspopup="dialog" aria-label="View Task ' + n + ': ' + esc(t.title) + '">View Task</button>';
    if (s === 'prog') actions += '<button type="button" class="btn btn-gold tt-do" data-act="done" data-n="' + n + '" aria-label="Mark Task ' + n + ' as completed"><i class="fa-solid fa-check" aria-hidden="true"></i> Mark as Completed</button>';
    if (s === 'todo') actions += '<button type="button" class="btn btn-ghost-dark tt-do" data-act="start" data-n="' + n + '" aria-label="Start Task ' + n + '"><i class="fa-solid fa-play" aria-hidden="true"></i> Start Task</button>' +
      '<button type="button" class="tt-link" data-act="done" data-n="' + n + '" aria-label="Mark Task ' + n + ' as completed">Mark as Completed</button>';
    if (s === 'done') actions += '<button type="button" class="tt-link" data-act="reopen" data-n="' + n + '" aria-label="Reopen Task ' + n + '">Undo</button>';
    return '<article class="tt-card s-' + s + '" id="task-' + n + '" data-n="' + n + '">' +
      '<header><span class="tt-no">TASK ' + n + '</span><span class="tt-st s-' + s + '"><i class="' + ICON[s] + '" aria-hidden="true"></i> ' + LABEL[s] + '</span></header>' +
      '<h3>' + esc(t.title) + '</h3><p>' + esc(t.description) + '</p>' +
      '<div class="tt-actions">' + actions + '</div></article>';
  }
  function renderTasks(popNumber) {
    var rows = TASKS.filter(matches);
    $('#taskGrid').innerHTML = rows.map(cardHtml).join('');
    $('#tEmpty').hidden = rows.length !== 0;
    $('#tCount').textContent = 'Showing ' + rows.length + ' of ' + TOTAL + ' tasks';
    if (popNumber && !reduce) { var el = $('#task-' + popNumber); if (el) el.classList.add('tt-pop'); }
  }

  function setStatus(n, s, silent) {
    var t = taskOf(n); if (!t || status[n] === s) return;
    status[n] = s; save();
    renderProgress(); renderTasks(n);
    if (openNumber === n) renderModal(n);
    if (!silent) {
      if (s === 'done') { toast('Task ' + n + ' marked as completed. ' + counts().done + ' of ' + TOTAL + ' done.'); if (counts().done === TOTAL) celebrate(); }
      else if (s === 'prog') toast('Task ' + n + ' is now in progress.');
      else toast('Task ' + n + ' moved back to Not Started.');
    }
  }

  /* ---------- Filters (conditional logic) ---------- */
  function setFilter(f) {
    filter = f;
    $$('#tFilters button').forEach(function (b) { var on = b.dataset.f === f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    renderTasks();
  }

  /* ---------- Task details popup ---------- */
  var dlg = $('#taskModal'), mBody = $('#tmBody');
  function field(label, value) { return value ? '<div><dt>' + label + '</dt><dd>' + esc(value) + '</dd></div>' : ''; }
  function renderModal(n) {
    var t = taskOf(n), s = status[n], c = '';
    c += '<div class="tm-top"><span class="tt-no">TASK ' + n + '</span><span class="tt-st s-' + s + '"><i class="' + ICON[s] + '" aria-hidden="true"></i> ' + LABEL[s] + '</span></div>';
    c += '<h3 id="tmTitle">' + esc(t.title) + '</h3><p class="tm-desc">' + esc(t.description) + '</p>';
    c += '<dl class="tm-facts">' + field('What you build', t.what) + field('Timing', t.timing) + field('Estimated time', t.time) + field('Difficulty', t.difficulty) + field('Technologies', t.tech) + field('Builds on', t.buildsOn) + '</dl>';
    if (t.tba) c += '<p class="tm-note"><span class="pill">Confirm with TechBridge</span> Check the official TechBridge task brief and the WhatsApp Community for this task.</p>';
    c += '<div class="tm-actions">';
    if (s === 'todo') c += '<button type="button" class="btn btn-ghost-dark" data-act="start" data-n="' + n + '"><i class="fa-solid fa-play" aria-hidden="true"></i> Start Task</button>';
    if (s !== 'done') c += '<button type="button" class="btn btn-gold" data-act="done" data-n="' + n + '"><i class="fa-solid fa-check" aria-hidden="true"></i> Mark as Completed</button>';
    if (s === 'done') c += '<button type="button" class="btn btn-ghost-dark" data-act="reopen" data-n="' + n + '">Undo completion</button>';
    if (t.page && t.page.charAt(0) !== '#') c += '<a class="btn btn-navy" href="' + esc(t.page) + '"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ' + esc(t.pageLabel) + '</a>';
    c += '<button type="button" class="btn btn-ghost-dark" data-close>Close</button></div>';
    mBody.innerHTML = c;
  }
  function openTask(n, trigger) {
    if (!taskOf(n)) return;
    openNumber = n; lastTrigger = trigger || null;
    renderModal(n); dlg.scrollTop = 0;
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
  }
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    var b = e.target.closest('[data-act]'); if (b) act(b.dataset.act, +b.dataset.n);
  });
  dlg.addEventListener('close', function () {
    openNumber = null;
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  });

  /* ---------- one place that reacts to every button ---------- */
  function act(a, n) {
    if (a === 'done') setStatus(n, 'done');
    else if (a === 'start') setStatus(n, 'prog');
    else if (a === 'reopen') setStatus(n, 'prog');
  }
  $('#taskGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var n = +b.dataset.n;
    if (b.dataset.act === 'view') openTask(n, b); else act(b.dataset.act, n);
  });
  $('#tFilters').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
  $('#tSearch').addEventListener('input', function () { query = this.value.trim().toLowerCase(); renderTasks(); });
  $('#tEmptyReset').addEventListener('click', function () { $('#tSearch').value = ''; query = ''; setFilter('all'); });
  $('#dContinue').addEventListener('click', function () { openTask(+this.dataset.n, this); });
  $('#tReset').addEventListener('click', function () {
    if (!confirm('Reset the dashboard to the sample progress? This only affects this device.')) return;
    status = defaults(); save(); renderProgress(); renderTasks(); toast('Progress reset to the sample.');
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
  renderProgress();
  renderTasks();
  renderHub();
  showTech('next');
})();
