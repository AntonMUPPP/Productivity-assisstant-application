document.addEventListener("DOMContentLoaded", function () {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");
  const addTodoWindow = document.querySelector(".add-todo-window");
  const saveTodoButton = document.querySelector("#savetodo");
  let editedTodo = null;

  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      if (editedTodo) {
        saveEditedTodo();
      } else {
        saveTodo();
      }
    });
  }

  function saveTodo() {
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();
    if (
      !todoTitle ||
      !todoDescription ||
      !deadline ||
      !dayInput ||
      !hourInput
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      description: todoDescription,
      deadline: deadline,
      time: {
        day: parseInt(dayInput),
        hour: parseInt(hourInput),
      },
      category: category,
      status: document.getElementById("completed").checked
        ? "completed"
        : "pending",
    };

    todos.push(newTodo);
    renderTodos();
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  function renderTodos(selectedCategories) {
    todoListContainer.innerHTML = "";
    let filteredTodos = todos;

    if (
      selectedCategories &&
      selectedCategories.length > 0 &&
      !selectedCategories.includes("all")
    ) {
      filteredTodos = todos.filter((todo) =>
        selectedCategories.includes(todo.category)
      );
    }

    switch (document.querySelector("#sorting").value) {
      case "closestday":
        filteredTodos.sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        );
        break;
      case "longestday":
        filteredTodos.sort(
          (a, b) => new Date(b.deadline) - new Date(a.deadline)
        );
        break;
      case "shortesttime":
        filteredTodos.sort(
          (a, b) =>
            a.time.day * 24 + a.time.hour - (b.time.day * 24 + b.time.hour)
        );
        break;
      case "longesttime":
        filteredTodos.sort(
          (a, b) =>
            b.time.day * 24 + b.time.hour - (a.time.day * 24 + a.time.hour)
        );
        break;
    }

    filteredTodos.forEach((todo) => {
      addTodoToList(todo);
    });
    console.log("rendered todos", filteredTodos);
  }

  function addTodoToList(todo) {
    const todoItem = document.createElement("div");
    todoItem.id = `todo-${todo.id}`;
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `
            <div class="todo-title">${todo.title}</div>
            <div class="todo-description">${todo.description}</div>
            <div class="todo-deadline">Deadline: ${todo.deadline}</div>
            <div class="todo-time">Time estimate: ${
              todo.time
                ? todo.time.day + " days, " + todo.time.hour + " hours"
                : "Not specified"
            }</div>
            <div class="todo-category">Category: ${todo.category}</div>
            <div class="complete-checkbox">
                <label>
                    Complete <input type="checkbox" ${
                      todo.status === "completed" ? "checked" : ""
                    }> 
                </label>
            </div>
            <div class="todo-actions">
                <button class="edit-todo-btn">Edit</button>
                <button class="delete-todo-btn">Delete</button>
            </div>
        `;

    todoListContainer.appendChild(todoItem);

    const editButton = todoItem.querySelector(".edit-todo-btn");
    editButton.addEventListener("click", function () {
      showAddTodoWindow();
      editedTodo = todo;
      document.querySelector("#todotitle").value = todo.title;
      document.querySelector("#tododescription").value = todo.description;
      document.querySelector("#listcategory").value = todo.category;
      document.querySelector("#date").value = todo.deadline;
      document.querySelector("input[name='day']").value = todo.time
        ? todo.time.day
        : "";
      document.querySelector("input[name='hour']").value = todo.time
        ? todo.time.hour
        : "";
    });

    const deleteButton = todoItem.querySelector(".delete-todo-btn");
    deleteButton.addEventListener("click", function () {
      const index = todos.indexOf(todo);
      if (index > -1) {
        todos.splice(index, 1);
        renderTodos();
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });

    const completeCheckbox = todoItem.querySelector(
      ".complete-checkbox input[type='checkbox']"
    );
    completeCheckbox.addEventListener("change", function () {
      todo.status = this.checked ? "completed" : "pending";
      renderTodos();
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  }

  function saveEditedTodo() {
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();
    if (
      !todoTitle ||
      !todoDescription ||
      !deadline ||
      !dayInput ||
      !hourInput
    ) {
      alert("Please fill in all fields");
      return;
    }

    editedTodo.title = todoTitle;
    editedTodo.description = todoDescription;
    editedTodo.category = category;
    editedTodo.deadline = deadline;
    editedTodo.time.day = parseInt(dayInput);
    editedTodo.time.hour = parseInt(hourInput);

    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));

    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    hideAddTodoWindow();

    editedTodo = null;
  }

  document.querySelector("#sorting").addEventListener("change", function () {
    renderTodos(getSelectedCategories());
  });

  document
    .querySelector(".filters button")
    .addEventListener("click", function () {
      renderTodos(getSelectedCategories());
    });

  function getSelectedCategories() {
    return Array.from(
      document.querySelectorAll('input[name="category"]:checked')
    ).map((checkbox) => checkbox.value);
  }

  renderTodos(getSelectedCategories());
});
