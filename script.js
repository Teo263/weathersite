const apiKey = '763a8de37ba31c4322cbbd156ea25c22'; // Replace with your actual OpenWeatherMap API key

document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
let map; // Declare a global variable for the map

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 401 || data.cod === '404') {
                alert('Error: ' + data.message);
            } else {
                displayWeather(data);
                updateMap(data.coord.lat, data.coord.lon, data.name);
            }
        })
        .catch(err => {
            console.error('Error fetching the weather data:', err);
        });
}

function displayWeather(data) {
    const { name, sys, main, weather } = data;
    document.getElementById('city').textContent = `City: ${name}, ${sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${main.temp}°C`;
    document.getElementById('description').textContent = `Weather: ${weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
}

function updateMap(lat, lon, cityName) {
    if (!map) {
        // Create the map for the first time
        map = L.map('map').setView([lat, lon], 10);

        // Add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add a marker
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`Weather in ${cityName}`)
            .openPopup();
    } else {
        // Update the map's view and marker for subsequent cities
        map.setView([lat, lon], 10);

        // Clear existing layers (optional, if you want to remove previous markers)
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add a new marker
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`Weather in ${cityName}`)
            .openPopup();
    }
}

