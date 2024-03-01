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
