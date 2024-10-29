const apiKey = '3a03dc6c6e51892bcf734c2aba2c78ed';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
let currentTheme = localStorage.getItem('theme') || 'light';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let forecastMode = localStorage.getItem('forecastMode') || 'pagination';
let searchTimeout;

// theme
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');


document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add(currentTheme + '-theme');
updateThemeIcon();
});

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  if (currentTheme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
}

// weather
async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    if (data.cod != "200") throw new Error(data.message);
    displayCurrentWeather(data);
  } catch (error) {
    alert('Error fetching weather data: ' + error.message);
  }
}

// weekly forcast 
async function fetchForecast(city) {
  try {
    const response = await fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    if (data.cod != "200") throw new Error(data.message);
    displayForecast(data.list);
  } catch (error) {
    alert('Error fetching forecast data: ' + error.message);
  }
}


function displayForecast(data) {
  const weeklyForecastContainer = document.getElementById("weeklyForecast");
  weeklyForecastContainer.innerHTML = ''; 

  data.slice(0, 7).forEach((item, index) => { // Display only 7 days of data
    const date = new Date();
    console.log(data)
    date.setDate(date.getDate() + index + 1); // Start from tomorrow
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const temp = (item.main.temp - 273.15).toFixed(1) + "°C";
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

    // Create a div for each day's weather data
    const dayData = document.createElement("div");
    dayData.className = "flex flex-col items-center";

    dayData.innerHTML = `
    <p class="text-white text-sm">${formattedDate}</p>
       <img src=${icon} alt="Partly Cloudy" class="w-18 h-18 bg-pink-200 ">
      <p class="text-white text-lg">${temp}</p>
      <p class="text-gray-500">${item.weather[0].description}</p>
    `;

    weeklyForecastContainer.appendChild(dayData);
  });
}


function searchWeather() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const city = document.getElementById('cityInput').value;
    if (city) {
      fetchWeather(city);
      fetchForecast(city);
      fetchHourForecast(city)
    }
  }, 500);
}
function displayCurrentWeather(data) {
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = '';  // Clear existing rows
  Array(data).forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const temp = (item.main.temp - 273.15).toFixed(1); // Kelvin to Celsius
    const feelsLike = (item.main.feels_like - 273.15).toFixed(1);
    const temp_min = item.main.temp_min 
    const temp_max = item.main.temp_max 
    const windSpeed = item.wind.speed;
    const windDeg = item.wind.deg;
    const humidity = item.main.humidity;
    const pressure = item.main.pressure;
    const seaLevel = item.main.sea_level || "N/A";
    const weatherDesc = item.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

    const weatherCard = document.createElement("div");
    weatherCard.className = "bg-blue-500 text-white rounded-xl shadow-lg p-6";

    weatherContainer.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 border rounded-lg">
           <div class="flex justify-between items-center">
             <div class="text-white text-2xl font-bold">${temp}°C</div>
             <div class="search-icon text-white">
               <i class="fas fa-search"></i>
             </div>
           </div>
           <div class="text-white text-lg mt-4 w-1/4 h-16">
             <div class="flex items-center">
                <img src=${icon} class="text-yellow-500"></img>
               <span>${weatherDesc}</span>
             </div>
             <div class="flex items-center mt-4">
               <i class="fas fa-map-marker-alt mr-2"></i>
               <span class="text-2xl">${item.name}</span>
             </div>
             <div class="flex items-center mt-4">
               <i class="fas fa-calendar-alt mr-2"></i>
               <span>${date}</span>
             </div>
           </div>
         </div>
         <div class="bg-gray-800 rounded-lg p-6 border rounded-lg">
             <div class="flex justify-between items-center">
                 <div class="text-white text-5xl font-bold">${temp}°C</div>
                 <div class="text-white text-lg">Feels like: ${feelsLike}°C</div>
             </div>
             <div class="flex justify-center items-center mt-4">
             <img src=${icon} class="text-yellow-500"></img>
                 <p class="text-white text-2xl ml-4">${weatherDesc}</p>
             </div>
             <div class="grid grid-cols-2 gap-4 mt-4">
                 <div>
                     <div class="flex items-center">
                         <i class="fa-solid fa-arrow-up text-white text-xl mr-2"></i>
                         <p class="text-white">Min</p>
                     </div>
                     <p class="text-white">${temp_min}°C</p>
                 </div>
                 <div>
                     <div class="flex items-center">
                         <i class="fa-solid fa-arrow-down text-white text-xl mr-2"></i>
                         <p class="text-white">Max</p>
                     </div>
                     <p class="text-white">${temp_max}°C</p>
                 </div>
                 <div>
                     <i class="fa-solid fa-droplet text-white text-xl"></i>
                     <p class="text-white">${humidity}</p>
                     <p class="text-white">Humidity</p>
                 </div>
                 <div>
                     <i class="fa-solid fa-wind text-white text-xl"></i>
                     <p class="text-white">${windSpeed}</p>
                     <p class="text-white">Wind Speed</p>
                 </div>
                 <div>
                     <i class="fa-solid fa-gauge text-white text-xl"></i>
                     <p class="text-white">${pressure}</p>
                     <p class="text-white">Pressure</p>
                 </div>
                 <div>
                     <i class="fa-solid fa-sun text-yellow-500 text-xl"></i>
                     <p class="text-white">${windDeg}°C</p>
                     <p class="text-white">Wind Deg</p>
                 </div>
             </div>
         </div>
    `

  })

}
