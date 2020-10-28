// get reference Dom elements
const cityFormEl = document.getElementById("city-form")
const cityInputEl = document.getElementById("city")

const formSumbitHandler = function(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    if (city) {
    getWeather(city)
    } else {
        alert("Please enter a city name")
    }
};

const getWeather = function(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5f561ad30edf570bba6252977997c67c`
    fetch(apiUrl)
        .then((res) => res.json())
        .then(function(res) {
            console.log(res);
        })
}
cityFormEl.addEventListener("submit", formSumbitHandler);