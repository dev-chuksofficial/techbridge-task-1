/* ==========================================================================
   TechBridge Task Management API  (Task 7)
   Node.js + Express

   What this server does:
   1. Starts a web server on http://localhost:3000
   2. Keeps the internship tasks (from data/tasks.json) in memory
   3. Accepts requests from the dashboard and answers with JSON
   4. Also serves the frontend, so http://localhost:3000/dashboard.html works

   Endpoints
   GET    /api/health        Is the backend running?          (used by the status indicator)
   GET    /api/tasks         Get all tasks
   GET    /api/tasks/:id     Get one task
   PUT    /api/tasks/:id     Update a task's status           body: { "status": "completed" }
   POST   /api/tasks         Add a new task                   (optional challenge)
   DELETE /api/tasks/:id     Delete a task                    (optional challenge)
   POST   /api/tasks/reset   Restore the original tasks       (demo helper)
   ========================================================================== */
'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

/* ---------- settings ---------- */
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const VALID_STATUSES = ['completed', 'in-progress', 'not-started'];
const PERSIST = process.env.PERSIST === 'true';              // PERSIST=true saves changes back into tasks.json
const DELAY_MS = Number(process.env.DELAY_MS) || 0;          // DELAY_MS=1500 slows the API down so you can see the loading state

/* ---------- the task data ----------
   The tasks are read from data/tasks.json once, when the server starts, and then kept in this array.
   Updates change this array. Unless PERSIST=true, restarting the server restores the original data. */
function readTasksFromFile() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
let tasks = readTasksFromFile();

function saveIfNeeded() {
  if (!PERSIST) return;
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2) + '\n');
}

/* ---------- small helpers ---------- */
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
function findTask(id) {
  return tasks.find(function (t) { return t.id === id; });
}
function isText(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

/* ---------- middleware (runs before the routes) ---------- */

// 1. Allow the dashboard to call the API even when it is opened from another port (for example VS Code Live Server)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 2. Read JSON sent in the body of a request (needed for PUT and POST)
app.use(express.json());

// 3. Print one line per API request in the terminal, so you can watch the dashboard talking to the server
app.use('/api', function (req, res, next) {
  const started = Date.now();
  res.on('finish', function () {
    console.log(req.method + ' ' + req.originalUrl + ' -> ' + res.statusCode + ' (' + (Date.now() - started) + ' ms)');
  });
  next();
});

// 4. Optional artificial delay, only for demos
if (DELAY_MS > 0) {
  app.use('/api', function (req, res, next) { setTimeout(next, DELAY_MS); });
}

/* ---------- API routes ---------- */

// Is the backend alive?
app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', service: 'TechBridge Task Management API', tasks: tasks.length });
});

// GET /api/tasks  ->  all tasks
app.get('/api/tasks', function (req, res) {
  res.json(tasks);
});

// POST /api/tasks/reset  ->  put the original tasks back (handy before a demo)
app.post('/api/tasks/reset', function (req, res) {
  tasks = readTasksFromFile();
  res.json({ message: 'Tasks reset to the original data.', count: tasks.length });
});

// GET /api/tasks/:id  ->  one task
app.get('/api/tasks/:id', function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'The task id must be a positive whole number.' });
  const task = findTask(id);
  if (!task) return res.status(404).json({ error: 'Task ' + id + ' was not found.' });
  res.json(task);
});

// PUT /api/tasks/:id  ->  update a task's status
app.put('/api/tasks/:id', function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'The task id must be a positive whole number.' });
  const task = findTask(id);
  if (!task) return res.status(404).json({ error: 'Task ' + id + ' was not found.' });

  const status = (req.body || {}).status;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use one of: ' + VALID_STATUSES.join(', ') + '.' });
  }
  task.status = status;
  saveIfNeeded();
  res.json(task);
});

// POST /api/tasks  ->  add a new task (optional challenge)
app.post('/api/tasks', function (req, res) {
  const body = req.body || {};
  if (!isText(body.title, 120)) return res.status(400).json({ error: 'A title is required (up to 120 characters).' });
  if (body.description !== undefined && !(typeof body.description === 'string' && body.description.length <= 500)) {
    return res.status(400).json({ error: 'The description must be text of up to 500 characters.' });
  }
  const status = body.status === undefined ? 'not-started' : body.status;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use one of: ' + VALID_STATUSES.join(', ') + '.' });
  }
  const nextId = tasks.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1;
  const task = { id: nextId, title: body.title.trim(), description: (body.description || '').trim(), status: status };
  tasks.push(task);
  saveIfNeeded();
  res.status(201).location('/api/tasks/' + nextId).json(task);
});

// DELETE /api/tasks/:id  ->  remove a task (optional challenge)
app.delete('/api/tasks/:id', function (req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'The task id must be a positive whole number.' });
  const task = findTask(id);
  if (!task) return res.status(404).json({ error: 'Task ' + id + ' was not found.' });
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveIfNeeded();
  res.json({ message: 'Task ' + id + ' was deleted.', task: task });
});

/* ---------- serve the frontend ---------- */
app.use(express.static(FRONTEND_DIR));

/* ---------- anything under /api that did not match above ---------- */
app.use('/api', function (req, res) {
  res.status(404).json({ error: 'Route not found: ' + req.method + ' ' + req.originalUrl });
});

/* ---------- error handler (must have 4 parameters) ---------- */
app.use(function (err, req, res, next) {      // eslint-disable-line no-unused-vars
  if (err && (err.type === 'entity.parse.failed' || err.status === 400)) {
    return res.status(400).json({ error: 'The request body is not valid JSON.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

/* ---------- start ---------- */
if (require.main === module) {
  app.listen(PORT, function () {
    console.log('TechBridge Task Management API is running');
    console.log('  Dashboard: http://localhost:' + PORT + '/dashboard.html');
    console.log('  API:       http://localhost:' + PORT + '/api/tasks');
    console.log('  Loaded ' + tasks.length + ' tasks from data/tasks.json' + (PERSIST ? ' (saving changes: ON)' : ''));
  });
}

module.exports = app;   // exported so the app can be tested
