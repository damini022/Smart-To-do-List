const taskList = document.getElementById("taskList");

window.onload = loadTasks;

function addTask() {
  const title = document.getElementById("taskInput").value.trim();
  const desc = document.getElementById("descInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;
  const category = document.getElementById("categoryInput").value;

  if (!title || !dueDate) {
    alert("Please fill in at least Task Title and Due Date.");
    return;
  }

  const task = { title, desc, dueDate, priority, category };
  saveTask(task);
  createTaskElement(task);
  clearInputs();
}

function clearInputs() {
  document.getElementById("taskInput").value = "";
  document.getElementById("descInput").value = "";
  document.getElementById("dueDateInput").value = "";
}

function createTaskElement(task) {
  const li = document.createElement("li");
     li.classList.add("task-enter");

  // Check overdue
  const now = new Date();
  const due = new Date(task.dueDate);
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const daysLeft = Math.floor((due - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) li.classList.add("overdue");

  li.innerHTML = `
    <strong>${task.title}</strong>
    <div>${task.desc}</div>
    <div class="countdown">${getCountdownText(daysLeft)}</div>
    <div class="badges">
      <span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
      <span class="badge category-${task.category.toLowerCase()}">${task.category}</span>
    </div>
    <span class="delete-btn" onclick="deleteTask(this)">delete</span>
  `;

  taskList.appendChild(li);
}

function getCountdownText(days) {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
  if (days === 0) return `Due Today`;
  return ` Due in ${days} day${days !== 1 ? 's' : ''}`;
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasks();

  // Sort by due date
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  taskList.innerHTML = "";
  tasks.forEach(task => createTaskElement(task));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function deleteTask(el) {
  const taskTitle = el.parentElement.querySelector("strong").textContent;
  let tasks = getTasks();
  tasks = tasks.filter(task => task.title !== taskTitle);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  el.parentElement.remove();
}

