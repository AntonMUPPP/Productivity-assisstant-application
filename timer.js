function toggleTimerWindow(){
    const window = document.querySelector(".timer")
    const overlay = document.querySelector(".overlay")
  
    if(timerActive){    //Just a check to make sure that the timer isnt running in the background
        alert("Please pause the timer before closing the window")
    }else{
        if(window.style.display === "flex"){
            window.style.display = "none"
            overlay.style.display = "none"
            document.body.style.overflowY = "visible"
        }else{
            window.style.display = "flex"
            overlay.style.display = "block"
            document.body.style.overflowY = "hidden"
        }
    }
  }
  
  let countdownTime = 0
  let defaultTime = 0
  let countdownInterval
  let timerActive = false
  
  function setTimer(countdownTimeInMinutes){    //Function for choosing the time
    countdownTime = countdownTimeInMinutes * 60   //multiplies it by 60 to get minutes
    defaultTime = countdownTime   
    updateTimer()
  }
  
  function toggleTimer(){   //Function to pause and start the timer
    if(countdownTime > 0){    //Check to see if the user selected a time
        if(timerActive){
            clearInterval(countdownInterval)
            document.querySelector(".timer-use-btn").textContent = "Start Timer"    //Changes the text to start timer, to match the state the timer is in
        }else{
            countdownInterval = setInterval(updateTimer, 1000)    //Gives countdown interval a value
            document.querySelector(".timer-use-btn").textContent = "Pause Timer"    //Same here but pause
        }
        timerActive = !timerActive
    }else{
        alert("Please select a time")   //If the user didnt choose a time, they get this alert
    }
  }
  
  function updateTimer(){   //Function for actually updating the timer on the page
    const timerElement = document.querySelector(".timer-text")
    const minutes = Math.floor(countdownTime / 60)
    const seconds = countdownTime % 60
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes   //These to lines makes the numbers look like "09" instead of "9"
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds
    timerElement.textContent = `${formattedMinutes} : ${formattedSeconds}`    //Updates the text on the page
    
    if(countdownTime === 0){    //Checks if it is done
        clearInterval(countdownInterval)    //Then clears the interval
        timerElement.textContent = "Finished!"    //And changes the timer text to a message
        countdownTime = defaultTime
        timerActive = false
        document.querySelector(".timer-use-btn").textContent = "Start Timer"    //Sets the text back to start timer
    }else{    //If it isnt done
        countdownTime--   //It just decreases the value by 1
    }
  }