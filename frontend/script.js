const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

// Ask the backend for the current tasks and display them
async function loadTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  renderTasks(tasks);
}

// Rebuild the visible list from a tasks array
function renderTasks(tasks) {
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.title;
    li.appendChild(span);

    const buttons = document.createElement('div');

    if (!task.completed) {
      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Complete';
      completeBtn.onclick = () => completeTask(task.id);
      buttons.appendChild(completeBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);
    buttons.appendChild(deleteBtn);

    li.appendChild(buttons);
    list.appendChild(li);
  });
}

async function addTask(title) {
  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  loadTasks();
}

async function completeTask(id) {
  await fetch(`/tasks/${id}`, { method: 'PUT' });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (title) {
    addTask(title);
    input.value = '';
  }
});

loadTasks();