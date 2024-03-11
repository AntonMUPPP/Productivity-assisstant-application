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

     if (weatherDescription === "01d")  {
       weatherIcon.className = "fa-solid fa-sun"; // Change to appropriate sunny icon（day）
     }else if (weatherDescription === "01n")  {
       weatherIcon.className = "fa-solid fa-moon"; // Change to appropriate sunny icon(night)
     } else if (weatherDescription === "02d" || weatherDescription === "02n") {
       weatherIcon.className = "fa-solid fa-cloud-sun"; // Change to appropriate few clouds icon
     } else if (
       weatherDescription === "03d" ||
       weatherDescription === "04d" 
     ) {
       weatherIcon.className = "fa-solid fa-cloud"; // Change to appropriate scattered clouds icon (day)
     } else if (
       weatherDescription === "03n" ||
       weatherDescription === "04n" 
     ) {
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
 }

 fetchWeather();



  /* ----- Function to log goback button ----- */
let goBack = () => {
    window.history.go(-1);
  }

  /* ----- Function to log sign out ----- */
signOutBtn.addEventListener('click',() => {
   localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  })

  let currentUser = localStorage.getItem('loggedInUser');
  //show username on header
const profileName = document.querySelector('#profileName');
profileName.innerText = currentUser;


//#region Antons code
let habits = JSON.parse(localStorage.getItem(`${currentUser}-habits`)) || []
let filteredHabits = []

window.onload = renderFilteredHabits(habits)      //Just renders the habits everytime the page gets reloaded
window.onload = clearCheckboxes()       //Resets the checkboxes on reload of the page

function toggleHabitWindow() {
    const window = document.querySelector(".add-habit-window")
    const overlay = document.querySelector(".overlay")
    const addButton = document.querySelector("#addHabitButton")
    const addHabitHeading = document.querySelector(".add-habit-window h2")
    const habitTitleInput = document.querySelector("#habittitle")

    if (window.style.display === "flex") {
        window.style.display = "none"
        habitTitleInput.value = ""      //Clear input value
        delete habitTitleInput.dataset.editingId        //Clear editingId attribute
        addButton.textContent = "Add Habit"     //Reset button text
        addHabitHeading.textContent = "Add Habit"       //Reset heading text
        overlay.style.display = "none"
    } else {
        window.style.display = "flex"
        overlay.style.display = "block"
    }
}

function renderFilteredHabits(filteredHabitsArr){
    const habitContainer = document.querySelector(".habit-container")
    habitContainer.innerHTML = ""

    filteredHabitsArr.forEach(habit => {
        const habitElement = document.createElement("div")      //Creates the habit element for each in the array
        habitElement.classList.add("habit", `habit-${habit.prio}`)     //Gives it the proper class

        habitElement.innerHTML = `
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')"><i class="fa-solid fa-xmark"></i></button>
            <h2>${habit.title}</h2>
            <div class="streak-container">
                <p>Streak:</p>
                <button class="decrease-streak-btn" onclick="decreaseStreak('${habit.id}')">-</button>
                <p class="streak">${habit.streak || 0}</p>
                <button class="increase-streak-btn" onclick="increaseStreak('${habit.id}')">+</button>
                <button class="reset-streak-btn" onclick="resetStreak('${habit.id}')">Reset streak</button>
            </div>
            <p>Priority: ${habit.prio}</p>
            <button class="edit-btn" onclick="editHabit('${habit.id}', '${habit.title}', '${habit.prio}')"><i class="fa-solid fa-pen-to-square"></i></button>`

        habitElement.setAttribute("id", habit.id)       //Gives the element the id of the habit so its easier to find which div is which
        habitContainer.appendChild(habitElement)
    })
}

function addHabit() {
    const habitTitleInput = document.querySelector("#habittitle")
    const habitTitle = habitTitleInput.value.trim()
    const habitPrio = document.querySelector("#priorityselect").value
    const window = document.querySelector(".add-habit-window")
    const overlay = document.querySelector(".overlay")
    const habitId = habitTitleInput.dataset.editingId || "habit_" + Date.now()

    //Small check to see that the user actually typed a title
    if (habitTitle === "") {
        alert("Please enter a title for the habit.")
        return
    }

    let habitObj = {
        title: habitTitle,
        prio: habitPrio,
        id: habitId,
        streak: 0
    }

    //Finds the existing habit and updates it or pushes the new object
    const existingHabitIndex = habits.findIndex(habit => habit.id === habitId)
    if (existingHabitIndex !== -1) {
        habitObj.streak = habits[existingHabitIndex].streak
        habits[existingHabitIndex] = habitObj
    } else {
        habits.push(habitObj)
    }

    renderFilteredHabits(habits)

    //Resets the input field and hides the add habit menu
    habitTitleInput.value = ""
    window.style.display = "none"
    overlay.style.display = "none"

    //Clears the editing flag so you can freely edit another habit
    delete habitTitleInput.dataset.editingId

    const addButton = document.querySelector("#addHabitButton")
    const addHabitHeading = document.querySelector(".add-habit-window h2")
    addButton.textContent = "Add Habit"
    addHabitHeading.textContent = "Add Habit"

    //Updates local storage
    localStorage.setItem(`${currentUser}-habits`, JSON.stringify(habits))
}

