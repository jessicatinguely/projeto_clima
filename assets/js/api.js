// Elementos do DOM (compatíveis com seu HTML)
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

// (Opcional, mas recomendado) Função que centraliza o fetch + validação
async function fetchJson(url, failMsg) {
    const res = await fetch(url);
    if (!res.ok) {
      // se quiser, inclua o código HTTP na mensagem:
      throw new Error(`${failMsg}`);
    }
    return res.json();
  }
  
/**
 * Traduz o código do tempo (Open-Meteo `weathercode`) em descrição legível.
 * @param {number} code - Código do tempo (ex.: 0, 1, 2, 3, 61, 95).
 * @returns {string} Descrição (ex.: "Céu limpo", "Nublado").
 */
function getWeatherDescription(code) {
    const map = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina com geada',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco intenso',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        80: 'Pancadas de chuva leves',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva fortes',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };
    return map[code] || 'Condição desconhecida';
}

/** @fileoverview
 * Funções do aplicativo de clima:
 * - Geocodificação (Open-Meteo)
 * - Clima atual (Open-Meteo)
 * - Mapeamento de códigos de clima para descrição/ícone
 * - Integração mínima com UI (tema dia/noite, ícone, descrição)
 * Observação: funções puras são exportadas para testes com Jest.
 */

/**
 * Busca coordenadas (latitude/longitude) para o nome de uma cidade
 * usando a API de Geocodificação do Open-Meteo.
 *
 * @async
 * @param {string} cityName - Nome da cidade (ex.: "São Paulo").
 * @returns {Promise<{name: string, country: string, latitude: number, longitude: number}>}
 * @throws {Error} Se a cidade não for encontrada ou a API falhar.
 * @example
 * const city = await getCityCoordinates('São Paulo');
 * // { name: 'São Paulo', country: 'Brasil', latitude: -23.55, longitude: -46.63 }
 */
async function getCityCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    const data = await fetchJson(url, 'Falha ao buscar coordenadas.');
    if (!data.results || data.results.length === 0) throw new Error('Cidade não encontrada');
    return data.results[0];
  }
  
  /**
 * Obtém dados meteorológicos atuais para coordenadas informadas.
 *
 * @async
 * @param {number} latitude - Latitude em graus (−90 a 90).
 * @param {number} longitude - Longitude em graus (−180 a 180).
 * @returns {Promise<{ current_weather: {
 *   temperature: number,
  *   weathercode: number,
  *   is_day: 0|1,
  *   windspeed?: number,
  *   winddirection?: number,
  *   time: string
  * } }>}
  * @throws {Error} Se a API falhar ou `current_weather` estiver ausente.
  * @example
  * const w = await getWeatherData(-23.55, -46.63);
  * console.log(w.current_weather.temperature);
  */
  async function getWeatherData(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const data = await fetchJson(url, 'Falha ao buscar meteorologia.');
    if (!data.current_weather) throw new Error('Dados meteorológicos indisponíveis');
    return data;
  }
/**
 * Mostra na tela temperatura, cidade, descrição e aplica tema.
 * @param {{name: string, country: string}} cityData - Dados da cidade.
 * @param {{ current_weather: { temperature: number, weathercode: number, is_day: 0|1, time: string } }} weatherData
 * @returns {void}
 */
