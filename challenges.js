/* TechBridge Challenge Hub (Task 5)
   What this file does:
   1. Track filtering        (All / Data Analytics / Web Development)
   2. Difficulty filtering   (All / Beginner / Intermediate / Advanced)
   3. Challenge details      (View Challenge opens a popup without leaving the page)
   Extras: search, sorting, result count, "no results" message, reset button,
   and a progress indicator that is saved on this device only.
   The cards are written in challenges.html so the page still shows every challenge without JavaScript;
   the full details for each challenge live in the CHALLENGES array below. */
(function () {
  'use strict';

  /* Variables and data: every challenge is an object inside an array */
  var CHALLENGES = [
  {
    "id": "sales-analysis",
    "title": "Small Shop Sales Analysis",
    "track": "data-analytics",
    "level": "Beginner",
    "icon": "fa-cart-shopping",
    "time": "2–3 hours",
    "desc": "Explore a month of sales records for a small shop and find which products and days perform best.",
    "outcome": "A one-page summary that names the top products, the best sales days and one recommendation for the shop.",
    "objective": "Practise reading a simple sales table and turning it into clear findings.",
    "produce": [
      "A cleaned sales spreadsheet",
      "Totals by product and by day",
      "A short written summary of three findings"
    ],
    "skills": [
      "Spreadsheet analysis",
      "Sorting and filtering",
      "Basic formulas"
    ],
    "tools": [
      "Excel or Google Sheets"
    ],
    "steps": [
      "Create or find a small sales dataset of about 50 to 100 rows.",
      "Check for blanks, typing mistakes and duplicates.",
      "Add totals by product and by day with formulas or a pivot table.",
      "Write three findings and one recommendation."
    ]
  },
  {
    "id": "expense-analysis",
    "title": "Monthly Expense Analysis",
    "track": "data-analytics",
    "level": "Beginner",
    "icon": "fa-wallet",
    "time": "2–3 hours",
    "desc": "Clean up a messy list of expenses and show where the money goes each month.",
    "outcome": "A tidy expense table and a chart that shows spending by category.",
    "objective": "Practise data cleaning and grouping so that a messy list becomes easy to understand.",
    "produce": [
      "A cleaned expense table",
      "Spending totals by category",
      "One clear chart with a title and labels"
    ],
    "skills": [
      "Data cleaning",
      "Grouping data into categories",
      "Data visualization"
    ],
    "tools": [
      "Excel or Google Sheets"
    ],
    "steps": [
      "Collect or create 40 to 80 sample expenses.",
      "Fix inconsistent names, dates and amounts.",
      "Assign each expense to a category.",
      "Total each category and chart the result."
    ]
  },
  {
    "id": "customer-analysis",
    "title": "Customer Analysis",
    "track": "data-analytics",
    "level": "Intermediate",
    "icon": "fa-users",
    "time": "3–4 hours",
    "desc": "Group customers by how often and how much they buy, and spot who matters most to the business.",
    "outcome": "A customer summary that shows top customers, repeat buyers and one idea for keeping them.",
    "objective": "Use grouping and summaries to understand how customers behave.",
    "produce": [
      "A customer table with order counts and totals",
      "A top 10 customers list",
      "A comparison of repeat and one-time buyers",
      "A short recommendation"
    ],
    "skills": [
      "Data cleaning",
      "Pivot tables or SQL GROUP BY",
      "Business-focused analysis"
    ],
    "tools": [
      "Excel, Google Sheets or SQL"
    ],
    "steps": [
      "Prepare a sample orders table with customer names or IDs.",
      "Count orders and add up spending for each customer.",
      "Separate repeat customers from one-time customers.",
      "Explain what the pattern means for the business."
    ]
  },
  {
    "id": "employee-data-analysis",
    "title": "Employee Data Analysis",
    "track": "data-analytics",
    "level": "Intermediate",
    "icon": "fa-id-card",
    "time": "3–4 hours",
    "desc": "Analyse a small staff dataset to compare departments, roles and pay patterns.",
    "outcome": "A short report that compares departments and highlights two useful patterns with charts.",
    "objective": "Compare groups in a dataset and explain the differences clearly.",
    "produce": [
      "A cleaned staff table (use made-up data, never real people)",
      "A summary by department",
      "Two charts",
      "A short written explanation of what you found"
    ],
    "skills": [
      "Data cleaning",
      "Grouping and averages",
      "Data visualization"
    ],
    "tools": [
      "Excel, Google Sheets or SQL"
    ],
    "steps": [
      "Create a made-up dataset of 30 to 60 staff records.",
      "Clean the columns so each one has a consistent format.",
      "Calculate headcount and average values for each department.",
      "Chart the two comparisons that matter most and explain them."
    ]
  },
  {
    "id": "business-dashboard",
    "title": "Business Sales Dashboard",
    "track": "data-analytics",
    "level": "Intermediate",
    "icon": "fa-chart-line",
    "time": "4–5 hours",
    "desc": "Build a simple dashboard that shows how a business performs month by month.",
    "outcome": "A dashboard with key totals, a monthly trend and a top-products chart that a manager can read in a minute.",
    "objective": "Analyse sales information and present the important trends in one clear view.",
    "produce": [
      "A dashboard sheet or page",
      "Three or four charts",
      "Key totals at the top",
      "Short notes that explain the story"
    ],
    "skills": [
      "Data cleaning",
      "Data visualization",
      "Business-focused analysis"
    ],
    "tools": [
      "Spreadsheet charts or any free charting tool"
    ],
    "steps": [
      "Prepare a sales dataset covering several months.",
      "Decide the three questions a manager would ask.",
      "Build one chart or number for each question.",
      "Arrange them so the most important result comes first."
    ]
  },
  {
    "id": "churn-analysis",
    "title": "Customer Churn Analysis",
    "track": "data-analytics",
    "level": "Advanced",
    "icon": "fa-user-minus",
    "time": "5–6 hours",
    "desc": "Study which customers stopped buying and look for the patterns behind it.",
    "outcome": "A findings report that names the strongest churn patterns and suggests two ways to reduce churn.",
    "objective": "Find patterns that help explain why customers leave.",
    "produce": [
      "A churn definition that you choose and explain",
      "SQL or spreadsheet summaries by customer group",
      "Charts that compare churn between groups",
      "A report with recommendations"
    ],
    "skills": [
      "SQL",
      "Data cleaning",
      "Data visualization",
      "Business-focused analysis"
    ],
    "tools": [
      "SQL (any database) and a spreadsheet"
    ],
    "steps": [
      "Define what counts as a customer who has left.",
      "Label each customer in your dataset as active or churned.",
      "Compare churn by group, such as plan, region or purchase size.",
      "Write the patterns and two practical recommendations."
    ]
  },
  {
    "id": "landing-page",
    "title": "Responsive Landing Page",
    "track": "web-development",
    "level": "Beginner",
    "icon": "fa-window-maximize",
    "time": "3–4 hours",
    "desc": "Build a one-page landing page for a made-up product or service that works on any screen.",
    "outcome": "A clean landing page with a hero, a features section and a call to action that looks right on a phone and a laptop.",
    "objective": "Practise HTML structure and CSS layout while building something that looks like a real page.",
    "produce": [
      "An index.html and a style.css file",
      "A hero, features, call to action and footer",
      "A mobile layout"
    ],
    "skills": [
      "HTML",
      "CSS",
      "Responsive layout"
    ],
    "tools": [
      "Code editor",
      "Browser developer tools"
    ],
    "steps": [
      "Sketch the sections you want on paper first.",
      "Write the HTML for each section.",
      "Style the page for desktop, then adjust it for mobile.",
      "Test it at three screen sizes."
    ]
  },
  {
    "id": "contact-form",
    "title": "Contact Form with Validation",
    "track": "web-development",
    "level": "Beginner",
    "icon": "fa-envelope-open-text",
    "time": "2–3 hours",
    "desc": "Create a contact form that checks what visitors type before it is sent.",
    "outcome": "A form that shows clear error messages and a success message without refreshing the page.",
    "objective": "Use JavaScript to check form fields and respond to what the visitor does.",
    "produce": [
      "A form with name, email and message fields",
      "JavaScript validation for each field",
      "Error and success messages"
    ],
    "skills": [
      "HTML forms",
      "JavaScript events",
      "Basic validation"
    ],
    "tools": [
      "Code editor",
      "Browser developer tools"
    ],
    "steps": [
      "Build the form in HTML with labels for every field.",
      "Write a function that checks each field.",
      "Show a helpful message next to any field that fails.",
      "Show a success message when everything is valid."
    ]
  },
  {
    "id": "portfolio-website",
    "title": "Personal Portfolio Website",
    "track": "web-development",
    "level": "Intermediate",
    "icon": "fa-id-badge",
    "time": "5–6 hours",
    "desc": "Design a portfolio website that introduces you and shows your work.",
    "outcome": "A multi-section portfolio with navigation, an about section, project cards and contact links, published online.",
    "objective": "Combine your skills into a complete website that represents you.",
    "produce": [
      "A portfolio with several sections",
      "Project cards",
      "A responsive navigation menu",
      "A published link"
    ],
    "skills": [
      "HTML",
      "CSS",
      "Responsive design",
      "Git/GitHub"
    ],
    "tools": [
      "Code editor",
      "Git and GitHub"
    ],
    "steps": [
      "Plan your sections: about, projects and contact.",
      "Build the layout and navigation.",
      "Add project cards with a short description each.",
      "Push the code to GitHub and publish the site."
    ]
  },
  {
    "id": "product-page",
    "title": "Product Page",
    "track": "web-development",
    "level": "Intermediate",
    "icon": "fa-bag-shopping",
    "time": "4–5 hours",
    "desc": "Build a product page with an image area, details and an option picker.",
    "outcome": "A product page where choosing an option updates what the visitor sees, without a page refresh.",
    "objective": "Combine layout skills with JavaScript so that the page responds to choices.",
    "produce": [
      "A product layout with details and a price",
      "An option or image switcher",
      "A quantity selector",
      "A responsive design"
    ],
    "skills": [
      "HTML",
      "CSS",
      "JavaScript",
      "DOM manipulation"
    ],
    "tools": [
      "Code editor",
      "Browser developer tools"
    ],
    "steps": [
      "Design the product layout with a made-up product.",
      "Store the product options in a JavaScript object.",
      "Update the page when the visitor picks an option.",
      "Check that everything works on a phone."
    ]
  },
  {
    "id": "responsive-business-site",
    "title": "Responsive Business Website",
    "track": "web-development",
    "level": "Intermediate",
    "icon": "fa-building",
    "time": "5–6 hours",
    "desc": "Create a small multi-page website for a made-up local business.",
    "outcome": "A three-page website with shared navigation and styling that looks right on a phone, a tablet and a laptop.",
    "objective": "Practise building several linked pages that share one consistent design.",
    "produce": [
      "Three linked pages",
      "One shared stylesheet",
      "A mobile menu",
      "Notes from testing at three screen sizes"
    ],
    "skills": [
      "HTML",
      "CSS",
      "Responsive design",
      "Git/GitHub"
    ],
    "tools": [
      "Code editor",
      "Git and GitHub"
    ],
    "steps": [
      "Choose a made-up business and plan three pages.",
      "Build the shared header, footer and styles.",
      "Create each page with its own content.",
      "Test and fix the layout at three screen sizes."
    ]
  },
  {
    "id": "task-board",
    "title": "Interactive Task Board",
    "track": "web-development",
    "level": "Advanced",
    "icon": "fa-list-check",
    "time": "6–8 hours",
    "desc": "Build a task board where visitors add, move, filter and remove tasks.",
    "outcome": "A working task board that remembers its tasks after a refresh and works well on mobile.",
    "objective": "Use JavaScript to manage data and keep the page in step with it.",
    "produce": [
      "Add, edit and delete tasks",
      "Status columns or filters",
      "Tasks saved in the browser",
      "A responsive design"
    ],
    "skills": [
      "JavaScript (arrays, objects, DOM)",
      "CSS",
      "Browser storage",
      "Git/GitHub"
    ],
    "tools": [
      "Code editor",
      "Browser developer tools",
      "Git and GitHub"
    ],
    "steps": [
      "Decide what information a task needs.",
      "Store the tasks in an array of objects.",
      "Write one function that redraws the board from the array.",
      "Save the array in the browser and load it again."
    ]
  }
];

  var TRACKS = { 'data-analytics': 'Data Analytics', 'web-development': 'Web Development' };
  var TRACK_ICON = { 'data-analytics': 'fa-chart-column', 'web-development': 'fa-code' };
  var RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  var STORE = 'tb-challenges-v1';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var grid = $('#chGrid');
  if (!grid) return;
  var cards = $$('.ch-card', grid);
  var dlg = $('#chModal'), body = $('#chmBody');
  var byId = {};
  CHALLENGES.forEach(function (c) { byId[c.id] = c; });

  /* The current filter choices (one object holds the page state) */
  var state = { track: 'all', level: 'all', q: '', sort: 'default' };
  var lastTrigger = null;

  /* ---------- Progress, saved on this device only ---------- */
  function loadDone() {
    try { var v = JSON.parse(localStorage.getItem(STORE) || '{}'); return v && typeof v.done === 'object' && v.done ? v.done : {}; }
    catch (e) { return {}; }
  }
  var done = loadDone();
  function saveDone() { try { localStorage.setItem(STORE, JSON.stringify({ done: done })); } catch (e) { /* storage may be blocked */ } }

  function updateProgress() {
    var total = CHALLENGES.length, count = 0;
    cards.forEach(function (card) {
      var d = !!done[card.dataset.id];
      if (d) count++;
      card.classList.toggle('is-done', d);
      $('.ch-done', card).hidden = !d;
    });
    $('#chDone').textContent = count;
    $('#chBarFill').style.width = (count / total * 100) + '%';
    $('#chBarFill').parentNode.setAttribute('aria-valuenow', count);
  }

  /* ---------- Filtering (conditional logic) ---------- */
  function matches(c) {
    if (state.track !== 'all' && c.track !== state.track) return false;
    if (state.level !== 'all' && c.level !== state.level) return false;
    if (state.q) {
      var hay = [c.title, c.desc, c.outcome, TRACKS[c.track], c.level, c.skills.join(' '), c.tools.join(' ')].join(' ').toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function setPressed(groupEl, value) {
    $$('button', groupEl).forEach(function (b) {
      var on = b.dataset.value === value;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyFilters() {
    /* 1. sort the cards (DOM reorder, no refresh) */
    var ordered = cards.slice().sort(function (a, b) {
      var ca = byId[a.dataset.id], cb = byId[b.dataset.id];
      var oa = +a.dataset.order, ob = +b.dataset.order;
      if (state.sort === 'easy') return (RANK[ca.level] - RANK[cb.level]) || (oa - ob);
      if (state.sort === 'hard') return (RANK[cb.level] - RANK[ca.level]) || (oa - ob);
      return oa - ob;
    });
    ordered.forEach(function (card) { grid.appendChild(card); });

    /* 2. show or hide each card */
    var shown = 0;
    cards.forEach(function (card) {
      var show = matches(byId[card.dataset.id]);
      var wasHidden = card.hidden;
      card.hidden = !show;
      if (show) {
        shown++;
        if (wasHidden) { card.classList.remove('ch-in'); void card.offsetWidth; card.classList.add('ch-in'); }
      }
    });

    /* 3. update the count, the empty message and the reset button */
    var total = cards.length;
    $('#chCount').textContent = 'Showing ' + shown + ' of ' + total + ' challenge' + (total === 1 ? '' : 's');
    $('#chEmpty').hidden = shown !== 0;
    $('#chReset').disabled = state.track === 'all' && state.level === 'all' && !state.q && state.sort === 'default';
  }

  function resetFilters() {
    state = { track: 'all', level: 'all', q: '', sort: 'default' };
    setPressed($('#chTrack'), 'all'); setPressed($('#chLevel'), 'all');
    $('#chSearch').value = ''; $('#chSort').value = 'default';
    applyFilters();
  }

  $('#chTrack').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.track = b.dataset.value; setPressed(this, state.track); applyFilters();
  });
  $('#chLevel').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.level = b.dataset.value; setPressed(this, state.level); applyFilters();
  });
  $('#chSearch').addEventListener('input', function () { state.q = this.value.trim().toLowerCase(); applyFilters(); });
  $('#chSort').addEventListener('change', function () { state.sort = this.value; applyFilters(); });
  $('#chReset').addEventListener('click', resetFilters);
  $('#chEmptyReset').addEventListener('click', resetFilters);

  /* ---------- Challenge details popup ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(cls) { var i = document.createElement('i'); i.className = cls; i.setAttribute('aria-hidden', 'true'); return i; }
  function block(title, node) {
    var s = el('section', 'chm-block'); s.appendChild(el('h4', null, title)); s.appendChild(node); return s;
  }
  function list(tag, items) {
    var l = el(tag, 'chm-list');
    items.forEach(function (t) { l.appendChild(el('li', null, t)); });
    return l;
  }
  function chips(items) {
    var l = el('ul', 'chm-chips');
    items.forEach(function (t) { l.appendChild(el('li', null, t)); });
    return l;
  }

  function renderModal(c) {
    body.textContent = '';
    var lv = RANK[c.level];

    var badges = el('div', 'chm-badges');
    var tr = el('span', 'ch-track ' + (c.track === 'data-analytics' ? 'is-da' : 'is-wd'));
    tr.appendChild(icon('fa-solid ' + TRACK_ICON[c.track])); tr.appendChild(document.createTextNode(' ' + TRACKS[c.track]));
    var lvl = el('span', 'ch-level lv' + lv);
    var bars = el('span', 'ch-bars'); bars.setAttribute('aria-hidden', 'true');
    bars.appendChild(document.createElement('i')); bars.appendChild(document.createElement('i')); bars.appendChild(document.createElement('i'));
    lvl.appendChild(bars); lvl.appendChild(document.createTextNode(c.level));
    badges.appendChild(tr); badges.appendChild(lvl);
    body.appendChild(badges);

    var h = el('h3', null, c.title); h.id = 'chmTitle'; body.appendChild(h);
    body.appendChild(el('p', 'chm-sum', c.desc));

    var facts = el('div', 'chm-facts');
    var f1 = el('div'); f1.appendChild(icon('fa-regular fa-clock')); f1.appendChild(el('span', null, 'Estimated time')); f1.appendChild(el('strong', null, c.time));
    var f2 = el('div'); f2.appendChild(icon('fa-solid fa-signal')); f2.appendChild(el('span', null, 'Difficulty')); f2.appendChild(el('strong', null, c.level));
    var f3 = el('div'); f3.appendChild(icon('fa-solid fa-layer-group')); f3.appendChild(el('span', null, 'Track')); f3.appendChild(el('strong', null, TRACKS[c.track]));
    facts.appendChild(f1); facts.appendChild(f2); facts.appendChild(f3);
    body.appendChild(facts);

    body.appendChild(block('Challenge objective', el('p', null, c.objective)));
    body.appendChild(block('What you need to produce', list('ul', c.produce)));
    var two = el('div', 'chm-two');
    two.appendChild(block('Skills required', chips(c.skills)));
    two.appendChild(block('Tools that may be used', chips(c.tools)));
    body.appendChild(two);
    var res = el('div', 'chm-result'); res.appendChild(icon('fa-solid fa-bullseye')); res.appendChild(el('div')); 
    res.lastChild.appendChild(el('strong', null, 'Expected result')); res.lastChild.appendChild(el('p', null, c.outcome));
    body.appendChild(res);
    body.appendChild(block('Suggested steps', list('ol', c.steps)));

    var acts = el('div', 'chm-actions');
    var mark = el('button', 'btn btn-navy chm-mark'); mark.type = 'button'; mark.dataset.id = c.id;
    function paintMark() {
      var d = !!done[c.id];
      mark.textContent = '';
      mark.appendChild(icon(d ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'));
      mark.appendChild(document.createTextNode(d ? ' Completed (tap to undo)' : ' Mark as completed'));
      mark.setAttribute('aria-pressed', d ? 'true' : 'false');
    }
    paintMark();
    mark.addEventListener('click', function () {
      if (done[c.id]) delete done[c.id]; else done[c.id] = true;
      saveDone(); updateProgress(); paintMark();
    });
    var close = el('button', 'btn btn-ghost-dark'); close.type = 'button'; close.dataset.close = ''; close.textContent = 'Back to challenges';
    acts.appendChild(mark); acts.appendChild(close);
    body.appendChild(acts);
    var more = el('p', 'chm-more');
    more.appendChild(document.createTextNode('Want the official internship tasks? See the '));
    var a = el('a', 'link', 'Internship Roadmap'); a.href = 'roadmap.html'; more.appendChild(a); more.appendChild(document.createTextNode('.'));
    body.appendChild(more);
  }

  function openChallenge(id, trigger) {
    var c = byId[id]; if (!c) return;
    lastTrigger = trigger || null;
    renderModal(c);
    dlg.scrollTop = 0;
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.ch-view'); if (!b) return;
    openChallenge(b.dataset.id, b);
  });

  /* Close with the X, the Back button, the backdrop (handled in script.js) or Esc */
  dlg.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) dlg.close(); });
  dlg.addEventListener('close', function () {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    if (lastTrigger && document.contains(lastTrigger) && !lastTrigger.closest('[hidden]')) lastTrigger.focus();
  });

  /* A link like challenges.html#landing-page opens that challenge */
  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (byId[id]) {
      if (matches(byId[id]) === false) resetFilters();
      var trig = $('.ch-view[data-id="' + id + '"]');
      openChallenge(id, trig);
    }
  }
  window.addEventListener('hashchange', fromHash);

  /* ---------- Start ---------- */
  updateProgress();
  applyFilters();
  fromHash();
})();
