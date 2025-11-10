/** @jest-environment jsdom */

describe('🌈 Interface e Mapeamento de Ícones - Projeto Clima', () => {

    afterEach(() => {
      // limpa o DOM entre testes
      document.body.innerHTML = '';
      jest.resetModules(); // zera o cache dos módulos para o próximo require
    });
  
    test('getWeatherIconClass: retorna ícones diferentes para dia e noite', () => {
      // aqui não precisa de DOM, pode requerer direto
      const { getWeatherIconClass } = require('../assets/js/api.js');
  
      expect(getWeatherIconClass(0, 1)).toBe('wi-day-sunny');        // dia
      expect(getWeatherIconClass(0, 0)).toBe('wi-night-clear');      // noite
      expect(getWeatherIconClass(2, 1)).toBe('wi-day-cloudy');       // dia
      expect(getWeatherIconClass(2, 0)).toBe('wi-night-alt-cloudy'); // noite
    });
  
    test('getWeatherIconClass: retorna fallback para código desconhecido', () => {
      const { getWeatherIconClass } = require('../assets/js/api.js');
  
      expect(getWeatherIconClass(999, 1)).toBe('wi-day-cloudy');         // fallback dia
      expect(getWeatherIconClass(999, 0)).toBe('wi-night-alt-cloudy');   // fallback noite
    });
  
    test('showResult: atualiza corretamente o DOM com temperatura e cidade', () => {
      // 1) Monta o DOM ANTES do require
      document.body.innerHTML = `
        <section id="home-section" class="section hidden"></section>
        <section id="result-section" class="section hidden">
          <h1 class="page-title"></h1>
          <div class="card result-card">
            <div class="temperature-box">
              <i id="weather-icon" class="wi"></i>
              <span id="temperature" class="temperature"></span>
            </div>
            <p id="city-name" class="city-name"></p>
            <p id="weather-description" class="weather-description"></p>
            <p id="current-time" class="current-time"></p>
            <button id="back-button" class="icon-button">🏠</button>
          </div>
        </section>
        <section id="error-section" class="section hidden"></section>
      `;
  
      // 2) Garante que o próximo require leia esse DOM
      jest.resetModules();
      const { __showResult } = require('../assets/js/api.js');
  
      const cityData = { name: 'São Paulo', country: 'Brasil' };
      const weatherData = {
        current_weather: {
          temperature: 22,
          weathercode: 2,
          is_day: 1,
          time: '2025-11-10T12:00:00Z'
        }
      };
  
      // 3) Executa e valida
      __showResult(cityData, weatherData);
  
      expect(document.getElementById('temperature').textContent).toBe('22°');
      expect(document.getElementById('city-name').textContent).toBe('São Paulo, Brasil');
      expect(document.body.classList.contains('theme-day')).toBe(true);
    });
  });
  