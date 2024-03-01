document.addEventListener("DOMContentLoaded", function () {
  // Оголошення змінних та ініціалізація
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");
  const addTodoWindow = document.querySelector(".add-todo-window");
  const saveTodoButton = document.querySelector("#savetodo");
  let editedTodo = null; // Додати цю змінну для збереження відредагованої справи

  // Функція для приховання вікна додавання справи
  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  // Функція для відображення вікна додавання справи
  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  // Додаємо обробник події для кнопки "Додати справу"
  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  // Додаємо обробник події для кнопки "Закрити"
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Додаємо обробник події для кнопки "Зберегти справу"
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      if (editedTodo) {
        saveEditedTodo(); // Викликаємо функцію для збереження відредагованої справи
      } else {
        saveTodo(); // Викликаємо функцію для збереження нової справи
      }
    });
  }

  // Функція для збереження справи
  function saveTodo() {
    // Отримуємо значення полів форми
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();

    // Перевіряємо, чи заповнені всі поля
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

    // Формуємо нову справу
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
      status: document.getElementById("status").checked
        ? "completed"
        : "pending",
    };

    // Додаємо справу до списку
    todos.push(newTodo);

    // Рендеримо список справ
    renderTodos();

    // Очищуємо поля вводу
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    // Зберігаємо оновлений список справ в локальному сховищі
    localStorage.setItem("todos", JSON.stringify(todos));

    // Приховуємо вікно додавання справи
    hideAddTodoWindow();
  }

  // Функція для рендерингу списку справ
  function renderTodos() {
    // Очищаємо контейнер перед рендерингом
    todoListContainer.innerHTML = "";
    // Додаємо кожну справу до контейнера
    todos.forEach((todo) => {
      addTodoToList(todo);
    });
  }

  // Функція для додавання справи до списку
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
                    Complete <input type="checkbox"> 
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
        todoItem.remove();
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }

  // Функція для збереження відредагованої справи
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

  // Запускаємо рендеринг списку справ при завантаженні сторінки
  renderTodos();

  // Додаємо можливість сортування
  function sortTodos(sortingCriteria) {
    let selectedCategory = document.querySelector(
      "input[name='category']:checked"
    ).value;

    switch (sortingCriteria) {
      case "status":
        todos.sort((a, b) => {
          if (a.status === "completed" && b.status !== "completed") {
            return 1; // Завершені завдання йдуть після незавершених
          } else if (a.status !== "completed" && b.status === "completed") {
            return -1; // Незавершені завдання йдуть перед завершеними
          } else {
            return 0; // Завдання з однаковим статусом залишаються на місці
          }
        });
        break;

      case "closestday":
        todos.sort((a, b) => {
          if (selectedCategory === "all") {
            return new Date(a.deadline) - new Date(b.deadline);
          }
          if (
            a.category === selectedCategory &&
            b.category === selectedCategory
          ) {
            return new Date(a.deadline) - new Date(b.deadline);
          } else if (a.category === selectedCategory) {
            return -1;
          } else if (b.category === selectedCategory) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "longestday":
        todos.sort((a, b) => {
          if (selectedCategory === "all") {
            return new Date(b.deadline) - new Date(a.deadline);
          }
          if (
            a.category === selectedCategory &&
            b.category === selectedCategory
          ) {
            return new Date(b.deadline) - new Date(a.deadline);
          } else if (a.category === selectedCategory) {
            return -1;
          } else if (b.category === selectedCategory) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "shortesttime":
        todos.sort((a, b) => {
          if (selectedCategory === "all") {
            return (
              a.time.day * 24 + a.time.hour - (b.time.day * 24 + b.time.hour)
            );
          }
          if (
            a.category === selectedCategory &&
            b.category === selectedCategory
          ) {
            return (
              a.time.day * 24 + a.time.hour - (b.time.day * 24 + b.time.hour)
            );
          } else if (a.category === selectedCategory) {
            return -1;
          } else if (b.category === selectedCategory) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "longesttime":
        todos.sort((a, b) => {
          if (selectedCategory === "all") {
            return (
              b.time.day * 24 + b.time.hour - (a.time.day * 24 + a.time.hour)
            );
          }
          if (
            a.category === selectedCategory &&
            b.category === selectedCategory
          ) {
            return (
              b.time.day * 24 + b.time.hour - (a.time.day * 24 + a.time.hour)
            );
          } else if (a.category === selectedCategory) {
            return -1;
          } else if (b.category === selectedCategory) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "category":
        todos.sort((a, b) => {
          if (selectedCategory === "all") {
            return (
              a.time.day * 24 + a.time.hour - (b.time.day * 24 + b.time.hour)
            );
          }
          if (
            a.category === selectedCategory &&
            b.category === selectedCategory
          ) {
            return new Date(a.deadline) - new Date(b.deadline);
          } else if (a.category === selectedCategory) {
            return -1;
          } else if (b.category === selectedCategory) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      default:
        break;
    }
    renderTodos();
  }

  // Додаємо обробник подій для кнопки сортування
  const sortButton = document.querySelector("button[onclick='onRender()']");
  if (sortButton) {
    sortButton.addEventListener("click", function () {
      const sortingCriteria = document.querySelector("#sorting").value;
      sortTodos(sortingCriteria);
    });
  }

  // Додаємо обробник подій для радіокнопок категорій
  const categoryRadios = document.querySelectorAll("input[name='category']");
  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const selectedCategory = document.querySelector(
        "input[name='category']:checked"
      ).value;
      if (selectedCategory !== "all") {
        sortTodos("category");
      } else {
        renderTodos();
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Declaration and initialization of variables
  let todos = JSON.parse(localStorage.getItem("todos")) || []; // Load the list of todos from local storage
  const todoListContainer = document.querySelector(".todo-container"); // Container for displaying the todo list
  const addTodoWindow = document.querySelector(".add-todo-window"); // Window for adding a new todo
  const saveTodoButton = document.querySelector("#savetodo"); // Button for saving a todo
  let editedTodo = null; // Add this variable to store the edited todo

  // Function to hide the add todo window
  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  // Function to display the add todo window
  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  // Adding event listener for the "Add ToDo" button
  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  // Adding event listener for the "Close" button
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Adding event listener for the "Save ToDo" button
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      if (editedTodo) {
        saveEditedTodo(); // Call function to save the edited todo
      } else {
        saveTodo(); // Call function to save a new todo
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

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();

    // Checking if all fields are filled
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
      status: document.getElementById("status").checked
        ? "completed"
        : "pending",
    };

    // Adding the todo to the list
    todos.push(newTodo);

    // Rendering the todo list
    renderTodos();

    // Clearing the input fields
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    // Saving the updated todo list to local storage
    localStorage.setItem("todos", JSON.stringify(todos));

    // Hiding the add todo window
    hideAddTodoWindow();
  }

  // Function to render the todo list
  function renderTodos() {
    // Clearing the container before rendering
    todoListContainer.innerHTML = "";
    // Adding each todo to the container
    todos.forEach((todo) => {
      addTodoToList(todo);
    });
  }

  // Function to add a todo item to the list
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
                    Complete <input type="checkbox"> 
                </label>
            </div>
            <div class="todo-actions">
                <button class="edit-todo-btn">Edit</button>
                <button class="delete-todo-btn">Delete</button>
            </div>
        `;

    todoListContainer.appendChild(todoItem);

    // Selecting the edit button of the current todo item
    const editButton = todoItem.querySelector(".edit-todo-btn");

    // Adding an event listener to the edit button to handle the click event
    editButton.addEventListener("click", function () {
      // Displaying the add todo window
      showAddTodoWindow();

      // Setting the editedTodo variable to the current todo being edited
      editedTodo = todo;

      // Setting the values of input fields in the add todo window to the values of the selected todo
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

    // Selecting the delete button of the current todo item
    const deleteButton = todoItem.querySelector(".delete-todo-btn");
    // Adding an event listener to the delete button to handle the click event
    deleteButton.addEventListener("click", function () {
      // Finding the index of the current todo in the todos array
      const index = todos.indexOf(todo);
      // Checking if the index is valid (exists in the array)
      if (index > -1) {
        // Removing the todo from the todos array
        todos.splice(index, 1);
        // Removing the todo item from the UI
        todoItem.remove();
        // Updating the todos data stored in local storage
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }

  // Function to save the edited todo
  function saveEditedTodo() {
    // Selecting input elements and getting their values
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;
    // Trimming input values
    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionInput.value.trim();

    // Checking if any required field is empty
    if (
      !todoTitle ||
      !todoDescription ||
      !deadline ||
      !dayInput ||
      !hourInput
    ) {
      alert("Please fill in all fields");
      return; // Exit function if any field is empty
    }

    // Updating the properties of the edited todo
    editedTodo.title = todoTitle;
    editedTodo.description = todoDescription;
    editedTodo.category = category;
    editedTodo.deadline = deadline;
    editedTodo.time.day = parseInt(dayInput);
    editedTodo.time.hour = parseInt(hourInput);
    // Rendering the updated list of todos
    renderTodos();

    // Saving the updated todos to local storage
    localStorage.setItem("todos", JSON.stringify(todos));

    // Clearing input fields
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    hideAddTodoWindow();

    // Resetting editedTodo to null after saving
    editedTodo = null;
  }

  // Rendering the todo list on page load
  renderTodos();

  // Function to sort todos based on the given sorting criteria
  function sortTodos(sortingCriteria) {
    // Getting the selected category for filtering
    let selectedCategory = document.querySelector(
      "input[name='category']:checked"
    ).value;

    // Switch statement to handle different sorting criteria
    switch (sortingCriteria) {
      // Sorting by status (completed or pending)
      case "status":
        todos.sort((a, b) => {
          if (a.status === "completed" && b.status !== "completed") {
            return 1; // Completed tasks come after pending tasks
          } else if (a.status !== "completed" && b.status === "completed") {
            return -1; // Pending tasks come before completed tasks
          } else {
            return 0; // Tasks with the same status remain in place
          }
        });
        break;

      // Sorting by closest deadline
      case "closestday":
        todos.sort((a, b) => {
          // If all categories are selected or the categories match
          if (
            selectedCategory === "all" ||
            (a.category === selectedCategory && b.category === selectedCategory)
          ) {
            return new Date(a.deadline) - new Date(b.deadline);
          } else if (a.category === selectedCategory) {
            return -1; // Tasks in selected category come first
          } else if (b.category === selectedCategory) {
            return 1; // Tasks in selected category come first
          } else {
            return 0; // Tasks with different categories remain in place
          }
        });
        break;

      // Sorting by longest day remaining
      case "longestday":
        todos.sort((a, b) => {
          // If all categories are selected or the categories match
          if (
            selectedCategory === "all" ||
            (a.category === selectedCategory && b.category === selectedCategory)
          ) {
            return new Date(b.deadline) - new Date(a.deadline);
          } else if (a.category === selectedCategory) {
            return -1; // Tasks in selected category come first
          } else if (b.category === selectedCategory) {
            return 1; // Tasks in selected category come first
          } else {
            return 0; // Tasks with different categories remain in place
          }
        });
        break;

      // Sorting by shortest time estimate
      case "shortesttime":
        todos.sort((a, b) => {
          // If all categories are selected or the categories match
          if (
            selectedCategory === "all" ||
            (a.category === selectedCategory && b.category === selectedCategory)
          ) {
            return (
              a.time.day * 24 + a.time.hour - (b.time.day * 24 + b.time.hour)
            );
          } else if (a.category === selectedCategory) {
            return -1; // Tasks in selected category come first
          } else if (b.category === selectedCategory) {
            return 1; // Tasks in selected category come first
          } else {
            return 0; // Tasks with different categories remain in place
          }
        });
        break;

      // Sorting by longest time estimate
      case "longesttime":
        todos.sort((a, b) => {
          // If all categories are selected or the categories match
          if (
            selectedCategory === "all" ||
            (a.category === selectedCategory && b.category === selectedCategory)
          ) {
            return (
              b.time.day * 24 + b.time.hour - (a.time.day * 24 + a.time.hour)
            );
          } else if (a.category === selectedCategory) {
            return -1; // Tasks in selected category come first
          } else if (b.category === selectedCategory) {
            return 1; // Tasks in selected category come first
          } else {
            return 0; // Tasks with different categories remain in place
          }
        });
        break;

      // Sorting by category
      case "category":
        todos.sort((a, b) => {
          // If all categories are selected or the categories match
          if (
            selectedCategory === "all" ||
            (a.category === selectedCategory && b.category === selectedCategory)
          ) {
            return new Date(a.deadline) - new Date(b.deadline);
          } else if (a.category === selectedCategory) {
            return -1; // Tasks in selected category come first
          } else if (b.category === selectedCategory) {
            return 1; // Tasks in selected category come first
          } else {
            return 0; // Tasks with different categories remain in place
          }
        });
        break;

      default:
        break;
    }

    // Rendering the sorted todos
    renderTodos();
  }

  // Adding event listener for the sorting button
  const sortButton = document.querySelector("button[onclick='onRender()']");
  if (sortButton) {
    sortButton.addEventListener("click", function () {
      // Getting the selected sorting criteria
      const sortingCriteria = document.querySelector("#sorting").value;
      // Sorting todos based on the selected criteria
      sortTodos(sortingCriteria);
    });
  }

  // Adding event listener for category radio buttons
  const categoryRadios = document.querySelectorAll("input[name='category']");
  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Getting the selected category
      const selectedCategory = document.querySelector(
        "input[name='category']:checked"
      ).value;
      // Sorting todos by category if a specific category is selected, otherwise rendering all todos
      if (selectedCategory !== "all") {
        sortTodos("category");
      } else {
        renderTodos();
      }
    });
  });
});
