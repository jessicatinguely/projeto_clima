// Elementos do DOM
const homeSection = document.getElementById('home-section');
const resultSection = document.getElementById('result-section');
const errorSection = document.getElementById('error-section');

const weatherForm = document.getElementById('weather-form');
const errorForm = document.getElementById('error-form');
const cityInput = document.getElementById('city-input');
const cityInputError = document.getElementById('city-input-error');
const backButton = document.getElementById('back-button');

const temperatureElement = document.getElementById('temperature');
const cityNameElement = document.getElementById('city-name');

// Função para obter coordenadas geográficas da cidade
async function getCityCoordinates(cityName) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('Cidade não encontrada');
    }
    
    return data.results[0];
}

// Função para obter dados meteorológicos
async function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    if (!data.current_weather) {
        throw new Error('Dados meteorológicos não disponíveis');
    }
    
    return data;
}

// Função para exibir resultado
function showResult(cityData, weatherData) {
    const { name, country } = cityData;
    const { current_weather } = weatherData;
    
    temperatureElement.textContent = `${Math.round(current_weather.temperature)}°`;
    cityNameElement.textContent = `${name}, ${country}`;
    
    homeSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

// Função para exibir erro
function showError() {
    homeSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
}

// Função para voltar ao início
function showHome() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    homeSection.classList.remove('hidden');
    cityInput.value = '';
    cityInputError.value = '';
}

// Função principal de busca
async function searchWeather(cityName) {
    try {
        const cityData = await getCityCoordinates(cityName);
        const weatherData = await getWeatherData(cityData.latitude, cityData.longitude);
        showResult(cityData, weatherData);
    } catch (error) {
        showError();
    }
}

// Event Listeners
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        searchWeather(cityName);
    }
});

errorForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInputError.value.trim();
    if (cityName) {
        searchWeather(cityName);
    }
});

backButton.addEventListener('click', showHome);