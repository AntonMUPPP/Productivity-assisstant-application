/* ----- Function to fetch weather data from the API ----- */
const apiKey = "c0a747ea68752bc62e09f4fce7115f76";
const city = "Stockholm";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

let fetchWeather = async () => {
  try {
    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].icon;
    const weather = weatherData.weather[0].main;

    const weatherIcon = document.querySelector("#weather-icon");
    const weatherText = document.querySelector("#weather-text");

    if (weatherDescription === "01d") {
      weatherIcon.className = "fa-solid fa-sun"; // Change to appropriate sunny icon（day）
    } else if (weatherDescription === "01n") {
      weatherIcon.className = "fa-solid fa-moon"; // Change to appropriate sunny icon(night)
    } else if (weatherDescription === "02d" || weatherDescription === "02n") {
      weatherIcon.className = "fa-solid fa-cloud-sun"; // Change to appropriate few clouds icon
    } else if (weatherDescription === "03d" || weatherDescription === "04d") {
      weatherIcon.className = "fa-solid fa-cloud"; // Change to appropriate scattered clouds icon (day)
    } else if (weatherDescription === "03n" || weatherDescription === "04n") {
      weatherIcon.className = "fa-solid fa-cloud-moon"; // Change to appropriate scattered clouds icon (night)
    } else if (weatherDescription === "09d" || weatherDescription === "09n") {
      weatherIcon.className = "fa-solid fa-cloud-showers-heavy"; // Change to appropriate shower rain icon
    } else if (weatherDescription === "10d" || weatherDescription === "10n") {
      weatherIcon.className = "fa-solid fa-cloud-rain"; // Change to appropriate rain icon
    } else if (weatherDescription === "11d" || weatherDescription === "11n") {
      weatherIcon.className = "fa-solid fa-cloud-bolt"; // Change to appropriate thunderstorm icon
    } else if (weatherDescription === "13d" || weatherDescription === "13n") {
      weatherIcon.className = "fa-solid fa-snowflake"; // Change to appropriate snow icon
    } else if (weatherDescription === "50d" || weatherDescription === "50n") {
      weatherIcon.className = "fa-solid fa-smog"; // Change to appropriate mist icon
    } else {
      weatherIcon.className = "fa- solid fa-question"; // Default icon if weather is unknown
    }

    weatherText.innerHTML = `${city}, ${weather}, ${temperature}°C`;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

fetchWeather();

/* ----- Function to log goback button ----- */
let goBack = () => {
  window.history.back();
};

  /* ----- Function to log sign out ----- */
  signOutBtn.addEventListener('click',() => {
    window.location.href = 'http://127.0.0.1:5500/index.html';
    isLoggedIn = false;
  })


// Execute the following code when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve todos from local storage or initialize an empty array
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  // Select the container for displaying the todo list
  const todoListContainer = document.querySelector(".todo-container");
  // Select the window for adding a new todo
  const addTodoWindow = document.querySelector(".add-todo-window");
  // Select the save button inside the add todo window
  const saveTodoButton = document.querySelector("#savetodo");
  // Initialize a variable to store the edited todo
  let editedTodo = null;

  // Function to hide  add todo window
  function hideAddTodoWindow() {
    addTodoWindow.style.display = "none";
  }

  // Function to show the add todo window
  function showAddTodoWindow() {
    addTodoWindow.style.display = "block";
  }

  // Select the add todo button and add event listener to show the add todo window when clicked
  const addTodoButton = document.querySelector(".add-todo-btn");
  if (addTodoButton) {
    addTodoButton.addEventListener("click", showAddTodoWindow);
  }

  // Select the close button inside the add todo window and add event listener to hide the window when clicked
  const closeButton = document.querySelector(".add-todo-window .close");
  if (closeButton) {
    closeButton.addEventListener("click", hideAddTodoWindow);
  }

  // Add event listener to the save todo button
  if (saveTodoButton) {
    saveTodoButton.addEventListener("click", function () {
      // If an existing todo is being edited, save the edited todo; otherwise, save a new todo
      if (editedTodo) {
        saveEditedTodo();
      } else {
        saveTodo();
      }
    });
  }

  // Function to save a new todo
  function saveTodo() {
    // Retrieve input values from the add todo form
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Trim input values and check for empty fields
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

    // Create a new todo object
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

    // Add the new todo to the todos array, render todos, clear input fields, and hide the add todo window
    todos.push(newTodo);
    renderTodos();
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    hideAddTodoWindow();
  }

  // Function to render todos based on selected categories and sorting option
  function renderTodos(selectedCategories) {
    todoListContainer.innerHTML = "";
    let filteredTodos = todos;

    // Filter todos based on selected categories
    if (
      selectedCategories &&
      selectedCategories.length > 0 &&
      !selectedCategories.includes("all")
    ) {
      filteredTodos = todos.filter((todo) =>
        selectedCategories.includes(todo.category)
      );
    }
    // Filter completed todos if the corresponding checkbox is unchecked
    const showCompleted = document.getElementById("completed").checked;
    if (!showCompleted) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.status !== "completed"
      );
    }

    // Sort todos based on the selected sorting option
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
      case "status":
        filteredTodos.sort((a, b) => {
          if (a.status === "completed") {
            return -1;
          } else if (b.status === "completed") {
            return 1;
          } else {
            return new Date(a.deadline) - new Date(b.deadline);
          }
        });
        break;
    }

    // Iterate over filtered todos and add them to the todo list container
    filteredTodos.forEach((todo) => {
      addTodoToList(todo);
    });
    console.log("rendered todos", filteredTodos);
  }

  // Function to add a todo to the todo list container
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

    // Add event listeners for edit, delete, and complete buttons
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
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos(getSelectedCategories()); // Refresh the display of the todo list after deletion
      }
    });

    const completeCheckbox = todoItem.querySelector(
      ".complete-checkbox input[type='checkbox']"
    );
    // Add event listener for changing the status of a todo
    completeCheckbox.addEventListener("change", function () {
      todo.status = this.checked ? "completed" : "pending";
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  }

  // Function to save edited todo
  function saveEditedTodo() {
    // Retrieve input values from the add todo form
    const todoTitleInput = document.querySelector("#todotitle");
    const todoDescriptionInput = document.querySelector("#tododescription");
    const category = document.querySelector("#listcategory").value;
    const deadline = document.querySelector("#date").value;
    const dayInput = document.querySelector("input[name='day']").value;
    const hourInput = document.querySelector("input[name='hour']").value;

    // Trim input values and check for empty fields
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

    // Update the edited todo with new values
    editedTodo.title = todoTitle;
    editedTodo.description = todoDescription;
    editedTodo.category = category;
    editedTodo.deadline = deadline;
    editedTodo.time.day = parseInt(dayInput);
    editedTodo.time.hour = parseInt(hourInput);

    // Render todos, update local storage, clear input fields, hide the add todo window, and reset the edited todo
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
    todoTitleInput.value = "";
    todoDescriptionInput.value = "";
    hideAddTodoWindow();
    editedTodo = null;
  }

  // Add event listener for changing the sorting option and render todos accordingly
  document.querySelector("#sorting").addEventListener("change", function () {
    renderTodos(getSelectedCategories());
  });

  // Add event listener for clicking the filter button and render todos accordingly
  document
    .querySelector(".filters button")
    .addEventListener("click", function () {
      renderTodos(getSelectedCategories());
    });

  // Add event listener for changing the status checkbox and render todos accordingly
  document.querySelector("#completed").addEventListener("change", function () {
    renderTodos(getSelectedCategories());
  });

  // Event handler for the category checkboxes in the add todo form
  function getSelectedCategories() {
    return Array.from(
      document.querySelectorAll('input[name="category"]:checked')
    ).map((checkbox) => checkbox.value);
  }

  // Initial rendering of todos based on selected categories
  renderTodos(getSelectedCategories());
});
