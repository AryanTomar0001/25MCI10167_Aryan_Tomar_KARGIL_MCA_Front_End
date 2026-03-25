let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterType = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!title) {
    alert("Task cannot be empty");
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false
  });

  saveTasks();
  renderTasks();
}

function renderTasks() {
  let total = document.getElementById("total");
  let completed = document.getElementById("completed");
  let pending = document.getElementById("pending");

  total.textContent = tasks.length;
  completed.textContent = tasks.filter(task => task.completed).length;
  pending.textContent = tasks.filter(task => !task.completed).length;

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (filterType === "completed") return task.completed;
    if (filterType === "pending") return !task.completed;
    return true;
  });

  filtered.forEach(task => {
    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.deadline && task.deadline < today;

    const card = document.createElement("div");
    card.className = `card p-3 mb-2 ${isOverdue ? "border-danger" : ""}`;

    card.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5 class="${task.completed ? 'text-decoration-line-through text-muted' : ''}">
            ${task.title}
          </h5>

          <span class="badge ${
            task.priority === "High" ? "bg-danger" :
            task.priority === "Medium" ? "bg-warning" : "bg-success"
          }">${task.priority}</span>

          <small class="ms-2"> ${task.deadline || "No Date"}</small>
        </div>

        <div>
          <button class="btn btn-success btn-sm" onclick="toggleTask(${task.id})">✔</button>
          <button class="btn btn-danger btn-sm" onclick="debouncedDeleteTask(${task.id})">🗑</button>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  updateCounter();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
}

const filterTasks = debounce(function(type) {
  filterType = type;
  renderTasks();
}, 300);

const debouncedDeleteTask = debounce(function(id) {
  deleteTask(id);
}, 300);

const debouncedSortTasks = debounce(function(type) {
  if (type === "priority") {
    const order = { High: 3, Medium: 2, Low: 1 };
    tasks.sort((a, b) => order[b.priority] - order[a.priority]);
  }

  if (type === "deadline") {
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  renderTasks();
}, 300);

function sortTasks(type) {
  debouncedSortTasks(type);
}

function updateCounter() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent = tasks.filter(t => t.completed).length;
  document.getElementById("pending").textContent = tasks.filter(t => !t.completed).length;
}

renderTasks();
