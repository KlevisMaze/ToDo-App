document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('new-task');
  const dateInput = document.getElementById('task-date');
  const timeInput = document.getElementById('task-time');
  const todoList = document.getElementById('todo-list');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let editingIndex = null;

  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${todo.task} - ${todo.date} ${todo.time}</span>`;
      li.setAttribute('draggable', true);
      li.setAttribute('data-index', index);
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => {
        taskInput.value = todo.task;
        dateInput.value = todo.date;
        timeInput.value = todo.time;
        editingIndex = index;
      });

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.classList.add('remove-button');
      removeButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this item?')) {
          li.classList.add('remove-animation');
          setTimeout(() => {
            li.remove();
            todos.splice(index, 1);
            saveTodos();
          }, 500);
        }
      });

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(removeButton);
      li.appendChild(buttonContainer);
      todoList.appendChild(li);

      li.addEventListener('dragstart', handleDragstar);
      li.addEventListener('dragover', handleDragover);
      li.addEventListener('drop', handleDrop);
      li.addEventListener('dragend', handleDragend);

      li.classList.add('add-animation');
    });
  };

  const scheduleNotification = (task, date, time) => {
    const taskDateTime = new Date(`${date}T${time}`);
    const delay = taskDateTime.getTime() - new Date().getTime();

    if (delay > 0) {
      setTimeout(() => {
        new Notification('To-Do Reminder', {
          body: task,
        });
      }, delay);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = taskInput.value.trim();
    const taskDate = dateInput.value;
    const taskTime = timeInput.value;
    if (newTask && taskDate && taskTime) {
      if (editingIndex !== null) {
        todos[editingIndex] = { task: newTask, date: taskDate, time: taskTime };
        editingIndex = null;
      } else {
        todos.push({ task: newTask, date: taskDate, time: taskTime });
        // Render only the newly added item
        renderTodo({ task: newTask, date: taskDate, time: taskTime }, todos.length - 1);
      }
      saveTodos();
      scheduleNotification(newTask, taskDate, taskTime);
      taskInput.value = '';
      dateInput.value = '';
      timeInput.value = '';
    }
  });

  const renderTodo = (todo, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${todo.task} - ${todo.date} ${todo.time}</span>`;
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      taskInput.value = todo.task;
      dateInput.value = todo.date;
      timeInput.value = todo.time;
      editingIndex = index;
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove this item?')) {
        li.classList.add('remove-animation');
        setTimeout(() => {
          li.remove();
          todos.splice(index, 1);
          saveTodos();
        }, 500);
      }
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(removeButton);
    li.appendChild(buttonContainer);
    li.classList.add('add-animation');
    todoList.appendChild(li);
  };

  renderTodos();

  // Request notification permission
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/sw.js').then(registration => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(error => {
    console.log('ServiceWorker registration failed: ', error);
  });
}