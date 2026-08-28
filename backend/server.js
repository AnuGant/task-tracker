const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Lets Express understand JSON sent in requests (e.g. when adding a task)
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Our "data" for now — just an array in memory. Resets if the server restarts.
let tasks = [];
let nextId = 1;

// GET /tasks -> return the current list of tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks -> add a new task
app.post('/tasks', (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id -> mark a task as complete
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = true;
  res.json(task);
});

// DELETE /tasks/:id -> remove a task
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Tracker backend running at http://localhost:${PORT}`);
});