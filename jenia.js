document.addEventListener("DOMContentLoaded", function () {
  // Оголошення змінних для списку справ та їх збереження в локальному сховищі
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoListContainer = document.querySelector(".todo-container");
  const addTodoWindow = document.querySelector(".add-todo-window");
  let editedTodo = null; // Змінна для зберігання посилання на редагований todo

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

  const saveTodoButton = document.querySelector("#savetodo");
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", saveTodo);
  } else {
    alert("Save Todo button not found");
  }

  // Обробник події для кнопки "Close"
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Обробник події для кнопки "Sort"
  const sortButton = document.getElementById("sort-btn");
  if (sortButton) {
    sortButton.addEventListener("click", sortTodos);
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

    if (editedTodo) {
      // Якщо редагується існуючий todo
      editedTodo.title = todoTitle;
      editedTodo.description = todoDescription;
      editedTodo.deadline = deadline;
      editedTodo.time = time;
      editedTodo.category = category;

      // Оновлюємо відповідний елемент на сторінці з урахуванням змін
      const todoItem = todoListContainer.querySelector(
        `#todo-${editedTodo.id}`
      );
      if (todoItem) {
        todoItem.querySelector(".todo-title").textContent = todoTitle;
        todoItem.querySelector(".todo-description").textContent =
          todoDescription;
        todoItem.querySelector(".todo-deadline").textContent = deadline;
        todoItem.querySelector(".todo-time").textContent = time;
        todoItem.querySelector(".todo-category").textContent = category;
      }

      editedTodo = null; // Збираємо зміни, оскільки редагування завершено
    } else {
      // Якщо створюється новий todo
      const newTodo = {
        id: Date.now(), // Генеруємо унікальний ідентифікатор
        title: todoTitle,
        description: todoDescription,
        deadline: deadline,
        time: time,
        category: category,
      };

      todos.push(newTodo);
      addTodoToList(newTodo);
    }

    todoTitleInput.value = "";
    todoDescriptionInput.value = "";

    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  function addTodoToList(todo) {
    const todoItem = document.createElement("div");
    todoItem.id = `todo-${todo.id}`; // Ідентифікуємо елемент за id
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `
      <div class="todo-title">${todo.title}</div>
      <div class="todo-description">${todo.description}</div>
      <div class="todo-deadline">${todo.deadline}</div>
      <div class="todo-time">${todo.time}</div>
      <div class="todo-category">${todo.category}</div>
      <div class="todo-actions">
        <button class="edit-todo-btn">Edit</button>
        <button class="complete-todo-btn">Complete</button>
      </div>
    `;

    todoListContainer.appendChild(todoItem);

    // Додати обробник події для кнопки "Edit" в новоствореному елементі
    const editButton = todoItem.querySelector(".edit-todo-btn");
    editButton.addEventListener("click", function () {
      showAddTodoWindow();
      editedTodo = todo; // Зберегти посилання на редагований todo
      // Заповнити поля форми із значеннями todo для редагування
      document.querySelector("#todotitle").value = todo.title;
      document.querySelector("#tododescription").value = todo.description;
      document.querySelector("#listcategory").value = todo.category;
      document.querySelector("#date").value = todo.deadline;
      document.querySelector("#time").value = todo.time;
    });

    // Додати обробник події для кнопки "Complete" в новоствореному елементі
    const completeButton = todoItem.querySelector(".complete-todo-btn");
    completeButton.addEventListener("click", function () {
      const index = todos.indexOf(todo);
      if (index > -1) {
        todos.splice(index, 1);
        todoItem.remove();
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }

  function sortTodos() {
    const sortingMethod = document.getElementById("sorting").value;
    switch (sortingMethod) {
      case "closestday":
        todos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "longestday":
        todos.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        break;
      case "shortesttime":
        todos.sort((a, b) => new Date(a.time) - new Date(b.time));
        break;
      case "longesttime":
        todos.sort((a, b) => new Date(b.time) - new Date(a.time));
        break;
      default:
        break;
    }
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos() {
    // Очищаємо контейнер для справ
    todoListContainer.innerHTML = "";
    hideAddTodoWindow();

    // Додаємо кожну справу до контейнера
    todos.forEach((todo) => {
      addTodoToList(todo);
    });
  }

  //додаємо існуючі todo до списку todos
  renderTodos();
});
