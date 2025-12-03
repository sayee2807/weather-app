const apiKey = "4af7dfcaa573192033874ee5c788aa07"; // <-- add your API key

// UI Elements
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfo = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const countryTxt = document.querySelector(".contry-txt");
const dateTxt = document.querySelector(".current-date-txt");

const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityTxt = document.querySelector(".humidity-value-txt");
const windTxt = document.querySelector(".wind-value-txt");

const weatherImg = document.querySelector(".weather-summary-img");
const forecastContainer = document.querySelector(".forecast-items-container");

// ICON MAP — must match your /assets/weather/ folder
const weatherIcons = {
    Clear: "clear.svg",
    Clouds: "clouds.svg",
    Rain: "rain.svg",
    Drizzle: "drizzle.svg",
    Thunderstorm: "thunderstorm.svg",
    Snow: "snow.svg",
};

// Format date
function formatDate(dt) {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" });
}

// Fetch Weather API
async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const res = await fetch(url);

        if (res.status === 404) {
            weatherInfo.style.display = "none";
            searchCitySection.style.display = "none";
            notFoundSection.style.display = "flex";
            return;
        }

        const data = await res.json();

        // Show weather section
        weatherInfo.style.display = "block";
        searchCitySection.style.display = "none";
        notFoundSection.style.display = "none";

        countryTxt.textContent = data.name;
        dateTxt.textContent = formatDate(data.dt);

        tempTxt.textContent = `${Math.round(data.main.temp)} °C`;
        conditionTxt.textContent = data.weather[0].main;

        humidityTxt.textContent = `${data.main.humidity}%`;
        windTxt.textContent = `${data.wind.speed} m/s`;

        // Set Weather Icon
        let iconName = weatherIcons[data.weather[0].main] || "clouds.svg";
        weatherImg.src = `assets/weather/${iconName}`;

        getForecast(city);
    } catch (error) {
        console.error("Weather Error:", error);
    }
}

// Fetch 5-Day Forecast
async function getForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const res = await fetch(url);
        const data = await res.json();

        forecastContainer.innerHTML = ""; // Clear existing forecast

        // Every 8th item → next 5 days
        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            let iconName = weatherIcons[day.weather[0].main] || "clouds.svg";

            const box = document.createElement("div");
            box.classList.add("forecast-item");

            box.innerHTML = `
                <h5 class="forecast-item-date regular-txt">${formatDate(day.dt)}</h5>
                <img src="assets/weather/${iconName}" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(day.main.temp)} °C</h5>
            `;

            forecastContainer.appendChild(box);
        }
    } catch (error) {
        console.error("Forecast Error:", error);
    }
}

// Search Button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") getWeather(city);
});

// Enter Key
cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city !== "") getWeather(city);
    }
});
