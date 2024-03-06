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





/* ----- Function to switch login and register ----- */
//all of the variables
 const login = document.querySelector('#login');
 const newAccount= document.querySelector('#newAccount');
 const registerBtn = document.querySelector('#registerBtn');
 const signinBtn = document.querySelector('#signinBtn');
 const usernameInput = document.querySelector('#usernameInput');
 const passwordInput = document.querySelector('#passwordInput');
 const main = document.querySelector('#main')
 const loginDiv = document.querySelector('.main-inloggning');
 const inloggdeDiv = document.querySelector('.main-inloggde');
 const userInfo = document.querySelector('.user_info');
 const profileName = document.querySelector('#profileName');
 const signOutBtn = document.querySelector('#signOutBtn');
 const apiGreating = document.querySelector('.apiGreating');
 const apiQuote = document.querySelector('.apiQuote');
 const myHabitsBtn = document.querySelector('#myHabitsBtn');
 const myTodosBtn = document.querySelector('#myTodosBtn');
 let isLoggedIn = false;

 newAccount.addEventListener('click', ()=>{
  login.style.borderBottom = "none";
  newAccount.style.borderBottom = '2px solid red';
  signinBtn.style.display = 'none';
  registerBtn.style.display = "inline-block";
 })

 login.addEventListener('click', ()=>{
  login.style.borderBottom = "2px solid red";
  newAccount.style.borderBottom = 'none';
  signinBtn.style.display = 'inline-block';
  registerBtn.style.display = "none";
 })




/* ----- Function to register user ----- */

//a function to check if username and password match
let checkCredentials = (username, password) => {
  const savedPassword = localStorage.getItem(username);
  if (savedPassword === password) {
    return true;
  } else {
    return false; 
  }
}


let isUsernameAvailable = () => {
  const username = usernameInput.value;
  let keysArray = [];
  //Loop through all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    keysArray.push(key);
  }
  // console.log(keysArray);
  //to check if the username is already taken.
  if (keysArray.includes(username)){
    return true
  }
}

registerBtn.addEventListener('click',()=>{
  const username = usernameInput.value;
  const password = passwordInput.value;

  //to check if the username inputs are empty.
if (username.trim() === ''){
  alert(`Please enter your username`)
  return;
}
//to check if the username is already taken.
if (isUsernameAvailable(username)) {
  alert(`Username is already taken!`);
  usernameInput.value = "";
  passwordInput.value = "";
  // to check if the password input is empty.
}else if (password.trim() === '') {
  alert(`Please enter your password.`);
}else {
  localStorage.setItem(username, password);
  alert (`Welcome! Your Account has been Created!`);
}
});


/* ----- Function to log in ----- */
signinBtn.addEventListener('click',()=>{
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username.trim() === '') {
    alert("Please enter your username! ");
  } else if (password.trim() === '') {
    alert("Please enter your password!");
    //to check if username and password match
  }else if(checkCredentials(username, password)) {
    localStorage.setItem('loggedInUser',username);
    userHomePage();
  }
    else {
      alert("Incorrect username or password!");
    }
})



/* ----- Function to log sign out ----- */
signOutBtn.addEventListener('click',() => {
  localStorage.removeItem('loggedInUser');
  main.classList = 'main-container'
  loginDiv.style.display = 'inline-block';
  inloggdeDiv.style.display = 'none';
  userInfo.style.display = 'none';
  isLoggedIn = false;
  window.location.href = 'index.html';
})



let userHomePage = () => {
  let currentUser = localStorage.getItem('loggedInUser');
  profileName.innerText = currentUser;
  main.classList = 'main-container-inloggde'
  loginDiv.style.display = 'none';
  inloggdeDiv.style.display = 'inline-block';
  userInfo.style.display = 'inline-block';
  isLoggedIn = true;
}

/* --- Check if users was already logged in */
if (localStorage.getItem('loggedInUser')) {
  // debugger;
  userHomePage();
}


/* ----- Function to fetch api greating----- */
let getGreeting = () => {
  const greetings = ["Hello!", "Hi!","Hey!", "Hi there!", "Hey there!"];
  // Randomly selects a greeting from the array
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

let displayGreetingAndQuote = async() => {
  const greeting = getGreeting();
  apiGreating.innerText = greeting;
}


displayGreetingAndQuote();
/* ----- Function to fetch api quote----- */
fetch('https://api.quotable.io/random')
.then(response => response.json())
.then(data => {
    const quote = data.content;
    apiQuote.innerHTML = `"${quote}"`;
})
.catch(error => console.error('Error fetching quote:', error));