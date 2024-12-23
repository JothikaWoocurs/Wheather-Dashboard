const apiKey = "cafabab3e87972cecc06f349cf7e4357"; // Replace with your OpenWeather API key
const currentWeatherDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");
const recentSearchesList = document.getElementById("recentSearches");

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
    saveSearch(city);
    displayRecentSearches();
  }
});

function fetchWeather(city) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  // Fetch current weather
  fetch(weatherApiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => displayCurrentWeather(data))
    .catch((error) => alert(error.message));

  // Fetch 5-day forecast
  fetch(forecastApiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => displayForecast(data.list))
    .catch((error) => alert(error.message));
}

function displayCurrentWeather(data) {
  currentWeatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Condition: ${data.weather[0].description}</p>
  `;
}

function displayForecast(forecastList) {
  forecastDiv.innerHTML = "";
  const dailyForecasts = forecastList.filter((_, index) => index % 8 === 0); // Every 8th item (3-hour intervals)

  dailyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    forecastDiv.innerHTML += `
      <div class="col-md-2">
        <div class="card p-3 text-center">
          <h5>${date}</h5>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          <p>${forecast.main.temp}°C</p>
          <p>${forecast.weather[0].description}</p>
        </div>
      </div>
    `;
  });
}

function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  if (!searches.includes(city)) {
    searches.unshift(city); // Add to the start
    searches = searches.slice(0, 5); // Limit to 5 recent searches
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }
}

function displayRecentSearches() {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentSearchesList.innerHTML = "";
  searches.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.classList.add("list-group-item");
    li.addEventListener("click", () => fetchWeather(city));
    recentSearchesList.appendChild(li);
  });
}

// Display recent searches on page load
displayRecentSearches();
