// DOM Elements
const valuesearch = document.getElementById("valuesearch");
const form = document.getElementById("app");
const cityElement = document.querySelector("#city h2");
const countryFlag = document.querySelector(".flag-icon");
const countryName = document.querySelector(".country-name");
const weatherIcon = document.querySelector(".weather-icon");
const tempValue = document.querySelector(".temp-value");
const description = document.querySelector(".description");
const feelsLike = document.getElementById("feels-like");
const cloud = document.getElementById("cloud");
const humid = document.getElementById("humid");
const wind = document.getElementById("wind");
const press = document.getElementById("press");
const visibility = document.getElementById("visibility");
const tempMax = document.getElementById("temp-max");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");
const loadingOverlay = document.querySelector(".loading-overlay");
const currentDate = document.querySelector(".current-date");
const currentTime = document.querySelector(".current-time");

// API settings
const API_KEY = "9505fd1df737e20152fbd78cdb289b6a";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// App state
let weatherData = null;
let units = "metric";

// Initialize the app
function initApp() {
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute
  
  // Event listeners
  form.addEventListener("submit", handleFormSubmit);
  celsiusBtn.addEventListener("click", () => setTemperatureUnit("metric"));
  fahrenheitBtn.addEventListener("click", () => setTemperatureUnit("imperial"));
  
  // Auto-focus search input on page load
  valuesearch.focus();
}

// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = now.toLocaleDateString('en-US', options);
  
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  currentTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const searchTerm = valuesearch.value.trim();
  
  if (searchTerm) {
    fetchWeatherData(searchTerm);
  } else {
    showError("Please enter a city name");
  }
}

// Show loading state
function showLoading(isLoading) {
  if (isLoading) {
    loadingOverlay.classList.add("show");
  } else {
    loadingOverlay.classList.remove("show");
  }
}

// Show error
function showError(message) {
  description.textContent = message || "Something went wrong. Please try again.";
  
  const weatherCard = document.querySelector(".weather-card");
  weatherCard.classList.add("error-shake");
  
  setTimeout(() => {
    weatherCard.classList.remove("error-shake");
  }, 500);
}

// Fetch weather data from API
async function fetchWeatherData(city) {
  try {
    showLoading(true);
    
    const params = new URLSearchParams({
      q: city,
      units: units,
      appid: API_KEY
    });
    
    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    
    if (data.cod === 200) {
      weatherData = data;
      updateUI(data);
    } else {
      showError(data.message || "City not found");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError();
  } finally {
    showLoading(false);
    valuesearch.value = '';
  }
}

// Update UI with weather data
function updateUI(data) {
  // Location info
  cityElement.textContent = data.name;
  countryFlag.src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
  countryFlag.alt = data.sys.country;
  
  // Get country name from country code
  const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  try {
    countryName.textContent = regionNames.of(data.sys.country);
  } catch(e) {
    countryName.textContent = data.sys.country;
  }
  
  // Weather icon and temperature
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherIcon.alt = data.weather[0].description;
  tempValue.textContent = Math.round(data.main.temp);
  
  // Weather description
  description.textContent = data.weather[0].description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Weather details
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
  cloud.textContent = `${data.clouds.all}%`;
  humid.textContent = `${data.main.humidity}%`;
  wind.textContent = `${(units === 'metric' ? data.wind.speed : data.wind.speed * 3.6).toFixed(1)} ${units === 'metric' ? 'm/s' : 'mph'}`;
  press.textContent = `${data.main.pressure} hPa`;
  tempMax.textContent = `${Math.round(data.main.temp_max)}°`;
  
  // Convert visibility from meters to kilometers
  const visibilityKm = data.visibility / 1000;
  visibility.textContent = `${visibilityKm.toFixed(1)} km`;
  
  // Sunrise and sunset times
  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);
  
  sunrise.textContent = formatTime(sunriseTime);
  sunset.textContent = formatTime(sunsetTime);
  
  // Animation for updated values
  document.querySelectorAll('.detail-item').forEach(item => {
    item.style.transform = 'scale(1.05)';
    setTimeout(() => {
      item.style.transition = 'transform 0.3s ease';
      item.style.transform = 'scale(1)';
    }, 200);
  });
}

// Format time to HH:MM format
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Set temperature unit (Celsius or Fahrenheit)
function setTemperatureUnit(unit) {
  if (units === unit) return;
  
  units = unit;
  
  // Update UI based on selected unit
  if (unit === 'metric') {
    celsiusBtn.classList.add('active');
    fahrenheitBtn.classList.remove('active');
    document.querySelector('.temp-unit').textContent = '°C';
  } else {
    celsiusBtn.classList.remove('active');
    fahrenheitBtn.classList.add('active');
    document.querySelector('.temp-unit').textContent = '°F';
  }
  
  // If we have weather data, fetch it again with the new unit
  if (weatherData) {
    fetchWeatherData(weatherData.name);
  }
}

// Add animated background effects
function createWeatherBackgroundEffects() {
  const container = document.querySelector('.container');
  const particles = document.createElement('div');
  particles.className = 'weather-particles';
  
  // Create and append particles based on current weather
  if (weatherData && weatherData.weather[0].main) {
    const weatherType = weatherData.weather[0].main.toLowerCase();
    
    switch (weatherType) {
      case 'rain':
      case 'drizzle':
        createRaindrops(particles, 50);
        break;
      case 'snow':
        createSnowflakes(particles, 30);
        break;
      case 'clouds':
        createClouds(particles, 8);
        break;
      case 'clear':
        createSunRays(particles);
        break;
    }
    
    container.appendChild(particles);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);