/* TechBridge Intern Portal: tracker, registration, submission, dashboard and hub.
   Everything is saved in this browser only (localStorage). Nothing is sent anywhere. */
(function () {
  'use strict';
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function toast(m) {
    var t = $('#toast'); if (!t) return;
    t.textContent = m; t.classList.add('show'); clearTimeout(toast.i);
    toast.i = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  /* ---------- shared data ---------- */
  var KEY = 'tb-portal-v1';
  var LV = { 1: 'Beginner', 2: 'Beginner \u2192 Intermediate', 3: 'Intermediate', 4: 'Intermediate \u2192 Advanced Beginner' };
  var T = [
    [1, 1, 'Build the TechBridge Homepage', 'Create the first version of the TechBridge website using HTML and CSS.', 1],
    [2, 4, 'Build the TechBridge Programs Experience', "Create a Programs experience that presents TechBridge's available learning programs.", 2],
    [3, 8, 'Build the Internship Tasks Experience', 'Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.', 2],
    [4, 11, 'Build an Interactive Task Tracker', 'Use JavaScript to make the internship task experience interactive and allow progress to be tracked.', 3],
    [5, 15, 'Build the Intern Registration Experience', 'Create a professional registration/onboarding interface for TechBridge interns.', 3],
    [6, 19, 'Build the Task Submission System', 'Create an interface through which interns can prepare and submit their task work.', 3],
    [7, 22, 'Build the Intern Dashboard', 'Create a dashboard where an intern can view their profile, progress, tasks, and submissions.', 4],
    [8, 26, 'Build the Complete TechBridge Internship Platform', 'Combine the different components created during the internship into a complete TechBridge platform.', 4]
  ];
  var STATUS = { todo: 'To do', prog: 'In progress', done: 'Done' };
  function load() {
    var s = {}; try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    s.profile = s.profile || null; s.progress = s.progress || {}; s.subs = Array.isArray(s.subs) ? s.subs : [];
    return s;
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save on this device.'); } }
  function stat(n) { return S.progress[n] || 'todo'; }
  function counts() {
    var c = { todo: 0, prog: 0, done: 0 };
    T.forEach(function (t) { c[stat(t[0])]++; });
    return c;
  }
  var START = new Date('2026-11-03T00:00:00');
  function today() { var n = new Date(); return Math.floor((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - START) / 86400000) + 1; }
  function taskOf(n) { return T[n - 1]; }
  function ring(el, pct) {
    if (!el) return;
    var r = $('.ring-fg', el), C = 2 * Math.PI * 54;
    r.style.strokeDasharray = C; r.style.strokeDashoffset = C;
    setTimeout(function () { r.style.strokeDashoffset = C * (1 - pct / 100); }, 60);
    $('.ring-t', el).textContent = Math.round(pct) + '%';
  }
  function fmt(iso) { try { return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; } }
  function initials(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '?'; }
  function subsHtml(list, del) {
    if (!list.length) return '<p class="empty"><i class="fa-regular fa-folder-open"></i> No submissions yet.</p>';
    return list.slice().reverse().map(function (s) {
      var t = taskOf(s.task);
      return '<article class="subi"><div><span class="tno">Task ' + s.task + '</span><h3>' + esc(t ? t[2] : '') + '</h3><p class="muted">' + esc(s.ref) + ' &middot; ' + esc(fmt(s.at)) + '</p>' +
        '<p><a class="link" href="' + esc(s.repo) + '" target="_blank" rel="noopener">Repository</a> &nbsp;&middot;&nbsp; <a class="link" href="' + esc(s.live) + '" target="_blank" rel="noopener">Live site</a> &nbsp;&middot;&nbsp; ' + esc(s.shot) + '</p></div>' +
        (del ? '<button type="button" class="linkish" data-del="' + esc(s.ref) + '">Delete</button>' : '') + '</article>';
    }).join('');
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-del]'); if (!b) return;
    if (!confirm('Delete this submission from this device?')) return;
    S.subs = S.subs.filter(function (s) { return s.ref !== b.dataset.del; }); save(); toast('Submission deleted');
    if ($('#subList')) $('#subList').innerHTML = subsHtml(S.subs, true);
    if ($('#dash')) renderDash();
  });

  /* active link in the portal navigation */
  var fn = location.pathname.split('/').pop() || 'index.html';
  $$('.pnav a').forEach(function (a) { if (a.getAttribute('href') === fn) a.setAttribute('aria-current', 'page'); });

  /* ---------- Task 4: tracker ---------- */
  var tl = $('#trackerList');
  if (tl) {
    var filter = 'all';
    var renderTracker = function () {
      var c = counts(), dn = today();
      ring($('#trkRing'), c.done / 8 * 100);
      $('#cDone').textContent = c.done; $('#cDone2').textContent = c.done; $('#cProg').textContent = c.prog; $('#cTodo').textContent = c.todo;
      $('#dayLbl').textContent = dn >= 1 && dn <= 30 ? 'Today is Day ' + dn + ' of 30.' : '';
      $$('#trkTrack .tn').forEach(function (a) {
        var s = stat(+a.dataset.n); a.classList.toggle('n-done', s === 'done'); a.classList.toggle('n-prog', s === 'prog');
      });
      var nx = T.filter(function (t) { return stat(t[0]) !== 'done'; })[0], box = $('#nextUp');
      box.innerHTML = nx
        ? '<span class="tno">Up next</span><h3>Task ' + nx[0] + ': ' + esc(nx[2]) + '</h3><p class="muted">' + esc(nx[3]) + '</p><a class="btn btn-navy" href="submit.html?task=' + nx[0] + '"><i class="fa-solid fa-upload"></i> Submit this task</a>'
        : '<span class="tno">All done</span><h3>You have completed all 8 tasks.</h3><p class="muted">Well done on finishing the TechBridge internship tasks.</p><a class="btn btn-gold" href="dashboard.html"><i class="fa-solid fa-table-columns"></i> View my dashboard</a>';
      var rows = T.filter(function (t) { return filter === 'all' || stat(t[0]) === filter; });
      tl.innerHTML = rows.length ? rows.map(function (t) {
        var s = stat(t[0]);
        return '<li class="ti ' + s + '" id="t' + t[0] + '"><div class="ti-h"><span class="tno">Task ' + t[0] + '</span><span class="dchip"><i class="fa-regular fa-calendar"></i> Day ' + t[1] + '</span><span class="lvl l' + t[4] + '"><span class="meter" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' + LV[t[4]] + '</span></div>' +
          '<h3>' + esc(t[2]) + '</h3><p>' + esc(t[3]) + '</p><div class="seg" role="group" aria-label="Status of task ' + t[0] + '">' +
          ['todo', 'prog', 'done'].map(function (k) { return '<button type="button" data-n="' + t[0] + '" data-s="' + k + '" aria-pressed="' + (s === k) + '" class="' + (s === k ? 'on ' + k : '') + '">' + STATUS[k] + '</button>'; }).join('') +
          '</div><a class="link" href="submit.html?task=' + t[0] + '">Submit this task <i class="fa-solid fa-arrow-right-long"></i></a></li>';
      }).join('') : '<li class="empty">No tasks match this filter.</li>';
    };
    tl.addEventListener('click', function (e) {
      var b = e.target.closest('.seg button'); if (!b) return;
      var before = counts().done, n = b.dataset.n;
      if (b.dataset.s === 'todo') delete S.progress[n]; else S.progress[n] = b.dataset.s;
      save(); renderTracker();
      if (counts().done === 8 && before < 8 && window.tbConfetti) window.tbConfetti();
      var f = $('#t' + n + ' .seg .on'); if (f) f.focus();
    });
    $$('.ftab').forEach(function (t) {
      t.addEventListener('click', function () {
        filter = t.dataset.f;
        $$('.ftab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        renderTracker();
      });
    });
    $('#resetProg').addEventListener('click', function () {
      if (!confirm('Reset all task progress on this device?')) return;
      S.progress = {}; save(); renderTracker(); toast('Progress reset');
    });
    renderTracker();
  }

  /* ---------- generic wizard ---------- */
  function wizard(form, card, onDone) {
    var steps = $$('.fstep', form), dots = $$('.stp li', card), fill = $('.stp-fill', card), cur = 0;
    function show(n) {
      cur = n;
      steps.forEach(function (s, k) { s.hidden = k !== n; });
      dots.forEach(function (x, k) { x.classList.toggle('on', k <= n); x.classList.toggle('ok', k < n); });
      fill.style.width = (n / (steps.length - 1) * 100) + '%';
      if (onDone.onShow) onDone.onShow(n);
      card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    function valid() {
      var ok = true;
      $$('[required]', steps[cur]).forEach(function (el) {
        var good = el.checkValidity(), f = el.closest('.field');
        if (f) f.classList.toggle('bad', !good);
        if (!good && ok) { el.focus({ preventScroll: true }); ok = false; }
      });
      return ok;
    }
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-next],[data-prev]'); if (!b) return;
      if (b.hasAttribute('data-next')) { if (valid()) show(cur + 1); } else show(cur - 1);
    });
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f && e.target.checkValidity()) f.classList.remove('bad'); });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (valid()) onDone(); });
  }

  /* ---------- Task 5: registration ---------- */
  var rf = $('#regForm');
  if (rf) {
    var rc = $('#regCard'), p = S.profile;
    if (p) {
      rf.elements.name.value = p.name; rf.elements.email.value = p.email; rf.elements.level.value = p.level; rf.elements.goal.value = p.goal;
      var rr = $('input[name=program][value="' + p.program + '"]', rf); if (rr) rr.checked = true;
      var al = $('#regAlready'); al.hidden = false; al.innerHTML = '<i class="fa-solid fa-circle-check"></i> You are registered as <b>' + esc(p.name) + '</b>. You can update your details below.';
    }
    var done = function () {
      var fd = new FormData(rf);
      S.profile = { name: fd.get('name').trim(), email: fd.get('email').trim(), program: fd.get('program'), level: fd.get('level'), goal: fd.get('goal').trim(), at: new Date().toISOString() };
      save(); rf.hidden = true; $('.stp', rc).hidden = true;
      $('#regWho').textContent = S.profile.name.split(' ')[0]; $('#regAv').textContent = initials(S.profile.name);
      $('#regDone').hidden = false; $('#regAlready').hidden = true;
      if (window.tbConfetti) window.tbConfetti();
      rc.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    done.onShow = function (n) {
      if (n !== 2) return;
      var fd = new FormData(rf);
      $('#regSummary').innerHTML = [['Full name', 'name'], ['Email', 'email'], ['Program', 'program'], ['Experience level', 'level'], ['Your goal', 'goal']].map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + esc(fd.get(r[1]) || '-') + '</dd></div>';
      }).join('');
    };
    wizard(rf, rc, done);
  }

  /* ---------- Task 6: submission ---------- */
  var sf = $('#subForm');
  if (sf) {
    var q = new URLSearchParams(location.search).get('task');
    if (q && taskOf(+q)) sf.elements.task.value = String(+q);
    $('#subList').innerHTML = subsHtml(S.subs, true);
    var sentences = function (t) { return t.split(/[.!?]+(?:\s|$)/).filter(function (x) { return x.trim().length > 1; }).length; };
    var note = sf.elements.note, nc = $('#noteCount');
    note.addEventListener('input', function () {
      var n = sentences(note.value); nc.textContent = n + (n === 1 ? ' sentence' : ' sentences') + ' (write 3 to 5)';
      note.setCustomValidity(n >= 3 && n <= 5 ? '' : 'Write between 3 and 5 sentences.');
    });
    note.setCustomValidity('Write between 3 and 5 sentences.');
    sf.elements.repo.addEventListener('input', function () { this.setCustomValidity(/^https:\/\/github\.com\/[^\/\s]+\/[^\/\s]+/i.test(this.value.trim()) ? '' : 'GitHub link needed'); });
    sf.elements.repo.setCustomValidity('GitHub link needed');
    sf.elements.live.addEventListener('input', function () { this.setCustomValidity(/^https:\/\/[^\s.]+\.[^\s]+/i.test(this.value.trim()) ? '' : 'Live link needed'); });
    sf.elements.live.setCustomValidity('Live link needed');
    var shot = sf.elements.shot, prev = $('#shotPrev');
    shot.addEventListener('change', function () {
      var f = shot.files[0], ok = f && /^image\//.test(f.type) && f.size < 5 * 1024 * 1024;
      shot.setCustomValidity(ok ? '' : 'Image under 5 MB needed'); shot.closest('.field').classList.toggle('bad', !ok);
      if (ok) { var fr = new FileReader(); fr.onload = function () { prev.src = fr.result; prev.hidden = false; }; fr.readAsDataURL(f); } else prev.hidden = true;
    });
    var pend = null;
    var check = function () {
      var ok = true;
      $$('[required]', sf).forEach(function (el) {
        var good = el.checkValidity(), f = el.closest('.field');
        if (f) f.classList.toggle('bad', !good);
        if (!good && ok) { el.focus({ preventScroll: true }); ok = false; }
      });
      return ok;
    };
    sf.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f && e.target.checkValidity()) f.classList.remove('bad'); });
    sf.addEventListener('change', function (e) { var f = e.target.closest('.field'); if (f && e.target.checkValidity()) f.classList.remove('bad'); });
    sf.addEventListener('submit', function (e) {
      e.preventDefault(); if (!check()) return;
      pend = { task: +sf.elements.task.value, repo: sf.elements.repo.value.trim(), live: sf.elements.live.value.trim(), shot: shot.files[0].name, note: note.value.trim() };
      var t = taskOf(pend.task);
      $('#subSummary').innerHTML = [['Task', 'Task ' + pend.task + ': ' + t[2] + ' (Day ' + t[1] + ')'], ['Repository', pend.repo], ['Live website', pend.live], ['Screenshot', pend.shot], ['Developer note', pend.note]].map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>';
      }).join('');
      $('#subEdit').hidden = true; $('#subReview').hidden = false; $('#subCard').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
    $('#subBack').addEventListener('click', function () { $('#subReview').hidden = true; $('#subEdit').hidden = false; });
    $('#subConfirm').addEventListener('click', function () {
      var ref = 'TB-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      pend.ref = ref; pend.at = new Date().toISOString(); S.subs.push(pend); S.progress[pend.task] = 'done'; save();
      $('#subRef').textContent = ref; sf.hidden = true; $('#subDone').hidden = false; $('#subList').innerHTML = subsHtml(S.subs, true);
      if (window.tbConfetti) window.tbConfetti();
    });
    $('#subAgain').addEventListener('click', function () {
      sf.reset(); prev.hidden = true; note.setCustomValidity('Write between 3 and 5 sentences.'); nc.textContent = '0 sentences (write 3 to 5)';
      ['repo', 'live'].forEach(function (k) { sf.elements[k].setCustomValidity('x'); }); shot.setCustomValidity('x');
      $('#subDone').hidden = true; sf.hidden = false; $('#subReview').hidden = true; $('#subEdit').hidden = false; $$('.bad', sf).forEach(function (f) { f.classList.remove('bad'); });
    });
  }

  /* ---------- Task 7: dashboard ---------- */
  var dash = $('#dash');
  function renderDash() {
    var c = counts(), dn = today(), pr = S.profile, nx = T.filter(function (t) { return stat(t[0]) !== 'done'; })[0];
    var groups = [1, 2, 3, 4].map(function (l) {
      var ts = T.filter(function (t) { return t[4] === l; }), dn2 = ts.filter(function (t) { return stat(t[0]) === 'done'; }).length;
      return '<div class="grp"><div class="grp-h"><span class="lvl l' + l + '"><span class="meter" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' + LV[l] + '</span><b>' + dn2 + '/' + ts.length + '</b></div><div class="pbar"><span style="width:' + (dn2 / ts.length * 100) + '%"></span></div></div>';
    }).join('');
    dash.innerHTML =
      '<div class="dgrid"><aside>' +
      (pr ? '<div class="card prof"><div class="avatar">' + esc(initials(pr.name)) + '</div><h2>' + esc(pr.name) + '</h2><p class="muted">' + esc(pr.email) + '</p><dl class="mfacts"><div><dt>Program</dt><dd>' + esc(pr.program) + '</dd></div><div><dt>Level</dt><dd>' + esc(pr.level) + '</dd></div></dl><p class="goal"><b>My goal</b><br>' + esc(pr.goal) + '</p><a class="link" href="register.html">Edit my profile <i class="fa-solid fa-arrow-right-long"></i></a></div>'
        : '<div class="card prof"><div class="avatar">?</div><h2>No profile yet</h2><p class="muted">Create your intern profile to personalise your dashboard.</p><a class="btn btn-gold" href="register.html"><i class="fa-solid fa-user-plus"></i> Register</a></div>') +
      '<div class="card qa"><h3>Quick actions</h3><a class="link" href="tracker.html">Update my tracker <i class="fa-solid fa-arrow-right-long"></i></a><a class="link" href="submit.html">Submit task work <i class="fa-solid fa-arrow-right-long"></i></a><a class="link" href="tasks.html">View all 8 tasks <i class="fa-solid fa-arrow-right-long"></i></a></div>' +
      '<div class="card qa"><h3>My data</h3><p class="muted">Saved on this device only.</p><button type="button" class="linkish" id="dExport">Download my data</button><button type="button" class="linkish" id="dClear">Clear all my data</button></div></aside>' +
      '<div class="dmain"><div class="card trk-ring"><div class="ring-box" id="dRing"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" cx="60" cy="60" r="54"/></svg><span class="ring-t">0%</span></div><div><h2>My progress</h2><p class="muted"><b>' + c.done + '</b> of 8 tasks done &middot; ' + c.prog + ' in progress</p><p class="muted">' + (dn >= 1 && dn <= 30 ? 'Today is Day ' + dn + ' of 30.' : '') + '</p></div></div>' +
      '<div class="card"><h3>Progress by difficulty</h3>' + groups + '</div>' +
      '<div class="card next">' + (nx ? '<span class="tno">Up next</span><h3>Task ' + nx[0] + ': ' + esc(nx[2]) + '</h3><p class="muted">' + esc(nx[3]) + '</p><a class="btn btn-navy" href="submit.html?task=' + nx[0] + '"><i class="fa-solid fa-upload"></i> Submit this task</a>' : '<span class="tno">All done</span><h3>All 8 tasks completed.</h3>') + '</div>' +
      '<div class="card"><h3>My tasks</h3><ul class="dtasks">' + T.map(function (t) { var s = stat(t[0]); return '<li><span><b>Task ' + t[0] + '</b> ' + esc(t[2]) + '</span><span class="stp-s ' + s + '">' + STATUS[s] + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>My submissions</h3><div class="sublist">' + subsHtml(S.subs, true) + '</div></div></div></div>';
    ring($('#dRing'), c.done / 8 * 100);
    $('#dExport').addEventListener('click', function () {
      var a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'techbridge-intern-data.json'; d.body.appendChild(a); a.click(); a.remove();
    });
    $('#dClear').addEventListener('click', function () {
      if (!confirm('Clear your profile, progress and submissions from this device?')) return;
      try { localStorage.removeItem(KEY); } catch (e) {} S = load(); renderDash(); toast('Your data was cleared');
    });
  }
  if (dash) renderDash();

  /* ---------- Task 8: portal hub ---------- */
  var hub = $('#hubWelcome');
  if (hub) {
    var c2 = counts(), pr2 = S.profile;
    if (pr2) hub.innerHTML = '<div class="welcome-in"><div class="avatar">' + esc(initials(pr2.name)) + '</div><div><h2>Welcome back, ' + esc(pr2.name.split(' ')[0]) + '</h2><p class="muted">' + esc(pr2.program) + ' &middot; ' + c2.done + ' of 8 tasks done</p></div></div><a class="btn btn-navy" href="dashboard.html"><i class="fa-solid fa-table-columns"></i> Open my dashboard</a>';
    var set = function (k, t) { var el = $('[data-sum=' + k + ']'); if (el) el.textContent = t; };
    if (pr2) set('reg', 'Registered as ' + pr2.name + '.');
    set('trk', c2.done + ' done, ' + c2.prog + ' in progress, ' + c2.todo + ' to do.');
    set('sub', S.subs.length ? S.subs.length + ' submission' + (S.subs.length === 1 ? '' : 's') + ' saved.' : 'No submissions yet.');
    set('dash', pr2 ? 'View your profile and progress.' : 'Register to personalise it.');
  }
})();
