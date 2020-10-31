// get reference Dom elements
const searchHistEl = document.getElementById("search-history");
const cityFormEl = document.getElementById("city-form");
const cityInputEl = document.getElementById("city");
const currentWeatherEl = document.getElementById("current-weather");
const fiveDayWeatherEl = document.getElementById("five-day")
const apiKey = "5f561ad30edf570bba6252977997c67c";

// create the past 5 searches array
let wdSearchHist = [];

const formSumbitHandler = function (event) {
  event.preventDefault();
  // get the search parameter
  let city = cityInputEl.value.trim().toUpperCase();
  // clear the contianer
  cityInputEl.value = "";
  // check if text was typed before button was pressed
  if (city) {
    // check if the parameter has NOT ben searched before
    if (wdSearchHist.indexOf(city) == -1) {
      // add new parameter to history
      wdSearchHist.unshift(city);
      // remove the last search on the list, keeping list length at 5
      if (wdSearchHist.length > 5) {
        wdSearchHist.pop();
      }
      // save array in local storage
      localStorage["wdSearchHist"] = JSON.stringify(wdSearchHist);
    }
    getCurrentWeather(city);
    getFiveDay(city);
    displaySearchHist(wdSearchHist);
  } else {
    alert("Please enter a city name");
  }
};

// fetch current weather (except UV index)
const getCurrentWeather = function (city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(apiUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        wdSearchHist.shift();
        localStorage["wdSearchHist"] = JSON.stringify(wdSearchHist);
        displaySearchHist(wdSearchHist);
        throw res;
      }
    })
    // call createcurrent weather function with fetched weather object
    .then((res) => displayCurrentWeather(res));
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

// fetch the 5 day forecast
const getFiveDay = function (city) {
  let fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(fiveDayUrl)
    .then((res) => res.json())
    .then((res) => displayFiveDay(res));
};

const displayCurrentWeather = function (obj) {
  // clear current weather el content
  currentWeatherEl.innerHTML = "";
  // create element to dislay current weather
  let titleEl = document.createElement("div");
  titleEl.classList = "flex-row text-align-left align-end";

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
  temperatureEl.classList = "flex-row text-align-left";
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
  humidityEl.classList = "flex-row text-align-left";
  // create h1 element to display humidity
  let currentHumidityEl = document.createElement("h2");
  currentHumidityEl.textContent = `Humidity = ${obj.main.humidity}%`;
  humidityEl.appendChild(currentHumidityEl);

  // create a row to display the wind speed
  let windEl = document.createElement("div");
  windEl.classList = "flex-row text-align-left";
  // create h2 element to display wind speed
  let WindSpeedEl = document.createElement("h2");
  // set text content to wind speed, rounded down to nearest tenth
  WindSpeedEl.textContent = `Wind Speed = ${obj.wind.speed.toFixed(1)}`;
  // append h2 to wind el
  windEl.appendChild(WindSpeedEl);

  // create a row to display UV index
  let UvEl = document.createElement("div");
  UvEl.classList = "flex-row text-align-left";
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
  UvRowEl.classList = "flex-row text-align-left";
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

const displayFiveDay = function (obj) {
  fiveDayWeatherEl.innerHTML = ""
  for (let i = 7; i<40; i= i + 8) {
    dayObj = obj.list[i]
    // split dt_txt to remove time stamp after date
    dateHalf = dayObj.dt_txt.split(" ")
    // split the date sring into yyyy mm dd
    dateSplit = dateHalf[0].split('-')
    // re-arrange date to mm-dd-yyyy
    dateText = `${dateSplit[1]}-${dateSplit[2]}-${dateSplit[0]}`

    let dayEl = document.createElement("div")
    dayEl.classList = "card col-12 col-md-2 text-align-center"

    dayTitle = document.createElement("div")
    dayTitle.classList = "card-header "
    dayTitle.textContent = dateText;

    let iconId = dayObj.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    let imgDiv = document.createElement("div")
    imgDiv.classList = "flex-row justify-space-around"

    dayIconEl = document.createElement("img")
    dayIconEl.setAttribute("src", iconUrl);
    imgDiv.appendChild(dayIconEl)

    let tempEl = document.createElement("p")
    let temp = dayObj.main.temp;
    let tempInF = Math.floor((temp * 9) / 5 - 459.67)
    tempEl.textContent = `Temp. = ${tempInF}(F)`

    let humidityEl = document.createElement("p");
    let humidity = dayObj.main.humidity;
    humidityEl.textContent = `Humidity = ${humidity}%`;


    dayEl.appendChild(dayTitle)
    dayEl.appendChild(imgDiv)
    dayEl.appendChild(tempEl)
    dayEl.appendChild(humidityEl)

    fiveDayWeatherEl.appendChild(dayEl)
  }
};

// create function to display search history
const displaySearchHist = function (arr) {
  // clear the search history box
  searchHistEl.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    // create a card link el
    let cardLinkEl = document.createElement("a");
    cardLinkEl.classList = "card-link";
    cardLinkEl.textContent = arr[i];
    searchHistEl.appendChild(cardLinkEl);
  }
};

// retrieve weather dashboard search history from local storage and initialize app
window.addEventListener("load", () => {
  if (localStorage["wdSearchHist"]) {
    wdSearchHist = JSON.parse(localStorage["wdSearchHist"]);
    // load the page with the last searched term
    getCurrentWeather(wdSearchHist[0]);
    getFiveDay(wdSearchHist[0]);
    displaySearchHist(wdSearchHist);
  }
});

cityFormEl.addEventListener("submit", formSumbitHandler);

searchHistEl.addEventListener("click", function (event) {
  let city = event.target.innerHTML;
  getCurrentWeather(city);
  getFiveDay(city);
});
