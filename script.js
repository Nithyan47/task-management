let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = -1;

document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#deadline-date", {
        dateFormat: "Y-m-d",
        defaultDate: "today",
        minDate: "today",
        
    });


    displayTasks();
});

function addTask() {
    const taskInput = document.getElementById('task');
    const deadlineDateInput = document.getElementById('deadline-date');
    const deadlineTimeInput = document.getElementById('deadline-time');
    const priorityInput = document.getElementById('priority');

    if (!taskInput.checkValidity() || !deadlineDateInput.checkValidity() || !deadlineTimeInput.checkValidity() || !priorityInput.checkValidity()) {
        alert("All fields are required. Please fill in all the details.");
        return;
    }

    const dateStr = `${deadlineDateInput.value}T${deadlineTimeInput.value}`;
    const selectedDateTime = new Date(dateStr);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
        alert("Invalid date and time. Please select a future date and time.");
        return;
    }

    const task = {
        name: taskInput.value,
        deadline: dateStr,
        priority: priorityInput.value,
        completed: false
    };

    if (editingIndex !== -1) {
        tasks[editingIndex] = task;
        editingIndex = -1;
    } else {
        tasks.push(task);
    }

    displayTasks();
    clearForm();
}

function displayTasks() {
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        listItem.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
            <span>${formatDateTime(task.deadline)}</span>
            <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span>
            <button onclick="toggleCompletion(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        tasksList.appendChild(listItem);
    });

    saveTasksToLocalStorage();
}

function editTask(index) {
    editingIndex = index;
    const task = tasks[index];
    document.getElementById('task').value = task.name;

    const dateTime = task.deadline.split('T');
    document.getElementById('deadline-date').value = dateTime[0];
    document.getElementById('deadline-time').value = dateTime[1];

    document.getElementById('priority').value = task.priority;

    document.getElementById('addTaskBtn').innerText = 'Update Task';
}

function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

function clearForm() {
    document.getElementById('task').value = '';
    document.getElementById('deadline-date').value = '';
    document.getElementById('deadline-time').value = '';
    document.getElementById('priority').value = 'low';
    document.getElementById('addTaskBtn').innerText = 'Add Task';
}

function formatDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
