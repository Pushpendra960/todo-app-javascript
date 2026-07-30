const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Task Counter
function updateCounter() {
    taskCount.textContent = `Total Tasks : ${tasks.length}`;
}

// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active")
            return !task.completed;

        if (currentFilter === "completed")
            return task.completed;

        return true;

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.dataset.id = task.id;

        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>

            <span>${task.text}</span>

            <button class="edit-btn">Edit</button>

            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(li);

    });

    updateCounter();

}

// Add Task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

}

// Add Button
addTaskBtn.addEventListener("click", addTask);

// Enter Key
taskInput.addEventListener("keypress", e => {

    if (e.key === "Enter")
        addTask();

});

// Event Delegation
taskList.addEventListener("click", e => {

    const item = e.target.closest(".task");

    if (!item) return;

    const id = Number(item.dataset.id);

    // Delete
    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

    }

    // Edit
    else if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const updated = prompt("Edit Task", task.text);

        if (updated !== null && updated.trim() !== "") {

            task.text = updated.trim();

        }

    }

    saveTasks();

    renderTasks();

});

// Complete Checkbox
taskList.addEventListener("change", e => {

    if (e.target.classList.contains("complete-checkbox")) {

        const item = e.target.closest(".task");

        const id = Number(item.dataset.id);

        const task = tasks.find(task => task.id === id);

        task.completed = e.target.checked;

        saveTasks();

        renderTasks();

    }

});

// Filters
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// Clear Completed
clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});

// Initial Render
renderTasks();