document.addEventListener('DOMContentLoaded', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    async function getWeather(city) {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=32804b24a847407391c53709241010&q=${city}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    async function getForecast(city) {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}&days=3`);
            return response.data;
        } catch (error) {
            console.error('Error fetching forecast data:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    // Function to display weather information
    async function displayWeather() {
        const city = document.getElementById('city').value;
        const currentWeatherData = await getWeather(city);
        const forecastData = await getForecast(city);
        
        if (currentWeatherData && currentWeatherData.location) {
            // Container for current weather
            let currentWeatherHTML = `
                <div id="currentWeatherContainer">
                    <h2>Weather in ${currentWeatherData.location.name}</h2>
                    <img src="https:${currentWeatherData.current.condition.icon}" alt="Weather Icon" style="width: 100px; height: auto;">
                    <p>Region: ${currentWeatherData.location.region}</p>
                    <p>Country: ${currentWeatherData.location.country}</p>
                    <p>Local Time: ${currentWeatherData.location.localtime}</p>
                    <p>Current Temperature: ${currentWeatherData.current.temp_c} °C</p>
                    <p>Weather Condition: ${currentWeatherData.current.condition.text}</p>
                    <p>Wind Speed: ${currentWeatherData.current.wind_kph} kph</p>
                    <p>Humidity: ${currentWeatherData.current.humidity}%</p>
                    <p>Last Update: ${currentWeatherData.current.last_updated}</p>
            `;

            // Check for current precipitation and snow
            if (currentWeatherData.current.precip_mm > 0) {
                currentWeatherHTML += `<p>Current Precipitation: ${currentWeatherData.current.precip_mm} mm</p>`;
            }
            if (currentWeatherData.current.snow_mm > 0) {
                currentWeatherHTML += `<p>Current Snow: ${currentWeatherData.current.snow_mm} mm</p>`;
            }

            // Display current weather
            document.getElementById('weatherInfo').innerHTML = currentWeatherHTML;

            // Forecast display
            if (forecastData && forecastData.forecast) {
                let forecastHTML = '<div id="forecastContainer"><h3>Forecast</h3>';
                forecastData.forecast.forecastday.forEach(day => {
                    forecastHTML += `
                        <div class="forecast-day">
                            <h4>${day.date}</h4>
                            <p>Max Temperature: ${day.day.maxtemp_c} °C</p>
                            <p>Min Temperature: ${day.day.mintemp_c} °C</p>
                            <p>Condition: ${day.day.condition.text}</p>
                    `;

                    // Check for forecast precipitation and snow
                    if (day.day.totalprecip_mm > 0) {
                        forecastHTML += `<p>Expected Precipitation: ${day.day.totalprecip_mm} mm</p>`;
                    }
                    if (day.day.daily_will_it_snow) {
                        forecastHTML += `<p>Expected Snow: ${day.day.totalsnow_cm} cm</p>`;
                    }

                    forecastHTML += '</div>';
                });
                forecastHTML += '</div>';

                // Append forecast container to weather info
                document.getElementById('weatherInfo').innerHTML += forecastHTML;
            }
        } else {
            document.getElementById('weatherInfo').innerHTML = '<p>Error fetching weather data.</p>';
        }
    }

    // Function to save location to favorites
    function saveToFavorites() {
        const city = document.getElementById('city').value;
        if (city && !favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${city} added to favorites!`);
            displayFavorites(); // Refresh the favorites list
        }
    }

    // Function to display favorites
    function displayFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = '';
        favorites.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;

            // Create delete button for each favorite
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteFavorite(city); // Call delete function with the city

            li.appendChild(deleteButton);
            favoritesList.appendChild(li);
        });
    }

    // Function to delete a specific favorite
    function deleteFavorite(city) {
        const index = favorites.indexOf(city);
        if (index > -1) {
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${city} removed from favorites!`);
            displayFavorites(); // Refresh the favorites list
        }
    }

    // Function to clear all favorites
    function clearFavorites() {
        localStorage.removeItem('favorites');
        favorites.length = 0;
        displayFavorites();
        alert('All favorites cleared!');
    }

    // Event listeners
    const getWeatherButton = document.getElementById('getWeather');
    const saveLocationButton = document.getElementById('saveLocation');
    const clearFavoritesButton = document.getElementById('clearFavorites');

    if (getWeatherButton) {
        getWeatherButton.addEventListener('click', displayWeather);
    }

    if (saveLocationButton) {
        saveLocationButton.addEventListener('click', saveToFavorites);
    }

    if (clearFavoritesButton) {
        clearFavoritesButton.addEventListener('click', clearFavorites);
    }

    // Display favorites on page load
    if (document.getElementById('favoritesList')) {
        displayFavorites();
    }
});