function showResult(cityData, weatherData) {
    const { name, country } = cityData;
    const { current_weather } = weatherData;

    // valores principais
    temperatureElement.textContent = `${Math.round(current_weather.temperature)}°`;
    cityNameElement.textContent = `${name}, ${country}`;

    // ÍCONE (Weather Icons) dentro da caixa da temperatura
    const iconEl = ensureIconElement();
    iconEl.className = `wi ${getWeatherIconClass(current_weather.weathercode, current_weather.is_day)}`;

    // Descrição (mantém abaixo do nome da cidade)
    let descEl = document.getElementById('weather-description');
    if (!descEl) {
        descEl = document.createElement('p');
        descEl.id = 'weather-description';
        descEl.className = 'weather-description';
        cityNameElement.insertAdjacentElement('afterend', descEl);
    }
    descEl.textContent = getWeatherDescription(current_weather.weathercode);

    // Remover/ocultar hora (se algum código anterior tiver criado)
    // linha de DATA (sem hora), embaixo da descrição
    let dateEl = document.getElementById('update-date');
    if (!dateEl) {
        dateEl = document.createElement('p');
        dateEl.id = 'update-date';
        dateEl.className = 'update-time';
        document.getElementById('weather-description').insertAdjacentElement('afterend', dateEl);
    }
    dateEl.textContent = formatDateOnly(current_weather.time);


    // tema dia/noite
    document.body.classList.remove('theme-day', 'theme-night');
    document.body.classList.add(current_weather.is_day === 1 ? 'theme-day' : 'theme-night');

    homeSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

/** Mostra tela de erro e volta tema para "dia". */
function showError() {
    homeSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.remove('hidden');

    document.body.classList.remove('theme-night');
    document.body.classList.add('theme-day');
}

/** Volta para a tela inicial e limpa os campos. */
function showHome() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    homeSection.classList.remove('hidden');
    cityInput.value = '';
    if (cityInputError) cityInputError.value = '';

    document.body.classList.remove('theme-night');
    document.body.classList.add('theme-day');
}

/**
 * Fluxo principal: resolve cidade → busca clima → exibe.
 * @async
 * @param {string} cityName - Nome da cidade.
 * @returns {Promise<void>}
 */
async function searchWeather(cityName) {
    try {
        const city = await getCityCoordinates(cityName);
        const weather = await getWeatherData(city.latitude, city.longitude);
        showResult(city, weather);
    } catch (e) {
        showError();
    }
}

// Listeners — só adiciona se os elementos existirem (evita erro no Jest)
if (typeof document !== 'undefined') {
    if (weatherForm) {
      weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cityName = cityInput.value.trim();
        if (cityName) searchWeather(cityName);
      });
    }
  
    if (errorForm) {
      errorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cityName = cityInputError.value.trim();
        if (cityName) searchWeather(cityName);
      });
    }
  
    if (backButton) {
      backButton.addEventListener('click', showHome);
    }
  }  

// estado inicial
document.body.classList.add('theme-day');
/**
 * Mapeia código do tempo + período (dia/noite) para classe do ícone (Weather Icons).
 * @param {number} code - Código do tempo (Open-Meteo).
 * @param {0|1} isDay - 1 para dia, 0 para noite.
 * @returns {string} Classe CSS (ex.: "wi-day-cloudy").
 */
function getWeatherIconClass(code, isDay) {
    const day = isDay === 1;
    const map = {
        0: day ? 'wi-day-sunny' : 'wi-night-clear',
        1: day ? 'wi-day-sunny-overcast' : 'wi-night-partly-cloudy',
        2: day ? 'wi-day-cloudy' : 'wi-night-alt-cloudy',
        3: 'wi-cloudy',
        45: 'wi-fog', 48: 'wi-fog',
        51: 'wi-sprinkle', 53: 'wi-sprinkle', 55: 'wi-sprinkle',
        61: 'wi-showers', 63: 'wi-rain', 65: 'wi-rain',
        71: 'wi-snow', 73: 'wi-snow', 75: 'wi-snow', 77: 'wi-snowflake-cold',
        80: 'wi-showers', 81: 'wi-rain', 82: 'wi-rain-wind',
        85: 'wi-snow', 86: 'wi-snow-wind',
        95: 'wi-thunderstorm', 96: 'wi-storm-showers', 99: 'wi-hail'
    };
    return map[code] || (day ? 'wi-day-cloudy' : 'wi-night-alt-cloudy');
}

// 2) Garante um <i id="weather-icon" class="wi"> dentro da .temperature-box
function ensureIconElement() {
    let icon = document.getElementById('weather-icon');
    if (!icon) {
        icon = document.createElement('i');
        icon.id = 'weather-icon';
        icon.className = 'wi';
        const box = document.querySelector('.temperature-box');
        // coloca o ícone antes do número
        box.prepend(icon);
    }
    return icon;
}
function formatDateOnly(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
}

if (typeof module !== 'undefined') {
    module.exports = {
      getCityCoordinates,
      getWeatherData,
      getWeatherDescription,
      getWeatherIconClass,
      // opcional: expor showResult p/ teste de DOM
      __showResult: typeof showResult === 'function' ? showResult : undefined,
    };
  }