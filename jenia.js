document.addEventListener("DOMContentLoaded", function () {
  // Оголошення змінних та ініціалізація
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");
  const addTodoWindow = document.querySelector(".add-todo-window");
  const saveTodoButton = document.querySelector("#savetodo");
  let editedTodo = null;

  // Функція, яка приховує вікно додавання завдання
  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  // Функція, яка показує вікно додавання завдання
  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  // Додавання обробника події для кнопки додавання завдання
  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  // Додавання обробника події для кнопки закриття вікна додавання завдання
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Додавання обробника події для кнопки збереження завдання
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      if (editedTodo) {
        saveEditedTodo();
      } else {
        saveTodo();
      }
    });
  }

  // Функція для збереження нового завдання
  function saveTodo() {
    // Отримання значень полів форми
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Перевірка заповненості полів
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

    // Створення нового завдання
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
        : "pending", // Змінив id на "completed"
    };

    // Додавання нового завдання до списку, відображення та збереження в localStorage
    todos.push(newTodo);
    renderTodos();
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  // Функція для відображення списку завдань
  function renderTodos(selectedCategory) {
    todoListContainer.innerHTML = "";

    let filteredTodos = todos;

    // Фільтрація за категорією, якщо вибрано конкретну категорію
    if (selectedCategory && selectedCategory !== "all") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.category === selectedCategory
      );
    }

    filteredTodos.forEach((todo) => {
      addTodoToList(todo);
    });
  }

  // Функція для додавання завдання до списку
  function addTodoToList(todo) {
    // Створення елемента для завдання
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

    // Додавання створеного елемента до списку
    todoListContainer.appendChild(todoItem);

    // Додавання обробників подій для кнопок редагування та видалення
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

    // Додавання обробника події для чекбоксу "Complete"
    const completeCheckbox = todoItem.querySelector(
      ".complete-checkbox input[type='checkbox']"
    );
    completeCheckbox.addEventListener("change", function () {
      todo.status = this.checked ? "completed" : "pending";
      renderTodos();
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  }

  // Функція для збереження редагованого завдання
  function saveEditedTodo() {
    // Отримуємо значення полів форми
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Перевіряємо, чи заповнені всі поля
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

    // Оновлюємо дані редагованого завдання
    editedTodo.title = todoTitle;
    editedTodo.description = todoDescription;
    editedTodo.category = category;
    editedTodo.deadline = deadline;
    editedTodo.time.day = parseInt(dayInput);
    editedTodo.time.hour = parseInt(hourInput);

    // Оновлюємо список та зберігаємо його в localStorage
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));

    // Очищуємо поля форми
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    // Приховуємо вікно редагування
    hideAddTodoWindow();

    // Скидаємо значення editedTodo
    editedTodo = null;
  }

  // Функція для фільтрації завдань за категоріями
  function filterTodosByCategory() {
    let selectedCategories = [];
    const checkboxes = document.querySelectorAll(
      "input[name='category']:checked"
    );

    // Отримання вибраних категорій
    checkboxes.forEach((checkbox) => {
      selectedCategories.push(checkbox.value);
    });

    // Фільтрація за вибраними категоріями
    let filteredTodos = todos.filter((todo) => {
      return (
        selectedCategories.includes(todo.category) ||
        selectedCategories.includes("all")
      );
    });

    // Виклик функції для відображення відфільтрованих завдань
    renderTodos(filteredTodos);
  }

  // Функція для очищення прапорців вибору категорій
  function clearCategoryCheckboxes() {
    const checkboxes = document.querySelectorAll("input[name='category']");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  // Додавання обробника події для кнопки сортування
  const sortButton = document.querySelector("#sorting");
  sortButton.addEventListener("click", filterTodosByCategory);

  // Очищення прапорців категорій при завантаженні сторінки
  clearCategoryCheckboxes();

  // Додавання обробника події для радіокнопок категорій
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

  renderTodos(); // Для відображення завдань при завантаженні сторінки
});