function deleteHabit(habitId) {
    const habitElement = document.getElementById(habitId)

    if (habitElement) {
        habitElement.remove()       //Removes the element from the page

        //This finds the index of the deleted habit in the habits array by comparing the h2 within the deleted element
        const index = habits.findIndex(habit => habit.title === habitElement.querySelector("h2").textContent)

        //Removes the habit from the array and local storage
        if (index !== -1) {
            habits.splice(index, 1)
            localStorage.setItem(`${currentUser}-habits`, JSON.stringify(habits))
        }
    }
}

function increaseStreak(habitId) {
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    if (habit) {
        habit.streak = (habit.streak) + 1
        streakP.innerText = habit.streak
        localStorage.setItem(`${currentUser}-habits`, JSON.stringify(habits))      //Updates the value in local storage
    }
}

function decreaseStreak(habitId) {
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    if (habit && habit.streak && habit.streak > 0) {
        habit.streak -= 1
        streakP.innerText = habit.streak
        localStorage.setItem(`${currentUser}-habits`, JSON.stringify(habits))      //Updates the value in local storage
    }
}

function resetStreak(habitId){
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    habit.streak = 0
    streakP.innerText = habit.streak
    localStorage.setItem(`${currentUser}-habits`, JSON.stringify(habits))      //Updates the value in local storage
}

function editHabit(id, title, prio) {
    const habitTitleInput = document.querySelector("#habittitle")
    const habitPrioritySelect = document.querySelector("#priorityselect")
    const addButton = document.querySelector("#addHabitButton")
    const addHabitHeading = document.querySelector(".add-habit-window h2")

    habitTitleInput.value = title
    habitPrioritySelect.value = prio

    addButton.textContent = "Save Habit"
    addHabitHeading.textContent = "Edit Habit"      //This changes the text in the window that pops up from "add habit" to "edit habit"

    toggleHabitWindow()

    habitTitleInput.dataset.editingId = id      //Sets a flag that indicates that we want to edit an existing habit
}

function filterHabits(){
    let pickedPriority = []
    filteredHabits = []
    const selectedPrio = document.querySelectorAll("[name='priority']:checked")     //Gets all the boxes that the user selected

    selectedPrio.forEach((checkbox) => {
        pickedPriority.push(checkbox.value)     //Pushes the checked boxes to a new array
    })

    if(pickedPriority.length === 0){        //If no boxes are checked then just returns the full list of habits
        renderFilteredHabits(habits)
        return
    }

    habits.forEach(habit => {       //Takes the habit array and checks every objects .prio value and compares it to the values in the pickedPriority array
        if (pickedPriority.includes(habit.prio)) {
            filteredHabits.push(habit)      //Pushes the ones that fit
            renderFilteredHabits(filteredHabits)        //Renders the new array
        }
    })
}

function clearCheckboxes(){     //Function to clear the checkboxes when the page reloads
    const checkboxes = document.querySelectorAll("[name='priority']")
    checkboxes.forEach(checkbox => {
        checkbox.checked = false
    })
}

function sortHabits() {
    const sortSelect = document.getElementById("sortSelect")
    const sortBy = sortSelect.value
    switch (sortBy) {       //Switch statement instead of a bunch of if/else for performance
        case "streakAsc":
            habits.sort((a, b) => a.streak - b.streak)      //Sorts the streaks in ascending order
            break
        case "streakDesc":
            habits.sort((a, b) => b.streak - a.streak)      //Sorts the streaks in descending order
            break
        case "priorityAsc":
            habits.sort((a, b) => {
                const priorityOrder = { "low": 0, "medium": 1, "high": 2 }      //Creates an object to give the priority options actual value so they can be sorted
                return priorityOrder[a.prio] - priorityOrder[b.prio]        //Sorts the priorities in ascending order
            })
            break
        case "priorityDesc":
            habits.sort((a, b) => {
                const priorityOrder = { "low": 0, "medium": 1, "high": 2 }      //Creates an object to give the priority options actual value so they can be sorted
                return priorityOrder[b.prio] - priorityOrder[a.prio]        //Sorts the priorities in descending order
            })
            break
        default:
            break
    }
    renderFilteredHabits(habits)        //Renders all the habits
    clearCheckboxes()
}
//#endregion