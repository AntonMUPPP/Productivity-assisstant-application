document.addEventListener("DOMContentLoaded", function () {
  // Declaration of variables and initialization
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");
  const addTodoWindow = document.querySelector(".add-todo-window");
  const saveTodoButton = document.querySelector("#savetodo");
  let editedTodo = null;

  // Function to hide the add todo window
  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  // Function to show the add todo window
  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  // Adding event listener for the add todo button
  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  // Adding event listener for the close button of the add todo window
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Adding event listener for the save todo button
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      if (editedTodo) {
        saveEditedTodo();
      } else {
        saveTodo();
      }
    });
  }

  // Function to save a new todo
  function saveTodo() {
    // Getting values from the form fields
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Checking for empty fields
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

    // Creating a new todo
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

    // Adding the new todo to the list, rendering it, and saving it to localStorage
    todos.push(newTodo);
    renderTodos();
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  // Function to render the list of todos
  function renderTodos(selectedCategory) {
    todoListContainer.innerHTML = "";

    let filteredTodos = todos;

    // Filtering by category if a specific category is selected
    if (selectedCategory && selectedCategory !== "all") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.category === selectedCategory
      );
    }

    filteredTodos.forEach((todo) => {
      addTodoToList(todo);
    });
  }

  // Function to add a todo to the list
  function addTodoToList(todo) {
    // Creating an element for the todo
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

    // Adding the created element to the list
    todoListContainer.appendChild(todoItem);

    // Adding event handlers for edit and delete buttons
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

    // Adding event handler for the Complete checkbox
    const completeCheckbox = todoItem.querySelector(
      ".complete-checkbox input[type='checkbox']"
    );
    completeCheckbox.addEventListener("change", function () {
      todo.status = this.checked ? "completed" : "pending";
      renderTodos();
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  }

  // Function to save an edited todo
  function saveEditedTodo() {
    // Getting values from the form fields
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Checking for empty fields
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

    // Updating the edited todo's data
    editedTodo.title = todoTitle;
    editedTodo.description = todoDescription;
    editedTodo.category = category;
    editedTodo.deadline = deadline;
    editedTodo.time.day = parseInt(dayInput);
    editedTodo.time.hour = parseInt(hourInput);

    // Updating the list and saving it to localStorage
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));

    // Clearing the form fields
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    // Hiding the edit window
    hideAddTodoWindow();

    // Resetting the editedTodo variable
    editedTodo = null;
  }

  // Function to filter todos by category
  function filterTodosByCategory() {
    let selectedCategories = [];
    const checkboxes = document.querySelectorAll(
      "input[name='category']:checked"
    );

    // Getting selected categories
    checkboxes.forEach((checkbox) => {
      selectedCategories.push(checkbox.value);
    });

    // Filtering by selected categories
    let filteredTodos = todos.filter((todo) => {
      return (
        selectedCategories.includes(todo.category) ||
        selectedCategories.includes("all")
      );
    });

    // Rendering filtered todos
    renderTodos(filteredTodos);
  }

  // Adding event listeners for category checkboxes
  const categoryCheckboxes = document.querySelectorAll(
    "input[name='category']"
  );
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      filterTodosByCategory();
    });
  });

  // Rendering todos on page load
  renderTodos();
});
