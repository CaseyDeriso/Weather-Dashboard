// get reference Dom elements
const cityFormEl = document.getElementById("city-form");
const cityInputEl = document.getElementById("city");
const currentWeatherEl = document.getElementById("current-weather");
const apiKey = "5f561ad30edf570bba6252977997c67c";

const formSumbitHandler = function (event) {
  event.preventDefault();
  let city = cityInputEl.value.trim();
  if (city) {
    getCurrentWeather(city);
  } else {
    alert("Please enter a city name");
  }
};

// fetch current weather (except UV index)
const getCurrentWeather = function (city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(apiUrl)
    .then((res) => res.json())
    // call createcurrent weather function with fetched weather object
    .then((res) => createCurrentWeather(res));
};

// fetch the UV index data
// get lat and long data from current search passed in as obj
const getUvIndex = function (obj) {
  let coord = obj.coord;
  let UvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
  fetch(UvUrl)
    .then((res) => res.json())
    .then((res) => displayUvBackground(res));
};

const createCurrentWeather = function (obj) {
  // clear current weather el content
  currentWeatherEl.innerHTML = "";
  // create element to dislay current weather
  let titleEl = document.createElement("div");
  titleEl.classList = "flex-row align-end";

  // create h1 and img elements to show searched city and icon for current weather from api
  let h1El = document.createElement("h1");
  let titleIconEl = document.createElement("img");
  // get the icon id
  let iconId = obj.weather[0].icon;
  // create a url to grab the icon
  let iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
  // set the icon src to the img element
  titleIconEl.setAttribute("src", iconUrl);
  // set city name to h1 element
  h1El.innerHTML = obj.name;
  // append to title element
  titleEl.appendChild(h1El);
  titleEl.appendChild(titleIconEl);

  // create row to display current temperature
  let temperatureEl = document.createElement("div");
  temperatureEl.setAttribute("class", "col-12");
  // get the current temp and convert K to F
  let currentTempF = Math.floor((obj.main.temp * 9) / 5 - 459.67);
  // create h1 element to display temp
  let tempDisplay = document.createElement("h2");
  // add text content and temeprature variable
  tempDisplay.textContent = `Teperature = ${currentTempF} (F)`;
  // append h1 to the temperature element
  temperatureEl.appendChild(tempDisplay);

  // create a row to display current humidity
  let humidityEl = document.createElement("div");
  humidityEl.setAttribute("class", "col-12");
  // create h1 element to display humidity
  let currentHumidityEl = document.createElement("h2");
  currentHumidityEl.textContent = `Humidity = ${obj.main.humidity}%`;
  humidityEl.appendChild(currentHumidityEl);

  // create a row to display the wind speed
  let windEl = document.createElement("div");
  windEl.setAttribute("class", "col-12");
  // create h2 element to display wind speed
  let WindSpeedEl = document.createElement("h2");
  // set text content to wind speed, rounded down to nearest tenth
  WindSpeedEl.textContent = `Wind Speed = ${obj.wind.speed.toFixed(1)}`;
  // append h2 to wind el
  windEl.appendChild(WindSpeedEl);

  // create a row to display UV index
  let UvEl = document.createElement("div");
  UvEl.setAttribute("class", "col-12");
  UvEl.setAttribute("id", "uv-index");

  // append each weather element to the current weather element
  currentWeatherEl.appendChild(titleEl);
  currentWeatherEl.appendChild(temperatureEl);
  currentWeatherEl.appendChild(humidityEl);
  currentWeatherEl.appendChild(windEl);
  currentWeatherEl.appendChild(UvEl);
  // get the uv index
  getUvIndex(obj);
};

const displayUvBackground = function (obj) {
  let UvRowEl = document.createElement("div");
  UvRowEl.setAttribute("class", "flex-row");
  let uvTextEl = document.createElement("h2");
  uvTextEl.textContent = "UV Index = ";
  let uvIndexEl = document.createElement("div");
  uvIndexEl.setAttribute("class", "uv-bg");
  uvIndexEl.textContent = obj.value;
  if (obj.value < 3) {
    uvIndexEl.style.background = "#9EE493";
  } else if (3 <= obj.value || res.value <= 7) {
    uvIndexEl.style.background = "#FFB30F";
  } else if (obj.value > 7) {
    uvIndexEl.style.background = "#6B0F1A";
  }
  UvRowEl.appendChild(uvTextEl);
  UvRowEl.appendChild(uvIndexEl);
  const currentUvIndexEl = document.getElementById("uv-index");
  currentUvIndexEl.appendChild(UvRowEl);
};

cityFormEl.addEventListener("submit", formSumbitHandler);
