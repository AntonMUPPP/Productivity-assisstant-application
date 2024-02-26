 const apiKey = "c0a747ea68752bc62e09f4fce7115f76";
 const city = "Stockholm";
 const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

 // Function to fetch weather data from the API
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


const login = document.querySelector('#login');
 const newAccount= document.querySelector('#newAccount');
 const register = document.querySelector('#register');
 const signin = document.querySelector('#signin')

 newAccount.addEventListener('click', ()=>{
  login.style.borderBottom = "none";
  signin.style.display = 'none';
  register.style.display = "inline-block";
 })

 login.addEventListener('click', ()=>{
  login.style.borderBottom = "2px solid red";
  signin.style.display = 'inline-block';
  register.style.display = "none";
 })



