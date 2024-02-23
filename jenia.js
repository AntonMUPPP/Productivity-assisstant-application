document.addEventListener("DOMContentLoaded", function () {
  // Оголошення змінних для списку справ та їх збереження в локальному сховищі
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");

  function hideAddTodoWindow() {
    const addTodoWindow = document.querySelector(".add-todo-window");
    addTodoWindow.style.display = "none";
  }

  function showAddTodoWindow() {
    const addTodoWindow = document.querySelector(".add-todo-window");
    addTodoWindow.style.display = "block";
  }

  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  const saveTodoButton = document.querySelector("#savetodo");
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", saveTodo);
  } else {
    alert("Save Todo button not found");
  }

  function saveTodo() {
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const time = document.querySelector("#time").value;

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();

    if (!todoTitle || !todoDescription) {
      alert("Fill in all fields");
      return;
    }

    const newTodo = {
      title: todoTitle,
      description: todoDescription,
      deadline: deadline,
      time: time,
      category: category,
    };

    todos.push(newTodo);
    addTodoToList(newTodo);

    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  function addTodoToList(todo) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `
      <div class="todo-title">${todo.title}</div>
      <div class="todo-description">${todo.description}</div>
      <div class="todo-deadline">${todo.deadline}</div>
      <div class="todo-time">${todo.time}</div>
      <div class="todo-category">${todo.category}</div>
      <div class="todo-actions">
        <button class="edit-todo-btn">Edit</button>
        <button class="delete-todo-btn">Delete</button>
      </div>
    `;

    todoListContainer.appendChild(todoItem);
  }

  hideAddTodoWindow();

  //додаємо нове todo до списку todos
  todos.forEach((todo) => {
    addTodoToList(todo);
  });
});
