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
const forecastSection = document.getElementById('forecast-section');
const forecastList = document.getElementById('forecast-list');

// ========== FUNÇÃO PARA ATUALIZAR TEMA BASEADO NA HORA ==========
function updateThemeByTime() {
    const hour = new Date().getHours();
    document.body.classList.remove('theme-day', 'theme-night');
    if (hour >= 6 && hour < 18) {
        document.body.classList.add('theme-day');
    } else {
        document.body.classList.add('theme-night');
    }
}

// Função que centraliza o fetch + validação
async function fetchJson(url, failMsg) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`${failMsg}`);
    }
    return res.json();
}

/**
 * Traduz o código do tempo (Open-Meteo `weathercode`) em descrição legível.
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

/**
 * Busca coordenadas (latitude/longitude) para o nome de uma cidade
 */
async function getCityCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    const data = await fetchJson(url, 'Falha ao buscar coordenadas.');
    if (!data.results || data.results.length === 0) throw new Error('Cidade não encontrada');
    return data.results[0];
}

/**
 * Obtém dados meteorológicos atuais para coordenadas informadas.
 */
async function getWeatherData(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const data = await fetchJson(url, 'Falha ao buscar meteorologia.');
    if (!data.current_weather) throw new Error('Dados meteorológicos indisponíveis');
    return data;
}

/**
 * Mostra na tela temperatura, cidade, descrição e aplica tema.
 */
function showResult(cityData, weatherData) {
    const { name, country } = cityData;
    const { current_weather } = weatherData;

    ensureMinElements();

    // valores principais
    temperatureElement.textContent = `${Math.round(current_weather.temperature)}°`;
    cityNameElement.textContent = `${name}, ${country}`;

    // ÍCONE (Weather Icons) dentro da caixa da temperatura
    const iconEl = ensureIconElement();
    iconEl.className = `wi ${getWeatherIconClass(current_weather.weathercode, current_weather.is_day)}`;

    // Descrição
    let descEl = document.getElementById('weather-description');
    if (!descEl) {
        descEl = document.createElement('p');
        descEl.id = 'weather-description';
        descEl.className = 'weather-description';
        cityNameElement.insertAdjacentElement('afterend', descEl);
    }
    descEl.textContent = getWeatherDescription(current_weather.weathercode);

    // Data
    let dateEl = document.getElementById('update-date');
    if (!dateEl) {
        dateEl = document.createElement('p');
        dateEl.id = 'update-date';
        dateEl.className = 'update-time';
        document.getElementById('weather-description').insertAdjacentElement('afterend', dateEl);
    }
    dateEl.textContent = formatDateOnly(current_weather.time);

    // tema dia/noite baseado na API
    document.body.classList.remove('theme-day', 'theme-night');
    document.body.classList.add(current_weather.is_day === 1 ? 'theme-day' : 'theme-night');

    homeSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

/** Mostra tela de erro */
function showError() {
    homeSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.remove('hidden');

    // esconde e limpa a previsão
    if (forecastSection) forecastSection.classList.add('hidden');
    if (forecastList) forecastList.innerHTML = '';

    updateThemeByTime();
}

/** Volta para a tela inicial */
function showHome() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    homeSection.classList.remove('hidden');

    // limpa campos
    if (cityInput) cityInput.value = '';
    if (cityInputError) cityInputError.value = '';

    // esconde e limpa a previsão
    if (forecastSection) forecastSection.classList.add('hidden');
    if (forecastList) forecastList.innerHTML = '';

    const min = document.getElementById('temperature-min');
    if (min) min.textContent = '';

    // Remove elemento de chuva
    const rainEl = document.getElementById('today-rain-chance');
    if (rainEl) rainEl.remove();

    updateThemeByTime();
}

/**
 * Fluxo principal: resolve cidade → busca clima → exibe.
 */
async function searchWeather(cityName) {
    try {
        const city = await getCityCoordinates(cityName);
        const weather = await getWeatherData(city.latitude, city.longitude);
        showResult(city, weather);

        // Previsão de 5 dias
        const daily = await getDailyForecast(city.latitude, city.longitude);
        updateTodayMin(daily);
        showForecast(daily);
    } catch (e) {
        console.error('Erro ao buscar clima:', e);
        showError();
    }
}

/**
 * Busca previsão diária (máx/mín + probabilidade de chuva) para 6 dias.
 */
