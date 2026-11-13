/* ==========================================================================
   TechBridge Interactive Internship Roadmap (Task 4)
   Plain JavaScript only. No frameworks.

   JavaScript concepts used, and where to find them:
   1. VARIABLES            currentTrack, STORAGE_KEY, elements such as roadList
   2. ARRAYS               each track keeps its 8 tasks in a "tasks" array
   3. OBJECTS              every task is an object { number, title, day, ... }
   4. FUNCTIONS            showTrack, renderTasks, renderDayTrack, ...
   5. EVENT LISTENERS      click and keydown on the track buttons, hashchange
   6. CONDITIONAL LOGIC    getLevel, chooseStartTrack and showTrack use if/else
   7. DOM MANIPULATION     createElement, textContent, classList, appendChild
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. VARIABLES ---------- */
  var currentTrack = 'web-development';      // the track being viewed right now
  var STORAGE_KEY = 'tb-track';              // remembers the last chosen track
  var tabs = document.querySelectorAll('.trk-btn');
  var roadList = document.getElementById('roadList');
  var dayTrack = document.getElementById('dayTrack');
  var ramp = document.getElementById('ramp');
  var vwName = document.getElementById('vwName');
  var vwSub = document.getElementById('vwSub');
  var vwIc = document.getElementById('vwIc');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 2. ARRAYS and 3. OBJECTS ----------
     Each track is an object. Its "tasks" property is an array, and every
     item in that array is an object describing one task. */
  var tracks = {
    'data-analytics': {
      name: 'Data Analytics',
      icon: 'fa-chart-column',
      tasks: [
        { number: 1, title: 'Data Cleaning Basics', day: 1, difficulty: 'Beginner',
          description: 'Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.' },
        { number: 2, title: 'Formulas & Pivot Tables', day: 4, difficulty: 'Beginner',
          description: 'Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.' },
        { number: 3, title: 'Data Visualization', day: 8, difficulty: 'Beginner \u2192 Intermediate',
          description: 'Create charts and a simple dashboard that communicate useful insights from a dataset.' },
        { number: 4, title: 'Introduction to SQL', day: 11, difficulty: 'Beginner \u2192 Intermediate',
          description: 'Practice basic SQL queries and use them to answer real-world questions about data.' },
        { number: 5, title: 'SQL Joins & Aggregations', day: 15, difficulty: 'Intermediate',
          description: 'Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.' },
        { number: 6, title: 'Lookup Functions & Data Wrangling', day: 19, difficulty: 'Intermediate',
          description: 'Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.' },
        { number: 7, title: 'Mini Analysis Project', day: 22, difficulty: 'Intermediate',
          description: 'Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.' },
        { number: 8, title: 'Capstone Project', day: 26, difficulty: 'Intermediate',
          description: 'Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.' }
      ]
    },
    'web-development': {
      name: 'Web Development',
      icon: 'fa-code',
      tasks: [
        { number: 1, title: 'Build the TechBridge Homepage', day: 1, difficulty: 'Beginner',
          description: 'Create the first version of the TechBridge website using HTML and CSS.' },
        { number: 2, title: 'Build the TechBridge Programs Experience', day: 4, difficulty: 'Beginner',
          description: "Create a Programs experience presenting TechBridge's available learning programs." },
        { number: 3, title: 'Build the Internship Tasks Experience', day: 8, difficulty: 'Beginner \u2192 Intermediate',
          description: 'Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.' },
        { number: 4, title: 'Build an Interactive Internship Roadmap', day: 11, difficulty: 'Beginner \u2192 Intermediate',
          description: 'Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.' },
        { number: 5, title: 'Build the Intern Registration Experience', day: 15, difficulty: 'Intermediate',
          description: 'Create a professional registration and onboarding interface for TechBridge interns.' },
        { number: 6, title: 'Build the Task Submission System', day: 19, difficulty: 'Intermediate',
          description: 'Create an interface through which interns can prepare and submit their task work.' },
        { number: 7, title: 'Build the Intern Dashboard', day: 22, difficulty: 'Intermediate',
          description: 'Create a dashboard where an intern can view their profile, progress, tasks and submissions.' },
        { number: 8, title: 'Build the Complete TechBridge Internship Platform', day: 26, difficulty: 'Intermediate',
          description: 'Combine the different components created during the internship into a complete TechBridge platform.' }
      ]
    }
  };

  /* ---------- 6. CONDITIONAL LOGIC ---------- */
  // Turns a difficulty label into a level from 1 (easiest) to 3 (hardest).
  function getLevel(difficulty) {
    if (difficulty === 'Beginner') {
      return 1;
    } else if (difficulty === 'Beginner \u2192 Intermediate') {
      return 2;
    } else {
      return 3;
    }
  }

  // Decides which track to open first: the link, then the last visit, then a default.
  function chooseStartTrack() {
    var fromLink = window.location.hash.replace('#', '');
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    if (tracks[fromLink]) {
      return fromLink;
    } else if (tracks[saved]) {
      return saved;
    } else {
      return 'web-development';
    }
  }

  /* ---------- 4. FUNCTIONS + 7. DOM MANIPULATION ---------- */
  // Builds the small difficulty label (name plus a four-bar meter).
  function createLevelChip(difficulty) {
    var chip = document.createElement('span');
    chip.className = 'lvl l' + getLevel(difficulty);
    var meter = document.createElement('span');
    meter.className = 'meter';
    meter.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 4; i++) { meter.appendChild(document.createElement('i')); }
    chip.appendChild(meter);
    chip.appendChild(document.createTextNode(difficulty));
    return chip;
  }

  // Builds one task card (one <li>) from a task object.
  function createTaskCard(task, position) {
    var item = document.createElement('li');
    item.className = 'stop';
    item.id = 'task-' + task.number;
    item.style.animationDelay = (position * 70) + 'ms';

    var marker = document.createElement('div');
    marker.className = 'day';
    marker.setAttribute('aria-hidden', 'true');
    marker.innerHTML = '<span>Day</span><b>' + task.day + '</b>';

    var card = document.createElement('article');
    card.className = 'tcard';

    var head = document.createElement('header');
    var number = document.createElement('span');
    number.className = 'tno';
    number.textContent = 'Task ' + task.number;
    head.appendChild(number);

    var title = document.createElement('h3');
    title.textContent = task.title;

    var text = document.createElement('p');
    text.className = 'tdesc';
    text.textContent = task.description;

    var meta = document.createElement('div');
    meta.className = 'tmeta';
    var dayChip = document.createElement('span');
    dayChip.className = 'dchip';
    dayChip.innerHTML = '<i class="fa-regular fa-calendar"></i> Day ' + task.day;
    meta.appendChild(dayChip);
    meta.appendChild(createLevelChip(task.difficulty));

    card.appendChild(head);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(meta);
    item.appendChild(marker);
    item.appendChild(card);
    return item;
  }

  // Shows the 8 task cards of the chosen track.
  function renderTasks(trackKey) {
    var list = tracks[trackKey].tasks;
    roadList.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      roadList.appendChild(createTaskCard(list[i], i));
    }
  }

  // Draws the 30-day line with one dot for each task, placed on its day.
  function renderDayTrack(trackKey) {
    var list = tracks[trackKey].tasks;
    dayTrack.innerHTML = '<div class="track-line"><div class="track-fill" style="width:100%"></div></div>';
    list.forEach(function (task) {
      var dot = document.createElement('a');
      dot.className = 'tn lv' + getLevel(task.difficulty);
      dot.style.left = ((task.day - 1) / 29 * 100).toFixed(2) + '%';
      dot.href = '#task-' + task.number;
      dot.setAttribute('aria-label', 'Task ' + task.number + ', Day ' + task.day + ', ' + task.difficulty);
      dot.innerHTML = '<b>' + task.number + '</b><span>Day ' + task.day + '</span>';
      dot.addEventListener('click', function (event) {
        event.preventDefault();
        var target = document.getElementById('task-' + task.number);
        if (target) { target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); }
      });
      dayTrack.appendChild(dot);
    });
    var end = document.createElement('span');
    end.className = 'tend';
    end.style.left = '100%';
    end.innerHTML = '<b><i class="fa-solid fa-flag-checkered"></i></b><span>Day 30</span>';
    dayTrack.appendChild(end);
  }

  // Draws one bar per task. Taller bars mean harder tasks.
  function renderRamp(trackKey) {
    var list = tracks[trackKey].tasks;
    ramp.innerHTML = '';
    list.forEach(function (task, index) {
      var level = getLevel(task.difficulty);
      var col = document.createElement('div');
      col.className = 'rbar';
      col.title = 'Task ' + task.number + ': ' + task.difficulty;
      var bar = document.createElement('i');
      bar.className = 'rb l' + level;
      bar.style.height = (level / 3 * 100) + '%';
      bar.style.animationDelay = (index * 60) + 'ms';
      var label = document.createElement('span');
      label.textContent = 'Day ' + task.day;
      col.appendChild(bar);
      col.appendChild(label);
      ramp.appendChild(col);
    });
  }

  // Updates the "Currently viewing" banner.
  function updateViewing(trackKey) {
    var track = tracks[trackKey];
    var last = track.tasks[track.tasks.length - 1];
    vwName.textContent = track.name.toUpperCase();
    vwSub.textContent = track.tasks.length + ' tasks \u00B7 Day ' + track.tasks[0].day + ' to Day ' + last.day + ' \u00B7 ' + track.tasks[0].difficulty + ' to ' + last.difficulty;
    vwIc.innerHTML = '<i class="fa-solid ' + track.icon + '"></i>';
    var banner = document.getElementById('viewing');
    banner.classList.remove('flash');
    void banner.offsetWidth;            // restart the animation
    banner.classList.add('flash');
  }

  // The main function: switch to a track and refresh every part of the page.
  function showTrack(trackKey, updateAddress) {
    if (!tracks[trackKey]) { trackKey = 'web-development'; }   // safety check
    currentTrack = trackKey;                                   // update the variable

    tabs.forEach(function (tab) {
      var isActive = tab.dataset.track === currentTrack;
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;
      tab.classList.toggle('active', isActive);
    });

    updateViewing(currentTrack);
    renderDayTrack(currentTrack);
    renderRamp(currentTrack);
    renderTasks(currentTrack);

    if (updateAddress) {
      try { localStorage.setItem(STORAGE_KEY, currentTrack); } catch (e) {}
      if (window.history && history.replaceState) { history.replaceState(null, '', '#' + currentTrack); }
    }
  }

  /* ---------- 5. EVENT LISTENERS ---------- */
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      showTrack(tab.dataset.track, true);
    });
    tab.addEventListener('keydown', function (event) {     // arrow keys move between tracks
      var next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { next = tabs[(index + 1) % tabs.length]; }
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
      if (next) { event.preventDefault(); next.focus(); showTrack(next.dataset.track, true); }
    });
  });

  window.addEventListener('hashchange', function () {      // links such as roadmap.html#data-analytics
    var wanted = window.location.hash.replace('#', '');
    if (tracks[wanted] && wanted !== currentTrack) { showTrack(wanted, false); }
  });

  /* ---------- Start the page ---------- */
  showTrack(chooseStartTrack(), false);
})();
