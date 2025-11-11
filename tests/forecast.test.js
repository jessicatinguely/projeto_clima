/** @jest-environment jsdom */

const { __showForecast } = require('../assets/js/api.js');

test('renderiza lista de 5 dias', () => {
  document.body.innerHTML = `
    <section id="forecast-section" class="section hidden">
      <ul id="forecast-list"></ul>
    </section>
  `;

  const daily = {
    time: ['2025-11-02','2025-11-03','2025-11-04','2025-11-05','2025-11-06'],
    weathercode: [2,45,3,96,1],
    temperature_2m_max: [23,27,29,19,26],
    temperature_2m_min: [18,18,17,15,16]
  };

  __showForecast(daily);

  const items = document.querySelectorAll('#forecast-list .forecast-item');
  expect(items.length).toBe(5);
  expect(document.getElementById('forecast-section').classList.contains('hidden')).toBe(false);
});