async function getDailyForecast(lat, lon) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=6&timezone=auto`;
    const data = await fetchJson(url, 'Falha ao buscar previsão diária.');
    if (!data.daily) throw new Error('Previsão diária indisponível');
    console.log('Dados da previsão:', data.daily); // DEBUG
    return data.daily;
}

function dateFromISODateOnly(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/** Renderiza os próximos 5 dias (sem incluir hoje) */
function showForecast(daily) {
    const ul = document.getElementById('forecast-list');
    if (!ul) return;
    ul.innerHTML = '';

    // usamos ícones "de dia" por padrão
    const isDay = 1;

    // COMEÇA DO ÍNDICE 1 para pular hoje (índice 0)
    for (let i = 1; i < Math.min(6, daily.time.length); i++) {
        const iso = daily.time[i];
        const d = dateFromISODateOnly(iso);
        const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long' });
        const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

        const code = daily.weathercode?.[i] ?? 2;
        const rainChance = daily.precipitation_probability_max?.[i] ?? 0;

        console.log(`Dia ${i}: ${dayName}, chuva: ${rainChance}%`); // DEBUG

        const li = document.createElement('li');
        li.className = 'forecast-item';

        li.innerHTML = `
      <div class="f-left">
        <div class="weekday">${capitalize(dayName)}</div>
        <div class="date">${dateStr}</div>
      </div>

      <div class="f-mid">
        <i class="wi ${getWeatherIconClass(code, isDay)}"></i>
        <div class="desc">${getWeatherDescription(code)}</div>
        ${rainChance > 0 ? `<div class="rain-chance">💧 ${rainChance}%</div>` : ''}
      </div>

      <div class="f-right">
        <div class="temp max">${Math.round(daily.temperature_2m_max[i])}°</div>
        <div class="temp min">${Math.round(daily.temperature_2m_min[i])}°</div>
      </div>
    `;
        ul.appendChild(li);
    }

    document.getElementById('forecast-section')?.classList.remove('hidden');
}

function ensureMinElements() {
    let slash = document.getElementById('temperature-slash');
    if (!slash) {
        slash = document.createElement('span');
        slash.id = 'temperature-slash';
        slash.className = 'temperature-slash';
        slash.textContent = '/';
        document.querySelector('.temperature-box')?.appendChild(slash);
    }

    let min = document.getElementById('temperature-min');
    if (!min) {
        min = document.createElement('span');
        min.id = 'temperature-min';
        min.className = 'temperature-min';
        document.querySelector('.temperature-box')?.appendChild(min);
    }
    return { slash, min };
}

function updateTodayMin(daily) {
    const { min } = ensureMinElements();
    if (!daily || !daily.time?.length) {
        if (min) min.textContent = '';
        return;
    }

    const todayISO = new Date().toISOString().slice(0, 10);
    let idx = daily.time.indexOf(todayISO);
    if (idx === -1) idx = 0;

    const tmin = Math.round(daily.temperature_2m_min?.[idx] ?? NaN);
    min.textContent = Number.isFinite(tmin) ? `${tmin}°` : '';

    // ADICIONA PROBABILIDADE DE CHUVA PARA HOJE
    const rainChance = daily.precipitation_probability_max?.[idx] ?? 0;
    console.log('Chuva hoje:', rainChance); // DEBUG

    let rainEl = document.getElementById('today-rain-chance');
    if (!rainEl) {
        rainEl = document.createElement('div');
        rainEl.id = 'today-rain-chance';
        rainEl.className = 'today-rain-chance';
        const dateEl = document.getElementById('update-date');
        if (dateEl) {
            dateEl.insertAdjacentElement('beforebegin', rainEl);
        }
    }

    if (rainChance > 0) {
        rainEl.textContent = `💧 ${rainChance}% de chance de chuva`;
        rainEl.style.display = 'block';
    } else {
        rainEl.style.display = 'none';
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Listeners
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

    // INICIALIZA O TEMA BASEADO NA HORA ATUAL
    updateThemeByTime();
}

/**
 * Mapeia código do tempo para classe do ícone (Weather Icons).
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

function ensureIconElement() {
    let icon = document.getElementById('weather-icon');
    if (!icon) {
        icon = document.createElement('i');
        icon.id = 'weather-icon';
        icon.className = 'wi';
        const box = document.querySelector('.temperature-box');
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
        getDailyForecast,
        __showResult: typeof showResult === 'function' ? showResult : undefined,
        __showForecast: typeof showForecast === 'function' ? showForecast : undefined,
    };
}