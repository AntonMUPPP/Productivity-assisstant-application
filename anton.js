let habits = JSON.parse(localStorage.getItem("habits")) || []

function hideHabitWindow(){
    let window = document.querySelector(".add-habit-window")
    if(window.style.display === "flex"){
        window.style.display = "none"
    }else{
        window.style.display = "flex"
    }
}

function renderHabits() {
    const habitContainer = document.querySelector(".habit-container")
    habitContainer.innerHTML = ""

    habits.forEach(habit => {
        const habitElement = document.createElement("div")
        habitElement.classList.add("temp")

        habitElement.innerHTML = `
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')">Delete</button>
            <h2>${habit.title}</h2>
            <div class="streak-container">
                <p>Streak:</p><button>-</button><p class="streak">0</p><button>+</button><button>Reset streak</button>
            </div>
            <p>Priority: ${habit.prio}</p>
            <button class="edit-btn">Edit</button>`

        habitElement.setAttribute("id", habit.id)

        habitContainer.appendChild(habitElement)
    })
}

window.onload = renderHabits()

function addHabit(){
    const habitTitleInput = document.querySelector("#habittitle")
    const habitTitle = habitTitleInput.value.trim()
    const habitPrio = document.querySelector("#priorityselect").value
    const window = document.querySelector(".add-habit-window")
    const habit = document.createElement("div")
    habit.classList.add("temp")

    if (habitTitle === "") {
        alert("Please enter a title for the habit.")
        return
    }
    const habitId = "habit_" + Date.now()

    let habitObj = {
        title: habitTitle,
        prio: habitPrio,
        id: habitId
    }

    console.log("created id:" + habitId)

    habit.innerHTML = `
        <button class="delete-btn" onclick="deleteHabit('${habitId}')">Delete</button>
        <h2>${habitObj.title}</h2>
        <div class="streak-container">
            <p>Streak:</p><button>-</button><p class="streak">${0}</p><button onclick="addStreak('${habitId}')">+</button><button>Reset streak</button>
        </div>
        <p>Priority: ${habitObj.prio}</p>
        <button class="edit-btn">Edit</button>`

    habit.setAttribute("id", habitId)

    const habitContainer = document.querySelector(".habit-container")
    habitContainer.append(habit)

    habits.push(habitObj)

    habitTitleInput.value = ""
    window.style.display = "none"

    localStorage.setItem("habits", JSON.stringify(habits))
}

function deleteHabit(habitId) {
    const habitElement = document.getElementById(habitId)

    if (habitElement) {
        habitElement.remove()

        const index = habits.findIndex(habit => habit.title === habitElement.querySelector("h2").textContent)

        if (index !== -1) {
            habits.splice(index, 1)
            localStorage.setItem("habits", JSON.stringify(habits))
        }
    }
}

function addStreak(habitId){
    const habitElement = document.getElementById(habitId)
    let streakText = habitElement.querySelector(".streak")
    
    console.log(habitElement.id)
}