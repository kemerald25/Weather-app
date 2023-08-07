const apiKey = "c90c9c8f2f5df4d458266f994fb58fc6";
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const humidityElement = document.getElementById("humidity");
const localTimeElement = document.getElementById("local-time");

// Get weather data from OpenWeatherMap API
async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Update UI with weather data
function updateWeatherUI(data, timeZone) {
  if (data) {
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    temperatureElement.textContent = `${data.main.temp}°C`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `Hum: ${data.main.humidity}%`;

    const utcTime = new Date();
    const localTime = new Date(utcTime.toLocaleString("en-US", { timeZone }));

    const options = {
      timeZoneName: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const localTimeString = localTime.toLocaleString("en-US", options);

    localTimeElement.textContent = `Local Time: ${localTimeString}`;
  } else {
    locationElement.textContent = "City not found";
    temperatureElement.textContent = "";
    descriptionElement.textContent = "";
    humidityElement.textContent = "";
    localTimeElement.textContent = "";
  }
}

// Fetch weather data for the searched city
async function searchWeather() {
  const city = searchInput.value.trim();
  if (city === "") {
    return;
  }

  const weatherData = await getWeatherData(city);
  updateWeatherUI(weatherData);
}

// Fetch time zone data using latitude and longitude
async function getTimeZone(lat, lon) {
  try {
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=4LMC1IOILFPX=json&by=position&lat=${lat}&lng=${lon}`
    );
    const data = await response.json();
    return data.zoneName;
  } catch (error) {
    console.error("Error fetching time zone data:", error);
    return null;
  }
}

// Attach event listener to search input field for "keyup" event
searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Attach event listener to search button
searchButton.addEventListener("click", searchWeather);

// Fetch weather data for the default city when the page loads
window.onload = function () {
  const defaultCity = "Benin City"; // You can change this to your desired default city
  getWeatherData(defaultCity).then(updateWeatherUI);
};
