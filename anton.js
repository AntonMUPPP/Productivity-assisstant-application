//#region Antons code
let habits = JSON.parse(localStorage.getItem("habits")) || []
let filteredHabits = []

window.onload = renderFilteredHabits(habits)      //Just renders the habits everytime the page gets reloaded
window.onload = clearCheckboxes()       //Resets the checkboxes on reload of the page

function toggleHabitWindow() {
    const window = document.querySelector(".add-habit-window");
    const addButton = document.querySelector("#addHabitButton");
    const addHabitHeading = document.querySelector(".add-habit-window h2");
    const habitTitleInput = document.querySelector("#habittitle");

    if (window.style.display === "flex") {
        window.style.display = "none"
        habitTitleInput.value = ""      //Clear input value
        delete habitTitleInput.dataset.editingId        //Clear editingId attribute
        addButton.textContent = "Add Habit"     //Reset button text
        addHabitHeading.textContent = "Add Habit"       //Reset heading text
    } else {
        window.style.display = "flex"
    }
}

function renderFilteredHabits(filteredHabitsArr){
    const habitContainer = document.querySelector(".habit-container")
    habitContainer.innerHTML = ""

    filteredHabitsArr.forEach(habit => {
        const habitElement = document.createElement("div")      //Creates the habit element for each in the array
        habitElement.classList.add("habit")     //Gives it the proper class

        habitElement.innerHTML = `
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')">Delete</button>
            <h2>${habit.title}</h2>
            <div class="streak-container">
                <p>Streak:</p>
                <button onclick="decreaseStreak('${habit.id}')">-</button>
                <p class="streak">${habit.streak || 0}</p>
                <button onclick="increaseStreak('${habit.id}')">+</button>
                <button onclick="resetStreak('${habit.id}')">Reset streak</button>
            </div>
            <p>Priority: ${habit.prio}</p>
            <button class="edit-btn" onclick="editHabit('${habit.id}', '${habit.title}', '${habit.prio}')">Edit</button>`

        habitElement.setAttribute("id", habit.id)       //Gives the element the id of the habit so its easier to find which div is which
        habitContainer.appendChild(habitElement)
    })
}

function addHabit() {
    const habitTitleInput = document.querySelector("#habittitle")
    const habitTitle = habitTitleInput.value.trim()
    const habitPrio = document.querySelector("#priorityselect").value
    const window = document.querySelector(".add-habit-window")
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

    //Clears the editing flag so you can freely edit another habit
    delete habitTitleInput.dataset.editingId

    const addButton = document.querySelector("#addHabitButton")
    const addHabitHeading = document.querySelector(".add-habit-window h2")
    addButton.textContent = "Add Habit"
    addHabitHeading.textContent = "Add Habit"

    //Updates local storage
    localStorage.setItem("habits", JSON.stringify(habits))
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
            localStorage.setItem("habits", JSON.stringify(habits))
        }
    }
}

function increaseStreak(habitId) {
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    if (habit) {
        habit.streak = (habit.streak) + 1
        streakP.innerText = habit.streak
        localStorage.setItem("habits", JSON.stringify(habits))      //Updates the value in local storage
    }
}

function decreaseStreak(habitId) {
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    if (habit && habit.streak && habit.streak > 0) {
        habit.streak -= 1
        streakP.innerText = habit.streak
        localStorage.setItem("habits", JSON.stringify(habits))      //Updates the value in local storage
    }
}

function resetStreak(habitId){
    const habit = habits.find(habit => habit.id === habitId)
    const streakP = document.querySelector(`#${habitId} > div > .streak`)
    habit.streak = 0
    streakP.innerText = habit.streak
    localStorage.setItem("habits", JSON.stringify(habits))      //Updates the value in local storage
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
    const selectedPrio = document.querySelectorAll("[name='priority']:checked")

    selectedPrio.forEach((checkbox) => {
        pickedPriority.push(checkbox.value)  
    })
    console.log(pickedPriority)

    if(pickedPriority.length === 0){
        renderFilteredHabits(habits)
        return
    }

    habits.forEach(habit => {
        if (pickedPriority.includes(habit.prio)) {
            filteredHabits.push(habit)
            renderFilteredHabits(filteredHabits)
        }
    })
}

function clearCheckboxes(){
    const checkboxes = document.querySelectorAll("[name='priority']")
    checkboxes.forEach(checkbox => {
        checkbox.checked = false
    });
}

//#endregion